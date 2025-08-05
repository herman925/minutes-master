# CSS Reference for MinutesMaster AI

This document provides a comprehensive reference for the design system and CSS variables used in MinutesMaster AI.

## Color System

Our application uses OKLCH color space for better perceptual uniformity and advanced color manipulation.

### Light Theme Colors
```css
:root {
  /* Base colors that define the core visual identity */
  --background: oklch(0.98 0.01 110);     /* Warm white page background */
  --foreground: oklch(0.15 0.02 110);     /* Deep charcoal primary text */
  
  --card: oklch(1 0 0);                   /* Pure white card background */
  --card-foreground: oklch(0.15 0.02 110); /* Text on card background */
  --popover: oklch(1 0 0);                /* Popover background */
  --popover-foreground: oklch(0.15 0.02 110); /* Text on popover */
  
  /* Action colors that represent interactive elements */
  --primary: oklch(0.65 0.2 150);         /* Main brand/action color (professional green) */
  --primary-foreground: oklch(0.98 0.01 110); /* Text on primary color */
  --secondary: oklch(0.94 0.02 110);      /* Supporting color (light gray) */
  --secondary-foreground: oklch(0.15 0.02 110); /* Text on secondary color */
  --accent: oklch(0.7 0.22 155);          /* Highlight color (vibrant green) */
  --accent-foreground: oklch(0.1 0.02 110); /* Text on accent color */
  
  /* Supporting UI colors for various states and elements */
  --muted: oklch(0.94 0.02 110);          /* Subdued background for de-emphasized content */
  --muted-foreground: oklch(0.5 0.02 110); /* Muted text color */
  --destructive: oklch(0.58 0.24 25);     /* Warning color for dangerous actions */
  --destructive-foreground: oklch(0.98 0.01 25); /* Text on destructive color */
  
  /* Interface structure colors */
  --border: oklch(0.9 0.02 110);          /* Border color for dividers */
  --input: oklch(0.9 0.02 110);           /* Input border color */
  --ring: oklch(0.65 0.2 150);            /* Focus indicator color */
  
  /* Chart colors for data visualization */
  --chart-1: oklch(0.65 0.2 150);         /* Primary chart color */
  --chart-2: oklch(0.7 0.22 155);         /* Secondary chart color */
  --chart-3: oklch(0.55 0.18 145);        /* Tertiary chart color */
  --chart-4: oklch(0.75 0.24 160);        /* Quaternary chart color */
  --chart-5: oklch(0.6 0.19 148);         /* Quinary chart color */
  
  /* Sidebar-specific colors */
  --sidebar: oklch(0.96 0.01 110);        /* Sidebar background */
  --sidebar-foreground: oklch(0.15 0.02 110); /* Sidebar text */
  --sidebar-primary: oklch(0.65 0.2 150); /* Sidebar primary elements */
  --sidebar-primary-foreground: oklch(0.98 0.01 110); /* Text on sidebar primary */
  --sidebar-accent: oklch(0.7 0.22 155);  /* Sidebar accent elements */
  --sidebar-accent-foreground: oklch(0.1 0.02 110); /* Text on sidebar accent */
  --sidebar-border: oklch(0.9 0.02 110);  /* Sidebar border color */
  --sidebar-ring: oklch(0.65 0.2 150);    /* Sidebar focus indicator */
}
```

### Dark Theme Colors
```css
.dark {
  /* Base colors adapted for dark theme */
  --background: oklch(0.10 0 0);          /* Deep black page background */
  --foreground: oklch(0.95 0 0);          /* Near white primary text */
  
  --card: oklch(0.12 0 0);                /* Dark gray card background */
  --card-foreground: oklch(0.95 0 0);     /* Text on card background */
  --popover: oklch(0.08 0 0);             /* Darker popover background */
  --popover-foreground: oklch(0.95 0 0);  /* Text on popover */
  
  /* Action colors optimized for dark theme */
  --primary: oklch(0.85 0 0);             /* High contrast neutral for accessibility */
  --primary-foreground: oklch(0.10 0 0);  /* Dark text on light primary */
  --secondary: oklch(0.20 0 0);           /* Dark gray secondary */
  --secondary-foreground: oklch(0.90 0 0); /* Light text on secondary */
  --accent: oklch(0.3 0 0);               /* Subdued accent for reduced eye strain */
  --accent-foreground: oklch(0.95 0 0);   /* Light text on accent */
  
  /* Supporting colors for dark theme */
  --muted: oklch(0.20 0 0);               /* Dark muted background */
  --muted-foreground: oklch(0.65 0 0);    /* Medium gray text */
  --destructive: oklch(0.5770 0.2450 27.3250); /* Consistent error red */
  --destructive-foreground: oklch(1 0 0); /* White text on error */
  
  /* Interface structure colors for dark theme */
  --border: oklch(0.20 0 0);              /* Dark borders */
  --input: oklch(0.20 0 0);               /* Dark input borders */
  --ring: oklch(0.85 0 0);                /* Bright focus rings */
  
  /* Chart colors adjusted for dark backgrounds */
  --chart-1: oklch(0.8100 0.1000 252);    /* Blue spectrum optimized for dark */
  --chart-2: oklch(0.6200 0.1900 260);    /* Different hues for dark theme */
  --chart-3: oklch(0.5500 0.2200 263);
  --chart-4: oklch(0.4900 0.2200 264);
  --chart-5: oklch(0.4200 0.1800 266);
  
  /* Dark sidebar colors */
  --sidebar: oklch(0.12 0 0);             /* Dark sidebar background */
  --sidebar-foreground: oklch(0.95 0 0);  /* Light sidebar text */
  --sidebar-primary: oklch(0.85 0 0);     /* Bright sidebar primary */
  --sidebar-primary-foreground: oklch(0.10 0 0); /* Dark text on sidebar primary */
  --sidebar-accent: oklch(0.3 0 0);       /* Muted sidebar accent */
  --sidebar-accent-foreground: oklch(0.95 0 0); /* Light text on sidebar accent */
  --sidebar-border: oklch(0.20 0 0);      /* Dark sidebar borders */
  --sidebar-ring: oklch(0.85 0 0);        /* Bright sidebar focus */
}
```

## Typography System

### Font Families
```css
:root {
  --font-sans: 'Inter', sans-serif;      /* Primary UI font - modern, readable */
  --font-serif: 'Merriweather', serif;   /* For emphasis and formal content */
  --font-mono: 'JetBrains Mono', monospace; /* Code, data, and technical content */
}
```

### Font Usage Guidelines
- **Inter**: Use for all UI elements, body text, headings, and interface labels
- **JetBrains Mono**: Use for speaker timestamps, code blocks, technical data, and panel headers
- **Merriweather**: Reserved for special emphasis, quotes, or formal document content

## Layout System

### Core Layout Variables
```css
:root {
  --radius: 0.5rem;                       /* Base border radius for consistent shape language */
  --spacing: 0.25rem;                     /* Base spacing unit for rhythm */
  --tracking-normal: 0em;                 /* Letter spacing baseline */
}
```

### Border Radius Scale
```css
/* Mapped to Tailwind's theme system for consistent rounding */
--radius-sm: calc(var(--radius) * 0.4);   /* 0.2rem - Small elements */
--radius-md: var(--radius);               /* 0.5rem - Default radius */
--radius-lg: calc(var(--radius) * 1.3);   /* 0.65rem - Larger components */
--radius-xl: calc(var(--radius) * 1.8);   /* 0.9rem - Cards and containers */
--radius-2xl: calc(var(--radius) * 2.5);  /* 1.25rem - Large containers */
--radius-full: 9999px;                    /* Full circle for buttons/avatars */
```

## Shadow System

Our shadow system creates consistent depth and hierarchy across the interface.

### Light Theme Shadows
```css
:root {
  --shadow-2xs: 0 1px 2px 0px hsl(240 5% 48% / 0.05);
  --shadow-xs: 0 1px 3px 0px hsl(240 5% 48% / 0.1), 0 1px 2px 0px hsl(240 5% 48% / 0.06);
  --shadow-sm: 0 2px 4px 0px hsl(240 5% 48% / 0.1), 0 2px 2px -1px hsl(240 5% 48% / 0.06);
  --shadow: 0 4px 6px -1px hsl(240 5% 48% / 0.1), 0 2px 4px -1px hsl(240 5% 48% / 0.06);
  --shadow-md: 0 10px 15px -3px hsl(240 5% 48% / 0.1), 0 4px 6px -2px hsl(240 5% 48% / 0.05);
  --shadow-lg: 0 20px 25px -5px hsl(240 5% 48% / 0.1), 0 10px 10px -5px hsl(240 5% 48% / 0.04);
  --shadow-xl: 0 25px 50px -12px hsl(240 5% 48% / 0.25);
  --shadow-2xl: 0 35px 60px -15px hsl(240 5% 48% / 0.3);
}
```

### Dark Theme Shadows
```css
.dark {
  /* More subtle shadows for dark theme */
  --shadow-2xs: 0 1px 2px 0px hsl(0 0% 0% / 0.05);
  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px 0px hsl(0 0% 0% / 0.06);
  --shadow-sm: 0 2px 4px 0px hsl(0 0% 0% / 0.1), 0 2px 2px -1px hsl(0 0% 0% / 0.06);
  --shadow: 0 4px 6px -1px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.06);
  --shadow-md: 0 10px 15px -3px hsl(0 0% 0% / 0.1), 0 4px 6px -2px hsl(0 0% 0% / 0.05);
  --shadow-lg: 0 20px 25px -5px hsl(0 0% 0% / 0.1), 0 10px 10px -5px hsl(0 0% 0% / 0.04);
  --shadow-xl: 0 25px 50px -12px hsl(0 0% 0% / 0.25);
  --shadow-2xl: 0 35px 60px -15px hsl(0 0% 0% / 0.3);
}
```

## Workspace-Specific Layout

### Main Grid System
```css
.main-grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;     /* Left panel, Center content, Right panel */
  grid-template-rows: auto 1fr auto;      /* Header, Main content, Footer */
  height: 100vh;
  gap: 1px;                               /* Thin border between panels */
  background-color: var(--border);        /* Border color shows through gaps */
}

.header, .footer {
  grid-column: 1 / 4;                     /* Span all three columns */
}

.panel {
  background-color: var(--card);
  padding: 1.5rem;
  overflow-y: auto;
  height: calc(100vh - 8rem);             /* Account for header/footer height */
}
```

### Custom Scrollbar Styling
```css
.panel {
  /* Custom scrollbar for better visual integration */
  scrollbar-width: thin;
  scrollbar-color: var(--muted-foreground) var(--muted);
}

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

### Navigation Icons

The header uses minimalist icon buttons for quick actions:

- A hamburger `Menu` icon toggles the minutes history sidebar.
- A `Settings` gear opens the API configuration dialog.

Both are implemented as ghost buttons with `p-2` spacing and use `text-muted-foreground` for subtle emphasis.

## Component-Specific Styles

### Typography Components
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

.transcript-speaker {
  font-weight: 700;
  color: var(--accent-foreground);
  background-color: var(--accent);
  padding: 0.1rem 0.4rem;
  border-radius: 0.25rem;
  font-family: var(--font-mono);
  display: inline-block;
}

.dictionary-term {
  background-color: var(--secondary);
  padding: 1rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  margin-bottom: 1rem;
}

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

## Utility Classes

### Enhanced Visual Effects
```css
.glass-card {
  backdrop-blur-sm: ;
  background: var(--card)/80;
  border: 1px solid var(--border)/50;
}

.gradient-text {
  background: linear-gradient(to right, var(--primary), var(--accent));
  background-clip: text;
  color: transparent;
}

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

### Interaction States
```css
.transition-smooth {
  transition: all 300ms ease-out;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.focus-ring {
  outline: none;
  ring: 2px solid var(--ring);
  ring-offset: 2px;
}
```

## Best Practices

### Color Usage Guidelines
- **Always use CSS variables**: Never hardcode color values
- **Semantic naming**: Use purpose-based names (primary, accent) over descriptive ones (green, blue)
- **Accessibility first**: Ensure minimum 4.5:1 contrast ratio for WCAG AA compliance
- **Theme consistency**: Test all color combinations in both light and dark themes
- **Foreground/Background pairing**: Each background color has a corresponding foreground color

### Typography Guidelines
- **Relative units**: Use rem/em for scalable design across different screen sizes
- **Consistent spacing**: Maintain uniform line heights and margins across similar elements
- **Font loading**: Use font-display: swap for better performance
- **Hierarchy**: Establish clear visual hierarchy through size, weight, and color variations

### Layout Best Practices
- **Grid for complex layouts**: Use CSS Grid for multi-dimensional layouts
- **Flexbox for alignment**: Use Flexbox for simpler one-dimensional alignments
- **Consistent spacing**: Use the spacing scale for rhythm and visual harmony
- **Responsive behavior**: Consider mobile-first design and progressive enhancement

### Shadow and Effect Guidelines
- **Purposeful shadows**: Use shadows to indicate elevation and hierarchy
- **Consistent lighting**: Maintain top-down lighting model across all shadows
- **Performance consideration**: Limit complex shadows on frequently animated elements
- **Accessibility**: Respect user preferences for reduced motion