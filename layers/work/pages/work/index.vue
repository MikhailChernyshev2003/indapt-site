<script setup lang="ts">
import PatternKv from '@l-work/assets/images/pattern.png';
import PatternKvTablet from '@l-work/assets/images/pattern-tablet.png';

const { t } = useI18n();

useSeoMeta({
  title: t('workPage.seoTitle'),
});

const { isDesktop } = useDevice();

const isFormOpen = ref(false);
const formVacancyTitle = ref('');

const handlerForm = (title: string) => {
  isFormOpen.value = !isFormOpen.value;
  formVacancyTitle.value = title;
  if (!isFormOpen.value) {
    document.body.classList.remove('lock');
  }
  else {
    document.body.classList.add('lock');
  }
};

const route = useRoute();

watch(() => route.query.scrollToBlock, (newVal) => {
  if (import.meta.client && newVal) {
    nextTick(() => {
      const block = document.querySelector(`.${route.query.scrollToBlock}`);

      if (block && block?.offsetTop > 0) {
        setTimeout(() => {
          const targetPosition = block.offsetTop - 100;

          window.scrollTo({
            top: targetPosition,
            behavior: 'auto',
          });
        }, 0);
      }
    });
  }
}, {
  immediate: true,
});

onMounted(async () => {
  await nextTick();
  const header = document.querySelector('.header');

  if (!header) return;

  header.style.backdropFilter = 'blur(20px)';
  header.style.webkitBackdropFilter = 'blur(20px)';
});
</script>

<template>
  <div class="work">
    <work-sections-hero class="work__hero" />
    <work-sections-career class="work__career" />
    <work-sections-team class="work__team" />
    <work-sections-projects class="work__projects" />
    <atoms-picture class="work__kv-pattern" :src="isDesktop ? PatternKv : PatternKvTablet" />
    <work-sections-vacancies class="work__vacancies" @open-form="handlerForm" />
    <work-sections-mail class="work__mail" />

    <!-- client-only как у модалок в шапке: teleport внутри transition на SSR даёт hydration mismatch -->
    <client-only>
      <transition name="fade" appear>
        <teleport to="body">
          <div
            v-if="isFormOpen"
            class="work__overlay-form"
            @click="handlerForm"
          >
            <work-organisms-response-form
              class="work__response-form"
              :vacancy="formVacancyTitle"
              @click.stop
              @close="handlerForm('')"
            />
          </div>
        </teleport>
      </transition>
    </client-only>
  </div>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/variables" as v;
@use "@styles/typography" as t;
@use "@styles/shared" as s;

.work {
  padding: 160px 60px 120px;

  @include a.tablet {
    padding: 144px 40px 120px;
  }

  @include a.mobile {
    padding: 76px 20px 80px;
  }

  &__career,
  &__team {
    position: relative;
    z-index: 3;

    margin-top: 120px;
  }

  &__career {
    @include a.mobile {
      margin-top: 80px;
    }
  }

  &__team {
    margin-top: 121px;

    @include a.mobile {
      margin-top: 64px;
    }
  }

  &__projects,
  &__vacancies {
    position: relative;
    z-index: 3;

    margin-top: 104px;

    @include a.tablet {
      margin-top: 120px;
    }
  }

  &__projects {
    @include a.mobile {
      margin-top: 75px;
    }
  }

  &__vacancies {
    @include a.mobile {
      margin-top: 84px;
    }
  }

  &__kv-pattern {
    position: absolute;
    top: 2000px;
    left: -60px;
    z-index: 1;

    width: auto;
    height: 2300px;

    @include a.tablet {
      top: 3640px;
      left: 0;

      height: 1600px;
    }

    @include a.mobile {
      display: none;
    }
  }

  &__mail {
    margin-top: 60px;

    @include a.mobile {
      margin-top: 40px;
    }
  }

  &__overlay-form {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000000;

    display: flex;
    align-items: center;
    justify-content: flex-end;

    width: 100vw;
    height: 100vh;
    padding: 24px 56px;

    background: var(--dark-blue-20);

    @include a.tablet {
      padding: 24px 40px;
    }

    @include a.mobile {
      padding: 16px;
    }
  }

  &__response-form {
    width: 688px;
    height: 100%;

    background: var(--white);
    border-radius: 20px;
  }
}
</style>
