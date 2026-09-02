import { gsap } from 'gsap';

interface FigureRevealOptions {
  /** Сдвиг начала появления в % высоты экрана: соседняя фигура стартует позже */
  shift?: number;
  /** Триггер вместо самой фигуры: нужен внутри sticky, где фигура не скроллится */
  trigger?: () => Element | null | undefined;
}

// Раскадровка шестиугольника на главной («Эксперты по развитию…»): фигура
// проявляется и растёт из своего центра, а кольца включаются по одному
// от ядра наружу. Здесь то же самое, только прогресс привязан к прокрутке:
// одноразовый запуск успевал отработать вхолостую на mount, пока картинки
// не загрузились и позиции считались по короткой странице
const START_SCALE = 0.35;
const REVEAL_LENGTH = 40;

/**
 * Появление фигуры по скроллу как на главной.
 * Кольца — элементы с атрибутом data-ring в порядке от внешнего к ядру;
 * ядро видно с самого начала
 */
export const useFigureReveal = (
  target: Ref<HTMLElement | null>,
  options: FigureRevealOptions = {},
) => {
  let timeline: gsap.core.Timeline | null = null;

  useGsap(() => {
    const el = target.value;

    if (!el) return;

    const { shift = 0, trigger } = options;
    const outerRings = [...el.querySelectorAll('[data-ring]')].slice(0, -1);

    gsap.set(el, { scale: START_SCALE, opacity: 0 });
    gsap.set(outerRings, { opacity: 0 });

    timeline = gsap.timeline({
      scrollTrigger: {
        trigger: trigger?.() || el,
        start: `top bottom-=${shift}%`,
        end: `top bottom-=${shift + REVEAL_LENGTH}%`,
        scrub: true,
      },
    })
      .to(el, { opacity: 1, duration: 1 }, 0)
      .to(el, { scale: 1, duration: 4, ease: 'none' }, 0)
      .to(outerRings, { opacity: 1, duration: 1.2, stagger: { each: 0.45, from: 'end' } }, 0.4);
  });

  onBeforeUnmount(() => {
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
    timeline = null;
  });
};
