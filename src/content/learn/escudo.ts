import { F, S } from './shared';

/* Mini video del módulo Escudo antiestafas */
const UNK = { v: 'chat', title: '+54 9 11 5555-0192', sub: 'Número desconocido', av: 6 };
export const ESCUDO_DEMO = [
  F(S('wa', { ...UNK, msgs: [{ t: 'Ma, soy yo, cambié de número. Necesito que me transfieras $ 80.000 urgente, después te explico' }], hl: 'm0' }), 'Te llega un mensaje urgente de un número nuevo que dice ser de la familia.'),
  F(S('wa', { ...UNK, msgs: [{ t: 'Ma, soy yo, cambié de número…' }, { t: 'Dale, rápido que me cortan' }], hl: 'm1' }), 'Primera señal: el apuro. La urgencia es para que no pienses.'),
  F(S('wa', { v: 'call', title: 'Hija', pic: 3, hl: 'end' }), 'Cortá y llamá vos al número que ya tenías agendado.'),
  F(S('wa', { v: 'chat', title: 'Hija', msgs: [{ t: '¿Qué? No, ma, yo no te escribí. ¡Es una estafa!' }], hl: 'm0' }), 'Si no era ella, no respondas más al número desconocido.'),
  F(S('wa', { v: 'list', title: 'Info. del contacto', info: '+54 9 11 5555-0192', infoSub: 'Número desconocido', items: [{ t: 'Bloquear', i: 'ban', danger: true }, { t: 'Reportar', i: 'flag', danger: true }], hl: 'r1' }), 'Reportalo y bloquealo. Y acordá con tu familia una palabra clave para emergencias.')
];
