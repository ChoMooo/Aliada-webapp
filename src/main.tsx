import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <HashRouter>
        <App />
      </HashRouter>
    </MotionConfig>
  </React.StrictMode>
);

/* La pantalla de carga se va cuando la app ya está lista y el logo terminó de armarse (máx. ~2,9 s) */
(function hideSplash() {
  const el = document.getElementById('splash');
  if (!el) return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const minMs = reduce ? 700 : 2450;
  const wait = Math.max(0, minMs - performance.now());
  const go = () => { el.classList.add('out'); setTimeout(() => el.remove(), 450); };
  setTimeout(() => requestAnimationFrame(go), wait);
  el.addEventListener('click', go, { once: true });
})();

if (!__PREVIEW__) {
  import('virtual:pwa-register').then(({ registerSW }) => registerSW({ immediate: true })).catch(() => {});
}
