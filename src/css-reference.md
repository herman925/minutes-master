# CSS Reference for MinutesMaster AI

## Color System

### Light Mode Colors
```css
--background: oklch(0.98 0.01 110);     /* Main page background - Very light warm gray */
--foreground: oklch(0.15 0.02 110);     /* Primary text color - Dark gray */
--card: oklch(1 0 0);                   /* Card backgrounds - Pure white */
--card-foreground: oklch(0.15 0.02 110); /* Text on cards - Dark gray */
--primary: oklch(0.65 0.2 150);         /* Primary action color - Rich green */
--primary-foreground: oklch(0.98 0.01 110); /* Text on primary - Light */
--secondary: oklch(0.94 0.02 110);      /* Secondary backgrounds - Light gray */
--secondary-foreground: oklch(0.15 0.02 110); /* Text on secondary - Dark gray */
--accent: oklch(0.7 0.22 155);          /* Accent color - Vibrant green */
--accent-foreground: oklch(0.1 0.02 110); /* Text on accent - Very dark */
--muted: oklch(0.94 0.02 110);          /* Muted backgrounds - Light gray */
--muted-foreground: oklch(0.5 0.02 110); /* Muted text - Medium gray */
--border: oklch(0.9 0.02 110);          /* Border color - Light gray */
--destructive: oklch(0.58 0.24 25);     /* Error/danger color - Red */
```

### Dark Mode Colors
```css
--background: oklch(0.10 0 0);          /* Main page background - Very dark */
--foreground: oklch(0.95 0 0);          /* Primary text color - Light gray */
--card: oklch(0.12 0 0);                /* Card backgrounds - Dark gray */
--card-foreground: oklch(0.95 0 0);     /* Text on cards - Light gray */
--primary: oklch(0.85 0 0);             /* Primary action color - Light gray */
--primary-foreground: oklch(0.10 0 0);  /* Text on primary - Dark */
--secondary: oklch(0.20 0 0);           /* Secondary backgrounds - Dark gray */
--secondary-foreground: oklch(0.90 0 0); /* Text on secondary - Light */
--accent: oklch(0.3 0 0);               /* Accent color - Medium gray */
--accent-foreground: oklch(0.95 0 0);   /* Text on accent - Light */
--muted: oklch(0.20 0 0);               /* Muted backgrounds - Dark gray */
--muted-foreground: oklch(0.65 0 0);    /* Muted text - Medium gray */
--border: oklch(0.20 0 0);              /* Border color - Dark gray */
--destructive: oklch(0.5770 0.2450 27.3250); /* Error/danger color - Red */
```

## Typography System

### Font Families
- **Sans Serif**: 'Inter', sans-serif (Primary UI font)
- **Monospace**: 'JetBrains Mono', monospace (Code, technical text)
- **Serif**: 'Merriweather', serif (Formal documents)

### Font Usage Guidelines
- **Body Text**: Use `font-sans` class or Inter font family
- **Code/Technical**: Use `font-mono` class for timestamps, API keys, etc.
- **Formal Documents**: Use `font-serif` for exported minutes

## Layout System

### Main Grid Layout
```css
.main-grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr; /* Left sidebar, center content, right sidebar */
  grid-template-rows: auto 1fr auto; /* Header, main content, footer */
  height: 100vh;
  gap: 1px;
  background-color: var(--border);
}
```

### Panel System
```css
.panel {
  background-color: var(--card);
  padding: 1.5rem;
  overflow-y: auto;
  height: calc(100vh - 8rem); /* Account for header/footer */
}
```

## Component Styles

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

### Transcript Speaker Labels
```css
.transcript-speaker {
  font-weight: 700;
  color: var(--accent-foreground);
  background-color: var(--accent);
  padding: 0.25rem 0.5rem;
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

### Rich Text Editor
```css
.rich-text-editor h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.rich-text-editor ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}
```

## Spacing System

### Border Radius
- **Small**: `calc(var(--radius) * 0.4)` (0.2rem)
- **Medium**: `var(--radius)` (0.5rem)
- **Large**: `calc(var(--radius) * 1.3)` (0.65rem)
- **XL**: `calc(var(--radius) * 1.8)` (0.9rem)

### Shadows
```css
/* Light Mode Shadows */
--shadow-sm: 0 2px 4px 0px hsl(240 5% 48% / 0.1), 0 2px 2px -1px hsl(240 5% 48% / 0.06);
--shadow: 0 4px 6px -1px hsl(240 5% 48% / 0.1), 0 2px 4px -1px hsl(240 5% 48% / 0.06);
--shadow-lg: 0 20px 25px -5px hsl(240 5% 48% / 0.1), 0 10px 10px -5px hsl(240 5% 48% / 0.04);

/* Dark Mode Shadows (more subtle) */
--shadow-sm: 0 2px 4px 0px hsl(0 0% 0% / 0.1), 0 2px 2px -1px hsl(0 0% 0% / 0.06);
--shadow: 0 4px 6px -1px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.06);
--shadow-lg: 0 20px 25px -5px hsl(0 0% 0% / 0.1), 0 10px 10px -5px hsl(0 0% 0% / 0.04);
```

## Interactive Elements

### Custom Scrollbars
```css
.panel::-webkit-scrollbar {
  width: 6px;
}

.panel::-webkit-scrollbar-track {
  background: var(--muted);
  border-radius: 3px;
}

.panel::-webkit-scrollbar-thumb {
  background: var(--muted-foreground);
  border-radius: 3px;
}

.panel::-webkit-scrollbar-thumb:hover {
  background: var(--accent);
}
```

### Theme Toggle
Both light and dark modes are supported with automatic switching based on the `dark` class on the HTML element.

## Utility Classes

### Glassmorphism
```css
.glass-card {
  backdrop-blur-sm;
  background: var(--card) / 80%;
  border: 1px solid var(--border) / 50%;
}
```

### Gradient Text
```css
.gradient-text {
  background: linear-gradient(to right, var(--primary), var(--accent));
  background-clip: text;
  color: transparent;
}
```

### Smooth Transitions
```css
.transition-smooth {
  transition: all 300ms ease-out;
}
```

### Hover Effects
```css
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

## Responsive Breakpoints

The design is optimized for desktop use but includes responsive considerations:

- **Mobile**: Single column layout with collapsible panels
- **Tablet**: Two-column layout (combine left/right panels)
- **Desktop**: Full three-column layout as designed

## Accessibility

### Focus States
All interactive elements include proper focus rings using the `--ring` color variable.

### Color Contrast
All color combinations meet WCAG AA standards for contrast ratios (4.5:1 minimum).

### High Contrast Mode
The design automatically adapts to system high contrast preferences.

---

This reference serves as the single source of truth for all styling decisions in the MinutesMaster AI application.