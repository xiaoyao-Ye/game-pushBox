import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS({}),
    // See more: https://github.com/antfu/unplugin-auto-import#configurations
    AutoImport({
      imports: [
        'vue',
        {
          '@vueuse/core': [
            'onKeyUp', // import { onKeyUp } from '@vueuse/core',
          ],
        },
      ],
      dts: './src/auto-imports.d.ts',
    }),
  ],
  resolve: {
    alias: { '@/': `${path.resolve(__dirname, 'src')}/` },
  },
})
