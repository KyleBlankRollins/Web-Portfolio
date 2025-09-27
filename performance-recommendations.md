# Performance Optimization Recommendations

## Current Status ✅

- **Main JS Bundle**: 97.78KB (20.96KB gzipped) - 20% reduction achieved
- **Lit Framework**: 15.72KB (5.97KB gzipped) - Separated for better caching
- **CSS Bundle**: 32.95KB (6.62KB gzipped)
- **Build Time**: ~350ms (very fast)

## Server Configuration Optimizations

### 1. HTTP Headers (Nginx/Apache)

```nginx
# Cache static assets aggressively
location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary "Accept-Encoding";
}

# Enable Brotli compression (15-20% better than gzip)
brotli on;
brotli_comp_level 6;
brotli_types
    text/plain
    text/css
    text/javascript
    application/javascript
    application/json;

# Enable gzip fallback
gzip on;
gzip_vary on;
gzip_comp_level 6;
gzip_types text/css application/javascript;
```

### 2. Font Loading Optimization

Current font loading can be improved with:

```html
<!-- In your HTML head -->
<link
  rel="preload"
  href="/fonts/valkyrie_b_regular.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
<link
  rel="preload"
  href="/fonts/IBMPlexMono-Regular.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

And CSS optimization:

```css
@font-face {
  font-family: "Valkyrie B";
  src: url("/fonts/valkyrie_b_regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap; /* Improves LCP */
}
```

## Code-level Optimizations

### 3. Lazy Load Components

For components not immediately visible:

```typescript
// Lazy load timeline on career page
const timeline = await import("./components/timeline/timeline.js");
```

### 4. Image Optimization

Add to vite.config.ts:

```typescript
// Install: npm install -D vite-plugin-imagemin
import { defineConfig } from "vite";
import { imagemin } from "vite-plugin-imagemin";

export default defineConfig({
  plugins: [
    imagemin({
      pngquant: { quality: [0.8, 0.9] },
      webp: { quality: 80 },
    }),
  ],
});
```

### 5. Critical CSS Extraction

For above-the-fold styles:

```typescript
// Install: npm install -D rollup-plugin-critical
import critical from "rollup-plugin-critical";
```

## Advanced Optimizations

### 6. Service Worker Caching

Add offline support and aggressive caching:

```typescript
// Install: npm install -D vite-plugin-pwa
import { VitePWA } from "vite-plugin-pwa";

plugins: [
  VitePWA({
    registerType: "autoUpdate",
    workbox: {
      globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
    },
  }),
];
```

### 7. Preload Critical Routes

Add to HTML templates:

```html
<link rel="prefetch" href="/portfolio.html" />
<link rel="prefetch" href="/career.html" />
```

## Performance Monitoring

### 8. Bundle Analysis Commands

- `npm run build:analyze` - View bundle composition
- `npm run preview` - Test production build locally

### 9. Performance Budget

Set in vite.config.ts:

```typescript
build: {
  rollupOptions: {
    output: {
      chunkSizeWarningLimit: 300, // Warn at 300KB
    }
  }
}
```

## Expected Improvements

With full implementation:

- **First Contentful Paint**: -200ms (font preloading)
- **Largest Contentful Paint**: -300ms (critical CSS)
- **Time to Interactive**: -150ms (code splitting)
- **Cumulative Layout Shift**: Reduced (font-display: swap)
- **Total Bundle**: Additional 10-15% reduction possible

## Quick Wins (Low Effort, High Impact)

1. ✅ **Already Done**: Manual chunking, modern targets
2. 🎯 **Next**: Add font preloading to templates
3. 🎯 **Next**: Enable Brotli compression on server
4. 🎯 **Next**: Add critical CSS for above-fold content

## Measurement Tools

- **Lighthouse**: Built into Chrome DevTools
- **WebPageTest**: https://webpagetest.org
- **Bundle Analyzer**: `npm run build:analyze`
- **Vite's built-in analyzer**: Shows gzip sizes automatically
