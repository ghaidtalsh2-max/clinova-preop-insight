import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { clinicalServerMiddleware } from './server/clinicalServerMiddleware.ts'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), clinicalServerMiddleware()],
})
