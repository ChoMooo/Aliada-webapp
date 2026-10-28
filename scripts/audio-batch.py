# Genera las narraciones con una voz neuronal gratuita usando sherpa-onnx, en tu computadora (sin cuentas ni costos).
# Modelos: https://github.com/k2-fsa/sherpa-onnx/releases (tts-models)
#   ENGINE=piper  (por defecto) → vits-piper-es_AR-daniela-high: voz "Daniela", acento argentino.
#                 Entrenada con grabaciones de Google publicadas bajo CC BY-SA 4.0 (openslr.org/61): la app da el crédito en Ajustes.
#   ENGINE=kokoro → kokoro-multi-lang-v1_0 (Apache 2.0), voz neutra "Alex"
# pip install sherpa-onnx soundfile numpy   ·   requiere ffmpeg
# Uso: VOICE_DIR=ruta/al/modelo python3 scripts/audio-batch.py textos.json public/audio src/generated/audio.json
import os, sys, re, json, time, subprocess
import numpy as np, soundfile as sf, sherpa_onnx

ENGINE = os.environ.get('ENGINE', 'piper')
D = os.environ.get('VOICE_DIR', 'vits-piper-es_AR-daniela-high' if ENGINE == 'piper' else 'kokoro-multi-lang-v1_0')
THREADS = int(os.environ.get('THREADS', '2'))
PAUSE_SENT, PAUSE_STEP, LEAD, TAIL = 0.45, 1.0, 0.2, 0.35
if ENGINE == 'piper':
    import glob
    SID, SPEED = 0, float(os.environ.get('VOICE_SPEED', '0.9'))      # un poco más despacio que lo normal
    cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
        vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=glob.glob(D + '/*.onnx')[0], tokens=D + '/tokens.txt', data_dir=D + '/espeak-ng-data',
            noise_scale=0.6, noise_scale_w=0.7),
        num_threads=THREADS), max_num_sentences=1)
    VTAG = 'piper:' + os.path.basename(D.rstrip('/')).replace('vits-piper-', '') + ':' + str(SPEED)
else:
    SID = int(os.environ.get('VOICE_SID', '29'))      # 29 = em_alex (voz masculina en español)
    SPEED = float(os.environ.get('VOICE_SPEED', '0.78'))
    cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
        kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(model=D + '/model.onnx', voices=D + '/voices.bin', tokens=D + '/tokens.txt',
            data_dir=D + '/espeak-ng-data', dict_dir=D + '/dict', lexicon=D + '/lexicon-us-en.txt', lang=os.environ.get('VOICE_LANG', 'es-419')),   # es-419: pronunciación latinoamericana (sin la z española)
        num_threads=THREADS), max_num_sentences=1)
    VTAG = 'kokoro:' + str(SID) + ':' + os.environ.get('VOICE_LANG', 'es-419')
tts = sherpa_onnx.OfflineTts(cfg)
SR = None

ABBR = r'(?<!\bDr)(?<!\bDra)(?<!\bSr)(?<!\bSra)(?<!\bAv)(?<!\bej)'
def sentences(t):
    parts = re.split(ABBR + r'(?<=[.!?…:])\s+', t.strip())
    return [p for p in parts if p.strip()]

def gen(text):
    global SR
    out = []
    for i, s in enumerate(sentences(text)):
        a = tts.generate(s, sid=SID, speed=SPEED); SR = a.sample_rate
        if i: out.append(np.zeros(int(PAUSE_SENT * SR), dtype=np.float32))
        out.append(np.array(a.samples, dtype=np.float32))
    return np.concatenate(out) if out else np.zeros(1, dtype=np.float32)

src = json.load(open(sys.argv[1])); outdir = sys.argv[2]; manp = sys.argv[3]
man = json.load(open(manp)) if os.path.exists(manp) else {}
man = {k: v for k, v in man.items() if k in src and v.get('v') == VTAG}   # rehace los que cambiaron de texto o de voz
os.makedirs(outdir, exist_ok=True)
keys = [k for k in src if k not in man]
print('pendientes', len(keys), flush=True); t0 = time.time()
for n, k in enumerate(keys):
    e = src[k]
    if e['kind'] == 'text':
        body = gen(e['speak']); marks = None
        audio = np.concatenate([np.zeros(int(LEAD * SR), np.float32), body, np.zeros(int(TAIL * SR), np.float32)])
    else:
        segs, marks, pos = [], [], 0
        for i, p in enumerate(e['parts']):
            a = gen(p)
            if not segs: segs.append(np.zeros(int(LEAD * SR), np.float32)); pos = len(segs[0])
            marks.append(round(pos / SR if i else 0, 2))
            gap = np.zeros(int(PAUSE_STEP * SR), np.float32); segs += [a, gap]; pos += len(a) + len(gap)
        audio = np.concatenate(segs)
    peak = float(np.max(np.abs(audio))) or 1.0; audio = audio * (0.9 / peak)
    wav = os.path.join(outdir, '_tmp.wav'); sf.write(wav, audio, SR)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-af', 'highpass=f=70,loudnorm=I=-17:TP=-1.5', '-ac', '1', '-ar', '24000', '-c:a', 'libmp3lame', '-b:a', '48k', f'{outdir}/{k}.mp3'], check=True)
    ent = {'f': k + '.mp3', 'd': round(len(audio) / SR, 2), 'v': VTAG}
    if marks: ent['m'] = marks
    man[k] = ent
    if n % 5 == 0 or n == len(keys) - 1:
        json.dump(man, open(manp, 'w'), separators=(',', ':'), sort_keys=True); print(n + 1, '/', len(keys), round(time.time() - t0), 's', flush=True)
json.dump(man, open(manp, 'w'), separators=(',', ':'), sort_keys=True)
# borra mp3 que ya no se usan
used = {v['f'] for v in man.values()}
for f in os.listdir(outdir):
    if f.endswith('.mp3') and f not in used: os.remove(os.path.join(outdir, f))
os.path.exists(wav) and os.remove(wav)
print('listo', flush=True)
