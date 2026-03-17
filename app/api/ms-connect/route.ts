import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.MICROSOFT_CLIENT_ID
  if (!clientId) {
    return NextResponse.json(
      { error: 'Microsoft OAuth not configured — add MICROSOFT_CLIENT_ID to Vercel env vars' },
      { status: 500 }
    )
  }

  const redirectUri = (process.env.NEXTAUTH_URL || 'https://office.chensheffer.com') + '/api/ms-callback'
  const scope = 'Notes.Read offline_access'

  const url =
    `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?` +
    `client_id=${encodeURIComponent(clientId)}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&response_mode=query` +
    `&prompt=select_account`

  return NextResponse.redirect(url)
}
