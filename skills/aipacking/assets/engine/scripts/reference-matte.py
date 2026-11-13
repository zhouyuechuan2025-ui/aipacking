import argparse,json,time,hashlib
from pathlib import Path
import numpy as np,cv2,onnxruntime as ort
from PIL import Image
p=argparse.ArgumentParser();p.add_argument('--video',default='public/presenter.mp4');p.add_argument('--model',default='models/rvm_mobilenetv3_fp32.onnx');p.add_argument('--out',default='public/matte');a=p.parse_args()
out=Path(a.out);out.mkdir(parents=True,exist_ok=True);opt=ort.SessionOptions();opt.intra_op_num_threads=4
sess=ort.InferenceSession(a.model,sess_options=opt,providers=['CPUExecutionProvider']);rec=[np.zeros((1,1,1,1),np.float32) for _ in range(4)];cap=cv2.VideoCapture(a.video);n=0;t=time.time();stats=[]
while True:
 ok,bgr=cap.read()
 if not ok:break
 rgb=cv2.cvtColor(bgr,cv2.COLOR_BGR2RGB);h,w=rgb.shape[:2];src=rgb.transpose(2,0,1)[None].astype(np.float32)/255
 fgr,alpha,*rec=sess.run(None,dict(src=src,r1i=rec[0],r2i=rec[1],r3i=rec[2],r4i=rec[3],downsample_ratio=np.array([min(1,384/w)],np.float32)))
 rgba=np.dstack([rgb,(np.clip(alpha[0,0],0,1)*255).astype(np.uint8)]);Image.fromarray(rgba).save(out/f'f_{n+1:04}.png',compress_level=2)
 stats.append(float(alpha.mean()));n+=1
 if n%30==0:print('matte',n,'frames',round(time.time()-t,1),'seconds',flush=True)
cap.release();(out/'meta.json').write_text(json.dumps(dict(frames=n,fps=30,width=w,height=h,model='RVM MobileNetV3 FP32',source=a.video,model_sha256=hashlib.sha256(Path(a.model).read_bytes()).hexdigest(),alpha_mean_min=min(stats),alpha_mean_max=max(stats))),encoding='utf8');print('Matte finished',n,flush=True)
