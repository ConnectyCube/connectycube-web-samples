import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App
      appId="7980"
      authKey="CmOpsbPmTjJbYjh"
      config={{
        debug: {
          mode: 1,
        },
        chat: {
          streamManagement: {
            enable: true,
          },
        },
      }}
    />
  </StrictMode>,
)
