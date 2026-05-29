import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { Toaster } from 'sonner';
import App from './App';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <>
        <Toaster richColors position="top-right" />
        <App />
      </>
    </ErrorBoundary>
  </StrictMode>,
);
