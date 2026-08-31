<script setup lang="ts">
const { color, dotX = 198 } = defineProps<{
  /** Цвет графика — акцент кейса */
  color: string;
  /** Позиция маркера по макету (x левого края внешнего круга) */
  dotX?: number;
}>();

const uid = useId();
</script>

<template>
  <!-- Линейный график из макета: площадь под кривой, штрих с угасанием
       по краям и светящийся маркер. Геометрия снята из фигмы -->
  <svg
    class="chart-line"
    viewBox="0 0 294 146"
    fill="none"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient
        :id="`cl-area-${uid}`"
        x1="148"
        y1="64"
        x2="146.5"
        y2="136"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset="0"
          :stop-color="color"
          stop-opacity="0.25"
        />
        <stop
          offset="1"
          :stop-color="color"
          stop-opacity="0.01"
        />
      </linearGradient>
      <linearGradient
        :id="`cl-line-${uid}`"
        x1="0"
        y1="51"
        x2="292"
        y2="51"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset="0"
          :stop-color="color"
          stop-opacity="0"
        />
        <stop offset="0.172" :stop-color="color" />
        <stop offset="0.768" :stop-color="color" />
        <stop
          offset="1"
          :stop-color="color"
          stop-opacity="0"
        />
      </linearGradient>
      <linearGradient
        :id="`cl-dot-${uid}`"
        x1="0.5"
        y1="0"
        x2="0.5"
        y2="1"
      >
        <stop offset="0.089" :stop-color="color" />
        <stop
          offset="1"
          :stop-color="color"
          stop-opacity="0.4"
        />
      </linearGradient>
    </defs>
    <path
      class="chart-line__area"
      d="M134.5 63.9C106.34 57.54 -0.5 66 -0.5 66L-0.5 135.5L292 136.5L292 100.5C279 106.67 228.18 115.55 202.5 108.5C174.89 100.94 169.74 72.1 134.5 63.9Z"
      :fill="`url(#cl-area-${uid})`"
    />
    <path
      class="chart-line__stroke"
      d="M0 67.5C15 66.2 100 59.9 134.5 63.9C170 68.2 175 92.5 206.5 108.9C235 115.5 275 106.5 292 101.9"
      :stroke="`url(#cl-line-${uid})`"
      stroke-width="3"
      stroke-linecap="round"
    />
    <g class="chart-line__dot" :transform="`translate(${dotX} 97)`">
      <circle
        cx="12"
        cy="12"
        r="12"
        :fill="color"
        opacity="0.35"
      />
      <circle
        cx="12"
        cy="12"
        r="7.5"
        :fill="`url(#cl-dot-${uid})`"
      />
      <circle
        cx="12"
        cy="12"
        r="4.5"
        fill="#ffffff"
      />
    </g>
  </svg>
</template>

<style scoped lang="scss">
.chart-line {
  display: block;
  width: 100%;
  height: auto;
}
</style>
