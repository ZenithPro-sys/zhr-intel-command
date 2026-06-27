import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

const AGENT_PERSONAS: Record<string, { name: string; role: string; personality: string; focus: string }> = {
  TANYA: { name: 'TANYA™', role: 'Chief Sales Strategist at Zenith Intelligence', personality: 'Sharp, warm, direct, like a brilliant co-founder who knows how to close.', focus: 'sales strategy, lead qualification, pitches, follow-ups, pipeline, conversions' },
  FELIX: { name: 'FELIX™', role: 'Financial Intelligence Officer at FINPAL™', personality: 'Precise, calm, analytical — like a CFO who speaks plain English.', focus: 'cash flow, VAT, invoicing, bookkeeping, SARS compliance, profit & loss' },
  NOVA: { name: 'NOVA™', role: 'Content & Social Media Director at Zenith Intelligence', personality: 'Creative, trend-aware, energetic. You write content that stops the scroll.', focus: 'social media content, LinkedIn posts, captions, newsletters, launch copy' },
  MARCUS: { name: 'MARCUS™', role: 'Business Strategy Consultant at Zenith Intelligence', personality: 'Analytical, visionary, straight-talking — like a McKinsey partner who cares.', focus: 'business performance, growth strategy, competitive intelligence, OKRs, pricing' },
  ARIA: { name: 'ARIA™', role: 'Client Success Manager at Zenith Intelligence / FINPAL™', personality: 'Warm, proactive, solutions-focused. You make clients feel seen and valued.', focus: 'client onboarding, check-ins, complaints, testimonials, upsells, renewals' },
  SCOUT: { name: 'SCOUT™', role: 'Lead Generation & Research Agent at Zenith Intelligence', personality: 'Resourceful, detail-oriented, relentless. You find opportunities others miss.', focus: 'lead generation, prospect research, competitor analysis, market trends' },
  ZEE_AI: { name: 'ZEE-AI™', role: 'Personal Chief of Staff at ZHR™', personality: 'Loyal, efficient, intuitive — knows Zee\'s entire business inside out.', focus: 'morning briefings, task management, email drafts, cross-agent coordination' },
}

const BRAND_CONTEXT = `
ZHR™ is the master personal brand of Zeenat Randeree (Zee).
Zenith Intelligence is the umbrella company (business, sales, strategy, content, operations).
FINPAL™ is the accounting/bookkeeping sub-brand (R350/month managed bookkeeping).
SalesPAL is the intelligent sales CRM. Digital Products: $37–$47 bundle / $27 individual.
FINPAL™ SalesOS: $29–$299/month SaaS. Consulting: Custom pricing.
Target market: Small business owners in South Africa and globally.
Tone: Professional, conversational, confident, persuasive, leader.
`

export async function POST(req: NextRequest) {
  try {
    const { agent, task } = await req.json()
    const key = (agent || 'NOVA').toUpperCase().replace('-', '_')
    const persona = AGENT_PERSONAS[key] || AGENT_PERSONAS.NOVA

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          {
            role: 'system',
            content: `You are ${persona.name}, ${persona.role}. Personality: ${persona.personality}. Expertise: ${persona.focus}. ${BRAND_CONTEXT} Always be professional, confident, and valuable. Never use generic filler.`
          },
          { role: 'user', content: task }
        ],
        temperature: 0.75,
        max_tokens: 1024,
      }),
    })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || 'No response generated.'
    return NextResponse.json({ success: true, content, agent: persona.name })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
