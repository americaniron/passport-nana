import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { BusinessProvider } from './context/BusinessContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <BusinessProvider>
      <App />
    </BusinessProvider>
  </ThemeProvider>
);
