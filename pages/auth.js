import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit() {
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.replace('/app')
      } else {
        if (!username.trim()) throw new Error('Please choose a username')
        if (password.length < 6) throw new Error('Password must be at least 6 characters')
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        if (data.user) {
          await supabase.from('profiles')
            .update({ username: username.trim(), display_name: username.trim() })
            .eq('id', data.user.id)
          setSuccess('Account created! Check your email to confirm, then sign in.')
          setMode('login')
        }
      }
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>LOCK IN</div>
        <div style={s.tagline}>Your fitness. Your people.</div>

        <div style={s.tabs}>
          <button style={{...s.tab, ...(mode==='login'?s.tabActive:{})}} onClick={()=>setMode('login')}>Sign In</button>
          <button style={{...s.tab, ...(mode==='signup'?s.tabActive:{})}} onClick={()=>setMode('signup')}>Sign Up</button>
        </div>

        {mode==='signup' && (
          <input
            style={s.input}
            placeholder="Username"
            value={username}
            onChange={e=>setUsername(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
          />
        )}
        <input
          style={s.input}
          placeholder="Email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          type="email"
          autoCapitalize="none"
          autoCorrect="off"
        />
        <input
          style={s.input}
          placeholder="Password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          type="password"
        />

        {error && <div style={s.error}>{error}</div>}
        {success && <div style={s.successMsg}>{success}</div>}

        <button
          style={{...s.btn, opacity: loading ? 0.6 : 1}}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Loading...' : mode==='login' ? 'Sign In' : 'Create Account'}
        </button>

        <div style={s.switch}>
          {mode==='login' ? "Don't have an account? " : "Already have an account? "}
          <span style={s.switchLink} onClick={()=>setMode(mode==='login'?'signup':'login')}>
            {mode==='login' ? 'Sign up' : 'Sign in'}
          </span>
        </div>
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
    gap: 12,
  },
  logo: {
    fontSize: 42,
    fontWeight: 900,
    color: '#c8f53e',
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: 4,
  },
  tagline: {
    color: '#555',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 20,
  },
  tabs: {
    display: 'flex',
    background: '#13131a',
    borderRadius: 12,
    padding: 4,
    gap: 4,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    padding: '10px',
    borderRadius: 9,
    border: 'none',
    cursor: 'pointer',
    background: 'transparent',
    color: '#555',
    fontWeight: 700,
    fontSize: 14,
  },
  tabActive: {
    background: '#1e1e2a',
    color: '#e8e4dc',
  },
  input: {
    background: '#13131a',
    border: '1px solid #2a2a3a',
    borderRadius: 12,
    padding: '14px 16px',
    color: '#e8e4dc',
    fontSize: 16,
    outline: 'none',
    width: '100%',
  },
  btn: {
    background: '#c8f53e',
    color: '#0a0a0f',
    border: 'none',
    borderRadius: 12,
    padding: '15px',
    fontSize: 16,
    fontWeight: 800,
    cursor: 'pointer',
    marginTop: 4,
  },
  error: {
    background: '#2a1515',
    border: '1px solid #ff555544',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#ff8888',
    fontSize: 13,
  },
  successMsg: {
    background: '#152a15',
    border: '1px solid #55ff5544',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#88ff88',
    fontSize: 13,
  },
  switch: {
    textAlign: 'center',
    color: '#555',
    fontSize: 13,
    marginTop: 8,
  },
  switchLink: {
    color: '#c8f53e',
    cursor: 'pointer',
    fontWeight: 700,
  },
}
