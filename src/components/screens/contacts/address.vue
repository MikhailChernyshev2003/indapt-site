<script setup lang="ts">
const { t } = useI18n();

const list = computed(() => [
  {
    title: t('contactsPage.address.moscow.title'),
    address: t('contactsPage.address.moscow.address'),
    // phone: '+7 (495) 123-45-67',
    phone: '',
  },
  {
    title: t('contactsPage.address.spb.title'),
    address: t('contactsPage.address.spb.address'),
    // phone: '+7 (812) 987-65-43',
    phone: '',
  },
  {
    title: t('contactsPage.address.dubai.title'),
    address: t('contactsPage.address.dubai.address'),
    // phone: '+971 4 567 89 10',
    phone: '',
  },
  {
    title: t('contactsPage.address.hongKong.title'),
    address: t('contactsPage.address.hongKong.address'),
    phone: '',
  },
]);
</script>

<template>
  <section class="address">
    <div class="address__wrapper">
      <p class="address__title">(Address)</p>
      <div class="address__list">
        <div
          v-for="item in list"
          :key="item.title"
          class="address__list-item"
        >
          <p class="address__list-item-title" v-html="item.title" />
          <p class="address__list-item-address" v-html="item.address" />
          <a
            v-if="item.phone"
            class="address__list-item-phone"
            :href="`tel:${item.phone}`"
            v-html="item.phone"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/adaptive" as a;

.address {
  width: 100%;

  @include a.tablet {
    border-top: 1px solid var(--dark-blue-20);
  }

  &__wrapper {
    display: flex;
    justify-content: space-between;
  }

  &__title {
    padding-top: 32px;

    color: var(--dark-blue-60);

    @include t.caption-l-semi;

    @include a.mobile {
      padding-top: 28px;

      @include t.caption-xs-medium;
    }
  }

  &__list {
    width: 874px;

    @include a.tablet {
      width: 570px;
    }

     @include a.mobile {
      width: 262px;
    }

    &-item {
      padding: 32px 0 30px;

      color: var(--dark-blue);

      @include a.mobile {
        padding: 24px 0;
      }

      &:not(:first-child) {
        border-top: 1px solid var(--dark-blue-20);
      }

      &-title {
        @include t.lead-m-medium;

        @include a.mobile {
          @include t.lead-s-medium;
        }
      }

      &-address {
        margin-top: 12px;

        @include t.body-m-medium;

        @include a.mobile {
          margin-top: 8px;

          @include t.body-s-medium;
        }
      }

      &-phone {
        display: block;
        margin-top: 12px;

        color: var(--dark-blue);

        @include t.body-m-medium;

        @include a.mobile {
          margin-top: 8px;

          @include t.body-s-medium-135;
        }
      }
    }
  }
}
</style>
