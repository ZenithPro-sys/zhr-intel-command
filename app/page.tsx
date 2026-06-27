'use client'
import { useState } from 'react'

const agents = [
  { id: 'TANYA', name: 'TANYA™', role: 'Chief Sales Strategist', brand: 'Zenith Intelligence', emoji: '💼', color: '#00D9FF', status: 'active' },
  { id: 'FELIX', name: 'FELIX™', role: 'Financial Intelligence Officer', brand: 'FINPAL™', emoji: '📊', color: '#00D9FF', status: 'active' },
  { id: 'NOVA', name: 'NOVA™', role: 'Content & Social Media Director', brand: 'Zenith Intelligence', emoji: '✨', color: '#00D9FF', status: 'active' },
  { id: 'MARCUS', name: 'MARCUS™', role: 'Business Strategy Consultant', brand: 'Zenith Intelligence', emoji: '🧠', color: '#00D9FF', status: 'active' },
  { id: 'ARIA', name: 'ARIA™', role: 'Client Success Manager', brand: 'Zenith / FINPAL™', emoji: '🤝', color: '#00D9FF', status: 'active' },
  { id: 'SCOUT', name: 'SCOUT™', role: 'Lead Generation & Research', brand: 'Zenith Intelligence', emoji: '🔍', color: '#00D9FF', status: 'active' },
  { id: 'ZEE_AI', name: 'ZEE-AI™', role: 'Personal Chief of Staff', brand: 'ZHR™', emoji: '⚡', color: '#00D9FF', status: 'active' },
]

export default function Home() {
  const [activeAgent, setActiveAgent] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || !activeAgent) return
    const userMsg = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: activeAgent.id, task: input }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'agent', content: data.content, agent: activeAgent.name }])
    } catch {
      setMessages(prev => [...prev, { role: 'agent', content: 'Something went wrong. Try again.', agent: activeAgent.name }])
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#0B0C10] text-[#CFD8E3]">
      {/* Header */}
      <header className="border-b border-[#00D9FF]/20 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#00D9FF] tracking-widest">ZHR™ INTELLIGENCE COMMAND</h1>
          <p className="text-xs text-[#CFD8E3]/50 tracking-wider">ZENITH INTELLIGENCE — MULTI-AGENT BUSINESS PLATFORM</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse"></span>
          <span className="text-xs text-[#00D9FF]">7 AGENTS ACTIVE</span>
        </div>
      </header>

      <div className="flex flex-col md:flex-row h-[calc(100vh-73px)]">
        {/* Agent Sidebar */}
        <aside className="w-full md:w-72 border-b md:border-b-0 md:border-r border-[#00D9FF]/10 p-4 overflow-y-auto">
          <p className="text-xs text-[#CFD8E3]/40 tracking-widest mb-3 px-1">SELECT AGENT</p>
          <div className="space-y-2">
            {agents.map(agent => (
              <button
                key={agent.id}
                onClick={() => { setActiveAgent(agent); setMessages([]) }}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  activeAgent?.id === agent.id
                    ? 'border-[#00D9FF] bg-[#00D9FF]/10'
                    : 'border-[#CFD8E3]/10 hover:border-[#00D9FF]/40 hover:bg-[#00D9FF]/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{agent.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm text-[#CFD8E3]">{agent.name}</p>
                    <p className="text-xs text-[#CFD8E3]/50">{agent.role}</p>
                    <p className="text-xs text-[#00D9FF]/70 mt-0.5">{agent.brand}</p>
                  </div>
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00D9FF]"></span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Chat Area */}
        <section className="flex-1 flex flex-col">
          {activeAgent ? (
            <>
              <div className="border-b border-[#00D9FF]/10 px-6 py-3">
                <p className="font-semibold text-[#00D9FF]">{activeAgent.name}</p>
                <p className="text-xs text-[#CFD8E3]/50">{activeAgent.role} — {activeAgent.brand}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-[#CFD8E3]/30 mt-20">
                    <p className="text-4xl mb-3">⚡</p>
                    <p className="text-sm">Chat with {activeAgent.name}</p>
                    <p className="text-xs mt-1">Ask anything in their area of expertise</p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-3 rounded-xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#00D9FF]/20 text-[#CFD8E3] rounded-br-none'
                        : 'bg-[#CFD8E3]/5 border border-[#00D9FF]/20 text-[#CFD8E3] rounded-bl-none'
                    }`}>
                      {msg.role === 'agent' && <p className="text-xs text-[#00D9FF] mb-1 font-semibold">{msg.agent}</p>}
                      <p style={{whiteSpace: 'pre-wrap'}}>{msg.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-[#CFD8E3]/5 border border-[#00D9FF]/20 px-4 py-3 rounded-xl rounded-bl-none">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-[#00D9FF] rounded-full animate-bounce" style={{animationDelay:'0ms'}}></span>
                        <span className="w-2 h-2 bg-[#00D9FF] rounded-full animate-bounce" style={{animationDelay:'150ms'}}></span>
                        <span className="w-2 h-2 bg-[#00D9FF] rounded-full animate-bounce" style={{animationDelay:'300ms'}}></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="border-t border-[#00D9FF]/10 p-4 flex gap-3">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder={`Ask ${activeAgent.name} anything...`}
                  className="flex-1 bg-[#CFD8E3]/5 border border-[#00D9FF]/20 rounded-xl px-4 py-3 text-sm text-[#CFD8E3] placeholder-[#CFD8E3]/30 focus:outline-none focus:border-[#00D9FF]/60"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="bg-[#00D9FF] text-[#0B0C10] font-bold px-5 py-3 rounded-xl text-sm disabled:opacity-40 hover:bg-[#00D9FF]/90 transition-all"
                >
                  SEND
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <h2 className="text-3xl font-bold text-[#00D9FF] mb-2 tracking-widest">ZHR™</h2>
              <p className="text-[#CFD8E3]/50 text-sm mb-8">Intelligence Command — Your AI Business Team</p>
              <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                {[
                  { label: 'Active Agents', value: '7' },
                  { label: 'Model', value: 'GPT-OSS 120B' },
                  { label: 'Brand', value: 'Zenith Intelligence' },
                  { label: 'Status', value: 'All Systems Go' },
                ].map(stat => (
                  <div key={stat.label} className="border border-[#00D9FF]/20 rounded-xl p-4">
                    <p className="text-xs text-[#CFD8E3]/40 mb-1">{stat.label}</p>
                    <p className="text-sm font-semibold text-[#00D9FF]">{stat.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#CFD8E3]/30 mt-8">Select an agent from the sidebar to begin</p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
