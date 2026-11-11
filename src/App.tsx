import React, { useEffect, useState } from 'react';
import { veilDelay } from './lib/navhist';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useD } from './store';
import { AppShell } from './layout/AppShell';
import { Toaster, ease } from './ui';
import { ErrorBoundary } from './ui/ErrorBoundary';
import { ACCESS_REQUIRED } from './config';
import Welcome from './features/Welcome';
import Empezar from './features/Empezar';
import AccessGate from './features/AccessGate';
import Home from './features/Home';
import { MisionesPage, MisionPage } from './features/Misiones';
const Lab = import.meta.env.DEV ? React.lazy(() => import('./features/Lab')) : null; // banco de pruebas, solo en desarrollo
import FinanzasHub from './features/finanzas/Hub';
import { copiaAutomatica } from './lib/copia';
/* Cada sección se baja aparte, la primera vez que se abre: el Inicio arranca más rápido.
   (Una vez instalada, la app ya tiene todo guardado y funciona sin internet igual que antes.) */
const lazy = React.lazy;
const nombrado = <M extends Record<string, any>>(f: () => Promise<M>, k: keyof M) => React.lazy(() => f().then((m) => ({ default: m[k] as React.ComponentType<any> })));
const Logros = lazy(() => import('./features/Logros'));
const Revision = lazy(() => import('./features/Revision'));
const PanelFinanzas = lazy(() => import('./features/finanzas/Panel'));
const PanelInversiones = lazy(() => import('./features/inversiones/Panel'));
const Settings = lazy(() => import('./features/Settings'));
const Resumen = lazy(() => import('./features/Resumen'));
const DigitalHub = lazy(() => import('./features/digital/Hub'));
const Diagnostico = lazy(() => import('./features/digital/Diagnostico'));
const PrimerosAjustes = lazy(() => import('./features/digital/PrimerosAjustes'));
const Modulo = lazy(() => import('./features/learn/Modulo'));
const Leccion = lazy(() => import('./features/learn/Leccion'));
const EscudoHub = lazy(() => import('./features/escudo/Hub'));
const InvHub = lazy(() => import('./features/inversiones/Hub'));
const Calculadora = lazy(() => import('./features/inversiones/Calculadora'));
const Glosario = lazy(() => import('./features/inversiones/Glosario'));
const Libro = lazy(() => import('./features/libro/Libro'));
const Salud = lazy(() => import('./features/Salud'));
const Vencimientos = lazy(() => import('./features/finanzas/vencimientos'));
const Cuotas = lazy(() => import('./features/finanzas/cuotas'));
const Simulador = lazy(() => import('./features/escudo/Simulador'));
const Analizador = lazy(() => import('./features/escudo/Analizador'));
const Familiar = lazy(() => import('./features/Familiar'));
const Plata = { Grande: nombrado(() => import('./features/finanzas/plata'), 'Grande'), Inflacion: nombrado(() => import('./features/finanzas/plata'), 'Inflacion'), Numeros: nombrado(() => import('./features/finanzas/plata'), 'Numeros'), PlataHub: nombrado(() => import('./features/finanzas/plata'), 'PlataHub'), Resultado: nombrado(() => import('./features/finanzas/plata'), 'Resultado'), Seguimiento: nombrado(() => import('./features/finanzas/plata'), 'Seguimiento') };
const Tram = { Ayuda: nombrado(() => import('./features/finanzas/tramites'), 'Ayuda'), Docs: nombrado(() => import('./features/finanzas/tramites'), 'Docs'), Guia: nombrado(() => import('./features/finanzas/tramites'), 'Guia'), Guias: nombrado(() => import('./features/finanzas/tramites'), 'Guias'), Preparar: nombrado(() => import('./features/finanzas/tramites'), 'Preparar'), Situacion: nombrado(() => import('./features/finanzas/tramites'), 'Situacion'), TramHub: nombrado(() => import('./features/finanzas/tramites'), 'TramHub') };
const Tal = { Comparar: nombrado(() => import('./features/finanzas/talento'), 'Comparar'), Ideas: nombrado(() => import('./features/finanzas/talento'), 'Ideas'), Op: nombrado(() => import('./features/finanzas/talento'), 'Op'), Perfil: nombrado(() => import('./features/finanzas/talento'), 'Perfil'), TalHub: nombrado(() => import('./features/finanzas/talento'), 'TalHub') };
const Tal2 = { Materiales: nombrado(() => import('./features/finanzas/talento2'), 'Materiales'), Oferta: nombrado(() => import('./features/finanzas/talento2'), 'Oferta'), Plan: nombrado(() => import('./features/finanzas/talento2'), 'Plan'), Precio: nombrado(() => import('./features/finanzas/talento2'), 'Precio'), Seg: nombrado(() => import('./features/finanzas/talento2'), 'Seg') };
/* Cargar sin escribir trae piezas pesadas (lector de fotos y de PDF): se baja aparte, cuando se abre */
const Cargar = React.lazy(() => import('./features/finanzas/Cargar'));

function useThemeSync() {
  const aj = useD((d) => d.aj);
  useEffect(() => {
    const r = document.documentElement;
    r.dataset.fs = aj.fs;
    r.dataset.bat = aj.bat ? '1' : '0';
    if (aj.tema === 'auto') r.removeAttribute('data-theme'); else r.dataset.theme = aj.tema;
    /* la barra del celular acompaña el tema elegido en Ajustes */
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
      const isDark = (m.getAttribute('media') || '').includes('dark');
      m.setAttribute('content', aj.tema === 'auto' ? (isDark ? '#070F1C' : '#F6F3EC') : aj.tema === 'dark' ? '#070F1C' : '#F6F3EC');
    });
  }, [aj.fs, aj.tema, aj.bat]);
}

function Page({ children }: { children: React.ReactNode }) {
  const [wait] = useState(veilDelay);
  return (
    <motion.div initial={{ opacity: 0, transform: 'translate(0px, 12px)' }} animate={{ opacity: 1, transform: 'translate(0px, 0px)' }} transition={{ duration: 0.25, ease, delay: wait }}>
      {children}
    </motion.div>
  );
}

export default function App() {
  useThemeSync();
  useEffect(() => { copiaAutomatica(); }, []); // copia en Drive, si la persona la activó
  const loc = useLocation();
  const onb = useD((d) => d.perfil.onb);
  const acceso = useD((d) => d.acceso.ok);
  if (ACCESS_REQUIRED && !acceso) return <><AccessGate /><Toaster /></>;
  if (!onb) return <><Welcome /><Toaster /></>;
  /* Primera vez: la encuesta va a pantalla completa, sin la barra de navegación */
  if (loc.pathname === '/empezar') return <><Empezar /><Toaster /></>;
  const R = (el: React.ReactNode) => <React.Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}><Page>{el}</Page></React.Suspense>;
  return (
    <AppShell>
      <ErrorBoundary resetKey={loc.pathname}>
      <Routes location={loc} key={loc.pathname}>
          <Route path="/" element={R(<Home />)} />
          <Route path="/ajustes" element={R(<Settings />)} />
          <Route path="/resumen" element={R(<Resumen />)} />
          <Route path="/finanzas" element={R(<FinanzasHub />)} />
          <Route path="/salud" element={R(<Salud />)} />
          <Route path="/finanzas/panel" element={R(<PanelFinanzas />)} />
          <Route path="/inversiones/panel" element={R(<PanelInversiones />)} />
          <Route path="/finanzas/vencimientos" element={R(<Vencimientos />)} />
          <Route path="/finanzas/cuotas" element={R(<Cuotas />)} />
          <Route path="/finanzas/cargar" element={R(<Cargar />)} />
          <Route path="/familiar" element={R(<Familiar />)} />
          <Route path="/finanzas/plata" element={R(<Plata.PlataHub />)} />
          <Route path="/finanzas/plata/numeros/:i" element={R(<Plata.Numeros />)} />
          <Route path="/finanzas/plata/resultado" element={R(<Plata.Resultado />)} />
          <Route path="/finanzas/plata/inflacion" element={R(<Plata.Inflacion />)} />
          <Route path="/finanzas/plata/seguimiento" element={R(<Plata.Seguimiento />)} />
          <Route path="/finanzas/plata/grande" element={R(<Plata.Grande />)} />
          <Route path="/finanzas/tramites" element={R(<Tram.TramHub />)} />
          <Route path="/finanzas/tramites/situacion" element={R(<Tram.Situacion />)} />
          <Route path="/finanzas/tramites/guias" element={R(<Tram.Guias />)} />
          <Route path="/finanzas/tramites/guia/:id" element={R(<Tram.Guia />)} />
          <Route path="/finanzas/tramites/preparar" element={R(<Tram.Preparar />)} />
          <Route path="/finanzas/tramites/preparar/:id" element={R(<Tram.Preparar />)} />
          <Route path="/finanzas/tramites/ayuda" element={R(<Tram.Ayuda />)} />
          <Route path="/finanzas/tramites/docs" element={R(<Tram.Docs />)} />
          <Route path="/finanzas/talento" element={R(<Tal.TalHub />)} />
          <Route path="/finanzas/talento/perfil" element={R(<Tal.Perfil />)} />
          <Route path="/finanzas/talento/ideas" element={R(<Tal.Ideas />)} />
          <Route path="/finanzas/talento/op/:id" element={R(<Tal.Op />)} />
          <Route path="/finanzas/talento/comparar" element={R(<Tal.Comparar />)} />
          <Route path="/finanzas/talento/oferta" element={R(<Tal2.Oferta />)} />
          <Route path="/finanzas/talento/precio" element={R(<Tal2.Precio />)} />
          <Route path="/finanzas/talento/materiales" element={R(<Tal2.Materiales />)} />
          <Route path="/finanzas/talento/plan" element={R(<Tal2.Plan />)} />
          <Route path="/finanzas/talento/seguimiento" element={R(<Tal2.Seg />)} />
          <Route path="/digital" element={R(<DigitalHub />)} />
          <Route path="/digital/diagnostico" element={R(<Diagnostico />)} />
          <Route path="/digital/ajustes" element={R(<PrimerosAjustes />)} />
          <Route path="/digital/m/:mod" element={R(<Modulo />)} />
          <Route path="/digital/m/:mod/:lec" element={R(<Leccion />)} />
          <Route path="/digital/escudo" element={R(<EscudoHub />)} />
          <Route path="/digital/escudo/simulador" element={R(<Simulador />)} />
          <Route path="/digital/escudo/analizador" element={R(<Analizador />)} />
          <Route path="/finanzas/m/:mod" element={R(<Modulo />)} />
          <Route path="/inversiones" element={R(<InvHub />)} />
          <Route path="/inversiones/calculadora" element={R(<Calculadora />)} />
          <Route path="/inversiones/glosario" element={R(<Glosario />)} />
          <Route path="/inversiones/m/:mod" element={R(<Modulo />)} />
          <Route path="/inversiones/m/:mod/:lec" element={R(<Leccion />)} />
          <Route path="/libro" element={R(<Libro />)} />
          <Route path="/finanzas/m/:mod/:lec" element={R(<Leccion />)} />
          <Route path="/escudo" element={<Navigate to="/digital/escudo" replace />} />
          <Route path="/escudo/simulador" element={<Navigate to="/digital/escudo/simulador" replace />} />
          <Route path="/escudo/analizador" element={<Navigate to="/digital/escudo/analizador" replace />} />
          <Route path="/digital/m/pay" element={<Navigate to="/finanzas/m/pay" replace />} />
          <Route path="/logros" element={R(<Logros />)} />
          <Route path="/revision" element={R(<Revision />)} />
          <Route path="/misiones" element={R(<MisionesPage />)} />
          <Route path="/misiones/:id" element={R(<MisionPage />)} />
          {Lab && <Route path="/lab" element={R(<React.Suspense fallback={null}><Lab /></React.Suspense>)} />}
          <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </ErrorBoundary>
      <Toaster />
    </AppShell>
  );
}
