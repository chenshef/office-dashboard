'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

export default function VerifyTOTP() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/verify-totp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.replace(/\s/g, '') }),
      })

      if (res.ok) {
        router.push('/dashboard')
      } else {
        const data = await res.json()
        setError(data.error || 'Invalid code. Please try again.')
        setCode('')
        inputRef.current?.focus()
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.title}>Loading...</div>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconWrap}>🔐</div>
        <h1 style={styles.title}>Two-Factor Authentication</h1>
        <p style={styles.subtitle}>
          Enter the 6-digit code from your<br />Google Authenticator app
        </p>
        <p style={styles.email}>{session.user?.email}</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            style={styles.input}
            autoComplete="one-time-code"
            disabled={loading}
          />

          {error && <div style={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={code.length !== 6 || loading}
            style={{
              ...styles.button,
              opacity: code.length !== 6 || loading ? 0.5 : 1,
            }}
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>

        <a href="/setup-totp" style={styles.setupLink}>
          Need to set up Authenticator? Click here
        </a>
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0b1b3d 0%, #1e40af 100%)',
    fontFamily: "'Lato', -apple-system, BlinkMacSystemFont, sans-serif",
    padding: '20px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '48px 40px',
    maxWidth: '420px',
    width: '100%',
    textAlign: 'center' as const,
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  iconWrap: { fontSize: '48px', marginBottom: '16px' },
  title: { fontSize: '24px', fontWeight: 900, color: '#0b1b3d', marginBottom: '8px', letterSpacing: '-0.3px' },
  subtitle: { fontSize: '14px', color: '#64748b', marginBottom: '4px', lineHeight: '1.5' },
  email: { fontSize: '13px', color: '#2563eb', fontWeight: 700, marginBottom: '24px' },
  form: { display: 'flex', flexDirection: 'column' as const, gap: '16px' },
  input: {
    fontSize: '32px', fontWeight: 900, textAlign: 'center' as const,
    letterSpacing: '8px', padding: '16px', border: '2px solid #e2e8f0',
    borderRadius: '12px', outline: 'none', fontFamily: "'Lato', monospace",
    color: '#0b1b3d', width: '100%', boxSizing: 'border-box' as const,
  },
  error: {
    background: '#fff1f2', border: '1px solid #fecaca', color: '#dc2626',
    padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 700,
  },
  button: {
    background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '10px',
    padding: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
  },
  setupLink: { display: 'block', marginTop: '20px', fontSize: '12px', color: '#94a3b8', textDecoration: 'underline' },
}
