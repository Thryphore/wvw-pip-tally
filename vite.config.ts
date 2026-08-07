import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base must match the GitHub Pages project path: https://<user>.github.io/wvw-pip-tally/
export default defineConfig({
  plugins: [react()],
  base: '/wvw-pip-tally/',
})
