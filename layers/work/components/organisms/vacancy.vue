<script setup lang="ts">
import type { IDetailVacancy } from '../../types';
import CloseVacancy from '../../assets/icons/vacancies/close.svg';

const props = defineProps<IDetailVacancy>();

const { t } = useI18n();

const route = useRoute();
const isOpen = ref(false);
const vacancyElement = ref<HTMLElement | null>(null);

const emits = defineEmits(['openForm']);

const openFormResume = () => {
  emits('openForm');
};

const scrollToVacancy = async () => {
  await nextTick();
  setTimeout(() => {
    if (!vacancyElement.value) return;

    const rect = vacancyElement.value.getBoundingClientRect();
    const yOffset = -100;
    const y = rect.top + window.scrollY + yOffset;

    window.scrollTo({
      top: y,
      behavior: 'smooth',
    });
  }, 600);
};

const openFromQuery = (value: unknown) => {
  if (import.meta.client && value && +value === props.id) {
    isOpen.value = true;

    nextTick(() => {
      scrollToVacancy();
    });
  }
};

watch(() => route.query.scrollTo, openFromQuery);

// Первое раскрытие — после гидрации: с immediate-watch класс vacancy_open расходился с SSR,
// Vue его не применял, и при заходе по ссылке /work?scrollTo=… вакансия оставалась закрытой
onMounted(() => {
  openFromQuery(route.query.scrollTo);
});
</script>

<template>
  <div
    ref="vacancyElement"
    class="vacancy"
    :class="{ vacancy_open: isOpen }"
  >
    <div class="vacancy__wrapper">
      <div class="vacancy__head" @click="isOpen = !isOpen">
        <h3 class="vacancy__head-title" v-html="title" />
        <div class="vacancy__head-info">
          <p class="vacancy__head-info-format" v-html="format" />
          <p class="vacancy__head-info-city" v-html="city" />
        </div>
        <CloseVacancy class="vacancy__head-info-close" />
      </div>
      <div class="vacancy__body">
        <div class="vacancy__body-content">
          <div class="vacancy__body-content-cols">
            <div class="vacancy__body-content-col">
              <p class="vacancy__body-content-col-title">
                {{ t("workPage.vacancies.work") }}
              </p>
              <div class="vacancy__body-content-col-list">
                <p
                  v-for="text in work"
                  :key="text"
                  class="vacancy__body-content-col-list-item"
                  v-html="text"
                />
              </div>
            </div>
            <div class="vacancy__body-content-col">
              <p class="vacancy__body-content-col-title">
                {{ t("workPage.vacancies.requirements") }}
              </p>
              <div class="vacancy__body-content-col-list">
                <p
                  v-for="text in requirements"
                  :key="text"
                  class="vacancy__body-content-col-list-item"
                  v-html="text"
                />
              </div>
            </div>
            <div class="vacancy__body-content-col">
              <p class="vacancy__body-content-col-title">
                {{ t("workPage.vacancies.conditions") }}
              </p>
              <div class="vacancy__body-content-col-list">
                <div
                  v-for="item in conditions"
                  :key="item.title"
                  class="vacancy__body-content-col-list-codition"
                >
                  <p
                    class="vacancy__body-content-col-list-codition-title"
                    v-html="item.title"
                  />
                  <p
                    v-for="text in item.text"
                    :key="text"
                    class="vacancy__body-content-col-list-item"
                    v-html="text"
                  />
                </div>
              </div>
            </div>
          </div>
          <atoms-button
            class="vacancy__body-content-button"
            mode="secondary"
            @click="openFormResume"
          >
            {{ t("workPage.vacancies.apply") }}
          </atoms-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@styles/typography" as t;
@use "@styles/adaptive" as a;

.vacancy {
  width: 100%;

  &_open {
    .vacancy__body {
      grid-template-rows: 1fr;

      &-content {
        padding: 32px;

        opacity: 1;

        @include a.mobile {
          padding: 20px;
        }
      }
    }

    .vacancy__head-info-close {
      transform: rotate(0);
      opacity: 0.7;
    }
  }

  &__wrapper {
  }

  &__head,
  &__body {
    background: var(--white);
  }

  &__head {
    display: flex;
    padding: 32px;

    border-radius: 16px;

    @include a.tablet {
      position: relative;
      z-index: 1;

      display: block;
    }

    @include a.mobile {
      padding: 20px;
    }
  }

  &__body {
    display: grid;
    grid-template-rows: 0fr;
    margin-top: 1px;
    overflow: hidden;

    border-radius: 16px;

    transition: grid-template-rows 0.3s;

    &-content {
      min-height: 0;
      padding: 0 32px;

      opacity: 0;

      transition: padding 0.3s, opacity 0.2s;

      @include a.mobile {
        padding: 0 20px;
      }

      &-cols {
        display: flex;
        gap: 40px;
        justify-content: space-between;

        @include a.tablet {
          flex-direction: column;
          gap: 24px;
          justify-content: flex-start;
        }

        @include a.mobile {
          gap: 20px;
        }
      }

      &-button {
        margin-top: 24px;

        @include a.tablet {
          margin-top: 32px;
        }
      }

      &-col {
        width: 392px;

        @include a.tablet {
          width: 100%;
        }

        &-title {
          margin-bottom: 16px;

          @include t.lead-m-medium;

          @include a.tablet {
            margin-bottom: 13px;
          }

          @include a.mobile {
            margin-bottom: 13px;

            @include t.lead-s-medium;
          }
        }

        &-list {
          &-item {
            position: relative;
            z-index: 1;

            max-width: 387px;
            padding-left: 17px;

            color: var(--dark-blue-80);

            @include t.body-s-medium-135;

            @include a.tablet {
              max-width: 100%;
            }

            @include a.mobile {
              padding-right: 4px;

              @include t.body-xs-medium;
            }

            &:not(:first-child) {
              margin-top: 8px;
            }

            &::before {
              position: absolute;
              top: 0;
              left: 0;

              content: "—";
            }
          }

          &-codition {
            &:not(:first-child) {
              .vacancy__body-content-col-list-codition-title {
                margin-top: 8px;
              }
            }

            &-title {
              position: relative;
              z-index: 1;

              padding-left: 15px;

              color: var(--dark-blue);

              @include t.body-s-semi;

              &::before {
                position: absolute;
                top: calc(50% - 3px);
                left: 0;

                width: 6px;
                height: 6px;

                background: var(--dark-blue);
                border-radius: 50%;

                content: "";
              }
            }
          }
        }
      }
    }
  }

  &__head {
    &-title {
      width: 392px;

      @include t.lead-m-medium;

      @include a.tablet {
        width: 100%;
        max-width: 540px;
      }

      @include a.mobile {
        max-width: 247px;

        @include t.lead-s-medium;
      }
    }

    &:hover {
      .vacancy__head-info-close {
        opacity: 0.7;
      }
    }

    &-info {
      margin-left: 40px;

      @include a.tablet {
        margin-top: 16px;
        margin-left: 0;
      }

      &-format {
        color: var(--dark-blue-60);

        @include t.caption-s-semi-140;

        @include a.mobile {
          @include t.body-xs-medium;
        }
      }

      &-city {
        margin-top: 4px;

        @include t.body-m-medium;

        @include a.mobile {
          margin-top: 0;
        }
      }

      &-close {
        width: 44px;
        height: 44px;
        margin-left: auto;

        transform: rotate(45deg);

        transition: transform 0.3s, opacity 0.3s;

        @include a.tablet {
          position: absolute;
          top: 32px;
          right: 32px;
          z-index: 1;
        }

        @include a.mobile {
          top: 14px;
          right: 14px;
        }
      }
    }
  }
}
</style>
