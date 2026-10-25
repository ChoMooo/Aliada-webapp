/** @type {import('tailwindcss').Config} */
const v = (n) => `rgb(var(--${n}) / <alpha-value>)`;
export default {
  future: { hoverOnlyWhenSupported: true },
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: v('bg'), surface: v('surface'), sunk: v('sunk'), ink: v('ink'), muted: v('muted'), line: v('line'),
        brand: v('brand'), onbrand: v('onbrand'), accent: v('accent'), onaccent: v('onaccent'), glow: v('glow'),
        sky: v('sky'), skysoft: v('skysoft'), amber: v('amber'), ambersoft: v('ambersoft'), mint: v('mint'),
        warn: v('warn'), warnink: v('warnink'), bad: v('bad'), badsoft: v('badsoft'), violet: v('violet'), violetsoft: v('violetsoft')
      },
      fontFamily: {
        head: ['"Instrument Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        body: ['"Public Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      borderRadius: { xl2: '0.875rem', xl3: '1.125rem' },
      boxShadow: {
        card: '0 1px 2px rgb(var(--shadow) / .05), 0 4px 14px -6px rgb(var(--shadow) / .10)',
        lift: '0 2px 4px rgb(var(--shadow) / .08), 0 18px 40px -12px rgb(var(--shadow) / .22)'
      }
    }
  },
  plugins: []
};
