import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { mut, gp } from '../../store';
import { uid } from '../../lib/format';
import { Button, MoneyInput, TextInput } from '../../ui';

/* Editor de filas nombre + monto (ingresos, gastos, ahorros, materiales…) */
export function RowEditor({ path, rows, currency, addLabel, namePh = 'Nombre' }: { path: string; rows: any[]; currency?: boolean; addLabel: string; namePh?: string }) {
  const upd = (id: string, f: string, v: string) => mut((d) => { const it = (gp(d, path) as any[]).find((x) => x.id === id); if (it) it[f] = v; });
  const del = (id: string) => mut((d) => { const a = gp(d, path) as any[]; const i = a.findIndex((x) => x.id === id); if (i >= 0) a.splice(i, 1); });
  const add = () => mut((d) => { (gp(d, path) as any[]).push(currency ? { id: uid(), n: '', m: '', mon: 'ARS' } : { id: uid(), n: '', m: '' }); });
  return (
    <div className="flex flex-col gap-2.5">
      <AnimatePresence initial={false}>
        {rows.map((it) => (
          <motion.div key={it.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_9.5rem_auto] gap-2 items-center">
            <div className="col-span-2 sm:col-span-1 min-w-0"><TextInput label="Nombre" value={it.n} onChange={(v) => upd(it.id, 'n', v)} placeholder={namePh} /></div>
            <div className="flex gap-2 min-w-0">
              <div className="flex-1 min-w-0 sm:w-[9.5rem]"><MoneyInput label="Monto" value={it.m} onChange={(v) => upd(it.id, 'm', v)} cur={it.mon === 'USD' ? 'US$' : '$'} /></div>
              {currency && (
                <select aria-label="Moneda" value={it.mon || 'ARS'} onChange={(e) => upd(it.id, 'mon', e.target.value)} className="!w-auto !px-2.5 !min-h-[3.3rem]">
                  <option value="ARS">$</option><option value="USD">US$</option>
                </select>
              )}
            </div>
            <button type="button" onClick={() => del(it.id)} aria-label="Quitar" className="grid place-items-center size-12 rounded-full border border-line bg-surface text-muted hover:text-bad sm:col-start-3 row-start-2 sm:row-start-auto col-start-2">
              <Trash2 className="size-5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      <div><Button variant="secondary" size="sm" icon={<Plus />} onClick={add}>{addLabel}</Button></div>
    </div>
  );
}
