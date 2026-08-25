<script setup lang="ts">
const {
  size = 'l',
  is = 'button',
} = defineProps<{
  active?: boolean;
  hover?: boolean;
  size?: 's' | 'l';
  is?: string;
}>();

const tagRef = useTemplateRef('tagRef');

defineExpose({ target: tagRef });
</script>

<template>
  <component
    :is="is"
    ref="tagRef"
    :type="is === 'button' ? 'button' : undefined"
    class="app-tag"
    :class="[`app-tag_size_${size}`, {
      'app-tag_active': active,
      'app-tag_hover': hover,
    }]"
  >
    <slot />
  </component>
</template>

<style scoped lang="scss">
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/adaptive" as a;
@use "@/assets/styles/shared" as s;

@mixin active {
  background-color: var(--white);
  border-color: var(--white);
}

button.app-tag {
  user-select: none;
}

.app-tag {
  padding: 10px 24px;

  color: var(--dark-blue);

  background: none;
  border: 1px solid var(--dark-blue-20);
  border-radius: 200px;
  backdrop-filter: blur(5px);

  transition: .2s ease;
  transition-property: background-color, border-color;

  @include a.mobile {
     @include t.caption-s-semi-128;
  }

  &_hover {
    @include s.hover {
      @include active;
    }
  }

  &_active {
    @include active;
  }

  &_size {
    &_l {
      @include t.caption-l-semi;
    }

    &_s {
      @include t.caption-s-semi-128;
    }
  }
}
</style>
