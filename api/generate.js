export default async function handler(req, res) {
  // ── CORS headers ─────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  // ── API key from Vercel environment variable ──────
  // Set this in: Vercel Dashboard → Your Project → Settings → Environment Variables
  // Name: REPLICATE_API_TOKEN   Value: r8_your_token_here
  const apiKey = process.env.REPLICATE_API_TOKEN;
  if (!apiKey) {
    return res.status(500).json({
      error: 'REPLICATE_API_TOKEN is not set. Add it in Vercel → Settings → Environment Variables.'
    });
  }

  const { prompt, style, seed } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  const fullPrompt = `${prompt}, ${style || 'pencil sketch, white background, detailed linework'}, high quality`;

  try {
    // ── Start prediction ──────────────────────────
    const startRes = await fetch(
      'https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type':  'application/json',
          'Prefer':        'wait=60',
        },
        body: JSON.stringify({
          input: {
            prompt:              fullPrompt,
            num_inference_steps: 4,
            seed:                seed || Math.floor(Math.random() * 9999999),
            go_fast:             true,
            megapixels:          '0.25',
            aspect_ratio:        '1:1',
            output_format:       'jpg',
            output_quality:      80,
          },
        }),
      }
    );

    const startData = await startRes.json();

    if (!startRes.ok) {
      return res.status(startRes.status).json({
        error: startData.detail || startData.error || `Replicate error ${startRes.status}`,
      });
    }

    // Synchronous response — output already ready
    if (startData.output && startData.output.length > 0) {
      return res.status(200).json({ imageUrl: startData.output[0] });
    }

    // ── Poll for result ───────────────────────────
    const predId = startData.id;
    for (let i = 0; i < 30; i++) {
      await sleep(2000);
      const pollRes  = await fetch(`https://api.replicate.com/v1/predictions/${predId}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      const pollData = await pollRes.json();

      if (pollData.status === 'succeeded' && pollData.output?.[0]) {
        return res.status(200).json({ imageUrl: pollData.output[0] });
      }
      if (pollData.status === 'failed') {
        return res.status(500).json({ error: pollData.error || 'Prediction failed' });
      }
    }

    return res.status(504).json({ error: 'Timed out waiting for image' });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
            output_quality:       80,
          },
        }),
      }
    );

    const startData = await startRes.json();

    if (!startRes.ok) {
      return res.status(startRes.status).json({
        error: startData.detail || startData.error || `Replicate error ${startRes.status}`,
      });
    }

    // If synchronous response already has output
    if (startData.output && startData.output.length > 0) {
      return res.status(200).json({ imageUrl: startData.output[0] });
    }

    // ── Poll for result ───────────────────────
    const predId = startData.id;
    for (let i = 0; i < 30; i++) {
      await sleep(2000);
      const pollRes  = await fetch(`https://api.replicate.com/v1/predictions/${predId}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      const pollData = await pollRes.json();

      if (pollData.status === 'succeeded' && pollData.output?.[0]) {
        return res.status(200).json({ imageUrl: pollData.output[0] });
      }
      if (pollData.status === 'failed') {
        return res.status(500).json({ error: pollData.error || 'Prediction failed' });
      }
    }

    return res.status(504).json({ error: 'Timed out waiting for image' });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
            
