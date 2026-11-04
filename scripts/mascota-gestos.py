# Uso: copiar el video de la mascota como src.mp4 en una carpeta de trabajo y correr: python3 scripts/mascota-gestos.py (requiere ffmpeg, numpy, scipy, Pillow)
# Recorta los gestos del video de la mascota: saca el fondo claro (relleno desde los bordes),
# recupera los bordes suaves y arma un WebP animado con transparencia por gesto.
# python3 cut.py  -> salida en out/
import subprocess, os, sys, json
import numpy as np
from PIL import Image
from scipy import ndimage

SRC = 'src.mp4'
os.makedirs('full', exist_ok=True); os.makedirs('out', exist_ok=True)
if not os.path.exists('full/001.png'):
    subprocess.run(['ffmpeg', '-v', 'error', '-i', SRC, 'full/%03d.png'], check=True)

CLIPS = {  # nombre: (primer cuadro, último cuadro) en numeración 0..187 a 24 cuadros por segundo
    'festeja': (22, 74),
    'piensa': (92, 141),
    'senala': (159, 187),
}
T0, T1 = 7.0, 70.0
DEDUP = float(os.environ.get('DEDUP', '1.2'))  # distancia al color de fondo: debajo de T0 es fondo, arriba de T1 es la mascota

def matte(rgb):
    p = rgb.astype(np.float32)
    # color del fondo: mediana de los bordes
    border = np.concatenate([p[:8].reshape(-1, 3), p[-8:].reshape(-1, 3), p[:, :8].reshape(-1, 3), p[:, -8:].reshape(-1, 3)])
    B = np.median(border, axis=0)
    d = np.sqrt(((p - B) ** 2).sum(-1))
    # fondo = lo parecido al fondo y conectado con el borde (la panza blanca queda adentro del contorno)
    near = d < T1
    lab, n = ndimage.label(near)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bgreg = np.isin(lab, list(edge))
    a = np.ones(d.shape, np.float32)
    a[bgreg] = np.clip((d[bgreg] - T0) / (T1 - T0), 0, 1)
    # la sombra del piso (gris muy claro) se saca: la app pone su propia sombra
    gris = (p.max(-1) - p.min(-1) < 22) & (p.mean(-1) > 120)
    a[bgreg & ((d < 40) | gris)] = 0
    # recorta 2 px del borde para que no quede un halo claro sobre fondos oscuros
    a = np.minimum(a, ndimage.grey_erosion(a, size=(5, 5)) * 0.6 + a * 0.4)
    # sombra del piso: queda suave y gris
    # des-mezclar el color de los bordes con el fondo conocido
    aa = np.maximum(a, 1e-3)[..., None]
    F = np.clip((p - (1 - aa) * B) / aa, 0, 255)
    F = np.where(a[..., None] > 0.999, p, F)
    return np.dstack([F, a * 255]).astype(np.uint8)

def bbox(alpha, th=20):
    ys, xs = np.where(alpha > th)
    return xs.min(), ys.min(), xs.max(), ys.max()

info = {}
for name, (a0, a1) in CLIPS.items():
    frames = [matte(np.asarray(Image.open('full/%03d.png' % (i + 1)).convert('RGB'))) for i in range(a0, a1 + 1)]
    boxes = [bbox(f[..., 3]) for f in frames]
    x0 = min(b[0] for b in boxes) - 12; y0 = min(b[1] for b in boxes) - 12
    x1 = max(b[2] for b in boxes) + 12; y1 = max(b[3] for b in boxes) + 12
    H = 300; W = round((x1 - x0) * H / (y1 - y0))
    ims = [Image.fromarray(f).crop((x0, y0, x1, y1)).resize((W, H), Image.LANCZOS) for f in frames]
    # cuadros casi iguales (solo ruido del video) se juntan en uno que dura más: mismo movimiento, mucho menos peso
    keep, dur = [ims[0]], [1000 / 24]
    ref = np.asarray(ims[0]).astype(np.int16)
    for im in ims[1:]:
        cur = np.asarray(im).astype(np.int16)
        if np.abs(cur - ref).mean() < DEDUP: dur[-1] += 1000 / 24
        else: keep.append(im); dur.append(1000 / 24); ref = cur
    dur = [round(x) for x in dur]
    keep[0].save('out/%s.webp' % name, save_all=True, append_images=keep[1:], duration=dur, loop=1,
                lossless=False, quality=80, alpha_quality=80, method=6, minimize_size=True, allow_mixed=True, kmax=48)
    ims[-1].save('out/%s-fin.webp' % name, quality=90, alpha_quality=90, method=6)
    ims[0].save('out/%s-ini.webp' % name, quality=90, alpha_quality=90, method=6)
    info[name] = {'w': W, 'h': H, 'frames': len(ims), 'kept': len(keep), 'ms': round(len(ims) * 1000 / 24), 'kb': os.path.getsize('out/%s.webp' % name) // 1024,
                  'crop': [int(x0), int(y0), int(x1), int(y1)]}
    # hoja de control sobre fondo oscuro y claro
    sel = ims[::max(1, len(ims) // 8)][:8]
    sheet = Image.new('RGB', (W * len(sel), H * 2), (20, 28, 52))
    sheet.paste(Image.new('RGB', (W * len(sel), H), (246, 243, 236)), (0, H))
    for k, im in enumerate(sel):
        sheet.paste(im, (k * W, 0), im); sheet.paste(im, (k * W, H), im)
    sheet.save('out/%s-hoja.png' % name)
print(json.dumps(info, indent=1))
