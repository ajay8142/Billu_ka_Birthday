# Birthday Surprise Web App

A locked, passkey-protected birthday surprise page: lock screen → PIN entry →
loading animation → "special day" reveal → cut-the-cake screen → swipeable
photo memories → sealed letter → typewriter message → confetti celebration. A
background-music toggle sits in the top-left corner throughout, and every
button gives a soft click sound.

Pure HTML/CSS/JS. No build step, no dependencies, works offline.

## 1. Run it locally

Just open `index.html` in a browser, or serve the folder so paths resolve cleanly:

```
npx serve .
```

## 2. Customize

Everything you'll want to change lives at the top of **`script.js`**, inside the
`CONFIG` object:

| Key | What it does |
|---|---|
| `passkey` | The 4-digit code required to unlock the site |
| `passkeyHint` | Text shown in the "forgot passkey" popup |
| `personTitle` | Heading on the cut-the-cake screen (HTML allowed) |
| `profilePhoto` | Circular photo on the lock + keypad screens |
| `photos` | Array of image paths for the memories carousel |
| `letterBody` | The message, typed out with a typewriter effect |
| `footerCredit` | Small watermark text bottom-right of the lock screen (empty = hidden) |
| `music.src` | Path to a background-music file |
| `music.volume` | 0–1 volume for the background music |

## 3. Add your photos and music

Drop files into:

- `assets/profile.jpg` — the circular avatar
- `assets/photos/1.jpg`, `2.jpg`, `3.jpg`, … — the memories carousel
- `assets/music.mp3` — background music, started/stopped from the speaker
  button in the top-left corner

If a photo (or the music file) is missing, that slot gracefully falls back to
a placeholder instead of breaking the page — so you can preview the app
before adding real media. Browsers block audio with sound from autoplaying,
so the music only starts once the visitor taps the speaker button — that tap
is also what a browser counts as "the user asked for sound," so it can't be
started automatically on page load.

Every button (keypad keys, Next, Message, Celebrate, Restart, the envelope,
the music toggle itself) plays a short synthesized click sound — no audio
file needed for that part, it's generated in the browser via the Web Audio
API.

## 4. Deploy

This is a static site — drag the whole folder onto any static host:

- **Cloudflare Pages**: pages.cloudflare.com → "Upload assets"
- **Netlify**: app.netlify.com/drop
- **GitHub Pages**: push to a repo, enable Pages on the `main` branch

No server, database, or build step required.

## Note on the passkey

The lock screen is a fun presentation gate, not real security — the passkey
lives in plain JS on the client. Don't use it to protect anything sensitive.
