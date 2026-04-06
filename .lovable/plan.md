

## Plan: Add Stats Strip + Gold Marquee Section

### What We're Building
A two-part block placed between the Hero and Products sections:
1. **Stats Grid** — dark brown (`#1C0A04`) 2×2 grid with gold numbers and subtle labels
2. **Marquee Strip** — maroon (`#8B1A1A`) continuously scrolling product names

### Implementation

**New file: `src/components/stats/StatsMarqueeSection.tsx`**

- Stats grid using CSS Grid `grid-cols-2` with `border` color `rgba(255,255,255,0.07)`
- Four cells with Cormorant Garamond numbers (`2.2rem`, weight 600, `#C8860A`) and uppercase labels (`0.72rem`, `rgba(255,255,255,0.45)`)
- Fade-up animation via `useInView` from `react-intersection-observer` + `framer-motion` (opacity 0→1, translateY 20→0, 0.8s ease)
- Marquee: duplicated text list inside a flex container with CSS `@keyframes marquee` scrolling left over 24s linear infinite
- No gap between stats and marquee (single component, no margin)
- No border-radius, no shadows — sharp and flat

**Edit: `src/pages/Index.tsx`**

- Import `StatsMarqueeSection` and place it between `<HeroSection />` and the first `<MobileSectionTransition>` wrapping `<ProductShowcase />`

**Edit: `src/index.css`**

- Add `@keyframes marquee` for the continuous left-scroll animation

### Mobile Handling
- On screens ≤480px, grid cells get reduced padding (`1rem 1.25rem`), number font scales to `1.6rem`
- Marquee font and speed remain the same

