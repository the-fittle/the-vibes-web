import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import unocss from 'unocss/vite'
import path from 'path'

export default defineConfig( {
  server: {
    port: 8080,
    watch: {
      ignored: [
        'lib',
        'node_modules',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve( './src/' ),
    },
  },
  build: {
    outDir: 'lib',
    // minify: 'esbuild',
    // sourcemap: true,
  },
  plugins: [
    solid(),
    unocss(),
  ],
} );

