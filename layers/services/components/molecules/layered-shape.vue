<script setup lang="ts">
import { gsap } from 'gsap';
import shapes from '@/data/shapes/index';

const {
  type,
  offset = 26,
  animated = true,
  revealShift = 0,
  triggerClosest = '',
} = defineProps<{
  /** Фигура из общих данных (те же, что морфятся на главной) */
  type: string;
  /** На сколько px по макету каждый следующий слой шире предыдущего */
  offset?: number;
  /** Появление по скроллу; выключено — фигура статична */
  animated?: boolean;
  /** Сдвиг начала появления в % высоты экрана: второй объект стартует позже */
  revealShift?: number;
  /** Селектор предка-триггера: нужен внутри sticky, где сама фигура не скроллится */
  triggerClosest?: string;
}>();

// Данные слоёв общие с главной: layer_1 — плотное ядро, дальше слои шире.
// Каждый слой в своей обёртке с отрицательным inset — как в svg-morph-shape
const layers = computed(() => {
  const data = shapes[type as keyof typeof shapes] ?? shapes.circle;

  return Object.entries(data).map(([key, layer], idx) => ({
    key,
    idx,
    path: (layer as { path: string }).path,
    stopColor1: (layer as { stopColor1: string }).stopColor1,
    stopColor2: (layer as { stopColor2: string }).stopColor2,
    opacity: (layer as { opacity: number }).opacity,
  }));
});

const uid = useId();

const rootRef = useTemplateRef<HTMLElement>('rootRef');

let tween: gsap.core.Timeline | null = null;

// Появление как у фигуры на главной: видно только ядро, затем слои
// включаются по одному от центра наружу, а вся фигура подрастает.
// Прогресс привязан к прокрутке
useGsap(() => {
  if (!animated) return;

  const root = rootRef.value;

  if (!root) return;

  const layerEls = [...root.querySelectorAll<HTMLElement>('.layered-shape__layer')];
  const outer = layerEls.slice(1);
  const trigger = (triggerClosest && root.closest<HTMLElement>(triggerClosest)) || root;

  gsap.set(root, { scale: 0.7, opacity: 0 });
  gsap.set(outer, { opacity: 0 });

  tween = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: `top bottom-=${revealShift}%`,
      end: `top bottom-=${revealShift + 40}%`,
      scrub: true,
    },
  })
    .to(root, { opacity: 1, duration: 1 }, 0)
    .to(root, { scale: 1, duration: 4 }, 0)
    .to(outer, { opacity: 1, duration: 1.2, stagger: 0.45 }, 0.4);
});

onBeforeUnmount(() => {
  tween?.scrollTrigger?.kill();
  tween?.kill();
  tween = null;
});
</script>

<template>
  <div
    ref="rootRef"
    class="layered-shape"
    :style="{ '--layered-shape-offset': `${offset / 16}rem` }"
  >
    <div
      v-for="layer in layers"
      :key="layer.key"
      class="layered-shape__layer"
      :style="{
        inset: `calc(var(--layered-shape-offset) * ${-layer.idx})`,
        zIndex: layers.length - layer.idx,
      }"
    >
      <svg
        class="layered-shape__svg"
        viewBox="0 0 174 174"
        fill="none"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          :d="layer.path"
          :opacity="layer.opacity"
          :fill="`url(#layered-shape-${uid}-${layer.key})`"
        />
        <defs>
          <linearGradient
            :id="`layered-shape-${uid}-${layer.key}`"
            x1="137.395"
            y1="66.8854"
            x2="32.112"
            y2="99.6704"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" :stop-color="layer.stopColor1" />
            <stop offset="1" :stop-color="layer.stopColor2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layered-shape {
  position: relative;

  // Квадратная сцена: слои расходятся наружу от неё

  &::before {
    display: block;
    padding-bottom: 100%;

    content: '';
  }
}

.layered-shape__layer {
  position: absolute;
}

.layered-shape__svg {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
