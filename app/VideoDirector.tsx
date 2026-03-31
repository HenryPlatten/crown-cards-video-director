'use client'

import { useState, useCallback } from 'react'
import styles from './VideoDirector.module.css'

const MODEL = 'veo-3.1-fast-generate-001'
const BASE = 'https://generativelanguage.googleapis.com/v1beta'

interface Scene {
  id: number
  duration: number
  label: string
  videoPrompt: string
  audioNote: string
  onScreenText: string | null
}

interface Variation {
  id: number
  name: string
  hook: string
  game: string
  musicNote: string
  scenes: Scene[]
}

const VARS: Variation[] = [
  {
    id: 1, name: 'Sigma Grind', hook: 'The quiet ones eat first.', game: 'Fortnite',
    musicNote: 'Lo-fi slow build → hard trap drop on card reveal',
    scenes: [
      { id: 1, duration: 3, label: 'Late night setup', onScreenText: null,
        videoPrompt: 'Extreme close-up of fingers on a mechanical keyboard, blue LED backlighting, empty energy drink beside the desk. Pull back slowly to reveal a lone gamer bathed in cold monitor glow in a dark room. Cinematic 9:16 vertical frame, shallow depth of field, moody film grain. No text. High-end gaming aesthetic.',
        audioNote: 'Mechanical key clicks, faint fan hum, distant city ambience' },
      { id: 2, duration: 3, label: 'Intense gameplay', onScreenText: null,
        videoPrompt: 'Over-the-shoulder POV of Fortnite build fight, fingers flying on controller, face reflected in monitor showing intense focus. Fast cuts synced to in-game action. Warm amber light from screen contrasts cold room. Close on eyes — pupils tracking fast, locked in. Vertical 9:16, cinematic slow-motion bursts.',
        audioNote: 'Game sounds muffled, heartbeat rising, controller click bursts' },
      { id: 3, duration: 3, label: 'Victory screen', onScreenText: null,
        videoPrompt: 'Victory Royale screen floods the room with gold light. Gamer leans back slowly, arms drop — pure silent satisfaction. Stats cascade on screen: eliminations, accuracy, placement. Camera drifts from screen to face, catching the faint smile. 9:16 vertical, warm golden bloom, film grain texture.',
        audioNote: 'Victory jingle echo, crowd roar fading in, deep bass thud' },
      { id: 4, duration: 3, label: 'Card materialises', onScreenText: null,
        videoPrompt: 'Black void. Golden particle streams spiral inward forming a holographic trading card. The card rotates slowly, foil surface catching prismatic light, gamer face on the front, stats printed clean. Full-screen 9:16, particles scatter on reveal, card glows with inner light. Premium cinematic quality, no UI elements.',
        audioNote: 'Crystalline shimmer sound, deep reverb impact on full reveal' },
      { id: 5, duration: 3, label: 'Value climbs', onScreenText: null,
        videoPrompt: 'Card value ticker in the corner of frame climbs rapidly. The gamer watches it rise, eyes widening. Quick cut montage: another elimination, another win, card value jumps. Each win sends a pulse through the card making it glow brighter. Vertical 9:16, kinetic energy, golden light pulses.',
        audioNote: 'Casino chip stack sound, ascending synth notes, crowd building' },
      { id: 6, duration: 3, label: 'Crown logo', onScreenText: 'crowncardsfn.com',
        videoPrompt: 'Pure black screen. Crown Cards logo drops from above with physical weight, landing with a subtle shockwave ripple. Gold crown gleams with holographic surface. URL fades in below in clean white type. Single lingering shimmer. Vertical 9:16, minimal, premium, final.',
        audioNote: 'Single deep impact thud, silence, faint shimmer ring out' },
    ]
  },
  {
    id: 2, name: 'DBZ Power Level', hook: "It's over 9000 — and it's on a card.", game: 'Rocket League',
    musicNote: 'Epic orchestral build → Japanese anime OST energy on reveal',
    scenes: [
      { id: 1, duration: 3, label: 'Scouter scan begins', onScreenText: null,
        videoPrompt: 'Gamer at desk, glowing scanner device overlay on screen reading stats. Numbers begin climbing rapidly. Scanner beeps accelerating. Face lit by green scanner glow, expression shifting from calm to alarmed. Anime-inspired colour grading, vertical 9:16, high contrast.',
        audioNote: 'Electronic scanning beeps accelerating, power charging sound' },
      { id: 2, duration: 3, label: 'Numbers explode', onScreenText: null,
        videoPrompt: 'Extreme close-up of stat counter spinning past its limit. Screen cracks with energy. Gamer grabs desk as shockwave hits the room. Monitor flickers and blazes with white light. Papers scatter. Pure anime power-up energy translated to realistic gaming setup. 9:16 vertical, dramatic backlighting.',
        audioNote: 'Power level alarm, explosive burst, electronic screech' },
      { id: 3, duration: 3, label: 'Energy converges', onScreenText: null,
        videoPrompt: 'Blinding white energy streams converge from every direction toward a single point in front of the gamer. Slow motion particles orbit the focal point. Gamer squints against the light, hand raised. Cinematic vertical 9:16, lens flares, dust motes, anticipation maxed.',
        audioNote: 'Rising harmonic tone, wind howling, absolute silence building' },
      { id: 4, duration: 3, label: 'Card detonation reveal', onScreenText: null,
        videoPrompt: 'Explosion of golden energy clears instantly to reveal a pristine holographic trading card hanging in air. Card rotates majestically, stats glowing, face portrait perfect. Room settles around it — papers drifting down. Cinematic pause. 9:16 vertical, golden hour light quality, premium card texture.',
        audioNote: 'Explosion silence then single pure tone, crowd gasp' },
      { id: 5, duration: 3, label: 'Card powers up', onScreenText: null,
        videoPrompt: 'The trading card pulses with increasing power as Rocket League match clips flash behind it — aerial goals, save highlights, boost chains. Each goal makes the card glow brighter, stats ticking up in real time. Aura expands around the card. 9:16, kinetic sports energy.',
        audioNote: 'Crowd roar building, stat counter beeps, power surge' },
      { id: 6, duration: 3, label: 'Crown logo', onScreenText: 'crowncardsfn.com',
        videoPrompt: 'Pure black screen. Crown Cards logo drops from above with physical weight, landing with a subtle shockwave ripple. Gold crown gleams with holographic surface. URL fades in below in clean white type. Single lingering shimmer. Vertical 9:16, minimal, premium, final.',
        audioNote: 'Single deep impact thud, silence, faint shimmer ring out' },
    ]
  },
  {
    id: 3, name: 'Holo Pull', hook: 'The card everyone wants is yours.', game: 'EA FC',
    musicNote: 'Crinkle sounds → silence → euphoric drop on holo reveal',
    scenes: [
      { id: 1, duration: 3, label: 'Pack on the table', onScreenText: null,
        videoPrompt: 'Hands slide a sealed Crown Cards pack across a dark desk. Pack surface shimmers slightly. Close-up on foil wrapper, fingers hover. Anticipation. Match footage plays on monitor in background. Shallow focus, cinematic 9:16, tactile product photography quality, dark studio lighting.',
        audioNote: 'Pack sliding sound, subtle background crowd noise, heartbeat' },
      { id: 2, duration: 3, label: 'Tear in slow motion', onScreenText: null,
        videoPrompt: 'Extreme slow-motion close-up of pack wrapper being torn open. Foil catches light as it tears. Each millisecond stretched. Fingers peel back the seal. Golden light escapes from inside the pack. Cinematic 9:16, macro photography depth of field, film grain, golden hour colour.',
        audioNote: 'Slow-motion pack rip amplified, each crinkle resonant' },
      { id: 3, duration: 3, label: 'Glow from inside', onScreenText: null,
        videoPrompt: 'Interior of pack glowing with intense holographic light. Fingers reach in slowly. The light intensifies as the card slides free. First glimpse of foil surface catching prismatic rainbow light. Pure anticipation. 9:16 vertical, lens flare from card surface, fingers trembling slightly.',
        audioNote: 'Rising shimmer tone, breath held, crystalline ring' },
      { id: 4, duration: 3, label: 'Full holo card reveal', onScreenText: null,
        videoPrompt: 'The holographic Crown Card held up to camera, full frame. Rainbow light cascades across the surface. Gamer face portrait glowing. Stats embossed in gold. Card tilts slowly catching every colour. This is the money shot. Cinematic 9:16, studio lighting quality, prismatic flare effects, premium texture.',
        audioNote: 'Full holo shimmer cascade, crowd eruption, bass drop' },
      { id: 5, duration: 3, label: 'Reaction', onScreenText: null,
        videoPrompt: 'Gamer face reacts — eyes wide, jaw drops, pulls card back to look closer. Holds it up again. Disbelief and joy. Quick cuts of the card from different angles. Friends leaning in over shoulder. Authentic emotion, not performed. Warm lighting, 9:16, handheld energy.',
        audioNote: 'Genuine exclamations muted, ambient celebration, music swell' },
      { id: 6, duration: 3, label: 'Crown logo', onScreenText: 'crowncardsfn.com',
        videoPrompt: 'Pure black screen. Crown Cards logo drops from above with physical weight, landing with a subtle shockwave ripple. Gold crown gleams with holographic surface. URL fades in below in clean white type. Single lingering shimmer. Vertical 9:16, minimal, premium, final.',
        audioNote: 'Single deep impact thud, silence, faint shimmer ring out' },
    ]
  },
  {
    id: 4, name: 'Stonks Arc', hook: 'Your K/D ratio is now an asset class.', game: 'Fortnite',
    musicNote: 'Lofi chill → market alert sounds → euphoric when line goes up',
    scenes: [
      { id: 1, duration: 3, label: 'Trading floor gamer', onScreenText: null,
        videoPrompt: 'Gaming setup styled like a trading desk — multiple monitors showing both Fortnite gameplay and a card value ticker. Gamer watching both screens with intensity. Green lines rising. Post-ironic deadpan expression. Neon green accent lighting, dark room, vertical 9:16. Absurdist realism.',
        audioNote: 'Stock market alert tones mixed with game audio, keyboard typing' },
      { id: 2, duration: 3, label: 'Win logged', onScreenText: null,
        videoPrompt: 'Victory screen on one monitor, card value ticker jumping sharply on another. Gamer points at the ticker with one finger, still expressionless. The line goes up. Close-up on ticker — number climbing. Cut to face — single slow nod. 9:16 vertical, deadpan comedy energy, green screen tones.',
        audioNote: 'Cash register sound, crowd cheer, alert ding' },
      { id: 3, duration: 3, label: 'Card materialises', onScreenText: null,
        videoPrompt: 'Black void. Golden particle streams spiral inward forming a holographic trading card. The card rotates slowly, foil surface catching prismatic light, gamer face on the front, stats printed clean. Full-screen 9:16, particles scatter on reveal, card glows with inner light. Premium cinematic quality.',
        audioNote: 'Market bell, crystalline shimmer, deep bass reveal' },
      { id: 4, duration: 3, label: 'Line only goes up', onScreenText: null,
        videoPrompt: 'Split screen: left side shows rapid Fortnite win montage — eliminations, placements, accuracy. Right side shows the card value chart responding in real time, line spiking with every win. Both sides perfectly synced. Green and gold colour palette. 9:16, kinetic rhythm cuts.',
        audioNote: 'Ascending synth stabs with each win, crowd building, coins' },
      { id: 5, duration: 3, label: 'Sent to the group', onScreenText: null,
        videoPrompt: 'Phone screen close-up showing WhatsApp group. Card image pinged into chat. Three typing indicators appear simultaneously. Then: a cascade of skull emojis, crying emojis, fire. One friend replies with a screenshot of their own card — clearly lower value. Soft phone glow, dark room, authentic messaging UI feel.',
        audioNote: 'WhatsApp notification sounds, rapid typing, notification cascade' },
      { id: 6, duration: 3, label: 'Crown logo', onScreenText: 'crowncardsfn.com',
        videoPrompt: 'Pure black screen. Crown Cards logo drops from above with physical weight, landing with a subtle shockwave ripple. Gold crown gleams with holographic surface. URL fades in below in clean white type. Single lingering shimmer. Vertical 9:16, minimal, premium, final.',
        audioNote: 'Single deep impact thud, silence, faint shimmer ring out' },
    ]
  },
  {
    id: 5, name: 'Squad Flex', hook: 'Send it to the group. Watch them suffer.', game: 'Rocket League',
    musicNote: 'Notification sounds → UK drill drop on card share',
    scenes: [
      { id: 1, duration: 3, label: 'Squad on voice', onScreenText: null,
        videoPrompt: 'Four gamers on voice chat playing together — split perspective showing each at their own setup. Headsets on, screens glowing, coordinated plays. Energy is collaborative and competitive simultaneously. Multiple vertical frames composited, neon lighting, gaming aesthetic.',
        audioNote: 'Voice chat callouts, game sounds layered, coordinated energy' },
      { id: 2, duration: 3, label: 'One player pops off', onScreenText: null,
        videoPrompt: 'One gamer breaks from the pack — extraordinary play on screen, jumps up, turns to camera with pure disbelief. Teammates visible reacting on other screens. This person just cooked. Authentic hype energy, handheld camera feel, warm lighting contrast to cold setups, 9:16.',
        audioNote: 'Explosive crowd noise, teammates shouting muffled, music cut' },
      { id: 3, duration: 3, label: 'Card materialises', onScreenText: null,
        videoPrompt: 'Black void. Golden particle streams spiral inward forming a holographic trading card. The card rotates slowly, foil surface catching prismatic light, gamer face on the front, stats printed clean. Full-screen 9:16, particles scatter on reveal, card glows with inner light. Premium cinematic quality.',
        audioNote: 'Crystalline shimmer sound, deep reverb impact on full reveal' },
      { id: 4, duration: 3, label: 'Screenshot then send', onScreenText: null,
        videoPrompt: 'Close-up of phone screen. Crown Cards profile showing the holographic card. Finger taps share. WhatsApp opens. Group chat selected. Message sent. Delivered ticks appear. All in one fluid motion, dark room, phone screen the only light source. 9:16, intimate and immediate.',
        audioNote: 'Screenshot sound, keyboard tap, WhatsApp send whoosh' },
      { id: 5, duration: 3, label: 'Group erupts', onScreenText: null,
        videoPrompt: 'Rapid fire cuts of three different friends seeing the card notification on their own phones. Each reacts differently: one goes silent, one types furiously, one physically leans back. Their screens show the cascade of emoji reactions — skulls, fires, eyes. Real rooms, real setups, authentic scale of reaction. 9:16.',
        audioNote: 'Notification pings, rapid typing, ambient chaos, laughter' },
      { id: 6, duration: 3, label: 'Crown logo', onScreenText: 'crowncardsfn.com',
        videoPrompt: 'Pure black screen. Crown Cards logo drops from above with physical weight, landing with a subtle shockwave ripple. Gold crown gleams with holographic surface. URL fades in below in clean white type. Single lingering shimmer. Vertical 9:16, minimal, premium, final.',
        audioNote: 'Single deep impact thud, silence, faint shimmer ring out' },
    ]
  },
]

type SceneStatus = 'idle' | 'generating' | 'done' | 'error'

export default function VideoDirector() {
  const [apiKey, setApiKey] = useState('')
  const [genAudio, setGenAudio] = useState(true)
  const [setupDone, setSetupDone] = useState(false)
  const [activeV, setActiveV] = useState(0)
  const [status, setStatus] = useState<Record<string, SceneStatus>>({})
  const [clips, setClips] = useState<Record<string, string>>({})
  const [log, setLog] = useState<Array<{ t: string; msg: string }>>([])
  const [err, setErr] = useState('')
  const [previewS, setPreviewS] = useState(0)
  const [generating, setGenerating] = useState(false)

  const sk = (vId: number, sId: number) => `${vId}-${sId}`
  const getSt = (vId: number, sId: number): SceneStatus => (status[sk(vId, sId)] || 'idle') as SceneStatus
  const getClip = (vId: number, sId: number) => clips[sk(vId, sId)]
  const doneV = (vId: number) => VARS.find(v => v.id === vId)!.scenes.filter(s => getSt(vId, s.id) === 'done').length
  const totalDone = VARS.reduce((a, v) => a + doneV(v.id), 0)
  const totalAll = VARS.length * 6
  const pct = Math.round((totalDone / totalAll) * 100)

  const addLog = (msg: string) => setLog(p => [...p.slice(-24), { t: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }), msg }])

  const pollOp = async (opName: string, vId: number, sId: number): Promise<string> => {
    for (let i = 0; i < 72; i++) {
      await new Promise(r => setTimeout(r, 5000))
      const res = await fetch(`${BASE}/${opName}?key=${apiKey}`)
      if (!res.ok) throw new Error(`Poll failed ${res.status}`)
      const d = await res.json()
      if (d.done) {
        const samples = d.response?.generateVideoResponse?.generatedSamples
        if (!samples?.length) throw new Error('No samples in response')
        const vid = samples[0].video
        if (vid?.uri) return vid.uri
        if (vid?.bytesBase64Encoded) return `data:video/mp4;base64,${vid.bytesBase64Encoded}`
        throw new Error('No video URI in response')
      }
      if (i % 4 === 0) addLog(`V${vId}S${sId} rendering... ${(i + 1) * 5}s elapsed`)
    }
    throw new Error('Timed out after 6 minutes')
  }

  const genScene = useCallback(async (vId: number, sId: number, prompt: string, audioNote: string) => {
    const key = sk(vId, sId)
    setStatus(p => ({ ...p, [key]: 'generating' }))
    addLog(`Starting V${vId} S${sId}...`)
    try {
      const fp = genAudio && audioNote ? `${prompt}\n\nAudio direction: ${audioNote}` : prompt
      const body: Record<string, unknown> = {
        instances: [{ prompt: fp }],
        parameters: { aspectRatio: '9:16', sampleCount: 1, durationSeconds: 3, personGeneration: 'allow_all' }
      }
      if (genAudio) (body.parameters as Record<string, unknown>).generateAudio = true

      const res = await fetch(`${BASE}/models/${MODEL}:predictLongRunning?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const e = await res.json()
        throw new Error(e.error?.message || `HTTP ${res.status}`)
      }
      const op = await res.json()
      if (!op.name) throw new Error('No operation returned from API')
      addLog(`V${vId}S${sId} queued — polling...`)
      const url = await pollOp(op.name, vId, sId)
      setClips(p => ({ ...p, [key]: url }))
      setStatus(p => ({ ...p, [key]: 'done' }))
      addLog(`V${vId}S${sId} complete`)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      setStatus(p => ({ ...p, [key]: 'error' }))
      setErr(`V${vId}S${sId}: ${msg}`)
      addLog(`ERROR V${vId}S${sId}: ${msg}`)
    }
  }, [apiKey, genAudio])

  const genVariation = async (vi: number) => {
    setGenerating(true); setErr('')
    const v = VARS[vi]
    for (const s of v.scenes) await genScene(v.id, s.id, s.videoPrompt, s.audioNote)
    addLog(`"${v.name}" done`)
    setGenerating(false)
  }

  const genAll = async () => {
    setGenerating(true); setErr('')
    for (const v of VARS) {
      for (const s of v.scenes) await genScene(v.id, s.id, s.videoPrompt, s.audioNote)
      addLog(`"${v.name}" complete`)
    }
    addLog('All 5 variations done')
    setGenerating(false)
  }

  const v = VARS[activeV]

  if (!setupDone) return (
    <div className={styles.page}>
      <div className={styles.hdr}>
        <div className={styles.crown} />
        <span className={styles.htitle}>Crown Cards — Video Director</span>
        <span className={`${styles.badge} ${styles.bpurple}`} style={{ marginLeft: 'auto' }}>VEO 3.1 FAST</span>
      </div>
      <div className={`${styles.card} ${styles.cardGold}`}>
        <div className={styles.lbl}>API key</div>
        <div style={{ display: 'flex', gap: 7, marginBottom: 14, flexWrap: 'wrap' }}>
          <span className={`${styles.badge} ${styles.bpurple}`}>veo-3.1-fast-generate-001</span>
          <span className={`${styles.badge} ${styles.bteal}`}>GA endpoint</span>
          <span className={`${styles.badge} ${styles.bgold}`}>native audio</span>
        </div>
        <input type="password" placeholder="AIza... (Google AI Studio key)" value={apiKey} onChange={e => setApiKey(e.target.value)} style={{ marginBottom: 8 }} />
        <div className={styles.note}>Get your key at <strong>aistudio.google.com/apikey</strong> → Create API key. Paid Gemini API plan required for Veo 3.1.</div>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="checkbox" id="aud" checked={genAudio} onChange={e => setGenAudio(e.target.checked)} />
          <label htmlFor="aud" style={{ fontSize: 13, cursor: 'pointer' }}>Generate native audio per clip</label>
          <span className={`${styles.badge} ${styles.bteal}`}>recommended</span>
        </div>
        <div className={styles.note} style={{ marginTop: 6 }}>Veo 3.1 generates synchronised ambient sound natively — controller clicks, crowd noise, card shimmer. No post-production audio needed.</div>
      </div>
      <div className={styles.card}>
        <div className={styles.lbl}>5 variations pre-loaded</div>
        <div className={styles.varGrid}>
          {VARS.map((vr, i) => (
            <div key={i} className={styles.varPreview}>
              <span className={styles.varNum}>V{i + 1}</span>
              <span style={{ fontWeight: 500 }}>{vr.name}</span>
              <span style={{ color: 'var(--mut)', fontSize: 12 }}>{vr.hook}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className={`${styles.btn} ${styles.btnP}`} onClick={() => setSetupDone(true)} disabled={!apiKey}>
          Start generating →
        </button>
      </div>
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.hdr}>
        <div className={styles.crown} />
        <span className={styles.htitle}>Crown Cards — Video Director</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          <span className={`${styles.badge} ${styles.bpurple}`}>VEO 3.1 FAST</span>
          <button className={`${styles.btn} ${styles.btnSm}`} onClick={() => setSetupDone(false)}>Change key</button>
        </div>
      </div>

      {generating && (
        <div className={`${styles.card} ${styles.cardGold}`} style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500 }}>
              <span className={styles.spin} />
              Rendering {totalDone}/{totalAll} clips...
            </div>
            <span className={`${styles.badge} ${styles.bgold}`}>{pct}%</span>
          </div>
          <div className={styles.pbar}><div className={styles.pfill} style={{ width: `${pct}%` }} /></div>
          <div className={styles.note}>Each clip ~60–90s via Veo 3.1 Fast. Keep this tab open.</div>
        </div>
      )}

      <div className={styles.stats}>
        {[{ n: VARS.length, l: 'Variations' }, { n: 6, l: 'Scenes each' }, { n: '18s', l: 'Duration' }, { n: totalDone, l: 'Clips done' }].map((s, i) => (
          <div key={i} className={styles.scard}>
            <div className={styles.snum}>{s.n}</div>
            <div className={styles.slbl}>{s.l}</div>
          </div>
        ))}
      </div>

      <div className={styles.tabs}>
        {VARS.map((vr, i) => (
          <button key={i} className={`${styles.tab} ${activeV === i ? styles.tabOn : ''}`} onClick={() => { setActiveV(i); setPreviewS(0) }}>
            {vr.name}
            {doneV(vr.id) > 0 && <span className={`${styles.badge} ${styles.bteal}`} style={{ marginLeft: 6, fontSize: 9 }}>{doneV(vr.id)}/6</span>}
          </button>
        ))}
      </div>

      <div className={`${styles.card}`} style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>V{activeV + 1}: {v.name}</div>
            <div style={{ fontSize: 12, color: 'var(--mut)' }}>{v.hook}</div>
            <div style={{ fontSize: 11, color: 'var(--mut)', marginTop: 4 }}>
              <span style={{ color: 'rgba(201,168,76,0.7)', marginRight: 4 }}>♪</span>{v.musicNote}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <span className={`${styles.badge} ${styles.bmut}`}>{v.game}</span>
            <button className={`${styles.btn} ${styles.btnSm} ${styles.btnP}`} onClick={() => genVariation(activeV)} disabled={generating}>
              Generate V{activeV + 1}
            </button>
            {!generating && totalDone === 0 && (
              <button className={`${styles.btn} ${styles.btnSm} ${styles.btnP}`} onClick={genAll}>
                Generate all 5
              </button>
            )}
          </div>
        </div>
      </div>

      {totalDone > 0 && (
        <div className={styles.reviewGrid}>
          <div className={styles.vp}>
            {getClip(v.id, v.scenes[previewS]?.id)
              ? <video src={getClip(v.id, v.scenes[previewS].id)} controls key={getClip(v.id, v.scenes[previewS].id)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div className={styles.noclip}>No clip yet</div>
            }
          </div>
          <div>
            {v.scenes.map((s, i) => (
              <div key={i} className={`${styles.sceneNav} ${previewS === i ? styles.sceneNavOn : ''}`} onClick={() => setPreviewS(i)}>
                <span style={{ fontSize: 12, color: previewS === i ? 'var(--gold)' : 'var(--txt)' }}>S{s.id} · {s.label}</span>
                <span className={`${styles.badge} ${getSt(v.id, s.id) === 'done' ? styles.bteal : getSt(v.id, s.id) === 'error' ? styles.bhot : styles.bmut}`} style={{ fontSize: 9 }}>
                  {getSt(v.id, s.id)}
                </span>
              </div>
            ))}
            {getClip(v.id, v.scenes[previewS]?.id) && (
              <a href={getClip(v.id, v.scenes[previewS].id)} download={`crown-v${activeV + 1}-s${previewS + 1}.mp4`} className={styles.dlLink}>
                Download clip ↓
              </a>
            )}
          </div>
        </div>
      )}

      {v.scenes.map((s, i) => {
        const st = getSt(v.id, s.id)
        const clip = getClip(v.id, s.id)
        return (
          <div key={i} className={`${styles.sc} ${st === 'done' ? styles.scDone : st === 'error' ? styles.scError : st === 'generating' ? styles.scGen : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--gold)' }}>S{s.id}</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</span>
                <span className={`${styles.badge} ${styles.bmut}`} style={{ fontSize: 9 }}>{s.duration}s</span>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {st === 'idle' && <span className={`${styles.badge} ${styles.bmut}`}>idle</span>}
                {st === 'generating' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--gold)' }}><span className={styles.spin} />rendering</span>}
                {st === 'done' && <span className={`${styles.badge} ${styles.bteal}`}>done</span>}
                {st === 'error' && <span className={`${styles.badge} ${styles.bhot}`}>error</span>}
                {st !== 'generating' && (
                  <button className={`${styles.btn} ${styles.btnSm}`} onClick={() => genScene(v.id, s.id, s.videoPrompt, s.audioNote)} disabled={generating}>
                    {st === 'done' ? 're-gen' : 'gen'}
                  </button>
                )}
              </div>
            </div>
            <div className={styles.promptBox}>
              <span style={{ color: 'var(--gold)', marginRight: 4 }}>►</span>
              {s.videoPrompt.slice(0, 140)}{s.videoPrompt.length > 140 ? '…' : ''}
            </div>
            <div className={styles.audioBox}>
              <span style={{ color: 'rgba(46,189,155,0.7)', marginRight: 4 }}>♪</span>{s.audioNote}
            </div>
            {clip && (
              <div style={{ marginTop: 6, display: 'flex', gap: 12 }}>
                <a href={clip} target="_blank" rel="noreferrer" className={styles.dlLink}>View ↗</a>
                <a href={clip} download={`crown-v${v.id}-s${s.id}.mp4`} className={styles.dlLink} style={{ color: 'var(--mut)' }}>Download ↓</a>
              </div>
            )}
          </div>
        )
      })}

      {log.length > 0 && (
        <div className={styles.logbox}>
          {log.slice(-10).map((l, i) => (
            <div key={i} className={styles.ll}><span>{l.t}</span>{l.msg}</div>
          ))}
        </div>
      )}
      {err && <div className={styles.errbox}>{err}</div>}
    </div>
  )
}
