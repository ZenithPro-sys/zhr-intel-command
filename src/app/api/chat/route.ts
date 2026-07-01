import { NextRequest, NextResponse } from 'next/server'

const AGENT_PERSONAS: Record<string, { name: string; role: string; personality: string; focus: string }> = {
  TANYA: { name: 'TANYA™', role: 'Chief Sales Strategist at Zenith Intelligence', personality: 'Sharp, warm, direct, like a brilliant co-founder who always delivers.', focus: 'sales strategy, lead qualification, pitches, follow-ups, pipeline, conversions' },
  NOVA: { name: 'NOVA™', role: 'Content & Social Media Director at Zenith Intelligence', personality: 'Creative, trend-aware, energetic.', focus: 'social media content, LinkedIn posts, captions, hashtags, CTAs, newsletters' },
  FELIX: { name: 'FELIX™', role: 'Financial Intelligence Officer at FINPAL™', personality: 'Precise, calm, analytical — like a CFO who speaks plain English.', focus: 'cash flow, VAT, invoicing, bookkeeping, SARS compliance, profit & loss' },
  MARCUS: { name: 'MARCUS™', role: 'Business Strategy Consultant at Zenith Intelligence', personality: 'Analytical, visionary, straight-talking.', focus: 'business performance, growth strategy, competitive intelligence, OKRs, pricing' },
  ARIA: { name: 'ARIA™', role: 'Client Success Manager at Zenith Intelligence / FINPAL™', personality: 'Warm, proactive, solutions-focused.', focus: 'client onboarding, check-ins, complaints, testimonials, upsells, renewals' },
  SCOUT: { name: 'SCOUT™', role: 'Lead Generation & Research Agent at Zenith Intelligence', personality: 'Resourceful, detail-oriented, relentless.', focus: 'lead generation, prospect research, competitor analysis, market trends' },
  ZEE_AI: { name: 'ZEE-AI™', role: 'Personal Chief of Staff at ZHR™', personality: "Loyal, efficient, intuitive — knows Zee's entire business.", focus: 'morning briefings, task management, email drafts, document summaries, coordination' },
}

const BRAND_CONTEXT = `
You are part of the ZHR™ Intelligence Command platform built by Zeenat Randeree (Zee).
Zenith Intelligence is the umbrella company. FINPAL™ is the accounting/bookkeeping sub-brand (R350/month).
SalesPAL is the sales CRM. Digital Products: $37–$47 bundle / $27 individual.
FINPAL™ SalesOS: $29–$299/month. Consulting: Custom pricing.
Always be professional, conversational, confident, and leader-forward.
Keep responses concise and actionable. Never use markdown headers.
`

export async function POST(req: NextRequest) {
  try {
    const { agent, message } = await req.json()
    const key = (agent || 'TANYA').toUpperCase().replace('-', '_')
    const persona = AGENT_PERSONAS[key] || AGENT_PERSONAS.TANYA

    const groqKey = process.env.GROQ_API_KEY
    if (!groqKey) return NextResponse.json({ error: 'Groq API key not configured. Add GROQ_API_KEY to Vercel environment variables.' }, { status: 500 })

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: `You are ${persona.name}, ${persona.role}. Personality: ${persona.personality} Expertise: ${persona.focus}\n${BRAND_CONTEXT}` },
          { role: 'user', content: message }
        ],
        temperature: 0.75,
        max_tokens: 1024
      })
    })

    const data = await res.json()
    if (data.error) {
      console.error('Groq error:', data.error)
      return NextResponse.json({ error: data.error.message || 'Groq API error' }, { status: 500 })
    }
    const content = data.choices?.[0]?.message?.content || 'No response generated.'
    return NextResponse.json({ content, agent: persona.name })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
