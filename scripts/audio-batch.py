import os, sherpa_onnx, soundfile as sf, json, sys, glob, subprocess, numpy as np, time
# Modelo: https://github.com/k2-fsa/sherpa-onnx/releases (tts-models: vits-piper-es_AR-daniela-high). pip install sherpa-onnx soundfile numpy
d=os.environ.get('VOICE_DIR','vits-piper-es_AR-daniela-high')
onnx=glob.glob(d+'/*.onnx')[0]
cfg=sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=onnx,tokens=d+'/tokens.txt',data_dir=d+'/espeak-ng-data',noise_scale=0.6,noise_scale_w=0.7),num_threads=2),max_num_sentences=1)
tts=sherpa_onnx.OfflineTts(cfg)
SPEED=0.92
src=json.load(open(sys.argv[1])); outdir=sys.argv[2]; manp=sys.argv[3]
man=json.load(open(manp)) if os.path.exists(manp) else {}
os.makedirs(outdir,exist_ok=True)
def gen(t):
    a=tts.generate(t,sid=0,speed=SPEED); return np.array(a.samples,dtype=np.float32),a.sample_rate
keys=[k for k in src if k not in man]
print('pending',len(keys),flush=True)
t0=time.time()
for n,k in enumerate(keys):
    e=src[k]; sr=22050
    lead=np.zeros(int(0.15*22050),dtype=np.float32)
    if e['kind']=='text':
        a,sr=gen(e['speak']); audio=np.concatenate([lead,a,np.zeros(int(0.3*sr),dtype=np.float32)]); marks=None
    else:
        segs=[lead]; marks=[]; pos=len(lead)
        for i,p in enumerate(e['parts']):
            a,sr=gen(p); marks.append(round(pos/sr if i else 0,2)); gap=np.zeros(int(0.9*sr),dtype=np.float32)
            segs+= [a,gap]; pos+=len(a)+len(gap)
        audio=np.concatenate(segs)
    peak=np.max(np.abs(audio)) or 1; audio=audio*(0.89/peak)
    wav=f'/tmp/_a.wav'; sf.write(wav,audio,sr)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',wav,'-ac','1','-ar','22050','-c:a','libmp3lame','-b:a','40k',f'{outdir}/{k}.mp3'],check=True)
    ent={'f':k+'.mp3','d':round(len(audio)/sr,2)}
    if marks: ent['m']=marks
    man[k]=ent
    if n%5==0 or n==len(keys)-1:
        json.dump(man,open(manp,'w'),separators=(',',':'),sort_keys=True); print(n+1,'/',len(keys),round(time.time()-t0),'s',flush=True)
json.dump(man,open(manp,'w'),separators=(',',':'),sort_keys=True)
print('done',flush=True)
