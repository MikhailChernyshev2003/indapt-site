import { ShaderMaterial, Texture } from 'three';
import fragmentShader from './fragment-shader.glsl?raw';
import vertexShader from './vertex-shader.glsl?raw';

export const createParticleShaderMaterial = (sprite: Texture, baseSize: number = 1) => {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      u_texture: { value: sprite },
      u_size: { value: baseSize },
      u_opacity: { value: 1.0 }
    },
    transparent: true,
    depthTest: true,
    depthWrite: true,
    vertexColors: true
  });
};
