import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom domain serves the site at the domain root.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
