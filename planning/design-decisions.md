# G.H.O.S.T. Site — Design Decisions

## Overall Vibe
Blend of "Classified Terminal" and "Deep Space Command." Welcoming and familiar — not intimidating. The terminal/hacking aesthetic lives in the **boot sequence only**, NOT on the main page itself.

## Boot Sequence (home page only)
- Terminal text on black screen before solar system appears
- Messages fire with **random jitter timing** — `delay = baseDelay + Math.random() * jitter`
  - Makes it feel like a real system doing real work, not a scripted animation
  - Values configurable as constants at top of JS file
- **Unicode block loading bars** fill up before each message: `░░░░░░░░░░` → `██████████`
- Messages:
  1. `INITIALIZING G.H.O.S.T. NETWORK...`
  2. `VERIFYING OPERATIVE CLEARANCE...`
  3. `SYNCING TACTICAL DISPLAY...`
  4. `LOADING DIVISION MANIFESTS...`
  5. `ALL SYSTEMS ONLINE.`
- **Skip button** — click anywhere or dedicated button to bypass
- Ends with screen flicker/flash CSS transition into solar system

## Typography
| Use | Font | Notes |
|-----|------|-------|
| Hero graphics / decorative headings | **Wargate** | Desktop license only — export as PNG/SVG from design software. Never embed as web font. |
| All live web text (nav, headings, labels) | **Orbitron** | Google Fonts, SIL OFL, free for web |
| Body copy, lore, terminal text | **Share Tech Mono / Courier New** | Monospace, terminal feel |

## Color Palette
| Name | Hex | Use |
|------|-----|-----|
| Background | `#0a0c08` | Page background |
| Surface | `#1e2a10` | Cards, panels |
| Olive Mid | `#3d5420` | Borders, dividers |
| Accent | `#6a8a30` | Secondary elements |
| Highlight | `#a8c060` | Active states, labels |
| Text | `#d8e0b8` | Body text |

## Division Orbit Glow Colors
| Division | Color |
|----------|-------|
| 69th M3CH Company | `#a0b800` (yellow-green) |
| 39th Hell-Blast Company | `#cc2200` (fire red) |
| Taskforce 27 Grey Owls | `#c8a832` (gold) |
| HiveBreakers | `#7a40cc` (purple) |
| Pale Riders | `#c8a832` (gold) |
| G.H.O.S.T. Trauma Response | `#cc0000` (red) |
| 666th Recoilless Rangers | `#e06020` (orange) |

## Solar System (Three.js via CDN)
- G.H.O.S.T. main logo at center, slowly rotating
- 7 division logos orbiting on 2 elliptical rings (4 inner, 3 outer)
- Each orbit trail glows in division color
- Starfield background
- Click division logo → popup modal (logo, name, motto, one-liner, "View Division" button)
- Full screen hero, sits above fold
