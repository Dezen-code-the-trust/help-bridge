import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  esbuild: {
    target: 'esnext',
    supported: {
      'top-level-await': true
    }
  },
  build: {
    target: 'esnext'
  },
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
      },
      protocolImports: true,
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
})