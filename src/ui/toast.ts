import { create } from 'zustand';
type T = { id: number; msg: string };
export const useToasts = create<{ list: T[] }>(() => ({ list: [] }));
let n = 0;
export function toast(msg: string) {
  const id = ++n;
  useToasts.setState((s) => ({ list: [...s.list, { id, msg }] }));
  setTimeout(() => useToasts.setState((s) => ({ list: s.list.filter((x) => x.id !== id) })), 2600);
}
