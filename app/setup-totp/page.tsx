'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function SetupTOTP() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/setup-totp')
        .then(res => res.json())
        .then(data => {
          if (data.qrCode) {
            setQrCode(data.qrCode)
            setSecret(data.secret)
          } else {
            setError(data.error || 'Failed to generate QR code')
          }
          setLoading(false)
        })
        .catch(() => {
          setError('Connection error')
          setLoading(false)
        })
    }
  }, [status])

  if (status === 'loading' || loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.title}>Loading setup...</div>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconWrap}>📱</div>
        <h1 style={styles.title}>Set Up Google Authenticator</h1>
        <p style={styles.subtitle}>Scan this QR code with your Google Authenticator app</p>
        <p style={styles.email}>{session.user?.email}</p>

        {error ? (
          <div style={styles.error}>{error}</div>
        ) : (
          <>
            {qrCode && (
              <div style={styles.qrWrap}>
                <img src={qrCode} alt="QR Code" style={styles.qrImg} />
              </div>
            )}
            <div style={styles.secretWrap}>
              <div style={styles.secretLabel}>Or enter this code manually:</div>
              <div style={styles.secretCode}>{secret}</div>
            </div>
          </>
        )}

        <div style={styles.steps}>
          <div style={styles.step}><span style={styles.stepNum}>1</span> Open Google Authenticator on your phone</div>
          <div style={styles.step}><span style={styles.stepNum}>2</span> Tap + button → Scan QR code</div>
          <div style={styles.step}><span style={styles.stepNum}>3</span> Scan the code above</div>
        </div>

        <button onClick={() => router.push('/verify-totp')} style={styles.button}>
          Done → Continue to verify
        </button>
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh',
    background: 'linear-gradient(135deg, #0b1b3d 0%, #1e40af 100%)',
    fontFamily: "'Lato', -apple-system, BlinkMacSystemFont, sans-serif", padding: '20px',
  },
  card: {
    background: '#ffffff', borderRadius: '16px', padding: '40px', maxWidth: '460px',
    width: '100%', textAlign: 'center' as const, boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  iconWrap: { fontSize: '48px', marginBottom: '12px' },
  title: { fontSize: '22px', fontWeight: 900, color: '#0b1b3d', marginBottom: '8px' },
  subtitle: { fontSize: '14px', color: '#64748b', marginBottom: '4px', lineHeight: '1.5' },
  email: { fontSize: '13px', color: '#2563eb', fontWeight: 700, marginBottom: '20px' },
  qrWrap: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  qrImg: { width: '220px', height: '220px', borderRadius: '12px', border: '2px solid #e2e8f0' },
  secretWrap: {
    background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px',
    padding: '12px', marginBottom: '24px',
  },
  secretLabel: { fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginBottom: '6px' },
  secretCode: { fontSize: '16px', fontWeight: 900, color: '#0b1b3d', letterSpacing: '2px', fontFamily: 'monospace' },
  steps: { textAlign: 'left' as const, marginBottom: '24px', display: 'flex', flexDirection: 'column' as const, gap: '10px' },
  step: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#475569' },
  stepNum: {
    width: '24px', height: '24px', borderRadius: '50%', background: '#2563eb', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 900, flexShrink: 0,
  },
  button: {
    width: '100%', background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '10px',
    padding: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
  },
  error: {
    background: '#fff1f2', border: '1px solid #fecaca', color: '#dc2626',
    padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, marginBottom: '16px',
  },
}
