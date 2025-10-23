# Ambetter Design System Reference
## For Demo/Educational Purposes Only

This document provides design specifications for building a demo application inspired by Ambetter Health's website design.

---

## 🎨 Brand Colors

### Primary Colors
```css
--ambetter-magenta: #C61C71;      /* Primary brand color */
--ambetter-pink: #DF87AF;         /* Secondary/hover states */
--ambetter-light-pink: #F7E0EC;   /* Backgrounds, accents */
```

### Neutral Colors
```css
--text-dark: #333333;             /* Headings */
--text-body: #6E6E6E;             /* Body text */
--text-light: #9CA3AF;            /* Secondary text */
--background-gray: #F5F5F5;       /* Section backgrounds */
--border-gray: #E5E7EB;           /* Borders */
--white: #FFFFFF;
```

### Accent Colors
```css
--success-green: #10B981;
--info-blue: #3B82F6;
--warning-yellow: #F59E0B;
```

---

## 📝 Typography

### Font Family
```css
font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
--text-6xl: 3.75rem;   /* 60px */
```

### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## 🏗️ Layout Structure

### Container Widths
```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

### Spacing Scale
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

---

## 🎯 Header Structure

### Top Utility Bar
- Height: `32px`
- Background: White
- Border Bottom: `1px solid #E5E7EB`
- Links: Small text (14px), right-aligned
- Items: "Español", "Member Login", "Find a Doctor"

### Main Navigation
- Height: `80px`
- Background: White
- Shadow: `0 1px 3px rgba(0,0,0,0.1)`
- Logo: Left-aligned, ~120px width
- Navigation: Center or right-aligned
- Links: 16px, medium weight, #333333 color
- Hover: Change to magenta (#C61C71)

---

## 🦸 Hero Banner

### Dimensions
- Min Height: `500px` (desktop), `400px` (mobile)
- Background: Image with magenta overlay
- Overlay: `rgba(198, 28, 113, 0.85)`

### Typography
- Headline: `text-5xl` or `text-6xl`, bold, white
- Subheadline: `text-2xl`, white, lighter weight
- Line Height: `1.2` for headlines

### CTAs
- Primary Button: White background, magenta text
- Secondary Button: Transparent, white border, white text
- Padding: `16px 32px`
- Border Radius: `8px`
- Font: Bold, 18px

---

## 📦 Card Components

### Feature Cards
```css
.feature-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s ease;
}

.feature-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.feature-card-image {
  height: 200px;
  background-size: cover;
  background-position: center;
}

.feature-card-content {
  padding: 24px;
}

.feature-card-title {
  font-size: 20px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 12px;
}

.feature-card-text {
  font-size: 16px;
  color: #6E6E6E;
  line-height: 1.6;
}

.feature-card-link {
  color: #C61C71;
  font-weight: 700;
  text-decoration: none;
}
```

---

## 🔘 Button Styles

### Primary Button
```css
.btn-primary {
  background: #C61C71;
  color: white;
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #A01658;
  transform: translateY(-1px);
}
```

### Secondary Button
```css
.btn-secondary {
  background: white;
  color: #C61C71;
  padding: 12px 32px;
  border: 2px solid #C61C71;
  border-radius: 8px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #F7E0EC;
}
```

### Outline Button
```css
.btn-outline {
  background: transparent;
  color: white;
  padding: 12px 32px;
  border: 2px solid white;
  border-radius: 8px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-outline:hover {
  background: rgba(255,255,255,0.1);
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

---

## 🎭 Logo Specifications

### Text-Based Logo (for demo purposes)
- Text: "Ambetter℠" or "Ambetter Health"
- Font: Roboto Bold
- Size: 28-32px
- Color: #C61C71 (magenta)
- Service Mark: Lighter gray (#6E6E6E)

### SVG Logo Placeholder
```svg
<svg width="200" height="50" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
  <!-- Circle element representing the 'A' icon -->
  <circle cx="20" cy="25" r="15" fill="#C61C71"/>
  <path d="M 15 30 L 20 20 L 25 30" stroke="white" stroke-width="3" fill="none"/>
  
  <!-- Text -->
  <text x="45" y="33" font-family="Roboto, sans-serif" font-size="28" font-weight="700" fill="#C61C71">
    Ambetter
  </text>
  <text x="175" y="20" font-family="Roboto, sans-serif" font-size="14" fill="#6E6E6E">
    ℠
  </text>
</svg>
```

---

## 🦶 Footer Styles

```css
.footer {
  background: #1F2937; /* Dark gray */
  color: white;
  padding: 64px 0 32px;
}

.footer-heading {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  color: white;
}

.footer-link {
  color: #9CA3AF; /* Gray-400 */
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: white;
}

.footer-bottom {
  border-top: 1px solid #374151;
  padding-top: 32px;
  margin-top: 48px;
  text-align: center;
  color: #9CA3AF;
  font-size: 14px;
}
```

---

## 🎨 Section Backgrounds

### Alternating Pattern
```css
Section 1: White background
Section 2: Light gray (#F5F5F5)
Section 3: White background
Section 4: Magenta background (#C61C71) - CTA sections
Section 5: Light gray (#F5F5F5)
```

---

## 🔍 Search Bar Component

```css
.search-input {
  padding: 12px 16px 12px 48px; /* Left padding for icon */
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 16px;
  width: 300px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #C61C71;
  box-shadow: 0 0 0 3px rgba(198, 28, 113, 0.1);
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9CA3AF;
}
```

---

## ✨ Animations

```css
/* Smooth transitions */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Hover lift effect */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Fade in animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}
```

---

## 📋 Usage Notes

**For Demo/Educational Purposes:**
- Use these specifications to create a similar look and feel
- Replace logo with text-based version or generic placeholder
- Use royalty-free stock images for hero banners and cards
- Maintain accessibility standards (WCAG AA minimum)
- Add proper ARIA labels and semantic HTML

**Image Sources (Royalty-Free):**
- Unsplash.com
- Pexels.com
- Pixabay.com

**Disclaimer:**
Add to your demo footer:
"This is a demonstration project. All trademarks and brand names are the property of their respective owners. This demo is for educational purposes only and is not affiliated with or endorsed by Ambetter Health."

---

## 🎯 Key Design Principles

1. **Clean & Professional**: Minimal clutter, clear hierarchy
2. **Accessible**: High contrast, readable fonts, proper spacing
3. **Trustworthy**: Healthcare-appropriate design, professional imagery
4. **User-Friendly**: Clear CTAs, intuitive navigation
5. **Mobile-First**: Responsive design for all devices
6. **Performance**: Optimized images, fast loading

---

**Last Updated**: October 2025
**Purpose**: Demo/Educational Reference Only

