import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // Base public path when served from GitHub Pages under a repository named `fkhub`.
  // Adjust when deploying to a different repo or to a GitHub Pages user site.
  base: '/fkhub/',
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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id) return;
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'vendor-framer-motion';
            if (id.includes('wagmi') || id.includes('@wagmi')) return 'vendor-wagmi';
            if (id.includes('viem')) return 'vendor-viem';
            if (id.includes('lottie-react') || id.includes('lottie-web')) return 'vendor-lottie';
            if (id.includes('@web3modal')) return 'vendor-web3modal';
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
            if (id.includes('lucide-react') || id.includes('react-icons')) return 'vendor-icons';
            return 'vendor';
          }
        },
      },
    },
  },
});