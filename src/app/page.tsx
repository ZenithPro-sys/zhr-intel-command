'use client'
import { useState } from 'react'

const AGENTS = [
  { id: 'TANYA', name: 'TANYA™', role: 'Chief Sales Strategist', brand: 'Zenith Intelligence', icon: '⚡', color: '#00D9FF', status: 'active' },
  { id: 'FELIX', name: 'FELIX™', role: 'Financial Intelligence Officer', brand: 'FINPAL™', icon: '📊', color: '#4ade80', status: 'active' },
  { id: 'NOVA', name: 'NOVA™', role: 'Content & Social Media Director', brand: 'Zenith Intelligence', icon: '🚀', color: '#f472b6', status: 'active' },
  { id: 'MARCUS', name: 'MARCUS™', role: 'Business Strategy Consultant', brand: 'Zenith Intelligence', icon: '🧠', color: '#a78bfa', status: 'active' },
  { id: 'ARIA', name: 'ARIA™', role: 'Client Success Manager', brand: 'Zenith / FINPAL™', icon: '💎', color: '#fb923c', status: 'active' },
  { id: 'SCOUT', name: 'SCOUT™', role: 'Lead Generation & Research', brand: 'Zenith Intelligence', icon: '🔍', color: '#facc15', status: 'active' },
  { id: 'ZEE_AI', name: 'ZEE-AI™', role: 'Personal Chief of Staff', brand: 'ZHR™', icon: '👑', color: '#00D9FF', status: 'active' },
]

export default function Home() {
  const [activeAgent, setActiveAgent] = useState<string | null>(null)
  const [messages, setMessages] = useState<{role:string;text:string}[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const agent = AGENTS.find(a => a.id === activeAgent)

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
        body: JSON.stringify({ agent: activeAgent, message: userMsg })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'agent', text: data.content || 'Sorry, something went wrong.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'agent', text: 'Connection error. Please try again.' }])
    }
    setLoading(false)
  }

  if (activeAgent && agent) {
    return (
      <div style={{ minHeight: '100vh', background: '#0B0C10', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(0,217,255,0.15)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => { setActiveAgent(null); setMessages([]) }}
            style={{ background: 'rgba(0,217,255,0.1)', border: '1px solid rgba(0,217,255,0.3)', borderRadius: 8, color: '#00D9FF', padding: '6px 14px', cursor: 'pointer', fontSize: 14 }}>
            ← Back
          </button>
          <div style={{ fontSize: 24 }}>{agent.icon}</div>
          <div>
            <div style={{ color: agent.color, fontWeight: 700, fontSize: 16 }}>{agent.name}</div>
            <div style={{ color: '#CFD8E3', fontSize: 12, opacity: 0.6 }}>{agent.role}</div>
          </div>
          <div style={{ marginLeft: 'auto', background: 'rgba(0,217,255,0.1)', border: '1px solid rgba(0,217,255,0.2)', borderRadius: 20, padding: '4px 12px', fontSize: 11, color: '#00D9FF' }}>
            ● ACTIVE
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: 60, opacity: 0.4 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{agent.icon}</div>
              <div style={{ color: '#CFD8E3', fontSize: 15 }}>Chat with {agent.name}</div>
              <div style={{ color: '#CFD8E3', fontSize: 13, marginTop: 6 }}>{agent.role}</div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '80%', padding: '12px 16px', borderRadius: 12, fontSize: 14, lineHeight: 1.6,
                background: m.role === 'user' ? 'rgba(0,217,255,0.15)' : 'rgba(255,255,255,0.05)',
                border: m.role === 'user' ? '1px solid rgba(0,217,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
                color: '#CFD8E3',
                borderBottomRightRadius: m.role === 'user' ? 2 : 12,
                borderBottomLeftRadius: m.role === 'agent' ? 2 : 12,
              }}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 6, padding: '12px 16px' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#00D9FF', opacity: 0.6, animation: `pulse 1s ${i*0.2}s infinite` }} />
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(0,217,255,0.15)', display: 'flex', gap: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder={`Ask ${agent.name}...`}
            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,217,255,0.2)', borderRadius: 10, padding: '12px 16px', color: '#CFD8E3', fontSize: 14, outline: 'none' }}
          />
          <button onClick={sendMessage} disabled={loading}
            style={{ background: '#00D9FF', border: 'none', borderRadius: 10, padding: '12px 20px', color: '#0B0C10', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
            Send
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0C10', padding: '0 0 40px' }}>
      {/* Header */}
      <div style={{ padding: '24px 20px 0', borderBottom: '1px solid rgba(0,217,255,0.1)', paddingBottom: 20 }}>
        <div style={{ fontSize: 11, color: '#00D9FF', letterSpacing: 3, marginBottom: 4, textTransform: 'uppercase' }}>ZHR™</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#CFD8E3', lineHeight: 1.2 }}>Intelligence Command</div>
        <div style={{ fontSize: 13, color: '#CFD8E3', opacity: 0.5, marginTop: 4 }}>Zenith Intelligence · Multi-Agent Platform</div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, padding: '20px 16px 0' }}>
        {[
          { label: 'Agents Active', value: '7' },
          { label: 'Posts Live', value: '5' },
          { label: 'Status', value: 'Online' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,217,255,0.12)', borderRadius: 10, padding: '12px 10px', textAlign: 'center' }}>
            <div style={{ color: '#00D9FF', fontSize: 20, fontWeight: 700 }}>{s.value}</div>
            <div style={{ color: '#CFD8E3', fontSize: 10, opacity: 0.5, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Agents */}
      <div style={{ padding: '24px 16px 0' }}>
        <div style={{ fontSize: 12, color: '#CFD8E3', opacity: 0.4, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>Your Agent Team</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {AGENTS.map(a => (
            <button key={a.id} onClick={() => { setActiveAgent(a.id); setMessages([]) }}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,217,255,0.12)', borderRadius: 12, padding: '16px', textAlign: 'left', cursor: 'pointer', width: '100%', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${a.color}15`, border: `1px solid ${a.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  {a.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: a.color, fontWeight: 700, fontSize: 15 }}>{a.name}</div>
                  <div style={{ color: '#CFD8E3', fontSize: 12, opacity: 0.6, marginTop: 2 }}>{a.role}</div>
                  <div style={{ color: '#CFD8E3', fontSize: 10, opacity: 0.35, marginTop: 1 }}>{a.brand}</div>
                </div>
                <div style={{ background: 'rgba(0,217,255,0.08)', border: '1px solid rgba(0,217,255,0.2)', borderRadius: 12, padding: '3px 10px', fontSize: 10, color: '#00D9FF', flexShrink: 0 }}>
                  ● LIVE
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 32, opacity: 0.25, fontSize: 11, color: '#CFD8E3' }}>
        ZHR™ Intelligence Command · Zenith Intelligence · Powered by Groq AI
      </div>
    </div>
  )
}
