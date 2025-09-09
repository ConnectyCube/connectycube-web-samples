import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss({
      content: {
        files: [
          './index.html',
          './src/**/*.{js,html}',
        ],
      },
    }),
  ],
});
