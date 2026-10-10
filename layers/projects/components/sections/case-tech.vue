<script setup lang="ts">
import { gsap } from 'gsap';
import type { ProjectTechBubble } from '@l-projects/types';
import type { TechRing } from '@l-projects/configs';
import SwipeHintIcon from '@l-projects/assets/images/swipe-hint.svg';

const { bubbles, rings } = defineProps<{
  /** Пузыри технологий: позиции сцены 1320x487 по макету */
  bubbles: ProjectTechBubble[];
  /** Кольца-декор сцены */
  rings: TechRing[];
  /** Цвет колец — акцент кейса */
  ringColor: string;
}>();

const { t } = useI18n();

const toRem = (px: number) => `${px / 16}rem`;

const stageRef = useTemplateRef<HTMLElement>('stageRef');
const rowRef = useTemplateRef<HTMLElement>('rowRef');

/** Пузырь, показывающий логотип: на десктопе — по ховеру,
 * на мобильном — ближайший к центру экрана при прокрутке */
const activeIdx = ref(-1);

let tween: gsap.core.Tween | null = null;

// На мобильном сцена по макету едет влево по мере прокрутки страницы,
// а пузырь у центра экрана раскрывает логотип — как в раскадровке
const shiftField = () => {
  const stage = stageRef.value;
  const row = rowRef.value;

  if (!stage || !row) return;

  // Ширины тянутся от html font-size: сдвиг пересчитываем на каждом
  // refresh (ресайз, поворот), иначе поле доезжало бы не до конца или дальше
  const shift = () => Math.max(0, row.scrollWidth - stage.clientWidth);

  if (shift() <= 0) return;

  tween = gsap.to(row, {
    x: () => -shift(),
    ease: 'none',
    scrollTrigger: {
      invalidateOnRefresh: true,
      trigger: stage,
      start: 'top 80%',
      end: 'bottom 30%',
      scrub: true,
      onUpdate: () => {
        const mid = window.innerWidth / 2;
        let best = -1;
        let bestDist = Infinity;

        row.querySelectorAll<HTMLElement>('.case-tech__bubble').forEach((el, idx) => {
          const r = el.getBoundingClientRect();
          const dist = Math.abs(r.left + r.width / 2 - mid);

          if (dist < bestDist) {
            bestDist = dist;
            best = idx;
          }
        });
        activeIdx.value = best;
      },
    },
  });
};

useGsap({
  tablet: shiftField,
  mobile: shiftField,
});

onBeforeUnmount(() => {
  tween?.scrollTrigger?.kill();
  tween?.kill();
  tween = null;
});
</script>

<template>
  <!-- Технологии проекта: поле парящих пузырей с кольцами-декором.
       Пузырь с логотипом раскрывает его по ховеру -->
  <section class="case-tech">
    <h2 class="case-tech__title" v-html="t('projects.general.technologies')" />
    <div ref="stageRef" class="case-tech__stage">
      <div ref="rowRef" class="case-tech__field">
        <div
          v-for="ring in rings"
          :key="`${ring.x}-${ring.y}`"
          class="case-tech__ring"
          :style="{
            top: toRem(ring.y),
            left: toRem(ring.x),
            width: toRem(ring.size),
            height: toRem(ring.size),
          }"
        >
          <projects-molecules-ring-circles :color="ringColor" :double="ring.double" />
        </div>
        <div
          v-for="(bubble, idx) in bubbles"
          :key="bubble.label"
          class="case-tech__bubble"
          :class="{ 'case-tech__bubble_active': idx === activeIdx }"
          :style="{
            top: toRem(bubble.y),
            left: toRem(bubble.x),
            width: toRem(bubble.size),
            height: toRem(bubble.size),
          }"
          @mouseenter="bubble.logo && (activeIdx = idx)"
          @mouseleave="activeIdx = -1"
        >
          <span class="case-tech__label" :class="{ 'case-tech__label_hidden': bubble.logo && idx === activeIdx }">
            {{ bubble.label }}
          </span>
          <img
            v-if="bubble.logo"
            class="case-tech__logo"
            :class="{ 'case-tech__logo_visible': idx === activeIdx }"
            :src="bubble.logo"
            :alt="bubble.label"
            loading="lazy"
          />
        </div>
      </div>
    </div>
    <!-- Подсказка «листайте» из макета: на планшете и мобильном сцена едет по скроллу -->
    <swipe-hint-icon class="case-tech__hint" aria-hidden="true" />
  </section>
</template>

<style scoped lang="scss">
@use "@styles/adaptive" as a;
@use "@styles/typography" as t;
@use "@styles/variables" as v;

.case-tech {
  display: flex;
  flex-direction: column;

  // Под подсказкой в макете отступ до «Результатов» больше общего шага страницы

  @include a.tablet {
    padding-bottom: 40px;
  }

  @include a.mobile {
    padding-bottom: 45px;
  }
}

.case-tech__title {
  color: var(--dark-blue);

  @include t.h1;

  @include a.tablet {
    @include t.h2;
  }

  @include a.mobile {
    @include t.h3;
  }
}

.case-tech__stage {
  position: relative;

  // Сцена пузырей по макету. Своего overflow нет: пузыри и кольца
  // режет край экрана (overflow-x: clip у case-page), а не край контейнера

  height: 487px;
  margin-top: 60px;

  @include a.mobile {
    margin-top: 40px;
  }
}

.case-tech__hint {
  display: none;
  flex: none;
  align-self: center;
  width: 66px;
  height: 48px;

  color: var(--dark-blue);

  @include a.tablet {
    display: block;
    margin-top: 36px;
  }

  @include a.mobile {
    margin-top: 11px;
  }
}

.case-tech__field {
  position: absolute;
  inset: 0;

  @include a.tablet {
    // Уже экрана поле не влезает и едет по скроллу, как в раскадровке

    right: auto;

    width: 1340px;
  }
}

.case-tech__ring {
  position: absolute;

  pointer-events: none;
}

.case-tech__bubble {
  position: absolute;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--white);
  border: 1px solid var(--dark-blue-10);
  border-radius: 50%;

  transition: box-shadow 0.3s;

  &_active {
    box-shadow: 0 8px 40px rgb(12 29 79 / 8%);
  }
}

.case-tech__label {
  padding: 0 24px;

  color: var(--dark-blue);
  font-weight: 500;
  font-size: 30px;

  font-family: v.$font-involve;
  line-height: 1.2;
  text-align: center;

  transition: opacity 0.3s;

  @include a.mobile {
    font-size: 24px;
  }

  &_hidden {
    opacity: 0;
  }
}

.case-tech__logo {
  position: absolute;
  top: 50%;
  left: 50%;

  width: 52%;
  height: 40%;
  object-fit: contain;

  transform: translate(-50%, -50%);

  opacity: 0;

  transition: opacity 0.3s;

  &_visible {
    opacity: 1;
  }
}
</style>
