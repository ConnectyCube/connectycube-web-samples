import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <App appId="7980" authKey="CmOpsbPmTjJbYjh" config={{ debug: { mode: 1 } }} />
)
