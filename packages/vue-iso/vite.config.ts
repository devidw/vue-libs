import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import unocss from 'unocss/vite'

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  plugins: [vue(), unocss()],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'VueIsolation',
      fileName: 'vue-iso'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
