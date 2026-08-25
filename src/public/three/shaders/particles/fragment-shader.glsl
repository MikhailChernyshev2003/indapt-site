precision mediump float;

uniform sampler2D u_texture;
uniform float u_opacity;

varying vec3 vColor;

void main() {
    // Читаем текстуру с маской (белый шестиугольник на черном фоне)
    vec4 textureColor = texture2D(u_texture, gl_PointCoord);

    // Вычисляем luminance (яркость) как маску
    float luminance = dot(textureColor.rgb, vec3(0.299, 0.587, 0.114));

    // Используем step для жесткой границы: >0.5 = видимо, <0.5 = невидимо
    float mask = step(0.5, luminance);

    // Умножаем маску на общую прозрачность
    float finalAlpha = mask * u_opacity;

    // Отбрасываем невидимые пиксели
    if (finalAlpha < 0.001) {
        discard;
    }

    // Применяем цвет частицы (из vertex color) и финальную прозрачность
    gl_FragColor = vec4(vColor, finalAlpha);
}
