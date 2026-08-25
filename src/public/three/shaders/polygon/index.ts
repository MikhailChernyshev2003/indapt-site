import { useWindowSize } from '@vueuse/core';
import { ShaderMaterial, Vector2 } from 'three';
import fragmentShader from './fragment-shader.glsl?raw';
import vertexShader from './vertex-shader.glsl?raw';

const { width, height } = useWindowSize();

export const polygonShaderMaterial = new ShaderMaterial({
  fragmentShader,
  vertexShader,
  uniforms: {
    u_time: { value: 0.0 },
    u_resolution: { value: new Vector2(width.value, height.value) },
  },
});
