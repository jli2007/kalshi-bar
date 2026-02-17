"use client";

import { useEffect, useRef } from "react";

interface HalftoneWaveBackgroundProps {
  className?: string;
}

interface TrailPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

const MAX_TRAIL_POINTS = 50;
const TRAIL_DECAY = 0.95;

export default function HalftoneWaveBackground({ className = "" }: HalftoneWaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, prevX: 0.5, prevY: 0.5 });
  const trailRef = useRef<TrailPoint[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const glContext = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!glContext) {
      console.error("WebGL not supported");
      return;
    }
    const gl = glContext;

    const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec3 u_trail[${MAX_TRAIL_POINTS}];
      uniform vec2 u_trailVel[${MAX_TRAIL_POINTS}];
      uniform int u_trailCount;

      #define PI 3.14159265359

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                           -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        for (int i = 0; i < 4; i++) {
          value += amplitude * snoise(p * frequency);
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        return value;
      }

      void main() {
        vec2 uv = v_uv;
        vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);

        vec2 totalDistortion = vec2(0.0);
        float totalInfluence = 0.0;

        for (int i = 0; i < ${MAX_TRAIL_POINTS}; i++) {
          if (i >= u_trailCount) break;

          vec3 point = u_trail[i];
          vec2 vel = u_trailVel[i];
          float life = point.z;

          if (life > 0.01) {
            vec2 pointPos = point.xy;
            vec2 diff = (uv - pointPos) * aspect;
            float dist = length(diff);

            float influence = life * smoothstep(0.28, 0.0, dist);

            vec2 pushDir = normalize(diff + 0.001);
            vec2 velInfluence = vel * life * 0.2;

            vec2 swirl = vec2(-diff.y, diff.x) * influence * 0.12;

            totalDistortion += (pushDir * influence * 0.03 + velInfluence * smoothstep(0.2, 0.0, dist) + swirl);
            totalInfluence += influence;
          }
        }

        vec2 distortedUV = uv + totalDistortion;

        float time = u_time * 0.04;
        vec2 noiseCoord = distortedUV * 2.5;

        float noise1 = fbm(noiseCoord + vec2(time * 0.1, time * 0.08));
        float noise2 = fbm(noiseCoord * 1.3 + vec2(-time * 0.08, time * 0.05) + noise1 * 0.4);
        float noise3 = fbm(noiseCoord * 0.7 + vec2(time * 0.04, -time * 0.06) + noise2 * 0.3);

        float combinedNoise = (noise1 + noise2 * 0.7 + noise3 * 0.5) / 2.2;

        combinedNoise += totalInfluence * 0.18;

        float dotScale = 60.0;
        vec2 dotUV = distortedUV * dotScale;

        float waveX = sin(distortedUV.y * 12.0 + time * 2.0 + combinedNoise * 2.5 + totalInfluence * 2.0) * 0.12;
        float waveY = cos(distortedUV.x * 10.0 + time * 1.8 + combinedNoise * 2.0 + totalInfluence * 1.8) * 0.12;
        dotUV += vec2(waveX, waveY) * (1.0 + combinedNoise * 0.8 + totalInfluence);

        vec2 dotCell = floor(dotUV);
        vec2 dotPos = fract(dotUV) - 0.5;

        float dotNoise = fbm(dotCell * 0.04 + time * 0.2);
        float baseDotSize = 0.13 + combinedNoise * 0.07 + dotNoise * 0.05;
        baseDotSize *= 0.9 + totalInfluence * 0.9;

        float dot = length(dotPos);
        float dotMask = 1.0 - smoothstep(baseDotSize - 0.08, baseDotSize + 0.04, dot);

        vec3 darkGreen = vec3(0.03, 0.08, 0.06);
        vec3 midGreen = vec3(0.05, 0.22, 0.17);
        vec3 brightGreen = vec3(0.10, 0.46, 0.32);
        vec3 lightGreen = vec3(0.15, 0.56, 0.40);

        float gradientT = uv.x * 0.4 + uv.y * 0.3 + combinedNoise * 0.5 + 0.3;
        gradientT += totalInfluence * 0.05;
        gradientT = clamp(gradientT, 0.0, 1.0);

        vec3 bgColor = mix(darkGreen, midGreen, smoothstep(0.0, 0.5, gradientT));
        bgColor = mix(bgColor, brightGreen, smoothstep(0.4, 0.8, gradientT));
        bgColor = mix(bgColor, lightGreen, smoothstep(0.7, 1.0, gradientT));

        vec3 dotColor = bgColor * 1.22 + vec3(0.04, 0.10, 0.08);

        dotColor += brightGreen * totalInfluence * 0.08;

        vec3 finalColor = mix(bgColor * 0.62, dotColor, dotMask * 0.76);

        float glow = smoothstep(0.5, 1.0, gradientT) * 0.08;
        finalColor += brightGreen * glow * dotMask;

        finalColor += brightGreen * totalInfluence * 0.02;

        float vignette = 1.0 - length((uv - 0.5) * 1.2) * 0.5;
        finalColor *= vignette;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function compileShader(source: string, type: number) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const trailLocation = gl.getUniformLocation(program, "u_trail");
    const trailVelLocation = gl.getUniformLocation(program, "u_trailVel");
    const trailCountLocation = gl.getUniformLocation(program, "u_trailCount");

    const canvasEl = canvas;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvasEl.width = canvasEl.clientWidth * dpr;
      canvasEl.height = canvasEl.clientHeight * dpr;
      gl.viewport(0, 0, canvasEl.width, canvasEl.height);
    }

    resize();
    window.addEventListener("resize", resize);

    let lastMouseMove = 0;
    function handleMouseMove(e: MouseEvent) {
      const rect = canvasEl.getBoundingClientRect();
      const newX = (e.clientX - rect.left) / rect.width;
      const newY = 1.0 - (e.clientY - rect.top) / rect.height;

      const vx = newX - mouseRef.current.x;
      const vy = newY - mouseRef.current.y;

      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = newX;
      mouseRef.current.y = newY;

      const now = Date.now();
      if (now - lastMouseMove > 20) {
        const speed = Math.sqrt(vx * vx + vy * vy);
        if (speed > 0.0015) {
          trailRef.current.unshift({
            x: newX,
            y: newY,
            vx: vx * 5,
            vy: vy * 5,
            life: Math.min(0.75, speed * 8 + 0.12)
          });

          if (trailRef.current.length > MAX_TRAIL_POINTS) {
            trailRef.current.pop();
          }
        }
        lastMouseMove = now;
      }
    }

    window.addEventListener("mousemove", handleMouseMove);

    const startTime = performance.now();
    function render() {
      timeRef.current += 0.016;
      const elapsed = performance.now() - startTime;
      if (elapsed < 500) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      trailRef.current = trailRef.current.filter(point => {
        point.life *= TRAIL_DECAY;
        point.vx *= 0.97;
        point.vy *= 0.97;
        point.x += point.vx * 0.0015;
        point.y += point.vy * 0.0015;
        return point.life > 0.01;
      });

      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(timeLocation, timeRef.current);
      gl.uniform2f(resolutionLocation, canvasEl.width, canvasEl.height);

      const trailData: number[] = [];
      const trailVelData: number[] = [];

      for (let i = 0; i < MAX_TRAIL_POINTS; i++) {
        if (i < trailRef.current.length) {
          const p = trailRef.current[i];
          trailData.push(p.x, p.y, p.life);
          trailVelData.push(p.vx, p.vy);
        } else {
          trailData.push(0, 0, 0);
          trailVelData.push(0, 0);
        }
      }

      gl.uniform3fv(trailLocation, trailData);
      gl.uniform2fv(trailVelLocation, trailVelData);
      gl.uniform1i(trailCountLocation, trailRef.current.length);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationRef.current);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ touchAction: "pan-y" }}
    />
  );
}
