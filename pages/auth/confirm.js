import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'

export default function ConfirmPage() {
  const router = useRouter()
  const [status, setStatus] = useState('verifying')

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setStatus('success')
        setTimeout(() => router.replace('/app'), 3000)
      } else if (event === 'USER_UPDATED') {
        setStatus('success')
        setTimeout(() => router.replace('/app'), 3000)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>LOCK IN</div>
        {status === 'verifying' ? (
          <>
            <div style={s.icon}>⏳</div>
            <div style={s.title}>Verifying your email...</div>
            <div style={s.sub}>Hang tight.</div>
          </>
        ) : (
          <>
            <div style={s.icon}>✅</div>
            <div style={s.title}>Email confirmed!</div>
            <div style={s.sub}>Taking you to Lock In...</div>
          </>
        )}
      </div>
    </div>
  )
}

const s = {
  page: {
    background: '#0a0a0f',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    fontSize: 42,
    fontWeight: 900,
    color: '#c8f53e',
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: 16,
  },
  icon: { fontSize: 52, marginBottom: 8 },
  title: {
    color: '#e8e4dc',
    fontSize: 22,
    fontWeight: 800,
    textAlign: 'center',
  },
  sub: {
    color: '#555',
    fontSize: 14,
    textAlign: 'center',
  },
}
