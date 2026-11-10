/* Ahorro de batería (Ajustes): apaga lo que más consume — el agua en movimiento, los videos de fondo,
   las auroras, las estrellas y los brillos que se mueven. Las transiciones cortas quedan. */
import { useD } from '../store';
export const useAhorro = () => useD((d) => !!d.aj.bat);
