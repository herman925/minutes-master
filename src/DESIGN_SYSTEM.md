# MinutesMaster AI - Design System

## Theme Architecture

### Light Mode Colors
```css
:root {
  /* Core backgrounds and text */
  --background: oklch(0.98 0.01 110);      /* Warm white background */
  --foreground: oklch(0.15 0.02 110);      /* Deep charcoal text */
  --card: oklch(1 0 0);                    /* Pure white cards */
  --card-foreground: oklch(0.15 0.02 110); /* Card text */

  /* Interactive elements */
  --primary: oklch(0.65 0.2 150);          /* Professional green primary */
  --primary-foreground: oklch(0.98 0.01 110); /* Light text on primary */
  --accent: oklch(0.7 0.22 155);           /* Vibrant green accent */
  --accent-foreground: oklch(0.1 0.02 110); /* Dark text on accent */
  
  /* Supporting colors */
  --secondary: oklch(0.94 0.02 110);       /* Light gray backgrounds */
  --muted: oklch(0.94 0.02 110);           /* Subdued backgrounds */
  --muted-foreground: oklch(0.5 0.02 110); /* Muted text */
  --border: oklch(0.9 0.02 110);           /* Subtle borders */
  --destructive: oklch(0.58 0.24 25);      /* Error red */
}
```

### Dark Mode Colors
```css
.dark {
  /* Core backgrounds and text */
  --background: oklch(0.10 0 0);           /* Rich black background */
  --foreground: oklch(0.95 0 0);           /* Near-white text */
  --card: oklch(0.12 0 0);                 /* Dark gray cards */
  --card-foreground: oklch(0.95 0 0);      /* Light card text */

  /* Interactive elements */
  --primary: oklch(0.85 0 0);              /* Bright gray primary (high contrast) */
  --primary-foreground: oklch(0.10 0 0);   /* Dark text on bright primary */
  --accent: oklch(0.3 0 0);                /* Subdued accent for dark mode */
  --accent-foreground: oklch(0.95 0 0);    /* Light text on accent */
  
  /* Supporting colors */
  --secondary: oklch(0.20 0 0);            /* Dark secondary */
  --muted: oklch(0.20 0 0);                /* Dark muted backgrounds */
  --muted-foreground: oklch(0.65 0 0);     /* Mid-gray muted text */
  --border: oklch(0.20 0 0);               /* Dark borders */
}
```

## Layout System

### Workspace Grid
The professional workspace uses a 3-column grid layout:
```css
.workspace-grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;  /* Left sidebar, main content, right sidebar */
  grid-template-rows: auto 1fr auto;   /* Header, content, footer */
  height: 100vh;
  gap: 1px;
  background-color: var(--border);
}
```

### Panel Components
- **workspace-panel**: Standard panel with padding and scrolling
- **workspace-header**: Full-width header spanning all columns
- **workspace-footer**: Full-width footer spanning all columns
- **panel-header**: Section headers within panels (monospace, uppercase)

## Typography

### Font Stack
```css
--font-sans: 'Inter', sans-serif;        /* Primary interface font */
--font-mono: 'JetBrains Mono', monospace; /* Code and technical text */
```

### Key Typography Classes
- `.gradient-text`: Primary to accent gradient text effect
- `.transcript-speaker`: Speaker names in transcripts (bold, monospace, primary color)
- `.panel-header`: Uppercase, tracked headers for panel sections
- `.rich-text-editor`: Content area styling with proper heading hierarchy

## Component Patterns

### Cards and Surfaces
```css
.card-shadow {
  box-shadow: 
    0 1px 3px 0 rgb(0 0 0 / 0.1), 
    0 1px 2px -1px rgb(0 0 0 / 0.1),
    0 0 0 1px rgb(0 0 0 / 0.05);
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
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

### Content Styling
- **Transcript speakers**: Bold monospace font with primary color
- **Rich text areas**: Proper heading hierarchy with list styling
- **File uploads**: Drag-and-drop zones with hover states

## Animation & Interaction

### Smooth Transitions
```css
.transition-smooth {
  transition: all 300ms ease-out;
}
```

### Hover Effects
- Cards lift slightly on hover
- Buttons have subtle scale and shadow changes
- Color transitions use the defined color palette

## Accessibility

### Focus States
- All interactive elements have visible focus rings
- Focus rings use `--ring` color for consistency
- High contrast ratios maintained across themes

### Color Contrast
- **Light mode**: 4.5:1 minimum contrast ratio
- **Dark mode**: Optimized for OLED displays with true blacks
- Color is never the only way information is conveyed

## Usage Guidelines

### Theme Switching
Toggle between light and dark modes by adding/removing the `dark` class on the document root element.

### Component Composition
1. Use semantic color names (primary, secondary, etc.) not specific colors
2. Leverage the shadow system for consistent depth
3. Follow the typography hierarchy for information architecture
4. Use workspace-specific classes for layout components

### Brand Colors
- **Primary green**: Professional, trustworthy, used for main actions
- **Accent green**: Vibrant, attention-grabbing, used for highlights
- **Neutrals**: Support the content without competing for attention