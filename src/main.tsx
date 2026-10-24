import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import App from './App';
import { ErrorBoundary } from './ui/ErrorBoundary';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <HashRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </HashRouter>
    </MotionConfig>
  </React.StrictMode>
);

/* Avisamos a la pantalla de carga que la app ya está lista (se va cuando termina la animación del logo) */
requestAnimationFrame(() => (window as any).__splash?.ready());

if (!__PREVIEW__) {
  import('virtual:pwa-register').then(({ registerSW }) => registerSW({ immediate: true })).catch(() => {});
}
