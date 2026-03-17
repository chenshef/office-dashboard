import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const baseUrl = process.env.NEXTAUTH_URL || 'https://office.chensheffer.com'

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/dashboard?ms=error&reason=${error || 'no_code'}`)
  }

  const clientId = process.env.MICROSOFT_CLIENT_ID || ''
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET || ''
  const redirectUri = `${baseUrl}/api/ms-callback`

  try {
    const tokenRes = await fetch('https://login.microsoftonline.com/consumers/oauth2/v2.0/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        scope: 'Notes.Read offline_access',
      }),
    })

    const tokenData = await tokenRes.json()

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('MS token error:', tokenData)
      return NextResponse.redirect(`${baseUrl}/dashboard?ms=token_error`)
    }

    const response = NextResponse.redirect(`${baseUrl}/dashboard?ms=connected`)

    // Store access token (1 hour)
    response.cookies.set('ms-access-token', tokenData.access_token, {
      httpOnly: true,
      secure: true,
      maxAge: tokenData.expires_in || 3600,
      sameSite: 'lax',
      path: '/',
    })

    // Store refresh token (30 days)
    if (tokenData.refresh_token) {
      response.cookies.set('ms-refresh-token', tokenData.refresh_token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
        path: '/',
      })
    }

    return response
  } catch (err) {
    console.error('MS callback error:', err)
    return NextResponse.redirect(`${baseUrl}/dashboard?ms=server_error`)
  }
}
