import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa'; // Correct import

export default defineConfig({
  plugins: [react(),
    VitePWA({
      registerType: "autoUpdate",   
      manifest: {
        name: "assetz",
        short_name: "assetz",
        description: "Keeping track of all your web assets",
        theme_color: "#0d1117",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
   build: {
    outDir: 'dist',
    sourcemap: true
  },
});