import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'

export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const secret = process.env.TOTP_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'TOTP not configured' }, { status: 500 })
  }

  const otpauth = authenticator.keyuri(
    session.user.email,
    'Office Dashboard',
    secret
  )

  const qrCodeDataUrl = await QRCode.toDataURL(otpauth)

  return NextResponse.json({
    qrCode: qrCodeDataUrl,
    secret: secret,
    email: session.user.email,
  })
}
