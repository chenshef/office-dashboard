import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/authOptions'

export async function GET() {
  const session = await getServerSession(authOptions) as any
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Not authenticated or no access token' }, { status: 401 })
  }

  if (session.error === 'RefreshAccessTokenError') {
    return NextResponse.json({ error: 'Session expired — please sign in again', needsReauth: true }, { status: 401 })
  }

  try {
    // Fetch latest 10 inbox messages
    const listRes = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10&labelIds=INBOX',
      { headers: { Authorization: `Bearer ${session.accessToken}` } }
    )

    if (!listRes.ok) {
      const err = await listRes.text()
      return NextResponse.json({ error: 'Failed to fetch Gmail messages', details: err }, { status: listRes.status })
    }

    const listData = await listRes.json()
    const messageIds = listData.messages || []

    // Fetch full metadata for each message in parallel
    const fullMessages = await Promise.all(
      messageIds.map(async (msg: { id: string }) => {
        try {
          const msgRes = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata` +
            `&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date&metadataHeaders=To`,
            { headers: { Authorization: `Bearer ${session.accessToken}` } }
          )
          if (!msgRes.ok) return null
          const msgData = await msgRes.json()
          const headers: { name: string; value: string }[] = msgData.payload?.headers || []
          const get = (name: string) =>
            headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || ''

          return {
            id: msgData.id,
            from: get('From'),
            to: get('To'),
            subject: get('Subject'),
            date: get('Date'),
            snippet: msgData.snippet || '',
            isUnread: (msgData.labelIds || []).includes('UNREAD'),
            isImportant: (msgData.labelIds || []).includes('IMPORTANT'),
            isStarred: (msgData.labelIds || []).includes('STARRED'),
            labels: msgData.labelIds || [],
          }
        } catch {
          return null
        }
      })
    )

    return NextResponse.json({
      messages: fullMessages.filter(Boolean),
      email: session.user?.email || '',
      fetchedAt: new Date().toISOString(),
      total: listData.resultSizeEstimate || messageIds.length,
    })
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch Gmail', message: err.message }, { status: 500 })
  }
}
