import type { Vector3, Color,
  Scene,
  PerspectiveCamera,
  WebGLRenderer, Camera } from 'three';

export type TTickCallback = (elapsedTime: number, delta: number) => void;

export interface IThreeContext {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
}

export interface ParticleData {
  basePosition: Vector3; // Original position on sphere
  radius: number; // Расстояние от центра сферы до частицы
  rotationAxis: Vector3; // Axis for rotation animation
  rotationAngle: number; // Current rotation angle
  currentPosition: Vector3; // Current animated position
  currentOffset: Vector3; // Current offset from base position (for smooth transitions)
  targetOffset: Vector3; // Target offset to smoothly transition to
  currentAttractionOffset: Vector3; // Current radius offset for attraction to mouseCenterPlaneIntersection
  currentColor: Color;
  targetColor: Color;
}

export interface UseParticleSphereOptions {
  scene: Scene;
  camera: Camera;
  renderer: WebGLRenderer;
}
