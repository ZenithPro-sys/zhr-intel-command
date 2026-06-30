'use client'
import { useState } from 'react'

const AGENTS = [
  {
    id: 'TANYA',
    name: 'TANYA™',
    role: 'Chief Sales Strategist',
    brand: 'Zenith Intelligence',
    color: '#00D9FF',
    status: 'active',
    avatar: 'T',
    training: {
      level: 85,
      sops: ['BANT Qualification Framework', 'Cold Email Under 120 Words', '5x Follow-Up Rule', 'Personalise First Line Always'],
      lastReview: '2026-06-28',
      wins: ['Zenith cold email template v2', 'LinkedIn DM sequence finalized'],
      improvements: ['Need industry-specific pain points library', 'Add objection handling scripts'],
    }
  },
  {
    id: 'FELIX',
    name: 'FELIX™',
    role: 'Financial Intelligence Officer',
    brand: 'FINPAL™',
    color: '#4ade80',
    status: 'active',
    avatar: 'F',
    training: {
      level: 90,
      sops: ['Always separate VAT from gross', 'Flag unusual transactions immediately', 'Format: Income/Expenses/VAT/Net', 'Reference SARS deadlines always'],
      lastReview: '2026-06-28',
      wins: ['FINPAL client reporting template', 'VAT flag system active'],
      improvements: ['Build industry-specific expense category library', 'Add SARS deadline calendar'],
    }
  },
  {
    id: 'NOVA',
    name: 'NOVA™',
    role: 'Content & Social Media Director',
    brand: 'Zenith Intelligence',
    color: '#f472b6',
    status: 'active',
    avatar: 'N',
    training: {
      level: 88,
      sops: ['Hook in first line — stop the scroll', 'Always include CTA', 'Rotate 4 themes Mon–Thu', 'Repurpose every post x3 formats', 'Trust-first — no hard selling'],
      lastReview: '2026-06-29',
      wins: ['Trust-first content rotation live', 'Instagram + LinkedIn automated', 'Notion content library synced'],
      improvements: ['Build winning post archive', 'Add visual content calendar', 'Develop Instagram Reels strategy'],
    }
  },
  {
    id: 'MARCUS',
    name: 'MARCUS™',
    role: 'Business Strategy Consultant',
    brand: 'Zenith Intelligence',
    color: '#a78bfa',
    status: 'active',
    avatar: 'M',
    training: {
      level: 80,
      sops: ['Structure: Situation/Insight/Recommendation/Action', 'Lead with data, instinct when not available', 'Flag revenue opps over R5K/month', 'Weekly growth opportunity report'],
      lastReview: '2026-06-28',
      wins: ['GigaZone Dynamics strategy brief', 'Zenith Intelligence expansion map'],
      improvements: ['Competitive intelligence dashboard needed', 'Monthly OKR review template'],
    }
  },
  {
    id: 'ARIA',
    name: 'ARIA™',
    role: 'Client Success Manager',
    brand: 'Zenith / FINPAL™',
    color: '#fb923c',
    status: 'active',
    avatar: 'A',
    training: {
      level: 78,
      sops: ['Onboarding email within 24hrs', 'Check-in: Week1/Month1/Month3/Quarterly', 'Collect testimonial at Month 2', 'Flag 7-day no-response as at-risk', 'Upsell window: Month 2'],
      lastReview: '2026-06-28',
      wins: ['Client onboarding email template v1'],
      improvements: ['Build client check-in automation', 'Create testimonial request sequence', 'Add upsell trigger workflow'],
    }
  },
  {
    id: 'SCOUT',
    name: 'SCOUT™',
    role: 'Lead Generation & Research',
    brand: 'Zenith Intelligence',
    color: '#facc15',
    status: 'active',
    avatar: 'S',
    training: {
      level: 75,
      sops: ['Lead list: Name/Company/Pain/Contact/Source', 'Research company website before outreach', 'Weekly: opportunity report + competitor intel', 'Target: SA SMEs R500K–R5M revenue'],
      lastReview: '2026-06-28',
      wins: ['Target profile defined', 'Competitor monitoring started'],
      improvements: ['Build SA SME database', 'Automate lead scoring', 'LinkedIn outreach templates needed'],
    }
  },
  {
    id: 'ZEE_AI',
    name: 'ZEE-AI™',
    role: 'Personal Chief of Staff',
    brand: 'ZHR™',
    color: '#00D9FF',
    status: 'active',
    avatar: 'Z',
    training: {
      level: 92,
      sops: ['Morning briefing by 7:30am SAST', 'Prioritise: Urgent/Important/Can wait', 'Protect Zee\'s time ruthlessly', 'Weekly performance digest all 7 agents', 'Escalate only: revenue opps, client risks, brand threats'],
      lastReview: '2026-06-29',
      wins: ['Daily briefing automation live', 'All 7 agents on Groq — zero credit dependency', 'Notion content library integrated'],
      improvements: ['Connect to email inbox', 'Add calendar conflict detection', 'Build weekly digest template'],
    }
  },
]

type View = 'command' | 'chat' | 'training' | 'agent-training'

export default function Home() {
  const [view, setView] = useState<View>('command')
  const [activeAgent, setActiveAgent] = useState<typeof AGENTS[0] | null>(null)
  const [messages, setMessages] = useState<{role:string;text:string}[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [trainingNote, setTrainingNote] = useState('')
  const [savedNote, setSavedNote] = useState(false)

  async function sendMessage() {
    if (!input.trim() || !activeAgent) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: activeAgent.id, message: userMsg })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'agent', text: data.content || 'Sorry, something went wrong.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'agent', text: 'Connection error. Please try again.' }])
    }
    setLoading(false)
  }

  function openChat(agent: typeof AGENTS[0]) {
    setActiveAgent(agent)
    setMessages([])
    setView('chat')
  }

  function openTraining(agent: typeof AGENTS[0]) {
    setActiveAgent(agent)
    setView('agent-training')
  }

  // ── CHAT VIEW ──
  if (view === 'chat' && activeAgent) {
    return (
      <div style={{ minHeight:'100vh', background:'#0B0C10', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid rgba(0,217,255,0.15)', display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={() => setView('command')} style={{ background:'rgba(0,217,255,0.1)', border:'1px solid rgba(0,217,255,0.3)', borderRadius:8, color:'#00D9FF', padding:'6px 14px', cursor:'pointer', fontSize:14 }}>← Back</button>
          <div style={{ width:36, height:36, borderRadius:8, background:`${activeAgent.color}20`, border:`1px solid ${activeAgent.color}50`, display:'flex', alignItems:'center', justifyContent:'center', color:activeAgent.color, fontWeight:700, fontSize:15 }}>{activeAgent.avatar}</div>
          <div>
            <div style={{ color:activeAgent.color, fontWeight:700, fontSize:15 }}>{activeAgent.name}</div>
            <div style={{ color:'#CFD8E3', fontSize:11, opacity:0.5 }}>{activeAgent.role}</div>
          </div>
          <div style={{ marginLeft:'auto', background:'rgba(0,217,255,0.08)', border:'1px solid rgba(0,217,255,0.2)', borderRadius:20, padding:'3px 10px', fontSize:10, color:'#00D9FF' }}>● LIVE</div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'20px 16px', display:'flex', flexDirection:'column', gap:12 }}>
          {messages.length === 0 && (
            <div style={{ textAlign:'center', marginTop:60, opacity:0.4 }}>
              <div style={{ width:60, height:60, borderRadius:14, background:`${activeAgent.color}15`, border:`1px solid ${activeAgent.color}40`, display:'flex', alignItems:'center', justifyContent:'center', color:activeAgent.color, fontWeight:700, fontSize:24, margin:'0 auto 12px' }}>{activeAgent.avatar}</div>
              <div style={{ color:'#CFD8E3', fontSize:15 }}>{activeAgent.name} is ready</div>
              <div style={{ color:'#CFD8E3', fontSize:12, marginTop:4 }}>{activeAgent.role}</div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start' }}>
              <div style={{ maxWidth:'82%', padding:'12px 16px', borderRadius:12, fontSize:14, lineHeight:1.6, background:m.role==='user'?'rgba(0,217,255,0.12)':'rgba(255,255,255,0.04)', border:m.role==='user'?'1px solid rgba(0,217,255,0.25)':'1px solid rgba(255,255,255,0.08)', color:'#CFD8E3', borderBottomRightRadius:m.role==='user'?2:12, borderBottomLeftRadius:m.role==='agent'?2:12, whiteSpace:'pre-wrap' }}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display:'flex', gap:5, padding:'8px 4px' }}>
              {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:activeAgent.color, opacity:0.6 }} />)}
            </div>
          )}
        </div>
        <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(0,217,255,0.12)', display:'flex', gap:10 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && sendMessage()} placeholder={`Ask ${activeAgent.name}...`}
            style={{ flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(0,217,255,0.2)', borderRadius:10, padding:'12px 16px', color:'#CFD8E3', fontSize:14, outline:'none' }} />
          <button onClick={sendMessage} disabled={loading} style={{ background:'#00D9FF', border:'none', borderRadius:10, padding:'12px 20px', color:'#0B0C10', fontWeight:700, cursor:'pointer', fontSize:14 }}>Send</button>
        </div>
      </div>
    )
  }

  // ── AGENT TRAINING VIEW ──
  if (view === 'agent-training' && activeAgent) {
    const t = activeAgent.training
    return (
      <div style={{ minHeight:'100vh', background:'#0B0C10', paddingBottom:40 }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid rgba(0,217,255,0.15)', display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={() => setView('training')} style={{ background:'rgba(0,217,255,0.1)', border:'1px solid rgba(0,217,255,0.3)', borderRadius:8, color:'#00D9FF', padding:'6px 14px', cursor:'pointer', fontSize:14 }}>← Training</button>
          <div style={{ width:36, height:36, borderRadius:8, background:`${activeAgent.color}20`, border:`1px solid ${activeAgent.color}50`, display:'flex', alignItems:'center', justifyContent:'center', color:activeAgent.color, fontWeight:700, fontSize:15 }}>{activeAgent.avatar}</div>
          <div>
            <div style={{ color:activeAgent.color, fontWeight:700, fontSize:15 }}>{activeAgent.name} — Training File</div>
            <div style={{ color:'#CFD8E3', fontSize:11, opacity:0.5 }}>Last reviewed: {t.lastReview}</div>
          </div>
        </div>

        <div style={{ padding:'20px 16px', display:'flex', flexDirection:'column', gap:16 }}>

          {/* Training Level */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(0,217,255,0.12)', borderRadius:14, padding:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <div style={{ color:'#CFD8E3', fontSize:13, fontWeight:600 }}>Training Level</div>
              <div style={{ color:activeAgent.color, fontSize:20, fontWeight:700 }}>{t.level}%</div>
            </div>
            <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:6, height:8, overflow:'hidden' }}>
              <div style={{ width:`${t.level}%`, height:'100%', background:`linear-gradient(90deg, ${activeAgent.color}, ${activeAgent.color}99)`, borderRadius:6 }} />
            </div>
          </div>

          {/* SOPs */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(0,217,255,0.12)', borderRadius:14, padding:16 }}>
            <div style={{ color:'#CFD8E3', fontSize:13, fontWeight:600, marginBottom:12 }}>📋 Active SOPs</div>
            {t.sops.map((sop, i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:8 }}>
                <div style={{ width:20, height:20, borderRadius:5, background:`${activeAgent.color}20`, border:`1px solid ${activeAgent.color}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:activeAgent.color, flexShrink:0, marginTop:1 }}>✓</div>
                <div style={{ color:'#CFD8E3', fontSize:13, opacity:0.8, lineHeight:1.4 }}>{sop}</div>
              </div>
            ))}
          </div>

          {/* Wins */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(74,222,128,0.15)', borderRadius:14, padding:16 }}>
            <div style={{ color:'#4ade80', fontSize:13, fontWeight:600, marginBottom:12 }}>🏆 Documented Wins</div>
            {t.wins.map((w, i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:8 }}>
                <div style={{ color:'#4ade80', fontSize:14, flexShrink:0 }}>→</div>
                <div style={{ color:'#CFD8E3', fontSize:13, opacity:0.8 }}>{w}</div>
              </div>
            ))}
          </div>

          {/* Improvements */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(250,204,21,0.15)', borderRadius:14, padding:16 }}>
            <div style={{ color:'#facc15', fontSize:13, fontWeight:600, marginBottom:12 }}>⚠️ Needs Improvement</div>
            {t.improvements.map((imp, i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:8 }}>
                <div style={{ color:'#facc15', fontSize:14, flexShrink:0 }}>→</div>
                <div style={{ color:'#CFD8E3', fontSize:13, opacity:0.8 }}>{imp}</div>
              </div>
            ))}
          </div>

          {/* Add Training Note */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(0,217,255,0.12)', borderRadius:14, padding:16 }}>
            <div style={{ color:'#CFD8E3', fontSize:13, fontWeight:600, marginBottom:10 }}>✏️ Add Training Note</div>
            <textarea
              value={trainingNote}
              onChange={e => setTrainingNote(e.target.value)}
              placeholder={`Add a correction, new SOP, or improvement for ${activeAgent.name}...`}
              style={{ width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(0,217,255,0.2)', borderRadius:10, padding:'12px', color:'#CFD8E3', fontSize:13, outline:'none', resize:'vertical', minHeight:90, fontFamily:'inherit', boxSizing:'border-box' }}
            />
            <button
              onClick={() => { setSavedNote(true); setTrainingNote(''); setTimeout(() => setSavedNote(false), 2500) }}
              style={{ marginTop:10, background:'#00D9FF', border:'none', borderRadius:9, padding:'10px 20px', color:'#0B0C10', fontWeight:700, cursor:'pointer', fontSize:13, width:'100%' }}>
              {savedNote ? '✅ Saved to Training Log' : 'Save Training Note'}
            </button>
          </div>

          {/* Chat with agent button */}
          <button onClick={() => openChat(activeAgent)} style={{ background:'rgba(0,217,255,0.08)', border:`1px solid ${activeAgent.color}40`, borderRadius:12, padding:'14px', color:activeAgent.color, fontWeight:700, cursor:'pointer', fontSize:14 }}>
            Chat with {activeAgent.name} →
          </button>
        </div>
      </div>
    )
  }

  // ── TRAINING HUB VIEW ──
  if (view === 'training') {
    return (
      <div style={{ minHeight:'100vh', background:'#0B0C10', paddingBottom:40 }}>
        <div style={{ padding:'20px 20px 0', borderBottom:'1px solid rgba(0,217,255,0.1)', paddingBottom:16, display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={() => setView('command')} style={{ background:'rgba(0,217,255,0.1)', border:'1px solid rgba(0,217,255,0.3)', borderRadius:8, color:'#00D9FF', padding:'6px 14px', cursor:'pointer', fontSize:14 }}>← Command</button>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:'#CFD8E3' }}>Agent Training Hub</div>
            <div style={{ fontSize:11, color:'#CFD8E3', opacity:0.4 }}>ZHR™ Training Doctrine · All 7 Agents</div>
          </div>
        </div>

        <div style={{ padding:'16px 16px 0' }}>
          <div style={{ background:'rgba(0,217,255,0.06)', border:'1px solid rgba(0,217,255,0.15)', borderRadius:12, padding:'12px 14px', marginBottom:16 }}>
            <div style={{ color:'#00D9FF', fontSize:12, fontWeight:600 }}>Training Doctrine</div>
            <div style={{ color:'#CFD8E3', fontSize:12, opacity:0.7, marginTop:4, lineHeight:1.5 }}>Give task → Review output → Correct mistakes → Save as SOP → Update agent. Every week, every agent gets better.</div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {AGENTS.map(a => (
              <button key={a.id} onClick={() => openTraining(a)}
                style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(0,217,255,0.1)', borderRadius:12, padding:'14px 16px', textAlign:'left', cursor:'pointer', width:'100%' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:40, height:40, borderRadius:9, background:`${a.color}15`, border:`1px solid ${a.color}40`, display:'flex', alignItems:'center', justifyContent:'center', color:a.color, fontWeight:700, fontSize:16, flexShrink:0 }}>{a.avatar}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div style={{ color:a.color, fontWeight:700, fontSize:14 }}>{a.name}</div>
                      <div style={{ color:a.color, fontSize:13, fontWeight:700 }}>{a.training.level}%</div>
                    </div>
                    <div style={{ color:'#CFD8E3', fontSize:11, opacity:0.5, marginTop:2 }}>{a.role}</div>
                    <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:4, height:4, marginTop:8, overflow:'hidden' }}>
                      <div style={{ width:`${a.training.level}%`, height:'100%', background:a.color, borderRadius:4 }} />
                    </div>
                  </div>
                  <div style={{ color:'#CFD8E3', opacity:0.3, fontSize:16, marginLeft:4 }}>›</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── COMMAND VIEW (HOME) ──
  return (
    <div style={{ minHeight:'100vh', background:'#0B0C10', paddingBottom:40 }}>
      {/* Header */}
      <div style={{ padding:'24px 20px 16px', borderBottom:'1px solid rgba(0,217,255,0.1)' }}>
        <div style={{ fontSize:10, color:'#00D9FF', letterSpacing:3, marginBottom:4, textTransform:'uppercase' }}>ZHR™ Intelligence Command</div>
        <div style={{ fontSize:22, fontWeight:700, color:'#CFD8E3', lineHeight:1.2 }}>Good morning, Zee 👑</div>
        <div style={{ fontSize:12, color:'#CFD8E3', opacity:0.4, marginTop:4 }}>Zenith Intelligence · All systems operational</div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, padding:'16px 16px 0' }}>
        {[
          { label:'Agents', value:'7', sub:'All Live' },
          { label:'Posts', value:'9+', sub:'This Week' },
          { label:'Status', value:'ON', sub:'Groq Active' },
        ].map(s => (
          <div key={s.label} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(0,217,255,0.1)', borderRadius:10, padding:'12px 8px', textAlign:'center' }}>
            <div style={{ color:'#00D9FF', fontSize:18, fontWeight:700 }}>{s.value}</div>
            <div style={{ color:'#CFD8E3', fontSize:9, opacity:0.5, marginTop:1 }}>{s.label}</div>
            <div style={{ color:'#4ade80', fontSize:9, marginTop:1 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Nav Tabs */}
      <div style={{ display:'flex', gap:8, padding:'16px 16px 0' }}>
        <button onClick={() => setView('command')} style={{ flex:1, background:'rgba(0,217,255,0.12)', border:'1px solid rgba(0,217,255,0.3)', borderRadius:9, padding:'9px', color:'#00D9FF', fontWeight:700, cursor:'pointer', fontSize:12 }}>🧠 Agents</button>
        <button onClick={() => setView('training')} style={{ flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:9, padding:'9px', color:'#CFD8E3', cursor:'pointer', fontSize:12 }}>📋 Training</button>
      </div>

      {/* Agent List */}
      <div style={{ padding:'16px 16px 0' }}>
        <div style={{ fontSize:10, color:'#CFD8E3', opacity:0.35, letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Your Agent Team</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {AGENTS.map(a => (
            <div key={a.id} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(0,217,255,0.1)', borderRadius:12, padding:'14px 16px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:42, height:42, borderRadius:10, background:`${a.color}15`, border:`1px solid ${a.color}40`, display:'flex', alignItems:'center', justifyContent:'center', color:a.color, fontWeight:700, fontSize:17, flexShrink:0 }}>{a.avatar}</div>
                <div style={{ flex:1 }}>
                  <div style={{ color:a.color, fontWeight:700, fontSize:14 }}>{a.name}</div>
                  <div style={{ color:'#CFD8E3', fontSize:11, opacity:0.5, marginTop:1 }}>{a.role}</div>
                  <div style={{ color:'#CFD8E3', fontSize:9, opacity:0.3 }}>{a.brand}</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'flex-end' }}>
                  <div style={{ background:'rgba(0,217,255,0.08)', border:'1px solid rgba(0,217,255,0.2)', borderRadius:12, padding:'2px 8px', fontSize:9, color:'#00D9FF' }}>● LIVE</div>
                </div>
              </div>
              {/* Action buttons */}
              <div style={{ display:'flex', gap:8, marginTop:12 }}>
                <button onClick={() => openChat(a)} style={{ flex:1, background:`${a.color}15`, border:`1px solid ${a.color}30`, borderRadius:8, padding:'8px', color:a.color, fontWeight:600, cursor:'pointer', fontSize:12 }}>Chat →</button>
                <button onClick={() => openTraining(a)} style={{ flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'8px', color:'#CFD8E3', cursor:'pointer', fontSize:12 }}>Training →</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign:'center', marginTop:28, opacity:0.2, fontSize:10, color:'#CFD8E3' }}>
        ZHR™ Intelligence Command · Zenith Intelligence · Powered by Groq AI
      </div>
    </div>
  )
}
