import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // Base public path. Historically this project set the base to '/mysite/'
  // for GitHub Pages when serving from https://<user>.github.io/mysite/.
  // When a custom domain (or user-pages root) is used the base should be
  // '/' (or the root). To make deployments flexible we allow overriding
  // the base with the VITE_BASE environment variable. Examples:
  //  - default (custom domain or user site): VITE_BASE not set -> '/'
  //  - GitHub Pages project site: VITE_BASE=/mysite/ npm run build
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // Prevent multiple React copies from being bundled (dedupe imports)
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    // Ensure react and react-dom are pre-bundled to avoid ESM/UMD interop issues
    include: ['react', 'react-dom'],
    exclude: ['lucide-react'],
  },
  build: {
  // Keep source maps disabled in production builds to avoid exposing
  // source code. Reverted after debugging.
  sourcemap: false,
    rollupOptions: {
      output: {
        // Bundle all node_modules into a single vendor chunk. This reduces the
        // chance of cross-chunk circular imports triggering "Cannot access
        // '<id>' before initialization" at runtime. If you later need fine-
        // grained caching for individual large libs, reintroduce manual
        // splitting carefully.
        manualChunks(id) {
          if (!id) return;
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});