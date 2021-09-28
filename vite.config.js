import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/curl2ffmpeg/',
  build: {
    sourcemap: true,
    minify: false,
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "src"),
    },
  },
})
