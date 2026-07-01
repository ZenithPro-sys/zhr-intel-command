import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    if (!prompt) return NextResponse.json({ error: 'Prompt required' }, { status: 400 })

    const falKey = process.env.FAL_API_KEY
    if (!falKey) return NextResponse.json({ error: 'FAL_API_KEY not configured' }, { status: 500 })

    // Use fal.ai for image generation (fast + affordable)
    const res = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Professional branded LinkedIn/Instagram graphic. Obsidian black background. Zenith Intelligence brand. Neon blue accents. ${prompt}`,
        image_size: 'square_hd',
        num_images: 1,
        num_inference_steps: 4,
      })
    })

    const data = await res.json()
    const imageUrl = data.images?.[0]?.url

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image generation failed', detail: data }, { status: 500 })
    }

    return NextResponse.json({ imageUrl })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
