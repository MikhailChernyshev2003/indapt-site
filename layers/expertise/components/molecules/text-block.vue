<script setup lang="ts">
import { SplitText } from 'gsap/SplitText';

const { isMobile } = useDevice();

defineProps<{
  unit?: string;
  label: string;
  text: string;
  main?: boolean;
}>();

const containerRef = useTemplateRef('containerRef');
const labelRef = useTemplateRef('labelRef');
const textRef = useTemplateRef('textRef');
let labelSplit: SplitText | null = null;
const animations: gsap.core.Animation[] = [];

useGsap(() => {
  if (!containerRef.value || !labelRef.value || !textRef.value) {
    return;
  }

  gsap.set(containerRef.value, {
    opacity: 0,
  });

  labelSplit = SplitText.create(labelRef.value, {
    type: 'lines',
    reduceWhiteSpace: false,
  });

  gsap.set(containerRef.value, {
    opacity: 1,
    scale: 1.1,
  });

  gsap.set(textRef.value, {
    y: 20,
    opacity: 0,
  });

  gsap.set(labelSplit.lines, {
    y: '100%',
    opacity: 0,
  });

  const scaleAnimation = gsap.to(containerRef.value, {
    scale: isMobile.value ? 1.05 : 1,
    y: 0,
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: 2,
    },
  });

  const textAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'center bottom',
      end: 'bottom bottom',
      scrub: 2,
    },
  });

  textAnimation
    .to(labelSplit.lines, { y: 0, opacity: 1, stagger: 0.1, ease: 'power1.out', fontFamily: 'Involve, sans-serif' })
    .to(textRef.value, { opacity: 1, y: 0, ease: 'power1.out' });

  animations.push(scaleAnimation, textAnimation);
});

onBeforeUnmount(() => {
  animations.forEach((animation) => {
    animation.scrollTrigger?.kill();
    animation.kill();
  });
  labelSplit?.revert();
});
</script>

<template>
  <div ref="containerRef" class="text-block">
    <h4><mark v-if="unit">{{ unit }}</mark> <span ref="labelRef">{{ label }}</span></h4>
    <p ref="textRef">{{ text }}</p>
  </div>
</template>

<style scoped lang="scss">
@use "@styles/typography" as t;
@use "@styles/adaptive" as a;

.text-block {
  position: absolute;
  z-index: 1;

  width: 544px;

  padding: 28px;

  background: var(--bg);

  border-radius: 16px;
  transform-origin: center top;

  @include a.tablet {
    position: static;
  }

  @include a.mobile {
    width: 100%;
    padding: 20px;
  }

  h4 {
    display: inline-flex;

    color: var(--dark-blue);

    @include a.mobile {
      flex-direction: column;
      gap: 8px;
    }

    span {
      @include t.h4;

      @include a.mobile {
        @include t.h5;
      }
    }

    mark {
      margin-inline-end: 16px;

      margin-top: 6px;

      color: var(--dark-blue-40);

      @include t.caption-m-medium;

      @include a.mobile {
        margin-top: 0;

        @include t.caption-xs-medium
      }
    }

    span div {
      overflow: hidden;
    }
  }

  p {
    margin-top: 16px;

    color: var(--dark-blue-70);

    @include t.body-l-medium;

    @include a.mobile {
      margin-top: 12px;

      @include t.body-s-medium-135;
    }
  }

  &_main {
    p {
      color: var(--dark-blue);
    }
  }
}
</style>
