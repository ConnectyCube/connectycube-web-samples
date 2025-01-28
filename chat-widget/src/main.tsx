import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const appConfig = {
  debug: {
    mode: 1,
  },
  chat: {
    streamManagement: {
      enable: true,
    },
  },
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App appId="7980" authKey="CmOpsbPmTjJbYjh" config={appConfig} />
  </StrictMode>,
)
