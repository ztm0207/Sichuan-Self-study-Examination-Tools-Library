import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/Sichuan-Self-study-Examination-Tools-Library/',
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
  },
})