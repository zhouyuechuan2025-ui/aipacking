import React, { useLayoutEffect, useRef } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

// Original volumetric-light backgrounds (no third-party shader code).
// variant: rays | aurora | nebula | prism | tunnel | silk
const MODES: Record<string, number> = { rays: 0, aurora: 1, nebula: 2, prism: 3, tunnel: 4, silk: 5 };

const FRAG = `
precision highp float;
uniform vec2 R; uniform float T; uniform float M; uniform vec3 A; uniform vec3 B; uniform float I;
float h(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y); }
float fbm(vec2 p){ float s=0., a=.5; for(int i=0;i<5;i++){ s+=a*n(p); p=p*2.03+vec2(1.7,9.2); a*=.5; } return s; }
vec3 spec(float x){ return .5+.5*cos(6.2831*(x+vec3(0.,.33,.67))); }
void main(){
  vec2 uv=gl_FragCoord.xy/R; vec2 p=(gl_FragCoord.xy-.5*R)/R.y; vec3 c=vec3(0.);
  if(M<.5){ // god rays from above
    vec2 o=vec2(.15*sin(T*.1),.75); vec2 d=p-o; float r=length(d); float a=atan(d.x,-d.y);
    vec2 q=vec2(cos(a),sin(a));
    float b=pow(fbm(q*4.+vec2(T*.08,0.)),2.2)*1.8+pow(fbm(q*11.-vec2(T*.12,1.)),3.)*1.4;
    float fall=exp(-r*1.15)*smoothstep(-.2,.6,-d.y+.3);
    c=mix(A,B,clamp(uv.x+.2*sin(T*.2),0.,1.))*b*fall*1.7;
    c+=A*.35*exp(-r*r*6.);
    c+=vec3(1.)*pow(n(gl_FragCoord.xy*.35+T*9.),40.)*fall*2.;       // dust sparkle
  } else if(M<1.5){ // aurora curtains
    for(int i=0;i<4;i++){ float f=float(i);
      float y=.15+.18*f+ .12*fbm(vec2(p.x*1.3+T*.07*(f+1.),f*4.))-.1;
      float band=exp(-pow((p.y-y)*(7.-f),2.))*(.6+.6*fbm(vec2(p.x*6.+T*.2,f)));
      c+=mix(A,B,f/3.)*band*.55; }
    c*=smoothstep(-.6,.2,p.y+.2);
  } else if(M<2.5){ // nebula
    vec2 q=p*1.6+vec2(T*.02,0.);
    float a=fbm(q+fbm(q*1.7+T*.03)*1.4);
    c=mix(A*.2,B,smoothstep(.35,.9,a))*smoothstep(.2,.95,a)*1.2+A*pow(a,6.)*2.;
    float s=pow(h(floor(gl_FragCoord.xy/2.)),180.)*2.; c+=vec3(s);
  } else if(M<3.5){ // prismatic burst
    float r=length(p), a=atan(p.y,p.x); vec2 q=vec2(cos(a),sin(a));
    float rays=pow(fbm(q*6.+T*.15),2.)*2.+pow(fbm(q*18.-T*.2),4.)*2.;
    c=spec(a/6.2831+T*.03+r*.4)*rays*exp(-r*1.1)*1.3;
    c+=vec3(1.)*exp(-r*7.)*.8;
  } else if(M<4.5){ // light tunnel
    float r=length(p), a=atan(p.y,p.x); float z=.35/max(r,.02)+T*1.6;
    float lanes=pow(abs(sin(a*14.+fbm(vec2(z*.3,a))*3.)),24.);
    float pulse=pow(fract(z*.5+h(vec2(floor(a*14./6.2831*14.),1.))),6.);
    c=mix(A,B,.5+.5*sin(a*3.))*lanes*(.5+2.*pulse)*smoothstep(0.,.35,r)*1.4;
    c+=A*.25*exp(-r*4.);
  } else { // silk
    float v=fbm(vec2(p.x*1.2+T*.05,p.y*3.+fbm(p*2.+T*.04)*2.));
    float s=sin(v*14.+p.x*3.); c=mix(A*.15,B*.6,.5+.5*s)*(.35+.65*smoothstep(.2,1.,v));
    c+=vec3(1.)*pow(.5+.5*s,18.)*.25;
  }
  c*=I;
  c+=(h(gl_FragCoord.xy+T)-.5)*.035;                                      // film grain
  gl_FragColor=vec4(c,1.);
}`;
const VERT = 'attribute vec2 p; void main(){ gl_Position=vec4(p,0.,1.); }';

const hex = (s: string) => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16) / 255);

export const LightField: React.FC<{ variant?: string; a?: string; b?: string; intensity?: number; speed?: number; scale?: number }> = ({
  variant = 'silk', a = '#5ee7ff', b = '#8b7bff', intensity = 1, speed = 1, scale = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const gl = useRef<any>(null);
  const w = Math.round(width * scale), h = Math.round(height * scale);
  useLayoutEffect(() => {
    const c = ref.current!; let s = gl.current;
    if (!s) {
      const g = c.getContext('webgl', { preserveDrawingBuffer: true, antialias: false }) as WebGLRenderingContext;
      if (!g) return;
      const sh = (t: number, src: string) => { const o = g.createShader(t)!; g.shaderSource(o, src); g.compileShader(o); return o; };
      const pr = g.createProgram()!; g.attachShader(pr, sh(g.VERTEX_SHADER, VERT)); g.attachShader(pr, sh(g.FRAGMENT_SHADER, FRAG)); g.linkProgram(pr); g.useProgram(pr);
      const buf = g.createBuffer(); g.bindBuffer(g.ARRAY_BUFFER, buf); g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW);
      const loc = g.getAttribLocation(pr, 'p'); g.enableVertexAttribArray(loc); g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
      s = gl.current = { g, pr, u: (n: string) => g.getUniformLocation(pr, n) };
    }
    const { g, u } = s;
    g.viewport(0, 0, w, h);
    g.uniform2f(u('R'), w, h); g.uniform1f(u('T'), (frame / fps) * speed + 3);
    g.uniform1f(u('M'), MODES[variant] ?? 0); g.uniform3fv(u('A'), hex(a)); g.uniform3fv(u('B'), hex(b)); g.uniform1f(u('I'), intensity);
    g.drawArrays(g.TRIANGLES, 0, 3);
  }, [frame, variant, a, b, intensity, speed, w, h, fps]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#03040a' }}>
      <canvas ref={ref} width={w} height={h} style={{ width: '100%', height: '100%' }} />
    </AbsoluteFill>
  );
};
