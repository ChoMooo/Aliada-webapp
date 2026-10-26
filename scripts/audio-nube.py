# Genera las narraciones con una voz argentina de calidad usando un servicio en la nube.
# Se corre UNA vez en tu computadora (los audios quedan guardados en la app; después no hay costos).
#
#   Azure (voces es-AR "Tomás" y "Elena"; el plan gratuito F0 incluye 500.000 caracteres por mes):
#     AZURE_KEY=tu_clave AZURE_REGION=eastus PROVIDER=azure VOICE=es-AR-TomasNeural \
#       python3 scripts/audio-nube.py textos.json public/audio src/generated/audio.json
#
#   ElevenLabs (pago para uso comercial; elegí en su biblioteca una voz con acento argentino y copiá su ID):
#     ELEVEN_KEY=tu_clave PROVIDER=elevenlabs VOICE=id_de_la_voz \
#       python3 scripts/audio-nube.py textos.json public/audio src/generated/audio.json
#
# Antes de gastar, el script muestra cuántos caracteres va a mandar y pide confirmación (o SI=1).
# Requiere: pip install numpy soundfile   ·   ffmpeg instalado
# Las claves se leen de variables de entorno: no las escribas en archivos del proyecto.
import os, sys, re, json, time, subprocess, urllib.request, urllib.error, io
from xml.sax.saxutils import escape
import numpy as np, soundfile as sf

PROVIDER = os.environ.get('PROVIDER', 'azure')
VOICE = os.environ.get('VOICE', 'es-AR-TomasNeural' if PROVIDER == 'azure' else '')
RATE = os.environ.get('RATE', '-10%')          # Azure: un poco más despacio que lo normal
SR = 24000
PAUSE_SENT, PAUSE_STEP, LEAD, TAIL = 0.45, 1.0, 0.2, 0.35
ABBR = r'(?<!\bDr)(?<!\bDra)(?<!\bSr)(?<!\bSra)(?<!\bAv)(?<!\bej)'

def sentences(t):
    return [p for p in re.split(ABBR + r'(?<=[.!?…:])\s+', t.strip()) if p.strip()]

def post(url, data, headers, tries=4):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, data=data, headers=headers, method='POST')
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503) and i < tries - 1:
                time.sleep(2 * (i + 1)); continue
            raise SystemExit(f'Error {e.code} del servicio: {e.read()[:300]!r}')
    raise SystemExit('El servicio no respondió.')

def ssml_body(text):
    """Lo que Azure cobra: el texto MÁS las etiquetas (salvo <speak> y <voice>). Por eso se cuenta igual que se manda."""
    body = '<break time="{}ms"/>'.format(int(PAUSE_SENT * 1000)).join(escape(s) for s in sentences(text))
    return f"<prosody rate='{RATE}'>{body}</prosody>"

def azure(text):
    key, region = os.environ['AZURE_KEY'], os.environ.get('AZURE_REGION', 'eastus')
    ssml = f"<speak version='1.0' xml:lang='es-AR'><voice name='{VOICE}'>{ssml_body(text)}</voice></speak>"
    raw = post(f'https://{region}.tts.speech.microsoft.com/cognitiveservices/v1', ssml.encode('utf-8'), {
        'Ocp-Apim-Subscription-Key': key, 'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm', 'User-Agent': 'aliada-digital'})
    a, sr = sf.read(io.BytesIO(raw), dtype='float32'); assert sr == SR
    return a

def eleven(text):
    key = os.environ['ELEVEN_KEY']
    out = []
    for i, s in enumerate(sentences(text)):
        raw = post(f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE}?output_format=pcm_24000', json.dumps({
            'text': s, 'model_id': os.environ.get('ELEVEN_MODEL', 'eleven_multilingual_v2'), 'language_code': 'es',
            'voice_settings': {'stability': 0.55, 'similarity_boost': 0.8, 'speed': 0.92}}).encode(), {
            'xi-api-key': key, 'Content-Type': 'application/json', 'Accept': 'audio/pcm'})
        if i: out.append(np.zeros(int(PAUSE_SENT * SR), np.float32))
        out.append(np.frombuffer(raw, dtype='<i2').astype(np.float32) / 32768)
    return np.concatenate(out)

gen = azure if PROVIDER == 'azure' else eleven

src = json.load(open(sys.argv[1])); outdir = sys.argv[2]; manp = sys.argv[3]
man = json.load(open(manp)) if os.path.exists(manp) else {}
man = {k: v for k, v in man.items() if k in src and v.get('v') == PROVIDER + ':' + VOICE}   # rehace todo si cambia la voz
os.makedirs(outdir, exist_ok=True)
keys = [k for k in src if k not in man]
def costo(e):
    t = [e['speak']] if e.get('speak') else e.get('parts', [])
    return sum(len(ssml_body(x)) if PROVIDER == 'azure' else len(x) for x in t)
chars = sum(costo(src[k]) for k in keys)
# Tope de seguridad: el plan gratis de Azure (F0) trae 500.000 caracteres por mes. Nunca mandamos más de TOPE.
TOPE = int(os.environ.get('TOPE', '450000'))
if chars > TOPE: sys.exit(f'Son {chars:,} caracteres y el tope es {TOPE:,}. No se manda nada.'.replace(',', '.'))
print(f'{len(keys)} audios pendientes · {chars:,} caracteres facturables · servicio {PROVIDER} · voz {VOICE}'.replace(',', '.'), flush=True)
if not keys: sys.exit(0)
if os.environ.get('SI') != '1' and input('¿Generar? (s/n) ').strip().lower() != 's': sys.exit('Cancelado.')

t0 = time.time()
for n, k in enumerate(keys):
    e = src[k]; marks = None
    if e['kind'] == 'text':
        audio = np.concatenate([np.zeros(int(LEAD * SR), np.float32), gen(e['speak']), np.zeros(int(TAIL * SR), np.float32)])
    else:
        segs, marks, pos = [np.zeros(int(LEAD * SR), np.float32)], [], int(LEAD * SR)
        for i, p in enumerate(e['parts']):
            a = gen(p); marks.append(round(pos / SR if i else 0, 2))
            gap = np.zeros(int(PAUSE_STEP * SR), np.float32); segs += [a, gap]; pos += len(a) + len(gap)
        audio = np.concatenate(segs)
    peak = float(np.max(np.abs(audio))) or 1.0; audio = audio * (0.9 / peak)
    wav = os.path.join(outdir, '_tmp.wav'); sf.write(wav, audio, SR)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-af', 'highpass=f=70,loudnorm=I=-17:TP=-1.5', '-ac', '1', '-ar', '24000',
                    '-c:a', 'libmp3lame', '-b:a', '48k', f'{outdir}/{k}.mp3'], check=True)
    os.remove(wav)
    ent = {'f': k + '.mp3', 'd': round(len(audio) / SR, 2), 'v': PROVIDER + ':' + VOICE}
    if marks: ent['m'] = marks
    man[k] = ent
    if n % 5 == 0 or n == len(keys) - 1:
        json.dump(man, open(manp, 'w'), separators=(',', ':'), sort_keys=True); print(n + 1, '/', len(keys), round(time.time() - t0), 's', flush=True)
json.dump(man, open(manp, 'w'), separators=(',', ':'), sort_keys=True)
used = {v['f'] for v in man.values()}
for f in os.listdir(outdir):
    if f.endswith('.mp3') and f not in used: os.remove(os.path.join(outdir, f))
print('Listo. Revisá algunos audios y después subí los cambios.', flush=True)
