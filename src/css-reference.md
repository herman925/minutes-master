# MinutesMaster AI - CSS Design System Reference

## Overview

This document outlines the comprehensive CSS design system for MinutesMaster AI, featuring both light and dark modes with a modern, professional aesthetic optimized for productivity and accessibility.

## Color System

### Light Mode Colors

#### Primary Colors
- `--background: oklch(0.98 0.01 110)` - Main background (near white with warm hint)
- `--foreground: oklch(0.15 0.02 110)` - Primary text (dark gray-green)
- `--card: oklch(1 0 0)` - Pure white for cards and surfaces
- `--card-foreground: oklch(0.15 0.02 110)` - Text on cards

#### Action Colors
- `--primary: oklch(0.65 0.2 150)` - Professional green primary
- `--primary-foreground: oklch(0.98 0.01 110)` - Text on primary (light)
- `--accent: oklch(0.7 0.22 155)` - Vibrant accent green
- `--accent-foreground: oklch(0.1 0.02 110)` - Text on accent (dark)

#### Supporting Colors
- `--secondary: oklch(0.94 0.02 110)` - Light gray backgrounds
- `--muted: oklch(0.94 0.02 110)` - Subdued backgrounds
- `--muted-foreground: oklch(0.5 0.02 110)` - Secondary text
- `--border: oklch(0.9 0.02 110)` - Subtle borders
- `--destructive: oklch(0.58 0.24 25)` - Error red

### Dark Mode Colors

#### Primary Colors
- `--background: oklch(0.10 0 0)` - Rich black background
- `--foreground: oklch(0.95 0 0)` - Near white text
- `--card: oklch(0.12 0 0)` - Slightly lighter dark surface
- `--card-foreground: oklch(0.95 0 0)` - Text on dark cards

#### Action Colors
- `--primary: oklch(0.85 0 0)` - Bright neutral primary for contrast
- `--primary-foreground: oklch(0.10 0 0)` - Dark text on bright primary
- `--accent: oklch(0.3 0 0)` - Muted accent for dark backgrounds
- `--accent-foreground: oklch(0.95 0 0)` - Light text on accent

#### Supporting Colors
- `--secondary: oklch(0.20 0 0)` - Dark gray backgrounds
- `--muted: oklch(0.20 0 0)` - Subdued dark backgrounds
- `--muted-foreground: oklch(0.65 0 0)` - Medium gray text
- `--border: oklch(0.20 0 0)` - Dark borders
- `--destructive: oklch(0.5770 0.2450 27.3250)` - Consistent error red

## Typography System

### Font Families
- `--font-sans: 'Inter', sans-serif` - Primary interface font
- `--font-serif: 'Merriweather', serif` - Heading emphasis font
- `--font-mono: 'JetBrains Mono', monospace` - Code and technical text

### Typography Classes
- `.font-mono` - Monospace font for technical content
- `.gradient-text` - Gradient text effect using primary to accent colors
- `.text-xs` through `.text-5xl` - Size hierarchy
- `.font-medium`, `.font-semibold`, `.font-bold` - Weight variations

## Layout System

### Workspace Grid Layout
```css
.workspace-grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr; /* Left sidebar, main content, right sidebar */
  grid-template-rows: auto 1fr auto; /* Header, content, footer */
  height: 100vh;
  gap: 1px;
  background-color: var(--border);
}
```

### Panel System
- `.workspace-panel` - Standard panel styling with padding and scrolling
- `.workspace-header` - Full-width header spanning all columns
- `.workspace-footer` - Full-width footer spanning all columns
- `.panel-header` - Section headers within panels

## Component Styles

### Cards
- `.card-shadow` - Standard card shadow with subtle border
- `.card-shadow-lg` - Enhanced shadow for elevated cards
- `.glass-card` - Glassmorphism effect with backdrop blur
- `.hover-lift` - Lift animation on hover

### Interactive Elements
- `.transition-smooth` - Consistent 300ms transition
- `.focus-ring` - Accessible focus states
- `.hover-lift:hover` - Subtle upward movement and shadow increase

### Content Areas
- `.rich-text-editor` - Styling for editable content areas
- `.transcript-speaker` - Speaker name formatting in transcripts
- `.dictionary-term` - Dictionary entry card styling

## Spacing & Layout

### Border Radius
- `--radius: 0.5rem` - Base radius (8px)
- `--radius-sm: calc(var(--radius) * 0.4)` - Small radius (3.2px)
- `--radius-lg: calc(var(--radius) * 1.3)` - Large radius (10.4px)
- `--radius-xl: calc(var(--radius) * 1.8)` - Extra large radius (14.4px)
- `--radius-full: 9999px` - Fully rounded

### Shadow System
Progressive shadow system with both light and dark mode variants:
- `--shadow-2xs` through `--shadow-2xl` - Increasing shadow intensity
- Dark mode uses black-based shadows for depth
- Light mode uses gray-based shadows for subtlety

## Accessibility Features

### Focus Management
- Consistent focus ring styling using `--ring` color
- Keyboard navigation support with visible focus states
- High contrast ratios meeting WCAG AA standards

### Color Contrast
- Light mode: Dark text (oklch 0.15) on light backgrounds (oklch 0.98+)
- Dark mode: Light text (oklch 0.95) on dark backgrounds (oklch 0.12-)
- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 contrast ratio for large text

### Responsive Design
- Grid layout adapts to screen size
- Panels collapse or stack on smaller screens
- Touch-friendly minimum 44px touch targets

## Animation & Motion

### Transitions
- `.transition-smooth` - 300ms ease-out for most interactions
- Hover states use `transform` for hardware acceleration
- Progressive enhancement - animations enhance but don't block functionality

### Micro-interactions
- Button hover states with subtle scale and shadow changes
- Loading states with rotating spinners
- Smooth tab transitions and panel switches

## Utility Classes

### Custom Utilities
- `.custom-scrollbar` - Themed scrollbar styling
- `.gradient-text` - Primary to accent gradient text
- `.workspace-*` - Workspace-specific layout classes

### State Management
- Theme switching handled via `.dark` class on document root
- All colors use CSS custom properties for automatic theme switching
- Consistent behavior across all components

## Usage Guidelines

### Theme Implementation
1. Apply `.dark` class to `<html>` or `<body>` for dark mode
2. All colors automatically switch via CSS custom properties
3. Test both themes for accessibility and usability

### Component Composition
1. Use semantic color names (primary, secondary, etc.) not specific colors
2. Leverage the shadow system for consistent depth
3. Follow the typography hierarchy for information architecture

### Performance Considerations
1. Shadows use hardware acceleration where possible
2. Transitions are optimized for 60fps performance
3. Color calculations are done at build time, not runtime

## Browser Support

- Modern browsers with CSS custom properties support
- Fallbacks provided for older browsers where critical
- Progressive enhancement approach for advanced features