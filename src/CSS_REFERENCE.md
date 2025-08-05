# CSS Reference - MinutesMaster AI

## Color System & Theme Documentation

This document outlines the complete color system, theme structure, and design tokens used in MinutesMaster AI.

### Light Mode Color Palette

#### Primary Colors
```css
--background: oklch(0.98 0.01 110);      /* Warm white background */
--foreground: oklch(0.15 0.02 110);      /* Deep charcoal text */
--card: oklch(1 0 0);                    /* Pure white cards */
--card-foreground: oklch(0.15 0.02 110); /* Card text color */
```

#### Interactive Colors
```css
--primary: oklch(0.65 0.2 150);          /* Rich green primary action */
--primary-foreground: oklch(0.98 0.01 110); /* White text on primary */
--accent: oklch(0.7 0.22 155);           /* Vibrant green accent */
--accent-foreground: oklch(0.1 0.02 110); /* Dark text on accent */
--secondary: oklch(0.94 0.02 110);       /* Light gray secondary */
--secondary-foreground: oklch(0.15 0.02 110); /* Dark text on secondary */
```

#### System Colors
```css
--muted: oklch(0.94 0.02 110);           /* Muted background */
--muted-foreground: oklch(0.5 0.02 110); /* Muted text */
--destructive: oklch(0.58 0.24 25);      /* Red for destructive actions */
--destructive-foreground: oklch(0.98 0.01 25); /* Light text on destructive */
--border: oklch(0.9 0.02 110);           /* Subtle borders */
--input: oklch(0.9 0.02 110);            /* Input borders */
--ring: oklch(0.65 0.2 150);             /* Focus ring color */
```

### Dark Mode Color Palette

#### Primary Colors
```css
--background: oklch(0.10 0 0);           /* Deep black background */
--foreground: oklch(0.95 0 0);           /* Near-white text */
--card: oklch(0.12 0 0);                 /* Dark gray cards */
--card-foreground: oklch(0.95 0 0);      /* Light card text */
```

#### Interactive Colors
```css
--primary: oklch(0.85 0 0);              /* Bright gray primary (high contrast) */
--primary-foreground: oklch(0.10 0 0);   /* Dark text on bright primary */
--accent: oklch(0.3 0 0);                /* Subdued accent for dark mode */
--accent-foreground: oklch(0.95 0 0);    /* Light text on accent */
--secondary: oklch(0.20 0 0);            /* Dark secondary */
--secondary-foreground: oklch(0.90 0 0); /* Light text on secondary */
```

#### System Colors
```css
--muted: oklch(0.20 0 0);                /* Dark muted background */
--muted-foreground: oklch(0.65 0 0);     /* Mid-gray muted text */
--destructive: oklch(0.5770 0.2450 27.3250); /* Red for destructive actions */
--destructive-foreground: oklch(1 0 0);  /* White text on destructive */
--border: oklch(0.20 0 0);               /* Dark borders */
--input: oklch(0.20 0 0);                /* Dark input borders */
--ring: oklch(0.85 0 0);                 /* Bright focus ring */
```

### Chart Colors

#### Light Mode Charts
```css
--chart-1: oklch(0.65 0.2 150);          /* Primary chart color */
--chart-2: oklch(0.7 0.22 155);          /* Secondary chart color */
--chart-3: oklch(0.55 0.18 145);         /* Tertiary chart color */
--chart-4: oklch(0.75 0.24 160);         /* Quaternary chart color */
--chart-5: oklch(0.6 0.19 148);          /* Quinary chart color */
```

#### Dark Mode Charts
```css
--chart-1: oklch(0.8100 0.1000 252);     /* Blue chart color */
--chart-2: oklch(0.6200 0.1900 260);     /* Purple chart color */
--chart-3: oklch(0.5500 0.2200 263);     /* Deep purple chart color */
--chart-4: oklch(0.4900 0.2200 264);     /* Darker purple chart color */
--chart-5: oklch(0.4200 0.1800 266);     /* Darkest purple chart color */
```

### Typography System

#### Font Families
```css
--font-sans: 'Inter', sans-serif;        /* Primary text font */
--font-serif: 'Merriweather', serif;     /* Heading font option */
--font-mono: 'JetBrains Mono', monospace; /* Code/data font */
```

#### Font Loading (HTML Head)
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
```

### Layout & Spacing

#### Border Radius System
```css
--radius: 0.5rem;                        /* Base radius (8px) */
--radius-sm: calc(var(--radius) * 0.4);  /* Small radius (3.2px) */
--radius-md: var(--radius);              /* Medium radius (8px) */
--radius-lg: calc(var(--radius) * 1.3);  /* Large radius (10.4px) */
--radius-xl: calc(var(--radius) * 1.8);  /* Extra large radius (14.4px) */
--radius-2xl: calc(var(--radius) * 2.5); /* 2XL radius (20px) */
--radius-full: 9999px;                   /* Full circle */
```

#### Shadow System

##### Light Mode Shadows
```css
--shadow-2xs: 0 1px 2px 0px hsl(240 5% 48% / 0.05);
--shadow-xs: 0 1px 3px 0px hsl(240 5% 48% / 0.1), 0 1px 2px 0px hsl(240 5% 48% / 0.06);
--shadow-sm: 0 2px 4px 0px hsl(240 5% 48% / 0.1), 0 2px 2px -1px hsl(240 5% 48% / 0.06);
--shadow: 0 4px 6px -1px hsl(240 5% 48% / 0.1), 0 2px 4px -1px hsl(240 5% 48% / 0.06);
--shadow-md: 0 10px 15px -3px hsl(240 5% 48% / 0.1), 0 4px 6px -2px hsl(240 5% 48% / 0.05);
--shadow-lg: 0 20px 25px -5px hsl(240 5% 48% / 0.1), 0 10px 10px -5px hsl(240 5% 48% / 0.04);
--shadow-xl: 0 25px 50px -12px hsl(240 5% 48% / 0.25);
--shadow-2xl: 0 35px 60px -15px hsl(240 5% 48% / 0.3);
```

##### Dark Mode Shadows (More Subtle)
```css
--shadow-2xs: 0 1px 2px 0px hsl(0 0% 0% / 0.05);
--shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px 0px hsl(0 0% 0% / 0.06);
--shadow-sm: 0 2px 4px 0px hsl(0 0% 0% / 0.1), 0 2px 2px -1px hsl(0 0% 0% / 0.06);
--shadow: 0 4px 6px -1px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.06);
--shadow-md: 0 10px 15px -3px hsl(0 0% 0% / 0.1), 0 4px 6px -2px hsl(0 0% 0% / 0.05);
--shadow-lg: 0 20px 25px -5px hsl(0 0% 0% / 0.1), 0 10px 10px -5px hsl(0 0% 0% / 0.04);
--shadow-xl: 0 25px 50px -12px hsl(0 0% 0% / 0.25);
--shadow-2xl: 0 35px 60px -15px hsl(0 0% 0% / 0.3);
```

### Sidebar Colors

#### Light Mode Sidebar
```css
--sidebar: oklch(0.96 0.01 110);         /* Light sidebar background */
--sidebar-foreground: oklch(0.15 0.02 110); /* Dark sidebar text */
--sidebar-primary: oklch(0.65 0.2 150);  /* Sidebar primary color */
--sidebar-primary-foreground: oklch(0.98 0.01 110); /* Text on sidebar primary */
--sidebar-accent: oklch(0.7 0.22 155);   /* Sidebar accent */
--sidebar-accent-foreground: oklch(0.1 0.02 110); /* Text on sidebar accent */
--sidebar-border: oklch(0.9 0.02 110);   /* Sidebar borders */
--sidebar-ring: oklch(0.65 0.2 150);     /* Sidebar focus ring */
```

#### Dark Mode Sidebar
```css
--sidebar: oklch(0.12 0 0);              /* Dark sidebar background */
--sidebar-foreground: oklch(0.95 0 0);   /* Light sidebar text */
--sidebar-primary: oklch(0.85 0 0);      /* Bright sidebar primary */
--sidebar-primary-foreground: oklch(0.10 0 0); /* Dark text on bright primary */
--sidebar-accent: oklch(0.3 0 0);        /* Muted sidebar accent */
--sidebar-accent-foreground: oklch(0.95 0 0); /* Light text on accent */
--sidebar-border: oklch(0.20 0 0);       /* Dark sidebar borders */
--sidebar-ring: oklch(0.85 0 0);         /* Bright sidebar focus ring */
```

## Utility Classes

### Custom Component Classes

#### Glassmorphism Effects
```css
.glass-card {
  @apply backdrop-blur-sm bg-card/80 border border-border/50;
}
```

#### Gradient Text
```css
.gradient-text {
  @apply bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent;
}
```

#### Enhanced Shadows
```css
.card-shadow {
  box-shadow: 
    0 1px 3px 0 rgb(0 0 0 / 0.1), 
    0 1px 2px -1px rgb(0 0 0 / 0.1),
    0 0 0 1px rgb(0 0 0 / 0.05);
}

.card-shadow-lg {
  box-shadow: 
    0 10px 15px -3px rgb(0 0 0 / 0.1), 
    0 4px 6px -4px rgb(0 0 0 / 0.1),
    0 0 0 1px rgb(0 0 0 / 0.05);
}
```

#### Smooth Transitions
```css
.transition-smooth {
  @apply transition-all duration-300 ease-out;
}
```

#### Hover Effects
```css
.hover-lift:hover {
  @apply transform translate-y-[-2px] shadow-lg;
}
```

#### Focus States
```css
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2;
}
```

### Workspace-Specific Classes

#### Grid Layout
```css
.workspace-grid {
  @apply grid h-screen gap-px bg-border;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
}
```

#### Panel Styling
```css
.workspace-panel {
  @apply bg-card p-6 overflow-y-auto custom-scrollbar;
}

.workspace-header {
  @apply bg-card border-b border-border flex items-center justify-between px-6 py-3;
  grid-column: 1 / 4;
}

.workspace-footer {
  @apply bg-card border-t border-border flex items-center justify-between px-6 py-2 text-sm;
  grid-column: 1 / 4;
}
```

#### Content Styling
```css
.panel-header {
  @apply font-mono text-sm uppercase tracking-wide text-muted-foreground mb-4 pb-2 border-b border-border;
}

.transcript-speaker {
  @apply font-bold text-primary font-mono;
}

.dictionary-term {
  @apply bg-secondary p-4 rounded-lg border border-border mb-4;
}

.rich-text-editor h2 {
  @apply text-xl font-semibold mt-6 mb-2;
}

.rich-text-editor ul {
  @apply list-disc pl-6;
}

.rich-text-editor li {
  @apply mb-1;
}
```

### Custom Scrollbar

#### Theme-Aware Scrollbar
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

## OKLCH Color Explanation

OKLCH (Lightness, Chroma, Hue) is a modern color space that provides:

- **Lightness (L)**: 0-1 scale where 0 is black, 1 is white
- **Chroma (C)**: Color intensity/saturation (0 = gray, higher = more vivid)
- **Hue (H)**: Color wheel position in degrees (0-360)

### Benefits of OKLCH
1. **Perceptual uniformity**: Equal changes in values produce equal visual changes
2. **Predictable lightness**: Easy to create color variants with consistent brightness
3. **Wide gamut**: Supports modern display capabilities
4. **Future-proof**: Works with P3 displays and beyond

### Usage Examples
```css
/* High lightness, low chroma, green hue = light green */
--primary: oklch(0.65 0.2 150);

/* Very low lightness, no chroma = near black */
--background: oklch(0.10 0 0);

/* High lightness, no chroma = near white */
--foreground: oklch(0.95 0 0);
```

## Theme Implementation Notes

### Switching Between Light and Dark
The theme system uses CSS custom properties and a class-based approach:

```javascript
// JavaScript theme switching
const applyTheme = (theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
```

### Fallback Strategy
All colors use OKLCH with automatic fallbacks to RGB for older browsers:

```css
/* Modern browsers get OKLCH */
--primary: oklch(0.65 0.2 150);

/* Older browsers fall back to RGB equivalent */
/* (handled automatically by browser engine) */
```

### Accessibility Considerations

#### Contrast Ratios
- **Background to Foreground**: 4.5:1 minimum (WCAG AA)
- **Primary to Primary-Foreground**: 4.5:1 minimum
- **Accent to Accent-Foreground**: 4.5:1 minimum

#### Focus Indicators
- All interactive elements have visible focus states
- Focus rings use appropriate contrast against backgrounds
- Focus styles are consistent across light and dark modes

#### Color Dependencies
- Information is never conveyed through color alone
- Text labels accompany color-coded elements
- Icons provide additional context where needed

## Performance Considerations

### CSS Custom Properties
- Defined once at root level for efficiency
- Leverages browser native theming capabilities
- Minimal JavaScript required for theme switching

### Shadow Optimization
- Uses modern CSS shadow syntax for better performance
- Shadows are pre-defined rather than calculated at runtime
- Different shadow sets for light/dark to optimize visual impact

### Font Loading
- Uses `font-display: swap` for better perceived performance
- Preconnects to Google Fonts for faster loading
- Fallback fonts defined for graceful degradation