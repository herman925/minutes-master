# MinutesMaster AI - CSS Reference

## Theme System

The application uses a dual-theme CSS custom property system with light and dark modes.

### Color Tokens

#### Light Mode
```css
:root {
  /* Core colors for clean, professional workspace */
  --background: oklch(0.98 0.01 110);      /* Very light warm gray */
  --foreground: oklch(0.15 0.02 110);      /* Dark text */
  
  /* Card system */
  --card: oklch(1 0 0);                    /* Pure white */
  --card-foreground: oklch(0.15 0.02 110); /* Dark text on cards */
  
  /* Interactive elements */
  --primary: oklch(0.65 0.2 150);          /* Professional green */
  --primary-foreground: oklch(0.98 0.01 110); /* Light text on primary */
  --secondary: oklch(0.94 0.02 110);       /* Light gray backgrounds */
  --secondary-foreground: oklch(0.15 0.02 110); /* Dark text on secondary */
  
  /* Accent and highlights */
  --accent: oklch(0.7 0.22 155);           /* Bright action color */
  --accent-foreground: oklch(0.1 0.02 110); /* Dark text on accent */
  
  /* System colors */
  --muted: oklch(0.94 0.02 110);           /* Subdued backgrounds */
  --muted-foreground: oklch(0.5 0.02 110); /* Muted text */
  --destructive: oklch(0.58 0.24 25);      /* Error/danger color */
  --destructive-foreground: oklch(0.98 0.01 25); /* Text on destructive */
  
  /* UI elements */
  --border: oklch(0.9 0.02 110);           /* Subtle borders */
  --input: oklch(0.9 0.02 110);            /* Input borders */
  --ring: oklch(0.65 0.2 150);             /* Focus rings */
}
```

#### Dark Mode
```css
.dark {
  /* Rich dark mode palette */
  --background: oklch(0.10 0 0);           /* Very dark background */
  --foreground: oklch(0.95 0 0);           /* Light text */
  
  --card: oklch(0.12 0 0);                 /* Dark cards */
  --card-foreground: oklch(0.95 0 0);      /* Light text on cards */
  
  --primary: oklch(0.85 0 0);              /* Bright neutral primary */
  --primary-foreground: oklch(0.10 0 0);   /* Dark text on primary */
  --secondary: oklch(0.20 0 0);            /* Dark secondary */
  --secondary-foreground: oklch(0.90 0 0); /* Light text on secondary */
  
  --accent: oklch(0.3 0 0);                /* Muted accent for dark mode */
  --accent-foreground: oklch(0.95 0 0);    /* Light text on accent */
  
  --muted: oklch(0.20 0 0);                /* Dark muted backgrounds */
  --muted-foreground: oklch(0.65 0 0);     /* Muted text */
  
  --border: oklch(0.20 0 0);               /* Dark borders */
  --input: oklch(0.20 0 0);                /* Dark input borders */
  --ring: oklch(0.85 0 0);                 /* Light focus rings */
}
```

### Typography System

```css
/* Font families */
--font-sans: 'Inter', sans-serif;         /* Primary UI font */
--font-serif: 'Merriweather', serif;      /* Reading font (not used) */
--font-mono: 'JetBrains Mono', monospace; /* Code/technical font */

/* Usage */
body {
  font-family: var(--font-sans);
  font-feature-settings: 'cv11', 'ss01'; /* Inter stylistic sets */
}

.font-mono {
  font-family: var(--font-mono);
}
```

### Radius System

```css
--radius: 0.5rem; /* Base radius */

/* Mapped to Tailwind */
--radius-sm: calc(var(--radius) * 0.4);   /* 0.2rem */
--radius-md: var(--radius);               /* 0.5rem */
--radius-lg: calc(var(--radius) * 1.3);   /* 0.65rem */
--radius-xl: calc(var(--radius) * 1.8);   /* 0.9rem */
--radius-2xl: calc(var(--radius) * 2.5);  /* 1.25rem */
--radius-full: 9999px;                    /* Full rounded */
```

### Shadow System

Light mode shadows use warm gray tones:
```css
--shadow-xs: 0 1px 3px 0px hsl(240 5% 48% / 0.1), 0 1px 2px 0px hsl(240 5% 48% / 0.06);
--shadow-sm: 0 2px 4px 0px hsl(240 5% 48% / 0.1), 0 2px 2px -1px hsl(240 5% 48% / 0.06);
--shadow-md: 0 10px 15px -3px hsl(240 5% 48% / 0.1), 0 4px 6px -2px hsl(240 5% 48% / 0.05);
--shadow-lg: 0 20px 25px -5px hsl(240 5% 48% / 0.1), 0 10px 10px -5px hsl(240 5% 48% / 0.04);
```

Dark mode shadows use pure black for depth:
```css
--shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px 0px hsl(0 0% 0% / 0.06);
--shadow-sm: 0 2px 4px 0px hsl(0 0% 0% / 0.1), 0 2px 2px -1px hsl(0 0% 0% / 0.06);
--shadow-md: 0 10px 15px -3px hsl(0 0% 0% / 0.1), 0 4px 6px -2px hsl(0 0% 0% / 0.05);
--shadow-lg: 0 20px 25px -5px hsl(0 0% 0% / 0.1), 0 10px 10px -5px hsl(0 0% 0% / 0.04);
```

## Custom Component Classes

### Workspace Layout
```css
.workspace-grid {
  @apply grid h-screen gap-px bg-border;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
}

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

### Content-Specific Classes
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
```

### Utility Classes
```css
.glass-card {
  @apply backdrop-blur-sm bg-card/80 border border-border/50;
}

.gradient-text {
  @apply bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent;
}

.transition-smooth {
  @apply transition-all duration-300 ease-out;
}

.hover-lift:hover {
  @apply transform translate-y-[-2px] shadow-lg;
}

.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2;
}
```

### Custom Scrollbar
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

## Usage Guidelines

### Theme Switching
The application automatically applies the correct theme based on the `dark` class on the `<html>` element:

```javascript
// Apply dark mode
document.documentElement.classList.add('dark')

// Apply light mode
document.documentElement.classList.remove('dark')
```

### Color Usage
- Use `bg-background` for main backgrounds
- Use `bg-card` for elevated surfaces
- Use `bg-primary` for main action buttons
- Use `bg-secondary` for less prominent backgrounds
- Use `bg-accent` for highlight actions
- Use `text-foreground` for primary text
- Use `text-muted-foreground` for secondary text

### Component Styling
All shadcn components automatically use the theme tokens. Custom components should follow the same pattern and use CSS custom properties for consistency.

### Responsive Design
The workspace uses CSS Grid for layout which automatically adapts to different screen sizes. Additional responsive utilities should be applied using Tailwind's responsive prefixes (sm:, md:, lg:, xl:).