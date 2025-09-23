import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.jsx';
import './styles/globals.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      navigate={(to) => window.history.pushState(null, '', to)}
    >
      <App />
    </ClerkProvider>
  </StrictMode>
);
