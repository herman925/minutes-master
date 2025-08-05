# MinutesMaster AI - CSS Reference

The application

#### Light Mode

  --background: 

#### Light Mode
```css
:root {
  /* Core colors for clean, professional workspace */
  --background: oklch(0.98 0.01 110);      /* Very light warm gray */
  --foreground: oklch(0.15 0.02 110);      /* Dark text */
  
  /* Card system */
  --destructive: oklch(0.58 0.24 25);      /* Error/danger 
  
  
  --ring: oklch(0.65 0.2 150
```
#### Dark Mode
.dark {
  --background: oklch(0.10 0 0);           /* Very dark background */
  
  --card-foreground: oklch(0.
  --primary: oklch(0.85 0 0);              /* Bright neutral primary
  --secondary: oklch(0.20 0 0);            /* Dark secondary */
  
  --accent-foreground
  --muted: oklch(0.20 0 0);                /* Dark muted backgrounds
  
  --input: oklch(0.20 0 0);                /* Dark input borders */
}


/* Font families */
--font-serif: 'Merriweather', serif;      /* Reading font (not

}
.fo

#### Dark Mode
### Ra
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
  grid-column: 1 / 4;
--radius-md: var(--radius);               /* 0.5rem */
--radius-lg: calc(var(--radius) * 1.3);   /* 0.65rem */
--radius-xl: calc(var(--radius) * 1.8);   /* 0.9rem */
.panel-header {
--radius-full: 9999px;                    /* Full rounded */


### Shadow System

  @apply bg-secondary p-4 rounded-lg bo
```css
--shadow-xs: 0 1px 3px 0px hsl(240 5% 48% / 0.1), 0 1px 2px 0px hsl(240 5% 48% / 0.06);
--shadow-sm: 0 2px 4px 0px hsl(240 5% 48% / 0.1), 0 2px 2px -1px hsl(240 5% 48% / 0.06);
--shadow-md: 0 10px 15px -3px hsl(240 5% 48% / 0.1), 0 4px 6px -2px hsl(240 5% 48% / 0.05);
--shadow-lg: 0 20px 25px -5px hsl(240 5% 48% / 0.1), 0 10px 10px -5px hsl(240 5% 48% / 0.04);
}

Dark mode shadows use pure black for depth:
```css
--shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px 0px hsl(0 0% 0% / 0.06);
--shadow-sm: 0 2px 4px 0px hsl(0 0% 0% / 0.1), 0 2px 2px -1px hsl(0 0% 0% / 0.06);
--shadow-md: 0 10px 15px -3px hsl(0 0% 0% / 0.1), 0 4px 6px -2px hsl(0 0% 0% / 0.05);
--shadow-lg: 0 20px 25px -5px hsl(0 0% 0% / 0.1), 0 10px 10px -5px hsl(0 0% 0% / 0.04);
```

}

  @apply transform t
```css
.workspace-grid {
  @apply grid h-screen gap-px bg-border;
```
  grid-template-rows: auto 1fr auto;
`

  scrollbar-color:
  @apply bg-card p-6 overflow-y-auto custom-scrollbar;
.

.workspace-header {
  @apply bg-card border-b border-border flex items-center justify-between px-6 py-3;
  grid-column: 1 / 4;
 

.workspace-footer {
  @apply bg-card border-t border-border flex items-center justify-between px-6 py-2 text-sm;
  grid-column: 1 / 4;
}
```

### Content-Specific Classes
### Th
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
All shadcn components automatically use t
}

.rich-text-editor ul {
  @apply list-disc pl-6;
}













































































