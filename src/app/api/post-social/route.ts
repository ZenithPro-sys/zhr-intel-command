import { NextRequest, NextResponse } from 'next/server'

const PERSON_URN = 'urn:li:person:Xzv5J_zXSy'

async function postToLinkedIn(caption: string, imageUrl?: string) {
  const token = process.env.LINKEDIN_ACCESS_TOKEN
  if (!token) throw new Error('LINKEDIN_ACCESS_TOKEN not configured')

  const body = {
    author: PERSON_URN,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text: caption },
        shareMediaCategory: imageUrl ? 'ARTICLE' : 'NONE',
        ...(imageUrl && {
          media: [{
            status: 'READY',
            description: { text: 'Zenith Intelligence' },
            originalUrl: imageUrl,
            title: { text: 'Zenith Intelligence' },
          }]
        })
      }
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
    }
  }

  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body)
  })

  const data = await res.json()
  if (!data.id) throw new Error(JSON.stringify(data))
  return { platform: 'linkedin', id: data.id, status: 'posted' }
}

async function postToInstagram(caption: string, imageUrl: string) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  if (!token) throw new Error('INSTAGRAM_ACCESS_TOKEN not configured')

  // Step 1: Create media container
  const igRes = await fetch(`https://graph.instagram.com/v19.0/me?fields=id&access_token=${token}`)
  const igData = await igRes.json()
  const igUserId = igData.id
  if (!igUserId) throw new Error('Instagram user ID not found')

  const containerRes = await fetch(
    `https://graph.instagram.com/v19.0/${igUserId}/media`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        caption,
        access_token: token,
      })
    }
  )
  const containerData = await containerRes.json()
  if (!containerData.id) throw new Error(JSON.stringify(containerData))

  // Step 2: Publish the container
  const publishRes = await fetch(
    `https://graph.instagram.com/v19.0/${igUserId}/media_publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerData.id,
        access_token: token,
      })
    }
  )
  const publishData = await publishRes.json()
  if (!publishData.id) throw new Error(JSON.stringify(publishData))

  return { platform: 'instagram', id: publishData.id, status: 'posted' }
}

export async function POST(req: NextRequest) {
  try {
    const { caption, imageUrl, platforms } = await req.json()

    if (!caption) return NextResponse.json({ error: 'Caption required' }, { status: 400 })

    const targets: string[] = platforms || ['linkedin']
    const results = []

    for (const platform of targets) {
      try {
        if (platform === 'linkedin') {
          results.push(await postToLinkedIn(caption, imageUrl))
        } else if (platform === 'instagram') {
          if (!imageUrl) throw new Error('Instagram requires an imageUrl')
          results.push(await postToInstagram(caption, imageUrl))
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Unknown error'
        results.push({ platform, status: 'failed', error: msg })
      }
    }

    return NextResponse.json({ results })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
