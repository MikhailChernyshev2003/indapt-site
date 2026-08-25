<script setup lang="ts">
type LogoType = 'full' | 'min';

const { isMobile, isTablet } = useDevice();

const {
  type = 'full',
  typeTablet = 'full',
  typeMobile = 'full',
} = defineProps<{
  type?: LogoType;
  typeTablet?: LogoType;
  typeMobile?: LogoType;
}>();

const LOGO_MAP = {
  full: resolveComponent('svgo-logo-full'),
  min: resolveComponent('svgo-logo-min'),
};

const ComponentLogo = computed(() => {
  if (isMobile.value) return LOGO_MAP[typeMobile];
  if (isTablet.value) return LOGO_MAP[typeTablet];
  return LOGO_MAP[type];
});
</script>

<template>
  <div class="logo">
    <component-logo class="logo__icon" />
  </div>
</template>

<style scoped lang="scss">
.logo {
  width: auto;

  color: var(--dark-blue);
}

.logo__icon {
  width: auto;
  height: 100%;
}
</style>
