import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import App from './App';
import { ErrorBoundary } from './ui/ErrorBoundary';
import '@fontsource-variable/atkinson-hyperlegible-next/wght.css'; // tipografía propia, sin pedirla a Google (funciona sin internet)
import '@fontsource/instrument-serif/latin-400-italic.css'; // títulos grandes con emoción (solo cursiva, solo latín)
import './styles.css';

/* Llegó algo desde "Compartir" de otra app: limpiamos la dirección y abrimos "Cargar sin escribir" */
if (new URLSearchParams(location.search).has('compartido')) {
  history.replaceState(null, '', location.pathname + '#/finanzas/cargar?de=compartido');
}

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
