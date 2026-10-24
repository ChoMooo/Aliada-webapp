/* Si una pantalla falla, en vez de quedar todo en blanco se muestra un aviso con salida */
import React from 'react';

type S = { err: Error | null };
export class ErrorBoundary extends React.Component<{ children: React.ReactNode; resetKey?: string }, S> {
  state: S = { err: null };
  static getDerivedStateFromError(err: Error) { return { err }; }
  componentDidCatch(err: Error, info: React.ErrorInfo) { console.error('[Aliada] error en pantalla:', err, info.componentStack); }
  componentDidUpdate(prev: { resetKey?: string }) { if (this.state.err && prev.resetKey !== this.props.resetKey) this.setState({ err: null }); }
  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div className="min-h-[60vh] grid place-items-center px-5 py-10 text-center">
        <div className="max-w-[26rem] flex flex-col items-center gap-3">
          <b className="font-head text-[1.4rem]">Algo no se pudo mostrar</b>
          <p className="text-muted">Tus datos están a salvo. Probá volver al inicio; si vuelve a pasar, recargá la página.</p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <button className="min-h-[3rem] px-5 rounded-lg bg-accent text-onaccent font-semibold" onClick={() => { location.hash = '#/'; this.setState({ err: null }); }}>Volver al inicio</button>
            <button className="min-h-[3rem] px-5 rounded-lg bg-sunk font-semibold" onClick={() => location.reload()}>Recargar</button>
          </div>
          <code className="mt-3 text-[.72rem] text-muted break-all">{String(this.state.err?.message || this.state.err)}</code>
        </div>
      </div>
    );
  }
}
