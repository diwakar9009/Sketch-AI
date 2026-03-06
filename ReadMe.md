# SketchAI ✏️

> **Turn a text prompt into a sketch-style AI animation — free, runs on your phone, no laptop needed.**

SketchAI is a mobile-friendly web app that generates sketch-style AI images from your prompt and plays them as a looping animation. It runs entirely in your browser and uses [Replicate](https://replicate.com) + [FLUX Schnell](https://replicate.com/black-forest-labs/flux-schnell) for real AI generation.

---

## ✨ Features

- **Real AI generation** — powered by FLUX Schnell via Replicate API
- **6 sketch styles** — Pencil, Charcoal, Ink, Watercolor, Anime, Blueprint
- **Animated preview** — frames play as a looping video in your browser
- **Mobile-first** — works on any phone browser, add to home screen for app feel
- **Download frames** — save all generated images to your device
- **100% free** — Replicate gives ~50 free images/month, Vercel hosting is free

---

## 📱 Live Demo

Deploy your own in 2 minutes → **[Deploy on Vercel](#-deploy-in-2-minutes)**

---

## 🗂 Project Structure

```
sketchai/
├── index.html        # Frontend — the full mobile UI
├── vercel.json       # Vercel config (sets 60s timeout for AI calls)
└── api/
    └── generate.js   # Serverless proxy — talks to Replicate (fixes CORS)
```

---

## ⚡ Deploy in 2 Minutes

### Step 1 — Get a free Replicate API key

1. Go to [replicate.com](https://replicate.com) and sign up (free, no credit card)
2. Go to **Account → API Tokens → Create Token**
3. Copy your token — it starts with `r8_...`

### Step 2 — Fork this repo

Click **Fork** at the top of this page to copy it to your GitHub account.

### Step 3 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub (free)
2. Click **Add New Project**
3. Select your forked repo
4. Leave all settings as default
5. Click **Deploy**
6. In ~60 seconds you'll have a live URL like `https://sketchai-yourname.vercel.app`

### Step 4 — Use it

1. Open your Vercel URL on your phone
2. Paste your Replicate API key
3. Type a prompt
4. Choose a sketch style
5. Tap **⚡ Generate Video**

---

## 🔧 How It Works

```
Your phone
    │
    │  POST /api/generate
    ▼
Vercel serverless function (api/generate.js)
    │
    │  POST https://api.replicate.com/v1/predictions
    ▼
FLUX Schnell model (Replicate GPU)
    │
    │  Image URL
    ▼
Back to your phone → displayed as animated frames
```

The serverless proxy is necessary because browsers block direct calls to the Replicate API (CORS restriction). Vercel's backend has no such restriction.

---

## 🎨 Sketch Styles

| Style | What it looks like |
|---|---|
| ✏️ Pencil | Graphite lines on white, hand-drawn feel |
| 🖤 Charcoal | Dark expressive strokes, rough texture |
| 🖋️ Ink | Fine cross-hatching, black ink on white paper |
| 🎨 Watercolor | Soft washes, loose expressive brushwork |
| ⚡ Anime | Clean lineart, cel-shaded, manga style |
| 📐 Blueprint | White lines on dark blue, architectural |

---

## 💡 Prompt Tips

- **Be specific** — "a lonely robot sitting by a campfire in a forest" works better than "a robot"
- **Mention the style** in your prompt too — e.g. *"pencil sketch style, white background, detailed linework"*
- **Add mood words** — dramatic, misty, warm, dark, vintage
- **3 frames** = fast and cheap. **8 frames** = smooth animation but uses more credits

**Example prompts to try:**
```
a lone astronaut sketching on an alien planet surface, pencil drawing, detailed
a cat sleeping in a sunlit window, watercolor style, soft edges
a futuristic city at night, ink illustration, fine cross-hatching
a dragon curled around a mountain, anime lineart, clean outlines
```

---

## 💰 Free Tier Limits

| Resource | Free Limit |
|---|---|
| Replicate images | ~50/month |
| Vercel deployments | Unlimited |
| Vercel serverless calls | 100,000/month |
| Bandwidth | 100GB/month |

With 3 frames per video, you get about **16 free videos per month**.  
With 5 frames per video, about **10 free videos per month**.

---

## 🛠 Local Development

If you want to run this locally:

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/sketchai.git
cd sketchai

# Install Vercel CLI
npm install -g vercel

# Run locally (emulates Vercel serverless functions)
vercel dev
```

Then open `http://localhost:3000` in your browser.

---

## 📲 Add to Home Screen (Mobile App Feel)

**iPhone / Safari:**
1. Open your Vercel URL in Safari
2. Tap the Share button (box with arrow)
3. Scroll down → **Add to Home Screen**
4. Tap **Add**

**Android / Chrome:**
1. Open your Vercel URL in Chrome
2. Tap the three-dot menu
3. Tap **Add to Home Screen**
4. Tap **Add**

The app will appear on your home screen and open fullscreen like a native app.

---

## 🚀 Possible Improvements

- [ ] GIF export (using gif.js)
- [ ] MP4 export (using ffmpeg.wasm)
- [ ] Prompt history / gallery
- [ ] Voice-to-prompt input
- [ ] Custom frame rate control
- [ ] YouTube Shorts / TikTok auto-export
- [ ] Share to social media directly
- [ ] Negative prompt support

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML + CSS + JS |
| Hosting | Vercel (free) |
| Serverless API | Vercel Functions (Node.js) |
| AI Model | FLUX Schnell via Replicate |
| Animation | HTML5 Canvas + requestAnimationFrame |

---

## ❓ Troubleshooting

**"Invalid API key"**
→ Make sure your key starts with `r8_` and was copied in full from replicate.com

**"Free credits ran out"**
→ Add billing at replicate.com — FLUX Schnell costs about $0.003 per image (~$0.015 per 5-frame video)

**Images generate but look wrong**
→ Add the style name to your prompt, e.g. *"pencil sketch style"* — this guides the model

**App loads but Generate button does nothing**
→ Make sure you're using the Vercel URL, not opening `index.html` directly from a file

**Vercel deploy fails**
→ Make sure your repo has the `api/` folder with `generate.js` inside it — this is the most common setup mistake

---

## 📄 License

MIT — free to use, modify, and deploy for personal or commercial projects.

---

## 🙏 Credits

- [FLUX Schnell](https://replicate.com/black-forest-labs/flux-schnell) by Black Forest Labs
- [Replicate](https://replicate.com) for the AI inference API
- [Vercel](https://vercel.com) for free hosting and serverless functions

---

*Built with ✏️ and a free API key.*
