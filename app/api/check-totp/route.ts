import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function GET(request: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ verified: false, reason: 'no-session' })
  }

  const cookie = request.cookies.get('totp-verified')
  if (!cookie?.value) {
    return NextResponse.json({ verified: false, reason: 'no-totp' })
  }

  const secret = process.env.TOTP_SECRET
  if (!secret) {
    return NextResponse.json({ verified: false, reason: 'no-secret' })
  }

  try {
    const decoded = Buffer.from(cookie.value, 'base64').toString()
    const expectedPrefix = `${session.user.email}:`
    const expectedSuffix = `:${secret.substring(0, 8)}`
    if (decoded.startsWith(expectedPrefix) && decoded.endsWith(expectedSuffix)) {
      return NextResponse.json({ verified: true })
    }
  } catch {
    // Invalid cookie
  }

  return NextResponse.json({ verified: false, reason: 'invalid-cookie' })
}
