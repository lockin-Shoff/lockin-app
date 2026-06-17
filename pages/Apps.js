import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { supabase } from '../lib/supabase'

// Load the tracker app client-side only (no server rendering)
const FitnessApp = dynamic(() => import('../components/FitnessApp'), { ssr: false })

export default function AppPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/')
      } else {
        setUser(session.user)
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') router.replace('/')
      if (session) setUser(session.user)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{
      background: '#0a0a0f',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 16,
    }}>
      <div style={{ fontSize: 28, fontWeight: 900, color: '#c8f53e', letterSpacing: 4 }}>LOCK IN</div>
      <div style={{ width: 28, height: 28, border: '3px solid #1e1e2a', borderTopColor: '#c8f53e', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return <FitnessApp user={user} supabase={supabase} />
}
