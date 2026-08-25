<script setup lang="ts">
import type { Subsidiary } from '~/types/contacts';

const { t } = useI18n();

defineProps<{
  subsidiaries: Subsidiary[];
  activeId: number;
}>();

const isDropdownOpen = ref(false);

defineEmits<{
  'update:activeId': [id: number];
}>();
</script>

<template>
  <div class="subsidiary-dropdown">
    <h3 class="subsidiary-dropdown__title">{{ t('contactsPage.map.branch') }}</h3>
    <div class="subsidiary-dropdown__list">
      <div
        v-for="item in subsidiaries"
        :key="item.id"
        class="subsidiary-dropdown__list-item"
        :class="{
          'subsidiary-dropdown__list-item_hide': !isDropdownOpen && item.id !== activeId,
        }"
        @click="$emit('update:activeId', item.id)"
      >
        <template v-if="isDropdownOpen">
          <div
            v-if="item.id !== activeId"
            class="subsidiary-dropdown__list-item-small"
          >
            <p v-html="item.shortName" />
          </div>
        </template>
        <div v-if="item.id === activeId" class="subsidiary-dropdown__list-item-active">
          <p v-html="item.name" />
          <!--
            временно скрыли

            <svgo-contacts-chevron-dropdown
              class="subsidiary-dropdown__chevron"
              :class="{
                'subsidiary-dropdown__chevron_open': isDropdownOpen,
              }"
              @click="isDropdownOpen = !isDropdownOpen"
            />
          -->
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/adaptive" as a;

.subsidiary-dropdown {
  position: absolute;
  right: 12px;
  bottom: 36px;
  z-index: 2;

  width: 320px;
  padding: 24px;

  background: var(--white);
  border-radius: 8px;

  @include a.mobile {
    width: 311px;
  }

  &__chevron {
    flex-shrink: 0;
    width: 24px;
    height: 24px;

    color: transparent;

    transform: rotate(180deg);

    &_open {
      transform: rotate(0);
    }
  }

  &__title {
    color: var(--dark-blue-60);

    @include t.caption-xs-medium;
  }

  &__list {
    display: flex;
    flex-direction: column;
    margin-top: 8px;

    &-item {
      &:not(:last-child) {
        margin-bottom: 16px;
      }

      &_hide {
        height: 0;
        margin-bottom: 0 !important;
      }

      &-small {
        color: var(--dark-blue-60);

        @include t.body-s-medium-135;
      }

      &-active {
        display: flex;
        align-items: center;
        justify-content: space-between;

        color: var(--dark-blue);

        @include t.body-s-semi;
      }
    }
  }
}
</style>
