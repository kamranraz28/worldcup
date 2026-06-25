# Toffee FIFA World Cup 2026 — UI/UX Design System

## Official Design Language — "The Stadium Experience"

---

## Brand Soul

Toffee's World Cup platform feels like walking into a stadium at golden hour — the energy of 80,000 fans, the pristine green pitch, the glow of floodlights, the weight of a trophy. It is premium, emotional, and electric — without yelling about football.

Every pixel whispers "World Cup." Nothing screams it.

---

## 1. Color Palette

### 1.1 Primary — Toffee Red

```
token: color-primary-500
hex:   #E30613
hsl:   358, 97%, 45%
usage: Primary buttons, links, active states, key accents

Scale:
50  #FFF0F0    — lightest bg, hover states on light
100 #FFD6D6    — table row hover, notification badges
200 #FFA3A8    — disabled primary
300 #FF6B73    — secondary hover states
400 #F83C46    — hover on primary
500 #E30613    — BASE (buttons, links, brand elements)
600 #B80010    — active, pressed states
700 #8A000C    — dark backgrounds, text on light bg
800 #5C0008    — deepest red, almost black
900 #2E0004    — extreme contrast, rarely used
```

### 1.2 Gold — Victory Accent

```
token: color-gold-500
hex:   #FFD54F
hsl:   45, 100%, 65%
usage: Achievement badges, trophies, verified badges, highlights

Scale:
100 #FFF8E1    — subtle celebratory background
200 #FFECB3    — hover
500 #FFD54F    — BASE (verified icon, gold tier badges)
700 #FFA000    — dark gold, text on gold bg
```

### 1.3 Football Green — Nature + Growth

```
token: color-green-500
hex:   #16A34A
hsl:   142, 76%, 36%
usage: Success states, verified status, check-in confirmed, pitch references

Scale:
50  #F0FFF4    — success alert background
100 #DCFCE7    — light success bg
500 #16A34A    — BASE (success, pitch green)
700 #15803D    — dark green
```

### 1.4 Blue — Trust + Information

```
token: color-blue-500
hex:   #3B82F6
hsl:   217, 91%, 59%
usage: Info badges, links (secondary), help icons

Scale:
50  #EFF6FF
100 #DBEAFE
500 #3B82F6    — BASE
700 #1D4ED8
```

### 1.5 Neutral — The Canvas

```
token: color-neutral-50
hex:   #FAFAFA    — page bg light

token: color-neutral-100
hex:   #F5F5F5    — card bg light, elevated surface

token: color-neutral-200
hex:   #E5E5E5    — borders, dividers light

token: color-neutral-400
hex:   #A3A3A3    — placeholder text, disabled text

token: color-neutral-500
hex:   #737373    — secondary text, metadata

token: color-neutral-700
hex:   #404040    — primary text light mode

token: color-neutral-900
hex:   #171717    — headings light mode
```

### 1.6 Dark Mode Surface

```
token: color-dark-bg
hex:   #0A0A0F    — page bg (deep navy-black)

token: color-dark-surface
hex:   #14141F    — card bg (slightly lighter)

token: color-dark-elevated
hex:   #1C1C2E    — elevated cards, modals, dropdowns

token: color-dark-border
hex:   #2A2A40    — borders, dividers

token: color-dark-text
hex:   #F1F1F7    — primary text

token: color-dark-text-secondary
hex:   #9494A6    — secondary text
```

### 1.7 Stadium Atmosphere Colors (Surface Tints)

```
token: color-stadium-glow
hex:   rgba(227, 6, 19, 0.04)    — faint red glow on hero sections
token: color-stadium-glow-dark
hex:   rgba(227, 6, 19, 0.08)    — dark mode version
token: color-pitch-mist
hex:   rgba(22, 163, 74, 0.03)   — ultra-subtle green tint
token: color-floodlight
hex:   rgba(255, 213, 79, 0.06)  — warm golden glow
```

---

## 2. Typography

### 2.1 Font Family

```
Primary:     "Inter" — system fallback: -apple-system, BlinkMacSystemFont
Monospace:   "JetBrains Mono" — for code, ticket IDs, data

Declaration:
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### 2.2 Type Scale

```
token: text-xs       0.75rem  (12px)  — captions, metadata, badges
token: text-sm       0.875rem (14px)  — body small, table cells, nav links
token: text-base     1rem     (16px)  — body text, paragraphs
token: text-lg       1.125rem (18px)  — large body, lead text
token: text-xl       1.25rem  (20px)  — subheadings
token: text-2xl      1.5rem   (24px)  — section headings
token: text-3xl      1.875rem (30px)  — page titles
token: text-4xl      2.25rem  (36px)  — hero headings
token: text-5xl      3rem     (48px)  — large hero
token: text-6xl      3.75rem  (60px)  — display hero
token: text-7xl      4.5rem   (72px)  — campaign hero
```

### 2.3 Font Weights

```
token: font-light      300  — large display text only
token: font-normal     400  — body text
token: font-medium     500  — buttons, nav items, labels
token: font-semibold   600  — subheadings, card titles
token: font-bold       700  — headings, page titles
token: font-extrabold  800  — marketing hero text, numbers
```

### 2.4 Line Height

```
token: leading-none     1     — tight, badges, buttons
token: leading-tight    1.25  — headings
token: leading-snug     1.375 — subheadings
token: leading-normal   1.5   — body text (default)
token: leading-relaxed  1.625 — long-form content
token: leading-loose    2     — sparse, luxury feel
```

### 2.5 Letter Spacing

```
token: tracking-tight   -0.025em  — headings, premium feel
token: tracking-normal  0         — body
token: tracking-wide    0.025em   — ALL CAPS labels
token: tracking-wider   0.05em    — uppercase badges
```

### 2.6 Typography Rules

- **Headings**: Always `tracking-tight`, weight 700, `leading-tight`
- **Page Titles**: `text-3xl` or `text-4xl`, weight 700, `leading-tight`
- **Card Titles**: `text-lg` or `text-xl`, weight 600
- **Body**: `text-base`, weight 400, `leading-normal`
- **Small Text**: `text-sm`, weight 400, `leading-snug`
- **Labels & Tags**: `text-xs` or `text-sm`, weight 500, `tracking-wide`
- **Numbers / Stats**: `text-2xl` or `text-3xl`, weight 700, `tracking-tight`
- **Hero**: `text-5xl` to `text-7xl`, weight 800, `tracking-tight`, `leading-none`

---

## 3. Spacing System

### 3.1 Base Unit: 4px

```
token: space-0    0px
token: space-1    4px    — micro gaps
token: space-2    8px    — tight gaps, icon margins
token: space-3    12px   — form element padding
token: space-4    16px   — card padding, button padding
token: space-5    20px   — section padding tight
token: space-6    24px   — standard spacing unit
token: space-8    32px   — card groups, form sections
token: space-10   40px   — page section gaps
token: space-12   48px   — major sections
token: space-14   56px   — wide sections
token: space-16   64px   — page padding (desktop)
token: space-20   80px   — hero padding
token: space-24   96px   — landing sections
token: space-32   128px  — mega sections
```

### 3.2 Spacing Rhythm

```
Between page sections:     space-16 (64px) desktop, space-10 (40px) mobile
Between card groups:       space-8  (32px)
Inside card:               space-6  (24px)
Between form fields:       space-5  (20px)
Between button and text:   space-3  (12px)
Between icon and label:    space-2  (8px)
```

---

## 4. Grid System

### 4.1 Layout Grid

```
Column count:  12 columns
Gutter:        24px (space-6)
Margin:        64px desktop, 24px tablet, 16px mobile
Max width:     1280px (content), 1440px (full)
```

### 4.2 Dashboard Grid

```
Dashboard uses a custom 4-column grid that collapses:
Desktop:  4 columns  (1fr 1fr 1fr 1fr)
Tablet:   2 columns  (1fr 1fr)
Mobile:   1 column   (1fr)

Each card spans 1, 2, or 4 columns based on importance.

KPI cards:   1 column each (4 per row)
Charts:      2 columns (2 per row)
Tables:      4 columns (full width)
Side widget: 1 column (sidebar context)
```

### 4.3 List Grid (Data Tables)

```
Responsive card-based layout on mobile.
Desktop uses traditional table.

Breakpoints:
sm:  640px    — single column
md:  768px    — 2 columns  
lg:  1024px   — table view
xl:  1280px   — table view + sidebar
2xl: 1536px   — comfortable table view
```

---

## 5. Cards

### 5.1 Card System

```
token: card-radius         12px (rounded-xl)
token: card-radius-lg      16px (rounded-2xl)
token: card-radius-sm      8px  (rounded-lg)

Light Mode:
token: card-bg             white (#FFFFFF)
token: card-border         rgba(0, 0, 0, 0.06)
token: card-shadow         0 1px 2px rgba(0,0,0,0.04), 
                           0 4px 8px rgba(0,0,0,0.02)
token: card-shadow-hover   0 4px 12px rgba(0,0,0,0.06),
                           0 12px 32px rgba(0,0,0,0.03)

Dark Mode:
token: card-bg             #14141F
token: card-border         rgba(255,255,255,0.04)
token: card-shadow         0 1px 2px rgba(0,0,0,0.2)
token: card-shadow-hover   0 4px 20px rgba(0,0,0,0.3)
```

### 5.2 Glass Card (Premium Variant)

```
Light Mode:
background: rgba(255, 255, 255, 0.7)
backdrop-filter: blur(20px)
border: 1px solid rgba(255, 255, 255, 0.3)
shadow: 0 8px 32px rgba(0, 0, 0, 0.04)

Dark Mode:
background: rgba(20, 20, 31, 0.7)
backdrop-filter: blur(24px)
border: 1px solid rgba(255, 255, 255, 0.04)
shadow: 0 8px 32px rgba(0, 0, 0, 0.2)

Usage: Modals, side panels, dropdowns, floating KPI cards, navbars
```

### 5.3 Card Anatomy

```
┌──────────────────────────────────────┐
│ [Icon] Title                    [Badge] │  <- header: space-4 padding
│ ───────────────────────────────────── │  <- divider: 1px, opacity 0.06
│                                        │
│   Content area (flexible height)       │  <- body: space-4 padding
│                                        │
│ ───────────────────────────────────── │  <- optional divider
│ [Action]                    [Meta]    │  <- footer: space-3 padding
└──────────────────────────────────────┘
```

---

## 6. Buttons

### 6.1 Button Hierarchy

```
PRIMARY     — filled, Red (#E30613), white text
              hover: #F83C46, active: #B80010

SECONDARY   — glass/outline, subtle border, text color
              hover: bg rgba(227,6,19,0.04)

GHOST       — no bg, no border, text only
              hover: bg rgba(0,0,0,0.04)

DANGER      — filled red (#DC2626), destructive actions

SUCCESS     — filled green (#16A34A), confirm actions

GOLD        — filled gold (#FFD54F), dark text, premium actions
```

### 6.2 Button Sizes

```
token: btn-xs      h-7 px-3 text-xs rounded-lg
token: btn-sm      h-9 px-4 text-sm rounded-lg
token: btn-md      h-10 px-5 text-sm rounded-xl
token: btn-lg      h-12 px-6 text-base rounded-xl
token: btn-xl      h-14 px-8 text-base rounded-2xl
```

### 6.3 Button States

```
Default:    transform: none
Hover:      transform: translateY(-1px); shadow increases
Active:     transform: translateY(0); scale slightly smaller (0.98)
Loading:    show spinner icon, disable interaction, reduce opacity to 0.7
Disabled:   opacity 0.4, no hover effects, cursor not-allowed
Focus:      ring-2 ring-primary-500/30 ring-offset-2
```

### 6.4 Icon Buttons

```
Square icon buttons: same sizing as text buttons, but square (h = w)
Usage: Close modals, actions in tables, toolbar items
```

---

## 7. Inputs & Forms

### 7.1 Input Fields

```
Light Mode:
token: input-bg            rgba(0,0,0,0.02) or white with subtle border
token: input-border        rgba(0,0,0,0.08)
token: input-border-hover  rgba(0,0,0,0.15)
token: input-border-focus  primary-500 (#E30613)
token: input-ring-focus    rgba(227,6,19,0.15)
token: input-placeholder   #A3A3A3
token: input-disabled-bg   rgba(0,0,0,0.03)
token: input-error-border  #DC2626
token: input-error-ring    rgba(220,38,38,0.15)

Dark Mode:
token: input-bg            rgba(255,255,255,0.03)
token: input-border        rgba(255,255,255,0.06)
token: input-border-hover  rgba(255,255,255,0.12)
token: input-border-focus  primary-500
token: input-ring-focus    rgba(227,6,19,0.25)
token: input-placeholder   #68687A
token: input-disabled-bg   rgba(255,255,255,0.02)
```

### 7.2 Input Sizes

```
token: input-sm      h-9 px-3 text-sm rounded-lg
token: input-md      h-10 px-4 text-sm rounded-xl
token: input-lg      h-12 px-4 text-base rounded-xl
token: input-xl      h-14 px-5 text-base rounded-2xl
```

### 7.3 Input Anatomy

```
┌─────────────────────────────────────────────┐
│  Label (text-sm, weight 500, mb-2)           │
│  ┌─────────────────────────────────────────┐ │
│  │ [icon]  placeholder text         [clear] │ │
│  └─────────────────────────────────────────┘ │
│  Helper text (text-xs, neutral-500)          │
│  Error text (text-xs, red-500)               │
└─────────────────────────────────────────────┘
```

### 7.4 Form Layout

```
- Single column on mobile, 2 columns on desktop (lg+)
- Labels always above input (not floating)
- 20px (space-5) gap between fields
- 32px (space-8) gap between form sections
- Submit button left-aligned
- Cancel link next to submit (ghost style)
```

### 7.5 Select, Checkbox, Radio, Toggle

```
Select:  Styled to match inputs, chevron icon on right
Checkbox: Square (18x18), rounded(4px), red check on checked
Radio:    Circle (18x18), red fill dot on selected
Toggle:   44x24 pill, red fill when active, smooth slide animation
          transition: 200ms cubic-bezier(0.4, 0, 0.2, 1)
```

### 7.6 File Upload

```
Dashed border zone, 2px, neutral-200
Icon cent er, "Upload document" text, "Max 10MB" subtext
Drag active: border turns red, bg gets red tint (0.04)
On file selected: card changes to show filename + size + remove button
Transition: all 300ms ease-out
```

---

## 8. Tables

### 8.1 Table Design

```
Minimal, clean, borderless, spacious.

Row height: 56px (space-14)
Padding:    16px (space-4) left/right
Header bg:  transparent
Header text: text-xs, weight 600, tracking-wide, uppercase, neutral-500
Row hover:  bg rgba(227,6,19,0.02) or neutral-50
Selected row: bg rgba(227,6,19,0.04) with left border accent (2px, red)

Dark mode:
Row hover:  rgba(255,255,255,0.02)
Selected:   rgba(227,6,19,0.06) with left border accent
```

### 8.2 Empty State

```
Centered illustration (custom drawn — stadium outline)
"Nothing here yet" heading (text-lg, weight 600)
Descriptive subtext (text-sm, neutral-500)
Call-to-action button (secondary, ghost, or primary)
```

### 8.3 Loading Skeleton

```
Pulsing gradient bars matching table structure.
animation: shimmer 2s infinite linear
background: linear-gradient(90deg, neutral-100 25%, neutral-200 50%, neutral-100 75%)
Dark: dark-elevated 25%, dark-border 50%, dark-elevated 75%
```

---

## 9. Charts

### 9.1 Chart Design Principles

```
- No gridlines (or ultra-faint, opacity 0.1)
- Axis labels: text-xs, neutral-400
- Line stroke width: 2px
- Area fill: gradient from color to transparent
- Dots on hover only
- Tooltip: glass card, dark bg, white text, rounded-xl, shadow
- Font: inherit Inter family
- Legend: bottom, horizontal, text-sm
```

### 9.2 Chart Types

```
Area Chart (Verifications over time)
  ─ gradient fill from red to transparent
  ─ smooth curve (monotone, not linear)

Bar Chart (Events per day)
  ─ rounded top corners (radius: 4px)
  ─ red fill
  ─ 4px gap between bars

Pie / Donut (Demographics)
  ─ donut style (center hole)
  ─ center shows total count
  ─ segments: Red, Gold, Green, Blue

Line Chart (Ticket sales trend)
  ─ multiple series: Red for VIP, Gold for General, Blue for VVIP
  ─ dots on data points (hidden until hover)
```

---

## 10. Sidebar

### 10.1 Sidebar Specification

```
Width:       280px (collapsed: 72px)
Bg light:    glass effect (white/70 + blur)
Bg dark:     glass effect (dark-surface/80 + blur)
Border right: 1px solid rgba(0,0,0,0.04) light / rgba(255,255,255,0.04) dark

Logo area: 64px height, centered logo, bottom divider
Nav item:   44px height, rounded-xl, padding 12px left
Nav hover:  bg rgba(227,6,19,0.04)
Nav active:  bg rgba(227,6,19,0.08) OR red left border + bg tint
Icon:       20x20, 2px stroke width, neutral-500 (active: red)
Label:      text-sm, weight 500, neutral-700 (active: red)

Section label: text-xs, tracking-wide, uppercase, weight 600, neutral-400
               padding top 24px, bottom 8px

Bottom:     User avatar (32x32), name, role, logout
            height: 72px, border-top
```

### 10.2 Sidebar Collapsed

```
Icon only, centered, tooltip on hover
Tooltip: glass card, text-sm, delay 300ms, duration 150ms
```

---

## 11. Navbar (Top Bar)

### 11.1 Navbar Specification

```
Height:     60px (space-15) or 64px (space-16)
Bg:         Same as sidebar (glass)
Border bottom: 1px solid rgba(0,0,0,0.04) light
            / rgba(255,255,255,0.04) dark
Padding:    16px left/right desktop, 12px mobile

Layout:     [Hamburger] [Breadcrumbs]   [Search] [Notifications] [Avatar]

Breadcrumbs: text-sm, neutral-500, chevron separator
             Last item: neutral-900, weight 600
Search:      Compact input, 240px, hidden on mobile (icon button instead)
Notifications: Bell icon, badge (red dot or number), 
               dropdown glass card on click
Avatar:      32x32, rounded-full, dropdown menu
```

---

## 12. Dialogs / Modals

### 12.1 Modal Spec

```
Overlay bg:     rgba(0,0,0,0.4) or rgba(0,0,0,0.6)
                backdrop-filter: blur(8px)
Modal card:     glass card (white/80 + blur-24)
                rounded-2xl (16px)
                max-width: 480px (sm), 640px (md), 800px (lg)
                shadow: 0 25px 50px rgba(0,0,0,0.15)
                animation: scale in (0.95 → 1) + fade in

Header:  space-6 padding, icon + title (text-lg, weight 600)
         close button (ghost icon, top right)
Body:    space-6 padding (or space-4 if form-heavy)
Footer:  space-4 padding, flex row, gap-3
         [Cancel] [Confirm/Primary]

Enter:  opacity 0 → 1, scale 0.95 → 1, duration 200ms, ease-out
Exit:   opacity 1 → 0, scale 1 → 0.95, duration 150ms, ease-in
Overlay: opacity 0 → 1, duration 200ms
```

### 12.2 Confirmation Dialog

```
Warning icon (gold/red), centered
Title: "Are you sure?"
Body:  "This action cannot be undone..."
Two buttons: Cancel (ghost) + Confirm (danger/primary)
Danger text: "Delete Event" / "Cancel Ticket"
```

---

## 13. Loading States

### 13.1 Page Load

```
Full page:  subtle fade in (opacity 0 → 1, 200ms, ease-out)
            no loading spinner for SSR pages (Inertia)
            content appears progressively

Section load: skeleton shimmer for 300ms minimum
              then fade in real content
```

### 13.2 Component Load

```
Buttons:   spinner icon (instead of text), 16x16, animate-spin
           OR pulsing dots (3 dots, staggered animation)
Cards:     skeleton rectangles matching card shape
           pulsing shimmer animation (2s infinite)
Tables:    5-8 skeleton rows, shimmer animation
Charts:    skeleton rectangle with chart silhouette
           subtle pulse animation
```

### 13.3 Skeleton Animation

```
@keyframes shimmer:
  0%     background-position: -200% 0
  100%   background-position: 200% 0

background: linear-gradient(
  90deg,
  var(--skeleton-base) 25%,
  var(--skeleton-shine) 50%,
  var(--skeleton-base) 75%
)
background-size: 200% 100%
```

---

## 14. Framer Motion Animation Rules

### 14.1 Transition Defaults

```
Default easing:  cubic-bezier(0.4, 0, 0.2, 1)  — "ease-out"
Default duration: 200ms

token: motion-ease-out    cubic-bezier(0.4, 0, 0.2, 1)
token: motion-ease-in     cubic-bezier(0.4, 0, 1, 1)
token: motion-ease-in-out cubic-bezier(0.4, 0, 0.2, 1)
token: motion-spring      spring( stiffness: 300, damping: 30 )
token: motion-bounce      spring( stiffness: 400, damping: 15 )
```

### 14.2 Motion Tokens

```
token: motion-duration-fast    150ms
token: motion-duration-normal  200ms
token: motion-duration-slow    300ms
token: motion-duration-slide   400ms
token: motion-duration-enter   500ms  (page transitions)

token: motion-delay-stagger    50ms   (per child in list)
token: motion-delay-stagger-slow 100ms
```

### 14.3 Component Animation Presets

```
Page transitions:
  fadeIn:     { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
  slideUp:    { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }
  slideRight: { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 } }

Card hover:
  scale hover: scale 1.02, y: -4px, shadow increase
  transition: 200ms ease-out

List items stagger:
  parent:      { initial: "hidden", animate: "visible" }
  variants:    visible: { transition: { staggerChildren: 0.05 } }
  child:       { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

Modal:
  backdrop:    fade in (opacity 0→1) 200ms
  content:     scale 0.95→1 + opacity 0→1, 250ms, spring(300,30)

Button:
  hover:       y: -1px, 150ms
  tap:         scale: 0.98, 100ms

Accordion:
  expand:      height 0→auto, 300ms ease-out

Tooltip:
  enter:       opacity 0→1, y 2→0, 150ms
  exit:        opacity 1→0, 100ms

Number counter (stats):
  animate from 0 to target value, 1s, ease-out
  use: motionValue + useTransform

Check-in success:
  burst animation: scale 0→1→1.2→1, opacity 0→1→1→0
  green checkmark, 600ms total

Badge / notification dot:
  bounce: scale(0)→scale(1.3)→scale(1), spring(400,15)
```

### 14.4 Accessibility — Reduced Motion

```
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

Framer Motion: useReducedMotion() hook
  — skip all animations if user prefers reduced motion
  — use `animate={prefersReducedMotion ? {} : { ... }}`
```

---

## 15. Light Mode / Dark Mode

### 15.1 Strategy

```
- CSS custom properties (design tokens) for all colors
- data-theme="light" | data-theme="dark" on <html>
- Tailwind dark mode: 'class' strategy
- Toggle stored in localStorage, default: system preference
- Framer Motion animate between modes (bg color transition, 300ms)
```

### 15.2 Light Mode

```
Page bg:        #FAFAFA (neutral-50)
Card bg:        white
Surface bg:     #F5F5F5 (neutral-100)
Border:         1px solid rgba(0,0,0,0.06)
Text primary:   #171717
Text secondary: #737373
Text muted:     #A3A3A3
Accent:         #E30613
Shadow:         subtle, warm-toned
Sidebar/Nav:    glass (white/70 + blur)
```

### 15.3 Dark Mode

```
Page bg:        #0A0A0F
Card bg:        #14141F
Surface bg:     #1C1C2E
Border:         1px solid rgba(255,255,255,0.04)
Text primary:   #F1F1F7
Text secondary: #9494A6
Text muted:     #5C5C70
Accent:         #FF4B57 (brighter red for dark mode)
Shadow:         deep, dark-toned (almost no shadow, use border)
Sidebar/Nav:    glass (dark-surface/80 + blur)
```

### 15.4 Transition between modes

```
All color transitions: 300ms ease-out
Apply via: transition: background-color 300ms ease, border-color 300ms ease, color 300ms ease
On :root or * selector with prefers-reduced-motion guard
```

---

## 16. Responsive Design Rules

### 16.1 Breakpoints

```
token: screen-sm    640px    @media (min-width: 640px)
token: screen-md    768px    @media (min-width: 768px)
token: screen-lg    1024px   @media (min-width: 1024px)
token: screen-xl    1280px   @media (min-width: 1280px)
token: screen-2xl   1536px   @media (min-width: 1536px)
```

### 16.2 Layout Adaptations

```
Mobile (< 640px):
  — Single column everything
  — Bottom navigation bar instead of sidebar (60px height)
  — Full-width cards, no padding on sides (16px safe area)
  — Modals become bottom sheets (80% height, rounded top-2xl)
  — Tables become card list (each row = card)
  — Sidebar hidden, hamburger menu opens drawer overlay
  — Font sizes: hero text-3xl, h1 text-2xl
  — Buttons full-width for primary actions

Tablet (640px - 1024px):
  — 2 column grid for cards
  — Sidebar collapsed by default (icon only)
  — Tables still card-based but 2 per row
  — Modals: medium size centered

Desktop (1024px+):
  — Full sidebar visible
  — Multi-column layouts
  — Standard table view
  — Floating action buttons
  — Max width containers
```

### 16.3 Navigation (Mobile)

```
Bottom tab bar:
  height: 64px
  bg: glass (white/80 + blur) / dark (dark-surface/90 + blur)
  border-top: 1px
  items: 5 max, icon + label (text-xs)
  active: red icon/text
  inactive: neutral-500
```

---

## 17. Dashboard Wireframe (Key Pages)

### 17.1 Main Dashboard

```
┌────────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  [Top Nav: Dashboard  | 🔍 | 🔔 | 👤]           │
│            │                                                    │
│            │  ╔══════════════════════════════════════════════╗  │
│            │  ║  Good morning, Sarah          [Date Range]  ║  │
│            │  ║  Welcome back to the Toffee World Cup HQ    ║  │
│            │  ╚══════════════════════════════════════════════╝  │
│            │                                                    │
│            │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│            │  │ Active    │ │ Tickets  │ │ Verified  │ │ Check-ins ││
│            │  │ Events    │ │ Sold     │ │ Customers │ │ Today     ││
│            │  │   12      │ │  1,847   │ │   3,421   │ │    842    ││
│            │  │  ▲ +3     │ │  ▲ +12%  │ │  ▲ +5%   │ │  ▲ +18%   ││
│            │  └──────────┘ └──────────┘ └──────────┘ └──────────┘│
│            │                                                    │
│            │  ┌─────────────────────┐ ┌────────────────────────┐│
│            │  │ Verifications Trend │ │ Ticket Sales by Type   ││
│            │  │ [Area Chart]         │ │ [Donut Chart]          ││
│            │  │                     │ │                        ││
│            │  │ ▲ 28% this week     │ │ VIP: 342  General: 1.2k││
│            │  └─────────────────────┘ └────────────────────────┘│
│            │                                                    │
│            │  ┌────────────────────────────────────────────────┐│
│            │  │ Recent Verifications Pending Review       [View All]│
│            │  │ ┌─────┬────────┬──────────┬────────┬────────┐ ││
│            │  │ │User │ Doc    │ Submitted│ Status │ Action │ ││
│            │  │ ├─────┼────────┼──────────┼────────┼────────┤ ││
│            │  │ │...  │ ...    │ ...      │ Pending│ [Review]│ ││
│            │  │ └─────┴────────┴──────────┴────────┴────────┘ ││
│            │  └────────────────────────────────────────────────┘│
│            │                                                    │
│            │  ┌─────────────────────┐ ┌────────────────────────┐│
│            │  │ Upcoming Events     │ │ Top Campaigns          ││
│            │  │ [List with dates]   │ │ [List with progress]   ││
│            │  └─────────────────────┘ └────────────────────────┘│
└────────────────────────────────────────────────────────────────┘
```

### 17.2 Landing Page (Public)

```
┌────────────────────────────────────────────────────────────────┐
│  [Nav: Logo | Events | Tickets | Campaigns | Sign In]         │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │    The Stadium Is Calling                                │  │
│    ═══════════════════                                       │  │
│    Toffee presents the official FIFA World Cup 2026         │  │
│    experience. Secure your seat. Feel the energy.          │  │
│                                                          │  │
│    [Browse Events →]     [Verify Now →]                   │  │
│                                                          │  │
│    ┌──────────┐ ┌──────────┐ ┌──────────┐                │  │
│    │  50+     │ │  10,000+ │ │  4,500+  │                │  │
│    │  Events  │ │  Fans    │ │   Seats  │                │  │
│    └──────────┘ └──────────┘ └──────────┘                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  [Subtle stadium curve SVG at bottom of hero]                 │
│                                                                │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │
│  │ 🏟  Live     │ │ 🎫  Secure   │ │ ✅  Instant  │          │
│  │    Events    │ │    Tickets   │ │    Verify    │          │
│  │  Experience  │ │  2-click    │ │  Under 2 min │          │
│  │  the energy  │ │  checkout    │ │   AI-powered │          │
│  └──────────────┘ └──────────────┘ └──────────────┘          │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Featured Events                                    [All]│  │
│  │                                                        │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │  │
│  │  │ Semi-Final   │ │ Quarter-Final│ │ Fan Zone     │      │  │
│  │  │ Viewing Party│ │ Live Stream  │ │ Expo         │      │  │
│  │  │ Jul 12, 2026 │ │ Jul 8, 2026  │ │ Jun 20-30   │      │  │
│  │  │ [Get Ticket] │ │ [Get Ticket] │ │ [Register]   │      │  │
│  │  └──────────────┘ └──────────────┘ └──────────────┘      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  [Footer: Logo | Links | Social | © Toffee 2026]              │
└────────────────────────────────────────────────────────────────┘
```

### 17.3 Admin Pages

```
All admin pages follow the same shell:

┌────────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  [Top Nav: Page Title | 🔍 | 🔔 | 👤]           │
│            │                                                    │
│            │  [Page Header: Title + Subtitle]  [Primary Action]│
│            │                                                    │
│            │  [Filters Bar: Search, Date Range, Status, ...]   │
│            │                                                    │
│            │  [Content Area: Table / Cards / Grid / Charts]    │
│            │                                                    │
│            │  [Pagination (if applicable)]                      │
│            │                                                    │
│            │  [Empty State (if no data)]                        │
│            │                                                    │
│            │  [Footer: subtle copyright]                        │
└────────────────────────────────────────────────────────────────┘
```

Admin page variants:

- **Events List**: Table with status badges, quick actions (publish, cancel, view)
- **Event Detail**: Header banner, tabs (Overview, Tickets, Check-ins, Settings)
- **Verification Queue**: Cards in a grid, each showing document preview, status, review CTA
- **Customer Profile**: Left: customer card, Right: tabs (Tickets, Verifications, History)
- **Campaign Builder**: Stepper form (Details → Rules → Rewards → Review & Launch)
- **Reports**: Predefined report cards, schedule toggle, download button

---

## 18. Design Tokens (Complete Reference)

### 18.1 Color Tokens

```
--color-primary-50:   #FFF0F0
--color-primary-100:  #FFD6D6
--color-primary-200:  #FFA3A8
--color-primary-300:  #FF6B73
--color-primary-400:  #F83C46
--color-primary-500:  #E30613
--color-primary-600:  #B80010
--color-primary-700:  #8A000C
--color-primary-800:  #5C0008
--color-primary-900:  #2E0004

--color-gold-50:      #FFF8E1
--color-gold-100:     #FFECB3
--color-gold-500:     #FFD54F
--color-gold-700:     #FFA000

--color-green-50:     #F0FFF4
--color-green-100:    #DCFCE7
--color-green-500:    #16A34A
--color-green-700:    #15803D

--color-blue-50:      #EFF6FF
--color-blue-100:     #DBEAFE
--color-blue-500:     #3B82F6
--color-blue-700:     #1D4ED8

--color-neutral-50:   #FAFAFA
--color-neutral-100:  #F5F5F5
--color-neutral-200:  #E5E5E5
--color-neutral-400:  #A3A3A3
--color-neutral-500:  #737373
--color-neutral-700:  #404040
--color-neutral-900:  #171717

--color-dark-bg:           #0A0A0F
--color-dark-surface:       #14141F
--color-dark-elevated:      #1C1C2E
--color-dark-border:        #2A2A40
--color-dark-text:          #F1F1F7
--color-dark-text-secondary:#9494A6

--color-glass-light:       rgba(255, 255, 255, 0.7)
--color-glass-border-light: rgba(255, 255, 255, 0.3)
--color-glass-dark:        rgba(20, 20, 31, 0.7)
--color-glass-border-dark: rgba(255, 255, 255, 0.04)
```

### 18.2 Shadow Tokens

```
--shadow-sm:       0 1px 2px rgba(0,0,0,0.04)
--shadow-md:       0 4px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)
--shadow-lg:       0 8px 24px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.02)
--shadow-xl:       0 12px 32px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.02)
--shadow-2xl:      0 24px 48px rgba(0,0,0,0.1)
--shadow-glass:    0 8px 32px rgba(0,0,0,0.04)

--shadow-dark-sm:  0 1px 2px rgba(0,0,0,0.2)
--shadow-dark-md:  0 4px 12px rgba(0,0,0,0.25)
--shadow-dark-lg:  0 8px 24px rgba(0,0,0,0.3)
--shadow-dark-xl:  0 16px 40px rgba(0,0,0,0.35)
```

### 18.3 Radius Tokens

```
--radius-xs:      4px
--radius-sm:      6px
--radius-md:      8px
--radius-lg:      10px
--radius-xl:      12px
--radius-2xl:     16px
--radius-3xl:     20px
--radius-full:    9999px
```

### 18.4 Z-Index Tokens

```
--z-dropdown:     100
--z-sticky:       200
--z-sidebar:      300
--z-navbar:       300
--z-modal-backdrop: 400
--z-modal:        500
--z-popover:      600
--z-tooltip:      700
--z-toast:        800
```

---

## 19. Component Library (Patterns)

### 19.1 Status Badges

```
Verified:     bg-green-50, text-green-700, dot icon, rounded-full
Pending:      bg-amber-50, text-amber-700, clock icon
Rejected:     bg-red-50, text-red-700, x icon
In Review:    bg-blue-50, text-blue-700, eye icon
Flagged:      bg-red-50, text-red-700, flag icon, pulse animation

Ticket statuses:
Confirmed:    bg-emerald-50, text-emerald-700
Reserved:     bg-gray-50, text-gray-600
Cancelled:    bg-red-50, text-red-600
Redeemed:     bg-indigo-50, text-indigo-700
Expired:      bg-orange-50, text-orange-700
```

### 19.2 Alert Banners

```
Success:      bg-green-50, border-green-200, text-green-700, check icon
Error:        bg-red-50, border-red-200, text-red-700, x icon
Warning:      bg-amber-50, border-amber-200, text-amber-700, alert icon
Info:         bg-blue-50, border-blue-200, text-blue-700, info icon

Glass variant (floating toast):
  bg: glass effect, backdrop-filter blur
  border: 1px solid rgba(color, 0.2)
  shadow: xl
  position: fixed, bottom right, space-6 margin
  auto-dismiss: 5s for success, manual for error
```

### 19.3 Avatars

```
Sizes:        24, 32, 40, 48, 64, 80, 96
Radius:       rounded-full always
Border:       2px white (light) / 2px dark-elevated (dark)
Fallback:     initials on neutral-200 bg
Status dot:   8px circle, absolute bottom-right,
              green (online), gray (offline), red (busy)
```

### 19.4 Progress Bars

```
Linear:
  height: 8px / 4px (thin)
  bg: neutral-100
  fill: primary-500 or green-500
  radius: full
  animation: width transition 500ms ease-out
  label: optional, text-xs, right-aligned

Circular (campaigns):
  size: 48x48 or 64x64
  stroke width: 4px
  trail color: neutral-200
  path color: primary-500
  center text: percentage, text-sm, weight 600
  animation: stroke-dashoffset transition 1s ease-out
```

### 19.5 Tooltips

```
Glass card style (white/80 + blur for light, dark-elevated/90 for dark)
text-sm, max-width 200px, padding space-2 space-3
Arrow pointing to trigger element
Delay: 300ms show, 100ms hide
```

### 19.6 Toast / Notifications

```
Stack: bottom-right, space-6 from edges
Each toast: glass card, space-4 padding, icon + message + dismiss
Auto-dismiss: success 4s, info 6s, error manual
Enter: slide in from right + fade, 300ms
Exit:  slide out to right + fade, 200ms
```

---

## 20. Stadium Atmosphere Visual Elements

### 20.1 Hero Section (Landing)

```
Full viewport height (100vh)
Background: deep gradient from #0F172A (top) → #1E1B2E (bottom)
Overlay: subtle stadium curve SVG at bottom (negative space)
         — 3 layered arcs, opacity 0.03, 0.02, 0.01
Center:  main headline in white, max-width 720px
         gold accent line under headline (w-20, h-1, bg-gold-500)
         CTA buttons on glass cards
Ambient: subtle floating particles (Framer Motion, 20-30 dots)
         varying size: 2-6px, opacity: 0.02-0.06
         drift animation: y-axis oscillation, 10-15s period
```

### 20.2 Stadium Curve SVG (Reusable)

```
Path: M 0 100 Q 50 0, 100 100 Q 150 200, 200 100
      (layered, varied opacity, responsive width)
Usage:   Hero section bottom, card dividers, section transitions
Colors:  primary-500 with opacity, gold-500 with opacity
```

### 20.3 Section Transitions

```
Between major sections:
  subtle curvature (CSS clip-path or SVG)
  clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%)
  alternating for visual rhythm
  on scroll: parallax effect (Framer Motion useScroll)
```

### 20.4 Lighting Effects

```
Cards on landing page:
  top edge: 1px gradient from rgba(227,6,19,0.15) to transparent
  reminiscent of floodlight glow

Dark mode cards:
  subtle inner shadow: inset 0 1px 0 rgba(255,255,255,0.03)
  edge lighting effect

CTA buttons:
  hover: box-shadow with primary-500 color spread
  glow: 0 0 20px rgba(227,6,19,0.2), 0 0 40px rgba(227,6,19,0.1)
```

---

## Appendix: Page-Specific Design Notes

### A.1 Verification Flow

```
A 3-step stepper (Framer Motion animated):
Step 1: Upload identity document (passport, ID card, license)
        - Large drag & drop zone
        - Real-time file type validation (show green check)
        - Preview thumbnail after upload
Step 2: Selfie capture
        - Camera access (fallback: file upload)
        - Circle frame overlay (think iPhone face ID)
Step 3: Review & Submit
        - Summary card with document + selfie thumbnails
        - "I confirm the above information is correct" checkbox
        - Submit button (primary, full-width)

After submit: Success animation (green burst, checkmark scale, confetti)
              "Verification submitted" message
              Estimated time: "Usually reviewed within 2 hours"
```

### A.2 Check-In Scanning

```
Full-screen scanner (mobile-first):
  Viewfinder frame: rounded rectangle, red border
  Scanning animation: corner brackets pulse
  Camera feed as background
  Success: screen flashes green, large checkmark + sound
  Fail: screen flashes red, shake animation, error message
  Manual entry fallback: ticket ID input field
```

### A.3 Event Detail Page

```
Hero banner:
  Event image with gradient overlay (dark to transparent)
  Date badge (glass card, top left)
  Status badge (top right)
  Title + venue + "spots left" counter

Below fold:
  Tab navigation (AnimatePresence for tab content)
  - Overview: description, time, venue map
  - Tickets: pricing tiers, availability, purchase CTA
  - Reviews: customer testimonials (if enabled)
  - Live: embedded stream (for virtual/hybrid)
```

---

*This design system is the single source of truth for all UI/UX implementation. All design decisions must conform to these specifications. Deviations require Lead Product Designer approval.*
