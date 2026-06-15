# G.H.O.S.T. Site — Structure & Pages

## Navigation Bar (fixed, top)
```
HOME  ·  DIVISIONS ▾  ·  LORE  ·  EVENTS  ·  STAFF  ·  GALLERY          [JOIN US]
```
- DIVISIONS dropdown lists all 7 divisions by name, each links to their page
- JOIN US button (top-right, styled CTA) → Discord invite link from `data/site.json`

---

## Pages (12 total)

### `index.html` — Home
| Section | Content |
|---------|---------|
| Boot Sequence | Terminal animation → transitions to solar system |
| Solar System Hero | Three.js, full viewport, division logos orbiting |
| About G.H.O.S.T. | Short blurb from `data/site.json` |
| Latest Events | 3 most recent cards from `data/events.json` |
| Stats + Socials | Faction stats + TikTok links, all from `data/site.json` |
| Footer | Logo, motto, nav links, Discord invite, copyright |

### `divisions/[slug].html` — 7 Division Pages
Each division gets its own dedicated page containing:
- Division logo, name, motto, description (from `data/divisions.json`)
- Division leadership: CO, XO, etc.
- TikTok link
- Division-specific media gallery (GitHub API reads `gallery/divisions/[slug]/`)

| Slug | Division |
|------|----------|
| `69th-mech` | 69th M3CH Company |
| `39th-hellblast` | 39th Hell-Blast Company |
| `taskforce-27` | Taskforce 27: Grey Owls |
| `hivebreakers` | HiveBreakers |
| `pale-riders` | Pale Riders |
| `gtr` | G.H.O.S.T. Trauma Response |
| `666th-rangers` | 666th Recoilless Rangers |

### `lore.html` — Lore
- Faction origin story (from `data/lore.json`)
- Timeline of key faction history events (JSON-driven, lore admin adds entries without coding)

### `events.html` — Events
- Cards: optional cover art, name, short description — sorted newest first
- Click card → popup modal: name, date, division tags, full lore writeup, image gallery
- All data from `data/events.json`, images from `gallery/events/[event-slug]/`
- No dedicated page per event

### `staff.html` — Staff
Three sections:
1. **Owner** — featured solo, large card
2. **Server Staff** — grouped: Admins → Mods → Staff
3. *(Division Commanders are NOT listed here — only on their division pages)*

Each card: callsign, rank, role, division, profile picture

### `gallery.html` — Gallery
- Tabs: **Media · Medals · Posters**
- Images loaded via GitHub API (reads folder contents at runtime — no code changes to add images)
- Medals tab: awards members can earn, displayed with name and image

---

## Data File Schema

### `data/site.json`
```json
{
  "factionName": "G.H.O.S.T.",
  "fullName": "Galactic Helldivers Operations Strike Taskforce",
  "motto": "No Warning | No Mercy | No Survivors",
  "discordInvite": "",
  "tiktok": "",
  "about": "Placeholder about text.",
  "stats": [
    { "label": "Active Members", "value": "2,000+" },
    { "label": "Divisions", "value": "7" },
    { "label": "Founded", "value": "2024" },
    { "label": "Operations", "value": "100+" }
  ],
  "bootSequence": {
    "baseDelay": 1800,
    "jitter": 600,
    "barLength": 10
  }
}
```

### `data/divisions.json`
Array of 7 division objects:
```json
{
  "name": "69th M3CH Company",
  "slug": "69th-mech",
  "motto": "Unbroken | Unyielding | Unstoppable",
  "oneLiner": "Placeholder",
  "description": "Placeholder",
  "logo": "Assets/69th-M3ch-Company---metallic.png",
  "glowColor": "#a0b800",
  "pageUrl": "divisions/69th-mech.html",
  "tiktok": "",
  "leadership": []
}
```

### `data/events.json`
Array of event objects, newest first:
```json
{
  "name": "Event Name",
  "date": "2026-06-01",
  "shortDesc": "Short description for the card.",
  "fullDesc": "Full lore writeup for the popup.",
  "divisionTags": ["69th-mech", "hivebreakers"],
  "coverImage": "",
  "imageFolder": "gallery/events/event-slug/"
}
```

### `data/lore.json`
```json
{
  "origin": "Faction origin story text.",
  "timeline": [
    { "date": "2024", "title": "Event Title", "description": "What happened." }
  ]
}
```

### `data/staff.json`
```json
{
  "owner": { "callsign": "", "rank": "", "role": "", "division": "", "pfp": "" },
  "staff": [
    { "callsign": "", "rank": "", "role": "", "division": "", "tier": "admin", "pfp": "" }
  ]
}
```

---

## Gallery Folder Structure
```
gallery/
  media/
  medals/
  posters/
  events/
    [event-slug]/
  divisions/
    69th/
    39th/
    taskforce-27/
    hivebreakers/
    pale-riders/
    gtr/
    666th/
```
