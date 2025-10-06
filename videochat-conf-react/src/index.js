import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CallProvider } from './services/call-service';

export const rerenderTree = () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));

  root.render(
    <BrowserRouter>
      <CallProvider>
        <App />
      </CallProvider>
    </BrowserRouter>
  );
};
rerenderTree();