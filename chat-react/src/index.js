import { createRoot } from 'react-dom/client';
import App from "./App";
import AuthService from './services/auth-service';
import "./index.scss";

AuthService.init();

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);