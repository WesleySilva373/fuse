import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Isso garante que os caminhos sejam relativos ao index.html
  build: {
    outDir: 'dist',
  },
});
