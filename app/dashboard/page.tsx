'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [totpChecked, setTotpChecked] = useState(false)
  const [totpVerified, setTotpVerified] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/check-totp')
        .then(res => res.json())
        .then(data => {
          setTotpChecked(true)
          if (data.verified) {
            setTotpVerified(true)
          } else {
            router.push('/verify-totp')
          }
        })
        .catch(() => {
          router.push('/verify-totp')
        })
    }
  }, [status, router])

  if (status === 'loading' || !totpChecked) {
    return (
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#f8fafc'}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'24px',fontWeight:900,color:'#0b1b3d'}}>Loading Dashboard...</div>
          <div style={{fontSize:'14px',color:'#64748b',marginTop:'8px'}}>Verifying authentication</div>
        </div>
      </div>
    )
  }

  if (!session || !totpVerified) return null

  return (
    <iframe
      src="/original-dashboard.html"
      style={{
        width: '100vw',
        height: '100vh',
        border: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1
      }}
      title="Office Dashboard"
    />
  )
}
