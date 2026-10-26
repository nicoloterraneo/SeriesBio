import { useEffect, useRef } from 'react';

const sources = [
  '/images/seriesbio-hero.png',
  '/images/seriesbio-cell-ribbon.png',
  '/images/seriesbio-dual-cells.png',
];

const vertexShader = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * .5 + .5;
    gl_Position = vec4(position, 0., 1.);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D imageA;
  uniform sampler2D imageB;
  uniform vec2 canvasSize;
  uniform vec2 imageSizeA;
  uniform vec2 imageSizeB;
  uniform float progress;
  uniform float elapsed;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3. - 2. * f);
    return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x),
      mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float value = 0.;
    float amplitude = .5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = p * 2.03 + vec2(17.1, 9.2);
      amplitude *= .5;
    }
    return value;
  }
  vec2 coverUv(vec2 uv, vec2 size) {
    float canvasAspect = canvasSize.x / canvasSize.y;
    float imageAspect = size.x / size.y;
    if (canvasAspect > imageAspect) {
      uv.y = (uv.y - .5) * (imageAspect / canvasAspect) + .5;
    } else {
      uv.x = (uv.x - .5) * (canvasAspect / imageAspect) + .5;
    }
    return uv;
  }
  void main() {
    float breathing = 1. + sin(elapsed * .22) * .022;
    vec2 floatOffset = vec2(sin(elapsed * .19), cos(elapsed * .16 + 1.1)) * .012;
    vec2 floatingUv = (vUv - .5) / breathing + .5 + floatOffset;
    vec2 uvA = coverUv(floatingUv, imageSizeA);
    vec2 uvB = coverUv(floatingUv, imageSizeB);
    vec2 uv = mix(uvA, uvB, progress);
    float t = elapsed * .12;
    vec2 drift = vec2(fbm(uv * 3. + t), fbm(uv * 3. - t + 8.)) - .5;
    float swell = sin(progress * 3.14159265);
    vec2 livingFlow = (drift + .35 * sin(uv * 8. + t)) * (.022 + .075 * swell);
    vec2 fromUv = clamp(uvA + livingFlow * (1. - progress * .32), .001, .999);
    vec2 toUv = clamp(uvB - livingFlow * (progress * .32), .001, .999);
    vec4 fromColor = texture2D(imageA, fromUv);
    vec4 toColor = texture2D(imageB, toUv);

    float field = fbm(uv * 5.2 + drift * 2. + t * .45);
    float edge = .23;
    float reveal = smoothstep(progress - edge, progress + edge, field);
    vec4 color = mix(toColor, fromColor, reveal);
    if (progress < .001) color = fromColor;
    if (progress > .999) color = toColor;

    float glow = smoothstep(.72, .08, distance(vUv, vec2(.72, .48)));
    color.rgb += vec3(.005, .035, .021) * glow;
    color.rgb *= vec3(.82, .98, .89);
    gl_FragColor = vec4(color.rgb, 1.);
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function LiquidArtwork({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
    if (!gl) return;

    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vertex || !fragment) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const textures = sources.map((_, index) => {
      const texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + index);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([2, 16, 11, 255]));
      return texture;
    });
    const imageA = gl.getUniformLocation(program, 'imageA');
    const imageB = gl.getUniformLocation(program, 'imageB');
    const imageSizeA = gl.getUniformLocation(program, 'imageSizeA');
    const imageSizeB = gl.getUniformLocation(program, 'imageSizeB');
    const canvasSize = gl.getUniformLocation(program, 'canvasSize');
    const progress = gl.getUniformLocation(program, 'progress');
    const elapsed = gl.getUniformLocation(program, 'elapsed');

    const images = sources.map((src, index) => {
      const image = new Image();
      image.onload = () => {
        gl.activeTexture(gl.TEXTURE0 + index);
        gl.bindTexture(gl.TEXTURE_2D, textures[index]);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.uniform2f(index === 0 ? imageSizeA : imageSizeB, image.naturalWidth, image.naturalHeight);
      };
      image.src = src;
      return image;
    });

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(canvas.clientWidth * scale));
      const height = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.uniform2f(canvasSize, width, height);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    let frame = 0;
    let startTime = 0;
    let stopped = false;
    const render = (now: number) => {
      if (stopped) return;
      if (!startTime) startTime = now;
      const seconds = (now - startTime) / 1000;
      const phaseLength = 12;
      const phase = seconds / phaseLength;
      const current = Math.floor(phase) % sources.length;
      const within = phase - Math.floor(phase);
      const next = (current + 1) % sources.length;
      const transition = Math.max(0, Math.min(1, (within - .48) / .52));
      gl.uniform1i(imageA, 0);
      gl.uniform1i(imageB, 1);
      gl.uniform2f(imageSizeA, images[current].naturalWidth || 1536, images[current].naturalHeight || 1024);
      gl.uniform2f(imageSizeB, images[next].naturalWidth || 1536, images[next].naturalHeight || 1024);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures[current]);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, textures[next]);
      gl.uniform1f(progress, transition * transition * (3 - 2 * transition));
      gl.uniform1f(elapsed, seconds);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frame = window.requestAnimationFrame(render);
    };
    frame = window.requestAnimationFrame(render);

    return () => {
      stopped = true;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      images.forEach((image) => { image.onload = null; });
      textures.forEach((texture) => texture && gl.deleteTexture(texture));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return <canvas ref={canvasRef} className={`liquid-art ${className}`} aria-hidden="true" />;
}
