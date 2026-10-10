<script setup>
import gsap from 'gsap';
import shapes from '@/data/shapes/index';

const $props = defineProps({
  type: {
    type: String,
    default: 'hexagon',
  },
  offset: {
    type: Number,
    default: 80,
  },
});

onMounted(() => {
  if (import.meta.client) {
    watchEffect(() => {
      for (let i = 1; i <= 7; i++) {
        gsap.to(`#svg-morph-shape-layer_${i}`, {
          morphSVG: shapes[$props.type][`layer_${i}`].path,
          duration: 0.4,
          attr: {
            opacity: shapes[$props.type][`layer_${i}`].opacity,
          },
        });

        gsap.to(`#svg-morph-shape-gradient-layer_${i}-stop-1`, {
          attr: {
            'stop-color': shapes[$props.type][`layer_${i}`].stopColor1,
          },
        });

        gsap.to(`#svg-morph-shape-gradient-layer_${i}-stop-2`, {
          attr: {
            'stop-color': shapes[$props.type][`layer_${i}`].stopColor2,
          },
        });
      }
    });
  }
});
</script>

<template>
  <div class="svg-morph-shape">
    <div
      v-for="(layer, key) in shapes.hexagon"
      :key="key"
      class="svg-morph-shape__layer"
      :class="[`svg-morph-shape__${key}`]"
    >
      <svg
        width="174"
        height="174"
        viewBox="0 0 174 174"
        xmlns="http://www.w3.org/2000/svg"
        class="svg-morph-shape__svg"
      >
        <path
          :id="`svg-morph-shape-${key}`"
          opacity="0.1"
          :d="layer.path"
          :fill="`url(#svg-morph-shape-gradient-${key})`"
        />

        <defs>
          <linearGradient
            :id="`svg-morph-shape-gradient-${key}`"
            x1="137.395"
            y1="66.8854"
            x2="32.112"
            y2="99.6704"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              :id="`svg-morph-shape-gradient-${key}-stop-1`"
              offset="0"
              :stop-color="layer.stopColor1"
            />
            <stop
              :id="`svg-morph-shape-gradient-${key}-stop-2`"
              offset="1"
              :stop-color="layer.stopColor2"
            />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
</template>

<style lang="scss">
@use "@/assets/styles/adaptive" as a;

.svg-morph-shape {
  --offset-layer: v-bind('$props.offset') / 16 * 1rem;

  position: relative;
  z-index: 0;

  @include a.mobile {
    --offset-layer: v-bind('$props.offset / 2') / 16 * 1rem;
  }

  &::before {
    display: block;
    height: 0;
    padding-bottom: 100%;

    content: '';
  }

  &__layer {
    position: absolute;
    inset: 0;

    z-index: 0;

    // Шаг слоёв меняется вместе с формой (offset 80 ↔ 60): без перехода
    // кольца прыгали, пока сам контур плавно морфится 0.4с

    transition: inset 0.4s;

    &_1 {
      inset: calc(var(--offset-layer) * 0);

      z-index: 7;
    }

    &_2 {
      inset: calc(var(--offset-layer) * -1);

      z-index: 6;
    }

    &_3 {
      inset: calc(var(--offset-layer) * -2);

      z-index: 5;
    }

    &_4 {
      inset: calc(var(--offset-layer) * -3);

      z-index: 4;
    }

    &_5 {
      inset: calc(var(--offset-layer) * -4);

      z-index: 3;
    }

    &_6 {
      inset: calc(var(--offset-layer) * -5);

      z-index: 2;
    }

    &_7 {
      inset: calc(var(--offset-layer) * -6);

      z-index: 1;
    }
  }

  &__svg {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
