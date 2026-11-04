/** @type {import('tailwindcss').Config} */
const v = (n) => `rgb(var(--${n}) / <alpha-value>)`;
export default {
  future: { hoverOnlyWhenSupported: true },
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: v('bg'), surface: v('surface'), sunk: v('sunk'), ink: v('ink'), muted: v('muted'), line: v('line'),
        teal: v('teal'), brand: v('brand'), onbrand: v('onbrand'), accent: v('accent'), onaccent: v('onaccent'), glow: v('glow'),
        sky: v('sky'), skysoft: v('skysoft'), amber: v('amber'), ambersoft: v('ambersoft'), mint: v('mint'),
        coral: v('coral'), warn: v('warn'), warnink: v('warnink'), bad: v('bad'), badsoft: v('badsoft'), violet: v('violet'), violetsoft: v('violetsoft')
      },
      fontFamily: {
        head: ['"Atkinson Hyperlegible Next Variable"', '"Atkinson Hyperlegible Next"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        body: ['"Atkinson Hyperlegible Next Variable"', '"Atkinson Hyperlegible Next"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        /* Títulos grandes con emoción (solo en tamaños grandes): Instrument Serif, cursiva */
        display: ['"Instrument Serif"', 'Georgia', '"Times New Roman"', 'serif']
      },
      /* Animaciones que usan los componentes de Aceternity UI */
      keyframes: {
        'meteor-effect': { '0%': { transform: 'rotate(215deg) translateX(0)', opacity: '1' }, '70%': { opacity: '1' }, '100%': { transform: 'rotate(215deg) translateX(-500px)', opacity: '0' } },
        scroll: { to: { transform: 'translate(calc(-50% - 0.5rem))' } },
        aurora: { from: { backgroundPosition: '50% 50%, 50% 50%' }, to: { backgroundPosition: '350% 50%, 350% 50%' } }
      },
      animation: {
        'meteor-effect': 'meteor-effect 5s linear infinite',
        scroll: 'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
        aurora: 'aurora 60s linear infinite'
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
