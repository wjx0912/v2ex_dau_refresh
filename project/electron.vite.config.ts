import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    build: {
      bytecode: false
    }
  },
  preload: {
    build: {
      bytecode: false,
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.ts'),
          inject: resolve(__dirname, 'src/preload/inject.ts')
        }
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [vue()]
  }
})
