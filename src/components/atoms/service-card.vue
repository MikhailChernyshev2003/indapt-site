<script setup lang="ts">
interface IProps {
  color: string;
  bg: string;
  title: string;
  slug: string;
  image: string;
}

defineProps<IProps>();

const cardRef = ref<HTMLElement | null>(null);
const decorRef = ref<HTMLElement | null>(null);
const isHovered = ref(false);

const card = useTemplateRef('cardRef');
const decor = useTemplateRef('decorRef');
const { top, left, width, height } = useElementBounding(card, { updateTiming: 'next-frame' });

const handleMouseMove = (e: MouseEvent) => {
  if (!card.value || !decor.value || !isHovered.value) return;

  const centerX = left.value + width.value / 2;
  const centerY = top.value + height.value / 2;

  const mouseX = e.clientX - centerX;
  const mouseY = e.clientY - centerY;

  const offsetX = mouseX * 0.05;
  const offsetY = mouseY * 0.05;

  decor.value.$el.style.transform = `scale(1) translate(${offsetX}px, ${offsetY}px)`;
};

const handleMouseEnter = () => {
  decor.value.$el.style.transform = 'scale(1)';
  setTimeout(() => {
    isHovered.value = true;
  }, 210);
};

const handleMouseLeave = () => {
  isHovered.value = false;
  if (decor.value) {
    decor.value.$el.style.transform = 'scale(0) translate(0, 0)';
  }
};
</script>

<template>
  <div
    ref="cardRef"
    class="service-card"
    :style="{ '--hover-color': color, '--hover-bg': bg }"
    @mousemove="handleMouseMove"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <svgo-services-decor ref="decorRef" class="service-card__decor" />
    <div class="service-card__inner">
      <h3 class="service-card__title" v-html="title" />
      <img
        class="service-card__img"
        :src="image"
        :alt="title"
      />
    </div>
  </div>
</template>

<style lang="scss">
@use "@/assets/styles/adaptive" as a;
@use "@/assets/styles/variables" as v;
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/shared" as s;

.service-card {
  position: relative;
  z-index: 1;

  width: 318px;
  height: 318px;

  text-decoration: none;

  @include a.tablet {
    width: 454px;
    height: 454px;
  }

  @include a.mobile {
    width: 290px;
    height: 290px;
  }

  @include s.hover {
    .service-card__inner {
      background: var(--hover-bg);
      border: 1px solid var(--hover-bg);
    }

    .service-card__img {
      transform: translateY(0);
    }

    .service-card__title {
      color: var(--hover-color);

      transform: translateY(-60px);
    }
  }

  &__decor {
    position: absolute;
    top: -20px;
    left: -12px;
    z-index: 1;

    width: 350px;
    height: 350px;

    color: var(--hover-color);

    transform: scale(0);

    transition: transform 0.2s;

    @include a.tablet {
      top: -35px;
      left: -24px;

      width: 520px;
      height: 520px;

      transition: transform 0s;
    }

    @include a.mobile {
      top: -12px;
      left: -8px;

      width: 310px;
      height: 310px;
    }
  }

  &__inner {
    position: relative;
    z-index: 2;

    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;

    background: rgba(#ffffff, 0.3);

    border: 1px solid var(--dark-blue-20);
    border-radius: 50%;
    backdrop-filter: blur(50px);

    transition: background v.$timing;

    @include a.tablet {
      transition: background 0s;
    }
  }

  &__title {
    max-width: 262px;

    color: var(--dark-blue);
    text-align: center;

    transition: transform v.$timing, color v.$timing;

    @include t.lead-m-medium;

    @include a.tablet {
      transition: transform 0s;

      @include t.lead-l-semi;
    }

    @include a.mobile {
      @include t.lead-s-medium;
    }
  }

  &__img {
    position: absolute;
    bottom: 0;
    left: 0;

    width: 100%;
    height: 184px;
    object-fit: contain;

    transform: translateY(100%);

    transition: transform v.$timing;

    pointer-events: none;

    @include a.tablet {
      height: 264px;

      transition: transform 0s;
    }

    @include a.mobile {
      height: 164px;
    }
  }
}
</style>
