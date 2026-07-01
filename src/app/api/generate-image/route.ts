import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    if (!prompt) return NextResponse.json({ error: 'Prompt required' }, { status: 400 })

    // Pollinations.ai — 100% free, no API key, no signup required
    const fullPrompt = encodeURIComponent(
      `Professional branded LinkedIn Instagram graphic. Obsidian black background. Neon blue glowing accents. Silver chrome typography. Zenith Intelligence premium brand. ${prompt}`
    )

    const imageUrl = `https://image.pollinations.ai/prompt/${fullPrompt}?width=1024&height=1024&nologo=true&seed=${Date.now()}`

    // Verify the image is reachable
    const check = await fetch(imageUrl, { method: 'HEAD' })
    if (!check.ok) {
      return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
    }

    return NextResponse.json({ imageUrl })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
