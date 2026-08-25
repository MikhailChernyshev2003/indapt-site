uniform float u_size;

varying vec3 vColor;

void main() {
    vColor = color;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Размер точки с учетом расстояния до камеры
    gl_PointSize = u_size * (800.0 / -mvPosition.z);
}
