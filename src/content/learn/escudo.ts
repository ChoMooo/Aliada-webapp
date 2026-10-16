import { F, app } from './shared';

/* Mini video del módulo Escudo antiestafas */
export const ESCUDO_DEMO = [
  F({ k: 'chat', title: '+54 9 11 5555-0192', sub: 'Número desconocido', msgs: [{ t: 'Ma, soy yo, cambié de número. Necesito que me transfieras $ 80.000 urgente, después te explico' }], hl: 'm0' }, 'Te llega un mensaje urgente de un número nuevo que dice ser de la familia.'),
  F({ k: 'chat', title: '+54 9 11 5555-0192', sub: 'Número desconocido', msgs: [{ t: 'Ma, soy yo, cambié de número…' }, { t: 'Dale, rápido que me cortan' }], hl: 'm1' }, 'Primera señal: el apuro. La urgencia es para que no pienses.'),
  F({ k: 'call', name: 'Hija (número de siempre)', hl: 'end' }, 'Cortá y llamá vos al número que ya tenías agendado.'),
  F({ k: 'chat', title: 'Hija', msgs: [{ t: '¿Qué? No, ma, yo no te escribí. ¡Es una estafa!' }], hl: 'm0' }, 'Si no era ella, no respondas más al número desconocido.'),
  F(app('Contacto', [{ b: 'card', t: '+54 9 11 5555-0192', s: 'Número desconocido', i: 'persona' }, { b: 'rows', items: [{ t: 'Bloquear', i: 'bloquear' }, { t: 'Reportar', i: 'denunciar', danger: true }], hl: 1 }], undefined, { tone: '#1f6b4f' }), 'Reportalo y bloquealo. Y acordá con tu familia una palabra clave para emergencias.')
];
