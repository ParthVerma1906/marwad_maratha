

## Fix Hero Section Vertical Balance and Alignment

### Problem
The hero content block sits too low (pushed down by `marginTop: '70px'`), and the button area has excessive bottom padding (`pb-12`), creating an unbalanced layout where content feels bottom-heavy. The scroll indicator and trust line positioning also need cleanup.

### Changes

#### 1. HeroContent.tsx -- Shift content block upward and tighten spacing

- Change `marginTop: '70px'` to `marginTop: '20px'` (moves block ~50px upward)
- Reduce `space-y-5` on the wrapper to `space-y-3` for tighter vertical rhythm
- Keep `mb-3` on "Flavours of Tradition." but reduce it to `mb-2` (slightly less gap before "Taste of Home.")
- Remove `space-y-3` wrapper around the paragraph -- use `mt-2` directly for a smaller gap after "Taste of Home."
- Change button container from `pt-6 pb-12` to `pt-4 pb-4` (reduce excessive bottom padding, keep 16px consistent spacing)

#### 2. HeroScrollIndicator.tsx -- Anchor cleanly at bottom with breathing room

- Change `bottom-8` to `bottom-6` (24px from bottom edge -- clean anchor point)
- No other changes needed; it is already centered and minimal

### Visual Hierarchy Result

```text
Navbar (fixed)
        |
   ~20px gap
        |
  "Flavours of Tradition."
   8px gap (mb-2)
  "Taste of Home."
   8px gap (mt-2)
  Paragraph text
   16px gap (pt-4)
  [Shop Now]  [Explore Products]
   16px gap (pb-4)
        ...
   ~24px from bottom
  "Scroll to explore"
       arrow
```

### What stays untouched
- Headline font, size, color, shadow
- "Taste of Home." script style and color
- Paragraph text styling
- Button styles and hierarchy (gradient primary, outlined secondary)
- Background image / carousel
- Scroll indicator content (text + arrow only, no circles)

### Technical Details
- **HeroContent.tsx** line 32: `space-y-5` to `space-y-3`
- **HeroContent.tsx** line 33: `marginTop: '70px'` to `marginTop: '20px'`
- **HeroContent.tsx** line 47: `mb-3` to `mb-2`
- **HeroContent.tsx** line 64-65: remove wrapping `space-y-3` div, apply `mt-2` to the `h2`
- **HeroContent.tsx** line 88: `pt-6 pb-12` to `pt-4 pb-4`
- **HeroScrollIndicator.tsx** line 15: `bottom-8` to `bottom-6`

