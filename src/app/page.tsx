'use client'
import { useState, useRef, useEffect } from 'react'

const AGENTS = [
  { id: 'TANYA', name: 'TANYA™', role: 'Chief Sales Strategist', brand: 'Zenith Intelligence', icon: '⚡', color: '#00D9FF' },
  { id: 'FELIX', name: 'FELIX™', role: 'Financial Intelligence Officer', brand: 'FINPAL™', icon: '📊', color: '#4ade80' },
  { id: 'NOVA', name: 'NOVA™', role: 'Content & Social Media Director', brand: 'Zenith Intelligence', icon: '🚀', color: '#f472b6' },
  { id: 'MARCUS', name: 'MARCUS™', role: 'Business Strategy Consultant', brand: 'Zenith Intelligence', icon: '🧠', color: '#a78bfa' },
  { id: 'ARIA', name: 'ARIA™', role: 'Client Success Manager', brand: 'Zenith / FINPAL™', icon: '💎', color: '#fb923c' },
  { id: 'SCOUT', name: 'SCOUT™', role: 'Lead Generation & Research', brand: 'Zenith Intelligence', icon: '🔍', color: '#facc15' },
  { id: 'ZEE_AI', name: 'ZEE-AI™', role: 'Personal Chief of Staff', brand: 'ZHR™', icon: '👑', color: '#00D9FF' },
]

type Msg = { role: 'user' | 'agent'; text: string }

export default function Home() {
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const agent = AGENTS.find(a => a.id === activeAgentId) ?? null

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send() {
    const text = input.trim()
    if (!text || !activeAgentId || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text }])
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: activeAgentId, message: text }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'agent', text: data.content || 'No response.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'agent', text: 'Connection error. Please try again.' }])
    }
    setLoading(false)
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  function selectAgent(id: string) {
    setActiveAgentId(id)
    setMessages([])
    setInput('')
  }

  function goBack() {
    setActiveAgentId(null)
    setMessages([])
    setInput('')
  }

  // === CHAT VIEW ===
  if (agent) {
    return (
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#0B0C10', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(0,217,255,0.12)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <button onClick={goBack}
            style={{ background: 'rgba(0,217,255,0.08)', border: '1px solid rgba(0,217,255,0.25)', borderRadius: 8, color: '#00D9FF', padding: '7px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            ← Back
          </button>
          <span style={{ fontSize: 22 }}>{agent.icon}</span>
          <div>
            <div style={{ color: agent.color, fontWeight: 700, fontSize: 15 }}>{agent.name}</div>
            <div style={{ color: '#CFD8E3', fontSize: 11, opacity: 0.5 }}>{agent.role} · {agent.brand}</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 10, color: '#00D9FF', background: 'rgba(0,217,255,0.08)', border: '1px solid rgba(0,217,255,0.2)', borderRadius: 20, padding: '4px 10px' }}>
            ● LIVE
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: 60, color: '#CFD8E3', opacity: 0.35 }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>{agent.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Chat with {agent.name}</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>{agent.role}</div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '82%',
                padding: '11px 15px',
                borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                fontSize: 14, lineHeight: 1.65, color: '#CFD8E3',
                background: m.role === 'user' ? 'rgba(0,217,255,0.14)' : 'rgba(255,255,255,0.05)',
                border: m.role === 'user' ? '1px solid rgba(0,217,255,0.28)' : '1px solid rgba(255,255,255,0.08)',
                whiteSpace: 'pre-wrap',
              }}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 5, padding: '8px 4px' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#00D9FF',
                  animation: `bounce 1s ${i*0.18}s infinite ease-in-out` }} />
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(0,217,255,0.1)', display: 'flex', gap: 8, flexShrink: 0, background: '#0B0C10' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`Ask ${agent.name}...`}
            disabled={loading}
            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,217,255,0.18)', borderRadius: 10, padding: '12px 14px', color: '#CFD8E3', fontSize: 14, outline: 'none' }}
          />
          <button onClick={send} disabled={loading || !input.trim()}
            style={{ background: loading || !input.trim() ? 'rgba(0,217,255,0.3)' : '#00D9FF', border: 'none', borderRadius: 10, padding: '12px 18px', color: '#0B0C10', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, transition: 'all 0.15s' }}>
            {loading ? '...' : 'Send'}
          </button>
        </div>

        <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }`}</style>
      </div>
    )
  }

  // === DASHBOARD VIEW ===
  return (
    <div style={{ minHeight: '100dvh', background: '#0B0C10', paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ padding: '24px 18px 20px', borderBottom: '1px solid rgba(0,217,255,0.1)' }}>
        <div style={{ fontSize: 10, color: '#00D9FF', letterSpacing: 4, marginBottom: 6, textTransform: 'uppercase', fontWeight: 600 }}>ZHR™ Intelligence Command</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: '#CFD8E3', lineHeight: 1.2 }}>Your AI Business Team</div>
        <div style={{ fontSize: 12, color: '#CFD8E3', opacity: 0.45, marginTop: 5 }}>Zenith Intelligence · 7 Agents · Powered by Groq</div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, padding: '18px 16px 0' }}>
        {[
          { label: 'Agents Active', value: '7', color: '#00D9FF' },
          { label: 'Posts Live', value: '5', color: '#4ade80' },
          { label: 'Status', value: 'Online', color: '#00D9FF' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,217,255,0.1)', borderRadius: 12, padding: '14px 10px', textAlign: 'center' }}>
            <div style={{ color: s.color, fontSize: 22, fontWeight: 700 }}>{s.value}</div>
            <div style={{ color: '#CFD8E3', fontSize: 10, opacity: 0.45, marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Agents */}
      <div style={{ padding: '22px 16px 0' }}>
        <div style={{ fontSize: 10, color: '#CFD8E3', opacity: 0.35, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14, fontWeight: 600 }}>Agent Team</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {AGENTS.map(a => (
            <button key={a.id} onClick={() => selectAgent(a.id)}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,217,255,0.1)', borderRadius: 14, padding: '16px 14px', textAlign: 'left', cursor: 'pointer', width: '100%', transition: 'border-color 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: `${a.color}12`, border: `1px solid ${a.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                  {a.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: a.color, fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{a.name}</div>
                  <div style={{ color: '#CFD8E3', fontSize: 12, opacity: 0.6 }}>{a.role}</div>
                  <div style={{ color: '#CFD8E3', fontSize: 10, opacity: 0.3, marginTop: 1 }}>{a.brand}</div>
                </div>
                <div style={{ flexShrink: 0, background: 'rgba(0,217,255,0.08)', border: '1px solid rgba(0,217,255,0.2)', borderRadius: 20, padding: '4px 10px', fontSize: 10, color: '#00D9FF', fontWeight: 600 }}>
                  ● LIVE
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 36, fontSize: 10, color: '#CFD8E3', opacity: 0.2, letterSpacing: 1 }}>
        ZHR™ · Zenith Intelligence · FINPAL™
      </div>
    </div>
  )
}
