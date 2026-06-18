import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function Landing() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/app')
      else setLoading(false)
    })
  }, [])

  if (loading) return (
    <div style={s.splash}>
      <div style={s.splashLogo}>LOCK IN</div>
    </div>
  )

  return (
    <div style={s.page}>

      {/* Nav */}
      <nav style={s.nav}>
        <div style={s.logo}>LOCK IN</div>
        <button style={s.navBtn} onClick={() => router.push('/auth')}>Sign In</button>
      </nav>

      {/* Hero */}
      <div style={s.hero}>
        <div style={s.badge}>FREE TO USE</div>
        <h1 style={s.h1}>Track. Match.<br /><span style={{color:'#c8f53e'}}>Lock In.</span></h1>
        <p style={s.sub}>The fitness app that connects you with people who share your exact goal — bulk, shred, maintain, or endurance.</p>
        <button style={s.cta} onClick={() => router.push('/auth')}>Start Free</button>
        <div style={s.ctaSub}>No download. No credit card. Works on any phone.</div>
      </div>

      {/* Features */}
      <div style={s.grid}>
        {[
          {icon:'💪', title:'97+ Exercises', desc:'Animated demos and detailed muscle diagrams showing exactly which muscle heads you are targeting.'},
          {icon:'🤝', title:'Fitness Matching', desc:'Get matched with people who share your exact fitness goal and message each other directly.'},
          {icon:'📊', title:'Full Macro Tracking', desc:'Barcode scanner for 5M+ foods, TDEE calculator, and smart meal suggestions based on your goal.'},
          {icon:'🔥', title:'Workout Recorder', desc:'Live stopwatch, set and rep logging, automatic rest timer, and Apple Health export.'},
          {icon:'📱', title:'Feels Like an App', desc:'Add to your iPhone home screen and it opens full screen with no browser bar.'},
          {icon:'💬', title:'Real-time Chat', desc:'Message your matches, share workouts, and keep each other accountable.'},
        ].map(f => (
          <div key={f.title} style={s.card}>
            <div style={s.cardIcon}>{f.icon}</div>
            <div style={s.cardTitle}>{f.title}</div>
            <div style={s.cardDesc}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Add to home screen tip */}
      <div style={s.tip}>
        <div style={s.tipTitle}>Add to your Home Screen</div>
        <div style={s.tipDesc}>
          iPhone: open in Safari → tap <strong style={{color:'#e8e4dc'}}>Share</strong> → tap <strong style={{color:'#e8e4dc'}}>"Add to Home Screen"</strong>. Lock In will appear on your home screen like a real app.
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{textAlign:'center', padding:'20px 24px 60px'}}>
        <button style={s.cta} onClick={() => router.push('/auth')}>Get Started Free</button>
      </div>

      {/* Footer */}
      <div style={s.footer}>
        <div style={{color:'#c8f53e', fontWeight:900, letterSpacing:2}}>LOCK IN</div>
        <div style={{color:'#444', fontSize:12}}>Free forever. No credit card required.</div>
      </div>
    </div>
  )
}

const s = {
  splash: {background:'#0a0a0f', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center'},
  splashLogo: {fontSize:36, fontWeight:900, color:'#c8f53e', letterSpacing:4},
  page: {background:'#0a0a0f', minHeight:'100vh', color:'#e8e4dc'},
  nav: {display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 24px', borderBottom:'1px solid #1e1e2a'},
  logo: {fontSize:20, fontWeight:900, color:'#c8f53e', letterSpacing:3},
  navBtn: {background:'transparent', border:'1px solid #2a2a3a', color:'#e8e4dc', borderRadius:8, padding:'8px 16px', cursor:'pointer', fontSize:14, fontWeight:600},
  hero: {textAlign:'center', padding:'56px 24px 40px'},
  badge: {fontSize:11, color:'#c8f53e', letterSpacing:2, fontWeight:700, marginBottom:14},
  h1: {fontSize:'clamp(34px,8vw,60px)', fontWeight:900, lineHeight:1.1, marginBottom:18, letterSpacing:-1},
  sub: {fontSize:17, color:'#888', maxWidth:400, margin:'0 auto 28px', lineHeight:1.65},
  cta: {background:'#c8f53e', color:'#0a0a0f', border:'none', borderRadius:14, padding:'15px 40px', fontSize:17, fontWeight:800, cursor:'pointer', letterSpacing:0.3},
  ctaSub: {fontSize:12, color:'#444', marginTop:10},
  grid: {display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:14, padding:'16px 20px', maxWidth:860, margin:'0 auto'},
  card: {background:'#13131a', border:'1px solid #1e1e2a', borderRadius:16, padding:'22px'},
  cardIcon: {fontSize:30, marginBottom:10},
  cardTitle: {fontWeight:700, fontSize:15, marginBottom:7},
  cardDesc: {color:'#888', fontSize:13, lineHeight:1.6},
  tip: {background:'#13131a', border:'1px solid #c8f53e33', borderRadius:14, margin:'8px 20px 20px', padding:'18px 22px'},
  tipTitle: {fontWeight:700, fontSize:14, color:'#c8f53e', marginBottom:6},
  tipDesc: {color:'#888', fontSize:13, lineHeight:1.6},
  footer: {borderTop:'1px solid #1e1e2a', padding:'18px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8},
}
