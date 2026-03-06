export default async function handler(req, res) {
  // ── CORS ─────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  // ── Debug: check token exists ─────────────────────
  const apiKey = process.env.REPLICATE_API_TOKEN;

  // This will tell you exactly what's wrong
  if (!apiKey) {
    return res.status(500).json({
      error: 'REPLICATE_API_TOKEN is missing from Vercel Environment Variables.',
      fix: 'Go to Vercel → Project → Settings → Environment Variables → add REPLICATE_API_TOKEN'
    });
  }

  if (!apiKey.startsWith('r8_')) {
    return res.status(500).json({
      error: 'REPLICATE_API_TOKEN looks wrong — it should start with r8_',
      hint: 'Double check the token value in Vercel Environment Variables'
    });
  }

  // ── Parse body ────────────────────────────────────
  const { prompt, style, seed } = req.body || {};

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt in request body' });
  }

  const fullPrompt = `${prompt}, ${style || 'pencil sketch, white background, detailed linework'}, high quality`;

  try {
    // ── Call Replicate ────────────────────────────
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

    // ── Handle Replicate errors ───────────────────
    if (!startRes.ok) {
      return res.status(startRes.status).json({
        error: startData.detail || startData.error || `Replicate returned error ${startRes.status}`,
        replicateStatus: startRes.status,
        hint:
          startRes.status === 401 ? 'Token is invalid — check it at replicate.com/account/api-tokens' :
          startRes.status === 402 ? 'Free credits ran out — add billing at replicate.com' :
          startRes.status === 429 ? 'Rate limited — wait a moment and try again' :
          'Check replicate.com for account issues'
      });
    }

    // ── Synchronous result ────────────────────────
    if (startData.output && startData.output.length > 0) {
      return res.status(200).json({ imageUrl: startData.output[0] });
    }

    // ── Poll ──────────────────────────────────────
    const predId = startData.id;
    if (!predId) {
      return res.status(500).json({ error: 'No prediction ID returned from Replicate', raw: startData });
    }

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
        return res.status(500).json({
          error: pollData.error || 'Replicate prediction failed',
          predictionId: predId
        });
      }
    }

    return res.status(504).json({ error: 'Timed out after 60 seconds waiting for image' });

  } catch (err) {
    return res.status(500).json({
      error: err.message,
      type: err.constructor.name,
      hint: 'This is a server-side error — check Vercel function logs for details'
    });
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
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
            
