import { resolve } from "path";
import { defineConfig, UserConfig } from 'vite'
import autoprefixer from 'autoprefixer';
import react from '@vitejs/plugin-react'
import dts from "vite-plugin-dts";
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

const globals = {
  "react": "React",
  "react-dom": "ReactDOM",
  "connectycube": "ConnectyCube",
}

export default defineConfig(({ mode }) => {
  const bundle = mode === 'production';

  const userConfig: UserConfig = {
    plugins: [
      react()
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        "@connectycube/types": resolve(__dirname, "./node_modules/connectycube/dist/types/types"),
      },
    },
    build: {
      lib: {
        entry: resolve(__dirname, `./src/${bundle ? 'index' : 'main'}.tsx`),
        name: 'ConnectyCubeChatWidget',
        fileName: (format) => `index.${format}.js`,
      },
      rollupOptions: {
        external: Object.keys(globals),
        output: { globals }
      },
    },
  };


  if (bundle) {
    userConfig.plugins = [
      react(),
      cssInjectedByJsPlugin(),
      dts({ tsconfigPath: './tsconfig.app.json' })
    ];
    userConfig.css = {
      postcss: {
        plugins: [
          autoprefixer({})
        ],
      }
    }
    userConfig.define = {
      'process.env': process.env
    }
  }

  return userConfig;
});
