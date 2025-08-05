# CSS Design System Reference

## Color Palette

### Light Mode
- **Background**: `oklch(0.98 0.01 110)` - Soft, warm white
- **Foreground**: `oklch(0.15 0.02 110)` - Dark gray text
- **Card**: `oklch(1 0 0)` - Pure white cards
- **Primary**: `oklch(0.65 0.2 150)` - Professional green
- **Secondary**: `oklch(0.94 0.02 110)` - Light gray
- **Accent**: `oklch(0.7 0.22 155)` - Vibrant green
- **Border**: `oklch(0.9 0.02 110)` - Subtle borders

### Dark Mode
- **Background**: `oklch(0.10 0 0)` - Deep black
- **Foreground**: `oklch(0.95 0 0)` - Bright white text
- **Card**: `oklch(0.12 0 0)` - Dark gray cards
- **Primary**: `oklch(0.85 0 0)` - Bright white for contrast
- **Secondary**: `oklch(0.20 0 0)` - Medium gray
- **Accent**: `oklch(0.3 0 0)` - Muted gray
- **Border**: `oklch(0.20 0 0)` - Dark borders

## Typography

### Font Families
- **Sans**: 'Inter', sans-serif (primary)
- **Mono**: 'JetBrains Mono', monospace (code/technical)
- **Serif**: 'Merriweather', serif (decorative)

### Font Scales
- **Panel Headers**: 0.875rem, uppercase, mono font
- **Rich Text H2**: 1.5rem, font-weight 600
- **Body Text**: 1rem (default)
- **Small Text**: 0.875rem

## Layout System

### Workspace Grid
```css
.main-grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
  gap: 1px;
  background-color: var(--border);
}
```

### Panel Structure
- **Left Panel**: Transcript input/display
- **Center Panel**: Generated minutes (2x width)
- **Right Panel**: Dictionary & instructions tabs
- **Header**: Full width navigation
- **Footer**: Status and actions

## Component Styles

### Transcript Speaker Tags
```css
.transcript-speaker {
  font-weight: 700;
  color: var(--accent-foreground);
  background-color: var(--accent);
  padding: 0.1rem 0.4rem;
  border-radius: 0.25rem;
  font-family: var(--font-mono);
  display: inline-block;
}
```

### Dictionary Terms
```css
.dictionary-term {
  background-color: var(--secondary);
  padding: 1rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  margin-bottom: 1rem;
}
```

### Panel Headers
```css
.panel-header {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted-foreground);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
}
```

## Custom Scrollbars

### Theme-Aware Scrollbars
```css
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--muted-foreground) var(--muted);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: var(--muted);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--muted-foreground);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--accent);
}
```

## Shadows & Effects

### Light Mode Shadows
- **Card Shadow**: `0 1px 3px 0 rgb(0 0 0 / 0.1)`
- **Large Shadow**: `0 10px 15px -3px rgb(0 0 0 / 0.1)`

### Dark Mode Shadows
- **Subtle shadows**: Lower opacity, pure black base
- **Enhanced for depth**: `0 25px 50px -12px hsl(0 0% 0% / 0.25)`

## Interactive States

### Hover Effects
- **Buttons**: Slight opacity change (90%)
- **Cards**: Transform translate-y(-2px) with shadow
- **Navigation**: Background color shift to accent

### Focus States
- **Ring**: 2px ring using primary color
- **Offset**: 2px offset from element

## Responsive Behavior

### Grid Adaptation
- Large screens: 3-column layout (1fr 2fr 1fr)
- Medium screens: Collapsible side panels
- Small screens: Single column with tabs

### Typography Scaling
- Headers maintain relative sizes
- Body text minimum 16px on mobile
- Touch targets minimum 44px

## Animation Guidelines

### Transition Timing
- **Quick Actions**: 100-150ms
- **State Changes**: 200-300ms
- **Page Transitions**: 300-500ms

### Easing Functions
- **Default**: ease-out
- **Micro-interactions**: cubic-bezier(0.16, 1, 0.3, 1)
- **Content slides**: ease-in-out

## Accessibility Features

### Color Contrast
- **WCAG AA compliance**: 4.5:1 for normal text
- **Large text**: 3:1 minimum ratio
- **Focus indicators**: High contrast borders

### Keyboard Navigation
- **Tab order**: Logical flow through interface
- **Focus visible**: Clear focus indicators
- **Skip links**: For main content areas

## Usage Examples

### Creating a Panel
```tsx
<aside className="panel">
  <h2 className="panel-header">Panel Title</h2>
  <div className="space-y-4">
    {/* Panel content */}
  </div>
</aside>
```

### Transcript Display
```tsx
<div className="space-y-6 text-sm">
  <div>
    <p className="transcript-speaker">Jane (00:02):</p>
    <p className="text-muted-foreground mt-1">"Meeting content here"</p>
  </div>
</div>
```

### Dictionary Entry
```tsx
<div className="dictionary-term">
  <p className="font-semibold">Term</p>
  <p className="text-sm text-muted-foreground">Definition here</p>
</div>
```