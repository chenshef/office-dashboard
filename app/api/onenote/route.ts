import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

async function refreshMsToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch('https://login.microsoftonline.com/consumers/oauth2/v2.0/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.MICROSOFT_CLIENT_ID || '',
        client_secret: process.env.MICROSOFT_CLIENT_SECRET || '',
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
        scope: 'Notes.Read offline_access',
      }),
    })
    const data = await res.json()
    return res.ok ? data.access_token : null
  } catch {
    return null
  }
}

export async function GET() {
  // Check Microsoft credentials are configured
  if (!process.env.MICROSOFT_CLIENT_ID) {
    return NextResponse.json(
      { error: 'Microsoft connection not configured', needsMsSetup: true },
      { status: 401 }
    )
  }

  const cookieStore = cookies()
  let msToken = cookieStore.get('ms-access-token')?.value
  const msRefresh = cookieStore.get('ms-refresh-token')?.value

  // Try refresh if no access token
  if (!msToken && msRefresh) {
    msToken = (await refreshMsToken(msRefresh)) || undefined
  }

  if (!msToken) {
    return NextResponse.json(
      { error: 'Microsoft account not connected', needsMsConnect: true },
      { status: 401 }
    )
  }

  try {
    // Fetch notebooks with sections expanded
    const notebooksRes = await fetch(
      'https://graph.microsoft.com/v1.0/me/onenote/notebooks' +
        '?$expand=sections&$orderby=lastModifiedDateTime desc&$top=20',
      { headers: { Authorization: `Bearer ${msToken}` } }
    )

    if (!notebooksRes.ok) {
      // Token might be expired — signal reconnect
      if (notebooksRes.status === 401) {
        return NextResponse.json(
          { error: 'Microsoft token expired — reconnect account', needsMsConnect: true },
          { status: 401 }
        )
      }
      const err = await notebooksRes.text()
      return NextResponse.json({ error: 'Failed to fetch notebooks', details: err }, { status: notebooksRes.status })
    }

    const notebooksData = await notebooksRes.json()

    // Sections modified in last 7 days
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const notebooks = (notebooksData.value || []).map((nb: any) => ({
      id: nb.id,
      name: nb.displayName,
      lastModified: nb.lastModifiedDateTime,
      isShared: nb.isShared || false,
      sections: (nb.sections || []).map((s: any) => ({
        id: s.id,
        name: s.displayName,
        lastModified: s.lastModifiedDateTime,
        isNew: s.lastModifiedDateTime ? new Date(s.lastModifiedDateTime) > oneWeekAgo : false,
        selfUrl: s.self,
      })),
    }))

    const newSections = notebooks.flatMap((nb: any) =>
      nb.sections
        .filter((s: any) => s.isNew)
        .map((s: any) => ({ ...s, notebookName: nb.name }))
    )

    // Sort new sections by lastModified desc
    newSections.sort(
      (a: any, b: any) =>
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    )

    return NextResponse.json({
      notebooks,
      newSections,
      totalNotebooks: notebooks.length,
      totalSections: notebooks.reduce((acc: number, nb: any) => acc + nb.sections.length, 0),
      fetchedAt: new Date().toISOString(),
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to fetch OneNote data', message: err.message },
      { status: 500 }
    )
  }
}
