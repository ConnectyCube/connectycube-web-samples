import { resolve } from "path";
import { defineConfig } from 'vite'
import autoprefixer from 'autoprefixer';
import react from '@vitejs/plugin-react'
import dts from "vite-plugin-dts";
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import { nodePolyfills } from "vite-plugin-node-polyfills";

const globals = {
  "react": "React",
  "react-dom": "ReactDOM",
  "connectycube": "ConnectyCube",
  'vite-plugin-node-polyfills/shims/process': "process",
  'vite-plugin-node-polyfills/shims/buffer': "Buffer"
}

export default defineConfig(({ mode }) => {
  const dev = mode === 'development';
  const plugins = dev ? [
    react(),
    nodePolyfills()
  ] : [
    react(),
    cssInjectedByJsPlugin(),
    dts({
      tsconfigPath: './tsconfig.app.json'
    })
  ];
  
  return {
    plugins,
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        "@connectycube/types": resolve(__dirname, "./node_modules/connectycube/dist/types/types"),
      },
    },
    build: {
      lib: {
        entry: resolve(__dirname, `./src/${dev ? 'main' : 'index'}.tsx`),
        name: 'ConnectyCubeChatWidget',
        fileName: (format) => `index.${format}.js`,
      },
      rollupOptions: {
        external: Object.keys(globals),
        output: { globals }
      },
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({})
        ],
      }
    }
  };
});
