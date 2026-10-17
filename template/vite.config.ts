import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const src = (p: string) => fileURLToPath(new URL(p, import.meta.url))

// BASE_PATH : préfixe de publication (ex. /mopal-apercus/<slug>/), fourni par le pipeline.
export default defineConfig(({ isSsrBuild }) => ({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  server: { port: process.env.PORT ? Number(process.env.PORT) : 5173 },
  resolve: {
    alias: {
      '@': src('./src'),
      ...(isSsrBuild ? { 'framer-motion': src('./src/lib/motion-static.tsx') } : {}),
    },
  },
}))
