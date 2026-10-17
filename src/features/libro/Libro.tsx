import React from 'react';
import { Navigate } from 'react-router-dom';
import { Download, FileText, NotebookPen, PackageOpen, Check, BookOpen } from 'lucide-react';
import { useStore, mut } from '../../store';
import { PageHeader, Card, Stagger, Item, Note, Progress, Disclosure, Mascot, cx } from '../../ui';

export const PARTES = [
  ['Entender los cambios', 'Qué está pasando en tu cuerpo y cómo se forma la imagen corporal.'],
  ['Reconstruir la relación con una misma', 'Autoestima, aceptación, comparación y redes, vestirte y moverte por placer.'],
  ['Sexualidad e intimidad', 'Deseo, intimidad, salud sexual, pareja y nuevos acuerdos.'],
  ['Tu nueva etapa', 'Límites, prioridades y cómo construir tu nueva versión.']
];
export const DIAS = ['Escribí tres cosas que tu cuerpo te permite hacer hoy.', 'Convertí una crítica automática de hoy en una descripción neutral de los hechos.', 'Mirate al espejo durante un minuto entero sin buscar ningún defecto.', 'Usá una prenda que te guste por cómo te hace sentir, no por cómo te queda.', 'Anotá qué situaciones concretas activan más tu inseguridad corporal.', 'Hacé una actividad corporal solamente por placer, sin objetivo de rendimiento.', 'Escribile una carta breve a tu cuerpo.', 'Identificá una regla estética que aprendiste, sin haberla elegido.', 'Preguntate quién serías si nadie pudiera opinar sobre tu apariencia.', 'Silenciá o dejá de seguir una cuenta que te active la comparación.', 'Anotá cinco cualidades tuyas que no tengan relación con tu físico.', 'Hablate hoy como le hablarías a una amiga querida.', 'Hacé algo que venís evitando por inseguridad corporal.', 'Registrá qué emociones aparecen cuando te comparás con otra persona.', 'Aprendé algo sobre menopausia o salud sexual desde una fuente confiable.', 'Identificá qué condiciones te ayudan a sentirte segura en la intimidad.', 'Escribí qué significa el deseo para vos, hoy, en esta etapa.', 'Si tenés pareja, conversá sobre una cosa que hoy necesitás distinta.', 'Si notás dolor o sequedad, anotá los síntomas y considerá una consulta.', 'Permitite una experiencia sensorial agradable, sin ningún objetivo de por medio.', 'Escribí tres límites que querés empezar a respetar más.', 'Elegí una actividad que te conecte con tu identidad, más allá del cuerpo.', 'Escribí una cosa que querés recuperar de otra etapa de tu vida.', 'Escribí una cosa completamente nueva que querés probar.', 'Revisá tu armario y separá las prendas que te hacen sentir incómoda.', 'Hacé algo que normalmente postergás por atender a otras personas.', 'Escribí cinco cosas que todavía querés experimentar en tu vida.', 'Elegí una idea de este libro que quieras conservar y aplicar.', 'Escribí cómo querés que se sienta tu vida dentro de un año.', 'Completá la frase: “Mi nueva versión es…”.'];
const FILES = [
  { f: 'libro/Kit-Mi-nueva-version.zip', n: 'Kit completo', s: 'Ebook + cuaderno + guía de uso (.zip, 280 kB)', icon: <PackageOpen /> },
  { f: 'libro/Ebook-Mi-nueva-version.pdf', n: 'Ebook', s: '20 capítulos en 4 partes (PDF, 25 páginas)', icon: <BookOpen /> },
  { f: 'libro/Cuaderno-de-trabajo.pdf', n: 'Cuaderno de trabajo', s: 'Programa de 30 días y ejercicios (PDF, 6 páginas)', icon: <NotebookPen /> }
];

export default function Libro() {
  const d = useStore((s) => s.d);
  if (d.perfil.sexo !== 'mujer') return <Navigate to="/" replace />;
  const hechos = Object.keys(d.libro.dias).length;
  const next = DIAS.findIndex((_, i) => !d.libro.dias[i + 1]);
  return (
    <Stagger className="flex flex-col gap-6">
      <Item><PageHeader kicker="Tu libro" title="Mi nueva versión" lead="Un acompañamiento para mujeres de más de 50 sobre el cuerpo, la autoestima y la identidad en esta etapa." /></Item>
      <Item><Card className="flex flex-col sm:flex-row gap-5 items-center">
        <img src="libro/portada.webp" alt="Portada del libro Mi nueva versión" className="w-40 sm:w-44 rounded-lg shadow-lift" />
        <div className="flex flex-col gap-3 min-w-0">
          <p className="text-[1rem]">Un ebook para leer de corrido o por capítulos, y un cuaderno con un programa de 30 días para llevar a la práctica, con calma.</p>
          <div className="flex flex-col gap-2">
            {FILES.map((x, i) => (
              <a key={x.f} href={x.f} download onClick={() => mut((s) => { s.libro.desc += 1; })}
                className={cx('flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors', i === 0 ? 'border-accent bg-accent text-onaccent hover:opacity-95' : 'border-line bg-surface hover:border-ink/30')}>
                <span className={cx('grid place-items-center size-10 rounded-lg [&_svg]:size-5 shrink-0', i === 0 ? 'bg-white/15' : 'bg-sunk')}>{x.icon}</span>
                <span className="flex-1 min-w-0"><b className="block">{x.n}</b><span className={cx('block text-[.84rem]', i === 0 ? 'opacity-85' : 'text-muted')}>{x.s}</span></span>
                <Download className="size-5 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </Card></Item>

      <Item><Card className="flex flex-col gap-3">
        <h2 className="text-[1.3rem]">Cómo usarlo</h2>
        <p className="text-[.98rem]">Leé un capítulo del ebook y completá el ejercicio o el día correspondiente del cuaderno. No hace falta seguir un orden estricto: cada capítulo funciona por separado.</p>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {PARTES.map(([t, s], i) => <div key={t} className="rounded-xl bg-sunk p-3.5"><span className="text-[.78rem] font-semibold text-accent">Parte {i + 1}</span><b className="block font-head font-semibold">{t}</b><span className="text-[.88rem] text-muted">{s}</span></div>)}
        </div>
      </Card></Item>

      <Item><Card className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div><h2 className="text-[1.3rem]">Tu programa de 30 días</h2><p className="text-[.92rem] text-muted">Un día por vez, sin culpa si te salteás alguno. Marcá los que vas haciendo.</p></div>
          <Mascot size={64} idle={false} />
        </div>
        <Progress value={hechos} max={30} label="Tu avance" right={`${hechos} de 30`} />
        {next >= 0 && <div className="rounded-xl border-[1.5px] border-accent bg-accent/[.06] p-4"><span className="text-[.8rem] font-semibold text-accent">Para hoy · Día {next + 1}</span><p className="text-[1.05rem] mt-0.5">{DIAS[next]}</p>
          <button className="mt-3 inline-flex items-center gap-2 rounded-lg bg-accent text-onaccent px-4 min-h-[2.75rem] font-semibold" onClick={() => mut((s) => { s.libro.dias[next + 1] = 1; })}><Check className="size-5" />Lo hice</button></div>}
        <Disclosure title="Ver los 30 días">
          <ol className="flex flex-col gap-1 pt-2">{DIAS.map((t, i) => {
            const on = !!d.libro.dias[i + 1];
            return <li key={i}><button className="w-full flex items-start gap-3 text-left py-2" onClick={() => mut((s) => { if (s.libro.dias[i + 1]) delete s.libro.dias[i + 1]; else s.libro.dias[i + 1] = 1; })} aria-pressed={on}>
              <span className={cx('grid place-items-center size-6 rounded-md border-[1.5px] shrink-0 mt-0.5', on ? 'bg-accent border-accent text-onaccent' : 'border-line')}>{on && <Check className="size-4" />}</span>
              <span className={cx('text-[.97rem]', on && 'text-muted line-through')}><b className="mr-1">Día {i + 1}.</b>{t}</span></button></li>;
          })}</ol>
        </Disclosure>
      </Card></Item>

      <Item><Note tone="info">Material educativo y de reflexión. No reemplaza el acompañamiento de un profesional de salud mental, médico o sexólogo matriculado. La información sobre síntomas y tratamientos es general y toda decisión de salud debe evaluarse de forma individual.</Note></Item>
      <Item><Card tone="sunk"><span className="flex items-center gap-2 text-[.9rem]"><FileText className="size-4" />Los archivos se guardan en la carpeta de descargas de tu celular o computadora.</span></Card></Item>
    </Stagger>
  );
}
