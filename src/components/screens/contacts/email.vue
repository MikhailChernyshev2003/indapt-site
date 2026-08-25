<script setup lang="ts">
const { t } = useI18n();

const mainEmail = computed(() => ({
  title: t('contactsPage.email.general'),
  mail: 'hello@indapt.net',
}));

const list = computed(() => [
  {
    title: t('contactsPage.email.partners'),
    mail: 'partners@indapt.net',
  },
  {
    title: t('contactsPage.email.tender'),
    mail: 'tender@indapt.net',
  },
  {
    title: t('contactsPage.email.press'),
    mail: 'press@indapt.net',
  },
]);
</script>

<template>
  <section class="email">
    <div class="email__wrapper">
      <p class="email__title">(Email)</p>
      <div class="email__content">
        <div class="email__item">
          <a
            class="email__item-mail"
            :href="`mailto:${mainEmail.mail}`"
            v-html="mainEmail.mail"
          />
          <p class="email__item-title" v-html="mainEmail.title" />
        </div>
        <div class="email__list">
          <div
            v-for="item in list"
            :key="item.title"
            class="email__list-item"
          >
            <a
              class="email__list-item-mail"
              :href="`mailto:${item.mail}`"
              v-html="item.mail"
            />
            <p class="email__list-item-title" v-html="item.title" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
@use "@/assets/styles/typography" as t;
@use "@/assets/styles/adaptive" as a;

.email {
  width: 100%;

  border-top: 1px solid var(--dark-blue-20);

  @include a.mobile {
    border-bottom: 1px solid var(--dark-blue-20);
  }

  &__wrapper {
    display: flex;
  }

  &__title {
    padding-top: 75px;

    color: var(--dark-blue-60);

    @include t.caption-l-semi;

    @include a.mobile {
      padding-top: 48px;

      @include t.caption-xs-medium;
    }
  }

  &__content {
    width: 874px;
    margin-left: auto;
    padding-top: 75px;
    padding-bottom: 32px;

    @include a.mobile {
      padding-top: 48px;
    }

    @include a.tablet {
      width: 570px;
    }

    @include a.mobile {
      width: 262px;
      padding-bottom: 24px;
    }
  }

  &__item {
    padding-bottom: 40px;

    @include a.mobile {
      padding-bottom: 16px;
    }

    &-title {
      color: var(--dark-blue);

      @include t.body-m-medium;

      @include a.mobile {
        margin-bottom: 8px;

        @include t.body-s-medium;
      }
    }

    &-mail {
      display: block;
      margin-bottom: 12px;

      color: var(--dark-blue);
      line-height: 70% !important;

      @include t.lead-l-semi;

      @include a.mobile {
        font-weight: 600;
        font-size: 28px;
        line-height: 60% !important;
      }
    }
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    padding-top: 40px;

    border-top: 1px solid var(--dark-blue-20);

    @include a.tablet {
      padding-top: 32px;
    }

    @include a.mobile {
      padding-top: 22px;
    }

    &-item {
      width: 270px;

      @include a.tablet {
        width: 236px;
        margin-bottom: 32px;
      }

      @include a.mobile {
        width: 100%;
        margin-bottom: 20px;
      }

      &:not(:last-child) {
        margin-right: 30px;
      }

      &-title {
        color: var(--dark-blue);

        @include t.body-m-medium;

        @include a.mobile {
          @include t.body-s-medium;
        }
      }

      &-mail {
        display: block;
        margin-bottom: 12px;

        color: var(--dark-blue);

        @include t.lead-m-medium;

        @include a.mobile {
          @include t.lead-s-medium;
        }
      }
    }
  }
}
</style>
