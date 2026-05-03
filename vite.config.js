import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './', // Isso garante que os caminhos sejam relativos
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        catalogo: resolve(__dirname, 'catalogo.html')
      }
    }
  },
});
