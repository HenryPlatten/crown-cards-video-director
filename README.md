# Crown Cards — Video Director

Standalone Vercel app for generating Crown Cards hype reel clips via Veo 3.1 Fast.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MeowMeowMax/crown-cards-video-director)

## Usage

1. Get a Google AI Studio API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Paste the key into the app
3. Generate individual variations or all 5 at once
4. Download clips as MP4

## Stack

- Next.js 14 App Router
- TypeScript
- Veo 3.1 Fast (`veo-3.1-fast-generate-001`) via Google Generative Language API

## Notes

- Veo 3.1 requires a paid Gemini API plan
- Each clip is ~3s, 9:16 vertical, with native audio
- 6 scenes × 5 variations = 30 clips total
- API key is client-side only — never sent to any server
