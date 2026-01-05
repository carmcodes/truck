import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    nodePolyfills({
      // include what antlr4ts typically trips on
      include: ['process', 'util'],
      globals: {
        process: true,
        global: true
      },
    }),
  ],
  resolve: {
    alias: {
      process: 'process/browser',
      util: 'util/',
    },
  },
  define: {
    // some libs check process.env
    'process.env': {},
  },
});
