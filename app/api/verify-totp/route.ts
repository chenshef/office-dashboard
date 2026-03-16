import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authenticator } from 'otplib'

export async function POST(request: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { code } = await request.json()
  const secret = process.env.TOTP_SECRET

  if (!secret) {
    return NextResponse.json({ error: 'TOTP not configured' }, { status: 500 })
  }

  authenticator.options = { window: 1 }
  const isValid = authenticator.verify({ token: code, secret })

  if (isValid) {
    const response = NextResponse.json({ success: true })
    const expiry = new Date(Date.now() + 12 * 60 * 60 * 1000)
    const cookieValue = `${session.user.email}:${Date.now()}:${secret.substring(0, 8)}`
    const hash = Buffer.from(cookieValue).toString('base64')
    response.cookies.set('totp-verified', hash, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      expires: expiry,
      path: '/',
    })
    return response
  }

  return NextResponse.json({ error: 'Invalid code' }, { status: 403 })
}
