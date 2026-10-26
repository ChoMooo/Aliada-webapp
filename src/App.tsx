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
import AccessGate from './features/AccessGate';
import Home from './features/Home';
import Settings from './features/Settings';
import Resumen from './features/Resumen';
import FinanzasHub from './features/finanzas/Hub';
import * as Plata from './features/finanzas/plata';
import * as Tram from './features/finanzas/tramites';
import * as Tal from './features/finanzas/talento';
import * as Tal2 from './features/finanzas/talento2';
import DigitalHub from './features/digital/Hub';
import Diagnostico from './features/digital/Diagnostico';
import PrimerosAjustes from './features/digital/PrimerosAjustes';
import Modulo from './features/learn/Modulo';
import Leccion from './features/learn/Leccion';
import EscudoHub from './features/escudo/Hub';
import InvHub from './features/inversiones/Hub';
import Calculadora from './features/inversiones/Calculadora';
import Glosario from './features/inversiones/Glosario';
import Libro from './features/libro/Libro';
import Salud from './features/Salud';
import Vencimientos from './features/finanzas/vencimientos';
import Cuotas from './features/finanzas/cuotas';
import Simulador from './features/escudo/Simulador';
import Analizador from './features/escudo/Analizador';

function useThemeSync() {
  const aj = useD((d) => d.aj);
  useEffect(() => {
    const r = document.documentElement;
    r.dataset.fs = aj.fs;
    if (aj.tema === 'auto') r.removeAttribute('data-theme'); else r.dataset.theme = aj.tema;
    /* la barra del celular acompaña el tema elegido en Ajustes */
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
      const isDark = (m.getAttribute('media') || '').includes('dark');
      m.setAttribute('content', aj.tema === 'auto' ? (isDark ? '#070F1C' : '#F6F3EC') : aj.tema === 'dark' ? '#070F1C' : '#F6F3EC');
    });
  }, [aj.fs, aj.tema]);
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
  const loc = useLocation();
  const onb = useD((d) => d.perfil.onb);
  const acceso = useD((d) => d.acceso.ok);
  if (ACCESS_REQUIRED && !acceso) return <><AccessGate /><Toaster /></>;
  if (!onb) return <><Welcome /><Toaster /></>;
  const R = (el: React.ReactNode) => <Page>{el}</Page>;
  return (
    <AppShell>
      <ErrorBoundary resetKey={loc.pathname}>
      <Routes location={loc} key={loc.pathname}>
          <Route path="/" element={R(<Home />)} />
          <Route path="/ajustes" element={R(<Settings />)} />
          <Route path="/resumen" element={R(<Resumen />)} />
          <Route path="/finanzas" element={R(<FinanzasHub />)} />
          <Route path="/salud" element={R(<Salud />)} />
          <Route path="/finanzas/vencimientos" element={R(<Vencimientos />)} />
          <Route path="/finanzas/cuotas" element={R(<Cuotas />)} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </ErrorBoundary>
      <Toaster />
    </AppShell>
  );
}
