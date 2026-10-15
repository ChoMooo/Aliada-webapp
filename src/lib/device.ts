export type OS = 'android' | 'ios';
export function detectOS(): OS | '' {
  const ua = navigator.userAgent || '';
  if (/iphone|ipad|ipod/i.test(ua) || (/Macintosh/.test(ua) && 'ontouchend' in document)) return 'ios';
  if (/android/i.test(ua)) return 'android';
  return '';
}
export const isIOS = () => detectOS() === 'ios';
export const isStandalone = () => window.matchMedia?.('(display-mode: standalone)').matches || (navigator as any).standalone === true;
