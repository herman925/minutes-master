# CSS Design System Reference

## Overview

This document provides a comprehensive reference for the MinutesMaster AI design system, including color palettes, typography, spacing, shadows, and component styling guidelines.

## Color Palette

### Base Colors
The design system uses a sophisticated green-tinted color palette that conveys professionalism and trustworthiness.

```css
:root {
  /* Primary Background Colors */
  --background: oklch(0.98 0.01 110);     /* Light, neutral background */
  --foreground: oklch(0.15 0.02 110);     /* Dark text for contrast */
  
  /* Card & Surface Colors */
  --card: oklch(1 0 0);                   /* Pure white cards */
  --card-foreground: oklch(0.15 0.02 110); /* Dark text on cards */
  --popover: oklch(1 0 0);                /* White popovers */
  --popover-foreground: oklch(0.15 0.02 110); /* Dark text in popovers */
}
```

### Interactive Colors
These colors are used for buttons, links, and interactive elements.

```css
:root {
  /* Primary Action Colors */
  --primary: oklch(0.65 0.2 150);         /* Rich green for primary actions */
  --primary-foreground: oklch(0.98 0.01 110); /* Light text on primary */
  
  /* Secondary Colors */
  --secondary: oklch(0.94 0.02 110);      /* Light gray for secondary actions */
  --secondary-foreground: oklch(0.15 0.02 110); /* Dark text on secondary */
  
  /* Muted Colors */
  --muted: oklch(0.94 0.02 110);          /* Subtle background color */
  --muted-foreground: oklch(0.5 0.02 110); /* Medium gray for less important text */
  
  /* Accent Colors */
  --accent: oklch(0.7 0.22 155);          /* Bright green for highlights */
  --accent-foreground: oklch(0.1 0.02 110); /* Dark text on accent */
}
```

### System Colors
Used for alerts, errors, and status indicators.

```css
:root {
  /* Status Colors */
  --destructive: oklch(0.58 0.24 25);     /* Red for errors/warnings */
  --destructive-foreground: oklch(0.98 0.01 25); /* Light text on destructive */
  
  /* Border & Input Colors */
  --border: oklch(0.9 0.02 110);          /* Light borders */
  --input: oklch(0.9 0.02 110);           /* Input field borders */
  --ring: oklch(0.65 0.2 150);            /* Focus ring color */
}
```

### Chart Colors
A harmonious palette for data visualization.

```css
:root {
  --chart-1: oklch(0.65 0.2 150);         /* Primary chart color */
  --chart-2: oklch(0.7 0.22 155);         /* Secondary chart color */
  --chart-3: oklch(0.55 0.18 145);        /* Tertiary chart color */
  --chart-4: oklch(0.75 0.24 160);        /* Quaternary chart color */
  --chart-5: oklch(0.6 0.19 148);         /* Quinary chart color */
}
```

## Typography

### Font Families

```css
:root {
  --font-sans: 'Inter', sans-serif;       /* Primary UI font */
  --font-serif: 'Merriweather', serif;    /* Heading font (optional) */
  --font-mono: 'Geist Mono', monospace;   /* Code and technical content */
}
```

### Font Usage Guidelines

#### Primary Text (Inter)
- **Use for**: Body text, UI elements, buttons, navigation
- **Characteristics**: Clean, modern, highly legible
- **Weight range**: 400 (regular) to 700 (bold)

#### Monospace Text (Geist Mono)
- **Use for**: Code snippets, transcripts, technical data, timestamps
- **Characteristics**: Fixed-width, technical aesthetic
- **Weight**: 400 (regular)

### Typography Scale

```css
/* Heading Styles */
.text-5xl { font-size: 3rem; }      /* Main titles */
.text-xl { font-size: 1.25rem; }    /* Section headings */
.text-lg { font-size: 1.125rem; }   /* Subsection headings */

/* Body Text */
.text-base { font-size: 1rem; }     /* Standard body text */
.text-sm { font-size: 0.875rem; }   /* Secondary text */
.text-xs { font-size: 0.75rem; }    /* Captions, metadata */
```

## Spacing System

### Base Spacing Unit
```css
:root {
  --spacing: 0.25rem; /* 4px base unit */
}
```

### Spacing Scale
- `p-1` = 4px
- `p-2` = 8px  
- `p-3` = 12px
- `p-4` = 16px
- `p-6` = 24px
- `p-8` = 32px
- `p-12` = 48px

## Border Radius

```css
:root {
  --radius: 0.5rem; /* 8px - modern, professional radius */
}
```

### Radius Scale
- `rounded-sm` = 2px (small elements)
- `rounded` = 8px (standard cards, buttons)
- `rounded-lg` = 12px (prominent cards)
- `rounded-xl` = 16px (hero elements)
- `rounded-2xl` = 24px (large featured elements)

## Shadow System

Professional shadow system that adds depth without being overwhelming.

```css
:root {
  /* Subtle shadows for layering */
  --shadow-2xs: 0 1px 2px 0px hsl(240 5% 48% / 0.05);
  --shadow-xs: 0 1px 3px 0px hsl(240 5% 48% / 0.1), 0 1px 2px 0px hsl(240 5% 48% / 0.06);
  --shadow-sm: 0 2px 4px 0px hsl(240 5% 48% / 0.1), 0 2px 2px -1px hsl(240 5% 48% / 0.06);
  
  /* Standard shadows for cards */
  --shadow: 0 4px 6px -1px hsl(240 5% 48% / 0.1), 0 2px 4px -1px hsl(240 5% 48% / 0.06);
  --shadow-md: 0 10px 15px -3px hsl(240 5% 48% / 0.1), 0 4px 6px -2px hsl(240 5% 48% / 0.05);
  
  /* Prominent shadows for elevated elements */
  --shadow-lg: 0 20px 25px -5px hsl(240 5% 48% / 0.1), 0 10px 10px -5px hsl(240 5% 48% / 0.04);
  --shadow-xl: 0 25px 50px -12px hsl(240 5% 48% / 0.25);
  --shadow-2xl: 0 35px 60px -15px hsl(240 5% 48% / 0.3);
}
```

### Shadow Usage Guidelines

- **shadow-xs**: Small UI elements, input focus states
- **shadow-sm**: Buttons, small cards
- **shadow**: Standard cards, panels
- **shadow-md**: Elevated cards, dropdowns
- **shadow-lg**: Modals, important callouts
- **shadow-xl**: Hero elements, major features

## Component Styles

### Custom CSS Classes

```css
/* Glassmorphism effect for modern feel */
.glass-card {
  @apply backdrop-blur-sm bg-card/80 border border-border/50;
}

/* Gradient text for branding */
.gradient-text {
  @apply bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent;
}

/* Enhanced shadows for depth */
.card-shadow {
  box-shadow: 
    0 1px 3px 0 rgb(0 0 0 / 0.1), 
    0 1px 2px -1px rgb(0 0 0 / 0.1),
    0 0 0 1px rgb(0 0 0 / 0.05);
}

/* Smooth animations */
.transition-smooth {
  @apply transition-all duration-300 ease-out;
}

/* Hover effects */
.hover-lift:hover {
  @apply transform translate-y-[-2px] shadow-lg;
}

/* Focus states */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2;
}
```

### Custom Scrollbar

```css
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: oklch(0.65 0.2 150) oklch(0.94 0.02 110);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: oklch(0.94 0.02 110);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: oklch(0.65 0.2 150);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: oklch(0.55 0.2 150);
}
```

## Color Usage Guidelines

### Primary Color Applications
- **Primary buttons**: Call-to-action buttons, submit buttons
- **Active states**: Selected tabs, active navigation items
- **Brand elements**: Logo accent, key highlights
- **Progress indicators**: Loading bars, completion status

### Secondary Color Applications
- **Secondary buttons**: Cancel, back, alternative actions
- **Background elements**: Subtle section backgrounds
- **Disabled states**: Inactive form elements
- **Supporting content**: Less important information

### Accent Color Applications
- **Highlights**: Important badges, notifications
- **Interactive elements**: Hover states, focus indicators
- **Success states**: Completion messages, positive feedback
- **Data visualization**: Charts, graphs, key metrics

## Accessibility Considerations

### Color Contrast
All color combinations meet WCAG AA standards:
- **Normal text**: 4.5:1 contrast ratio minimum
- **Large text**: 3:1 contrast ratio minimum
- **Interactive elements**: Clear visual distinction

### Focus States
- All interactive elements have visible focus indicators
- Focus rings use the primary color for consistency
- Tab order follows logical content flow

### Color Independence
- Information is not conveyed through color alone
- Icons and text labels supplement color coding
- High contrast mode compatibility maintained

## Implementation Notes

### CSS Variable Usage
```css
/* Correct usage */
.my-component {
  background-color: var(--card);
  color: var(--card-foreground);
  border: 1px solid var(--border);
}

/* With Tailwind */
.my-component {
  @apply bg-card text-card-foreground border-border;
}
```

### Responsive Considerations
- Font sizes scale appropriately on mobile devices
- Touch targets meet minimum 44px requirements
- Spacing adapts for comfortable mobile interaction

### Dark Mode Ready
The color system is designed to easily support dark mode by updating the CSS variables while maintaining contrast ratios and visual hierarchy.

## Best Practices

1. **Consistency**: Use the defined color palette exclusively
2. **Hierarchy**: Leverage color saturation and brightness to establish visual hierarchy
3. **Context**: Choose colors that match the semantic meaning of content
4. **Testing**: Verify color combinations in different lighting conditions
5. **Documentation**: Keep this reference updated when making changes

This design system ensures a professional, accessible, and visually cohesive experience across the entire MinutesMaster AI application.