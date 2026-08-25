precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform int u_shapeType;
uniform int u_targetShapeType;
uniform float u_transitionFactor;
uniform float u_radius;
uniform float u_cornerRadius;
uniform float u_layerWidth;
uniform float u_numLayers;
uniform vec3 u_bgColor;
uniform vec3 u_baseColor;
uniform vec2 u_position;
uniform float u_rotation;
uniform float u_starSmoothness;

uniform vec3 u_gradientColorA;// Начальный цвет градиента
uniform vec3 u_gradientColorB;// Конечный цвет градиента
uniform float u_gradientAngle;// Угол градиента в радианах
uniform float u_gradientStopA;// Позиция первого цвета (0.0-1.0, например 0.207 для 20.7%)
uniform float u_gradientStopB;// Позиция второго цвета (0.0-1.0, например 0.7676 для 76.76%)
uniform float u_opacity;// Непрозрачность (0.0-1.0)

#define PI  3.14159265359
#define PHI 1.61803398875

// Вспомогательная функция
float dot2(in vec2 v) {
  return dot(v, v);
}

// Генерации линейного градиента
vec3 linearGradient(vec2 uv, float angle, vec3 colorA, vec3 colorB, float stopA, float stopB) {
  // Нормализуем координаты относительно центра
  vec2 coords = uv;

  // Поворачиваем координаты на нужный угол для задания направления градиента
  float s = sin(angle);
  float c = cos(angle);
  coords = vec2(
  coords.x * c - coords.y * s,
  coords.x * s + coords.y * c
  );

  // Базовый фактор интерполяции (от -0.5 до 0.5)
  float t = coords.x;

  // Маппим t из диапазона [-0.5, 0.5] в [0, 1]
  t = t + 0.5;

  // Применяем стопы, ремаппим из [0,1] в [stopA, stopB]
  t = stopA + t * (stopB - stopA);

  // Ограничиваем значение
  t = clamp(t, 0.0, 1.0);

  // Интерполируем цвета
  return mix(colorA, colorB, t);
}

// Скругление SDF
float opRound(float d, float r) {
  return d - r;
}

// Функция для поворота 2D вектора
vec2 rotate2D(vec2 p, float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return vec2(
  p.x * c - p.y * s,
  p.x * s + p.y * c
  );
}

// SDF для круга
float sdCircle(in vec2 p, in float r) {
  return length(p) - r;
}

// SDF для многоугольника
float sdPolygon(in vec2 p, in float r, in float n) {
  float an = PI / n;
  float bn = mod(atan(p.y, p.x), 2.0 * an) - an;
  p = length(p) * vec2(cos(bn), abs(sin(bn)));
  p -= r * vec2(cos(an), sin(an));

  return length(max(p, 0.0)) + min(0.0, max(p.x, p.y));
}

// SDF для 4-лучевой звезды
float sdRoundedCross(in vec2 p, in float h) {
  float k = 0.5 * (h + 1.0 / h);

  p = abs(p);
  return (p.x < 1.0 && p.y < p.x * (k - h) + h)
  ? k - sqrt(dot2(p - vec2(1, k)))// circular arc
  : sqrt(min(dot2(p - vec2(0, h)), // top corner
  dot2(p - vec2(1, 0))));// right corner
}

// SDF для "цветочной" формы со скругленными внутренними и внешними углами
float sdFlower(in vec2 p, in float r, in float n, in float smoothness) {
  float angle = atan(p.y, p.x);// Угол к точке

  float dist = length(p);// Расстояние до точки

  // Модулируем расстояние с помощью косинуса для создания лепестков
  // smoothness управляет глубиной выемок (0.0-1.0)
  // где 0.0 дает правильный многоугольник, а 1.0 дает очень глубокие выемки
  float modulation = r * (1.0 - smoothness * 0.7 * cos(n * angle));

  // Формируем SDF как разность между расстоянием до точки и модулированным радиусом
  return dist - modulation;
}

float sdStar4(in vec2 p, in float r, in float smoothness) {
  float n = 4.0;
  return sdFlower(p, r, n, smoothness);
}

float sdStar5(in vec2 p, in float r, in float smoothness) {
  float n = 5.0;
  return sdFlower(p, r, n, smoothness);
}

// Функция для генерации многослойного эффекта с золотым сечением
float layeredEffect(float d, float layerWidth, float numLayers) {
  // Используем золотое сечение для распределения слоев
  // Внешние слои более разрежены, внутренние более плотные
  float goldenOffset = pow(PHI, 0.5) - 1.0;// Коэффициент для естественного распределения
  float adjustedD = d + 0.5 + goldenOffset;

  // Используем нелинейное распределение слоев для более естественного вида
  float layer = floor(adjustedD / layerWidth);
  layer = clamp(layer, 0.0, numLayers - 1.0);

  // Интенсивность с использованием золотой пропорции
  float t = layer / numLayers;
  return 1.0 - pow(t, 1.0 / PHI);// Даёт более плавный градиент
}

// Функция для получения SDF формы по типу
float getShapeSDF(vec2 p, float r, int shapeType) {
  if (shapeType == 0) {
    return sdCircle(p, r);
  }
  else if (shapeType == 1) {
    return sdPolygon(p, r, 3.0);
  }
  else if (shapeType == 2) {
    return sdPolygon(p, r, 4.0);
  }
  else if (shapeType == 3) {
    return sdPolygon(p, r, 5.0);
  }
  else if (shapeType == 4) {
    return sdPolygon(p, r, 6.0);
  }
  else if (shapeType == 5) {
    return sdStar4(p, r, u_starSmoothness);
  }
  else {
    return sdStar5(p, r, u_starSmoothness);
  }
}

void main() {
  // Нормализуем координаты
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);

  // Применяем трансформации к координатам:
  // 1. Сдвиг по позиции (вычитаем позицию для правильного перемещения)
  uv -= u_position;
  // 2. Поворот вокруг центра
  uv = rotate2D(uv, u_rotation);

  // Получаем SDF для текущей и целевой форм
  float d1 = getShapeSDF(uv, u_radius, u_shapeType);
  float d2 = getShapeSDF(uv, u_radius, u_targetShapeType);

  // Интерполируем между ними
  float t = smoothstep(0.0, 1.0, u_transitionFactor);
  float d = mix(d1, d2, t);

  // Применяем скругление
  float roundedD = opRound(d, u_cornerRadius);

  // Создаем многослойный эффект
  float intensity = layeredEffect(roundedD, u_layerWidth, u_numLayers);

  vec3 color;
  // Применяем градиент к фигуре
  color = linearGradient(
  uv,
  u_gradientAngle,
  u_gradientColorA,
  u_gradientColorB,
  u_gradientStopA,
  u_gradientStopB
  );

  // Смешиваем с фоном на основе интенсивности
  vec3 finalColor = mix(u_bgColor, color, pow(intensity, 1.0));

  // Финальный цвет
  //    vec3 finalColor = mix(u_bgColor, u_baseColor, pow(intensity, 1.0 / PHI));

  gl_FragColor = vec4(finalColor, u_opacity);
}
