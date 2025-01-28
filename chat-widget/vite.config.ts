import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite";
import react from '@vitejs/plugin-react'
import { resolve } from "path";
import dts from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";

const globals = {
  "react": "React",
  "react-dom": "ReactDOM",
  'vite-plugin-node-polyfills/shims/process': "process",
  'vite-plugin-node-polyfills/shims/buffer': "Buffer"
}

export default defineConfig(({ mode }) => {
  const dev = mode === 'development';
  const plugins = dev ? [
    tailwindcss(),
    react(),
    nodePolyfills()
  ] : [
    tailwindcss(),
    react(),
    dts({
      rollupTypes: true,
      tsconfigPath: './tsconfig.app.json'
    })
  ];
  
  return {
    plugins,
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        "@connectycube/types": resolve(__dirname, "../node_modules/connectycube/dist/types/types"),
      },
    },
    build: {
      lib: {
        entry: resolve(__dirname, dev ? 'src/main.tsx' : 'src/index.ts'),
        name: 'ConnectyCubeChatWidget',
        fileName: (format) => `index.${format}.js`,
      },
      rollupOptions: {
        external: dev ? Object.keys(globals) : [],
        output: {
          globals: dev ? globals : undefined
        }
      },
    }
  };
});
