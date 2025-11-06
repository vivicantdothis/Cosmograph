# Design Guidelines: Synesthetic Number Universe

## Design Approach
**Reference-Based**: Vintage-inspired aesthetic matching the provided reference image with modern minimalist execution. The design draws from the attached image's elegant, nostalgic aesthetic while maintaining clean, functional interactivity.

## Typography
- **Headings**: Elegant script font (closest to reference image - use Pinyon Script, Great Vibes, or similar decorative script via Google Fonts)
- **Body Text**: Clean, modern sans-serif (Inter, Source Sans Pro)
- **Planet Descriptions/Quotes**: Lighter script or italic serif for whimsical explorer quotes
- **Technical Data**: Monospace font for edge weights and numerical data

## Core Visual Identity

**Color Palette** (Vintage-Inspired):
- Background: Olive green with subtle texture/grain
- Planets: Cohesive muted pastel scheme (sage green, dusty rose, soft lavender, muted ochre, powder blue)
- Sun: Warm glowing yellow with soft radial gradient
- Stars/Stardust: Off-white/cream with very subtle twinkle
- Text: Cream/off-white for primary, darker olive for contrast
- Panel: Semi-transparent cream/beige overlay

## Layout System
**Spacing**: Use Tailwind units of 4, 6, 8, 12, 16 for consistent rhythm

### Landing Page
- Full viewport hero section with olive green textured background
- Centered content: Large script title, elegant subtitle, prominent CTA
- Vintage decorative border elements (subtle flourishes)
- Minimal navigation if needed

### Universe Page
- Full-screen canvas (100vw x 100vh)
- Sun positioned center (slightly above vertical center for visual balance)
- Transparent input box overlaying sun area
- Side panel slides in from right (400px width, semi-transparent backdrop)

## Component Library

### Solar System Visualization
- **Sun**: 120px diameter, glowing yellow gradient with subtle pulsing animation
- **Planets**: Variable sizes (20-60px diameter based on number properties)
- **Orbits**: Faint circular paths, slower rotation (15-45s per orbit depending on distance)
- **Input Box**: Transparent background with subtle border, centered near sun, 200px wide
- **Background**: Faint star dust particles with minimal twinkle effect (slower, more subtle than typical)

### Side Panel
- Width: 400px, slides from right
- Background: Semi-transparent cream/beige (rgba with backdrop blur)
- Sections: Planet graphic at top (150px), number title, whimsical description/quote, properties grid, shortest path visualization with edge weights
- Planet Graphic: Circular representation matching orbit planet
- Close button: Top-right corner, minimal "×" symbol

### Shortest Path Visualization
- Visual graph showing connected planets
- Lines connecting nodes with edge weights displayed
- Active path highlighted in accent color
- Compact, diagram-style representation

## Animation Guidelines
**Minimal & Purposeful**:
- Planet orbits: Slow, continuous rotation (CSS transforms)
- Stars: Very subtle twinkle (opacity fade, 3-5s intervals)
- Panel: Smooth slide-in transition (300ms)
- Input: Gentle focus glow
- NO hover effects on planets (click only)
- NO excessive particle effects

## Images
**No hero images required** - The design uses canvas-based solar system visualization as the primary visual element. The vintage textured background provides the aesthetic foundation.

## Accessibility
- Ensure input box has clear focus state despite transparency
- Planet click targets minimum 40px (invisible padding if needed)
- Keyboard navigation for panel (Escape to close)
- Text contrast maintains WCAG AA standards against semi-transparent backgrounds

## Key Design Principles
1. **Vintage Meets Modern**: Nostalgic aesthetic with contemporary UX patterns
2. **Whimsical Professionalism**: Playful descriptions with clean data presentation
3. **Minimal Motion**: Slow, contemplative animations matching cosmic theme
4. **Cohesive Color Story**: Unified muted palette across all planets
5. **Functional Beauty**: Every visual element serves the data visualization purpose