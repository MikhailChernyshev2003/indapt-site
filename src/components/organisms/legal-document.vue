<script setup lang="ts">
import CloseIcon from '@/assets/icons/close-icon.svg';
import termsRu from '~/content/legal/terms.ru.json';
import termsEn from '~/content/legal/terms.en.json';
import privacyRu from '~/content/legal/privacy.ru.json';
import privacyEn from '~/content/legal/privacy.en.json';

const { kind } = defineProps<{ kind: 'terms' | 'privacy' }>();
const emit = defineEmits<{ close: [] }>();
const { locale } = useI18n();
const dialog = ref<HTMLDialogElement | null>(null);
const title = ref<HTMLElement | null>(null);
const documents = { ru: { terms: termsRu, privacy: privacyRu }, en: { terms: termsEn, privacy: privacyEn } };
const content = computed(() => documents[locale.value === 'ru' ? 'ru' : 'en'][kind]);
let previouslyLocked = false;
let previousFocus: HTMLElement | null = null;

const close = () => dialog.value?.close();

onMounted(() => {
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  previouslyLocked = document.body.classList.contains('lock');
  document.body.classList.add('lock');
  dialog.value?.showModal();
  title.value?.focus({ preventScroll: true });
});

onBeforeUnmount(() => {
  dialog.value?.close();
  if (!previouslyLocked) document.body.classList.remove('lock');
  previousFocus?.focus({ preventScroll: true });
});
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialog"
      class="legal-document"
      aria-labelledby="legal-document-title"
      :lang="locale === 'ru' ? 'ru' : 'en'"
      @close="emit('close')"
      @click.self="close"
    >
      <article class="legal-document__panel">
        <header class="legal-document__header">
          <h2
            id="legal-document-title"
            ref="title"
            tabindex="-1"
            class="legal-document__title"
          >
            {{ content.title }}
          </h2>
          <button
            type="button"
            class="legal-document__close"
            :aria-label="locale === 'ru' ? 'Закрыть документ' : 'Close document'"
            @click="close"
          >
            <CloseIcon aria-hidden="true" />
          </button>
        </header>
        <div class="legal-document__content">
          <template v-for="(block, index) in content.blocks" :key="index">
            <h3 v-if="block.type === 'heading'">{{ block.text }}</h3>
            <p v-else>{{ block.text }}</p>
          </template>
        </div>
      </article>
    </dialog>
  </Teleport>
</template>

<style scoped lang="scss">
@use '@styles/adaptive' as a;
@use '@styles/typography' as t;

.legal-document {
  position: fixed;
  inset: 0;

  width: min(920px, calc(100% - 48px));
  max-width: none;
  max-height: calc(100dvh - 48px);
  margin: auto;
  overflow-y: auto;
  overscroll-behavior: contain;

  color: var(--dark-blue);

  background: #ffffff;
  border: 0;
  border-radius: 24px;

  @include a.mobile {
    width: calc(100% - 24px);
    max-height: calc(100dvh - 24px);

    border-radius: 16px;

  }

  &::backdrop {
    background: rgb(12 29 79 / 35%);
    backdrop-filter: blur(8px);
  }

  &__header {
    position: sticky;
    top: 0;
    z-index: 1;

    display: flex;
    gap: 24px;
    align-items: flex-start;
    padding: 40px 48px 24px;

    background: #ffffff;

    @include a.mobile {
      gap: 12px;
      padding: 24px 20px 20px;
    }
  }

  &__title {
    flex: 1;

    @include t.h2;

    @include a.mobile {
      @include t.h5;
    }
  }

  &__close {
    flex: 0 0 44px;
    width: 44px;
    height: 44px;

    color: var(--dark-blue);

    @include a.mobile {
      flex-basis: 36px;
      width: 36px;
      height: 36px;
    }

    :deep(svg) {
      width: 100%;
      height: 100%;
    }
  }

  &__content {
    padding: 0 48px 48px;

    overflow-wrap: anywhere;

    @include t.body-s-regular;

    @include a.mobile {
      padding: 0 20px 32px;
    }

    p + p {
      margin-top: 16px;
    }

    h3 {
      margin: 32px 0 16px;

      @include t.h5;

      @include a.mobile {
        @include t.h6;
      }
    }
  }
}
</style>
