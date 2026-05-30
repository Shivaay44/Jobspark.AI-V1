import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { Toaster } from 'sonner';
import App from './App';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import { FirebaseProvider } from './components/FirebaseProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <FirebaseProvider>
        <Toaster richColors position="top-right" />
        <App />
      </FirebaseProvider>
    </ErrorBoundary>
  </StrictMode>,
);
