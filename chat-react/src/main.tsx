import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initConnectyCube } from '@connectycube/react';
import { appConfig, credentials } from './config.ts';
import App from './App.tsx'

initConnectyCube(credentials, appConfig);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
