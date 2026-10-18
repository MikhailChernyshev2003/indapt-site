import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CYCLE_STAGES, DARK_BG, LIGHT_BG, MEDIA_SLOTS } from '@l-ai-production/configs';
import type { SceneLayout, SceneState } from './useCreationScene';

interface Chapter {
  /** Начало главы: прокрутка, при которой её верх у верха окна */
  start: number;
  /** Сколько глава держит липкий экран */
  span: number;
}

interface BuildOptions {
  page: HTMLElement;
  state: SceneState;
  layout: SceneLayout;
  onDark: (dark: boolean) => void;
  onActive: (active: boolean) => void;
}

/**
 * Один мастер-таймлайн на всю страницу. Время таймлайна — пиксели прокрутки
 * от верха страницы: каждая сцена ставится на позицию своей главы, поэтому
 * разметка (высоты глав в CSS) и хореография не расходятся. При ресайзе
 * таймлайн пересобирается целиком
 */
export function buildStoryTimeline({ page, state, layout, onDark, onActive }: BuildOptions) {
  const vh = window.innerHeight;
  const pageTop = page.getBoundingClientRect().top + window.scrollY;
  const isDesktop = layout === 'desktop';
  const isMobile = layout === 'mobile';

  const chapter = (name: string): Chapter => {
    const el = page.querySelector<HTMLElement>(`[data-chapter="${name}"]`)!;
    const rect = el.getBoundingClientRect();
    const start = rect.top + window.scrollY - pageTop;
    return { start, span: Math.max(rect.height - vh, vh * 0.5) };
  };

  const q = (selector: string) => page.querySelectorAll<HTMLElement>(selector);

  const hero = chapter('hero');
  const spark = chapter('spark');
  const figures = chapter('figures');
  const images = chapter('images');
  const video = chapter('video');
  const cycle = chapter('cycle');
  const services = chapter('services');
  const numbers = chapter('numbers');
  const finale = chapter('finale');

  const at = (c: Chapter, f: number) => c.start + c.span * f;
  const total = page.offsetHeight - vh;

  // Раскладка сцены под ширину экрана
  const L = {
    heroX: isDesktop ? 1.35 : 0,
    heroY: isDesktop ? 0 : isMobile ? 0.62 : 0.55,
    heroScale: isDesktop ? 1.05 : isMobile ? 0.62 : 0.8,
    sideX: isDesktop ? 1.5 : 0,
    sideY: isDesktop ? 0 : 0.6,
    shapeScale: isDesktop ? 1.22 : isMobile ? 0.72 : 1,
    imagesX: isDesktop ? 0.9 : 0,
    imagesY: isDesktop ? 0 : 0.2,
    cycleX: isDesktop ? 1.55 : 0,
    cycleY: isDesktop ? 0 : 0.85,
    cycleScale: isDesktop ? 0.85 : isMobile ? 0.45 : 0.6,
  };

  Object.assign(state, {
    sphereX: L.heroX,
    sphereY: L.heroY,
    sphereScale: L.heroScale,
    shapeX: L.sideX,
    shapeY: L.sideY,
    shapeScale: L.shapeScale,
    mouse: isDesktop ? 1 : 0,
  });

  const bg = page.querySelector<HTMLElement>('.ai-page__bg');
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: page,
      start: 'top top',
      end: `+=${total}`,
      scrub: 1,
      invalidateOnRefresh: false,
    },
  });

  const ease = 'power2.inOut';

  /** Текст главы: появляется снизу и уходит вверх */
  const inOut = (targets: NodeListOf<HTMLElement> | HTMLElement[], from: number, to: number, len = vh * 0.35) => {
    if (!targets.length) return;
    tl.fromTo(targets, { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, stagger: len * 0.12, duration: len, ease: 'power2.out' }, from);
    tl.to(targets, { autoAlpha: 0, y: -70, stagger: len * 0.08, duration: len * 0.8, ease: 'power2.in' }, to);
  };

  // ---- 1. Hero: сфера уходит к центру, заголовок — вверх ----
  // Начало задано явно: вступление могло ещё не доиграть, когда таймлайн
  // впервые записал стартовые значения, и заголовок остался бы скрытым
  tl.fromTo(q('[data-chapter="hero"] .ai-reveal'), { autoAlpha: 1, y: 0 }, {
    autoAlpha: 0, y: -80, stagger: vh * 0.04, duration: vh * 0.5, ease: 'power2.in', immediateRender: false,
  }, at(hero, 0.15));
  tl.to(state, { sphereX: L.sideX, sphereY: L.sideY, sphereScale: isDesktop ? 1 : L.heroScale, duration: hero.span + vh * 0.6, ease }, at(hero, 0));

  // ---- 2. Идея: камера ближе, сфера закручивается и пульсирует ----
  inOut(q('[data-chapter="spark"] .ai-reveal'), at(spark, 0.05), at(spark, 0.78));
  tl.to(state, { camZ: 4.8, swirl: 1.4, duration: spark.span * 0.6, ease }, at(spark, 0));
  tl.to(state, { pulse: 0.35, duration: spark.span * 0.25, ease: 'sine.inOut', yoyo: true, repeat: 1 }, at(spark, 0.3));
  tl.to(state, { camZ: 6, swirl: 0, duration: spark.span * 0.4, ease }, at(spark, 0.7));

  // ---- 3. Форма: шестиугольник → звезда → круг ----
  inOut(q('[data-chapter="figures"] .ai-reveal'), at(figures, 0.0), at(figures, 0.9));
  tl.to(state, { hex: 1, duration: figures.span * 0.25, ease }, at(figures, 0.02));
  tl.to(state, { star: 1, duration: figures.span * 0.22, ease }, at(figures, 0.36));
  tl.to(state, { circle: 1, duration: figures.span * 0.22, ease }, at(figures, 0.66));
  tl.to(state, { spin: Math.PI * 2, duration: figures.span, ease: 'none' }, at(figures, 0));

  const steps = q('.ai-steps__item');
  const stepAt = [0.02, 0.36, 0.66];
  steps.forEach((step, i) => {
    tl.fromTo(step, { '--active': 0 }, { '--active': 1, duration: figures.span * 0.12 }, at(figures, stepAt[i]!));
    if (i < steps.length - 1) {
      tl.to(step, { '--active': 0, duration: figures.span * 0.12 }, at(figures, stepAt[i + 1]!));
    }
  });

  // ---- 4. Изображение: фигура распадается, сфера выпускает плоскости ----
  inOut(q('[data-chapter="images"] .ai-chapter__scrim, [data-chapter="images"] .ai-reveal'), at(images, 0.12), at(images, 0.88));
  tl.to(state, {
    hex: 0, star: 0, circle: 0, burst: 0.55,
    sphereX: L.imagesX, sphereY: L.imagesY, sphereScale: isDesktop ? 0.7 : 0.5,
    duration: images.span * 0.3, ease,
  }, at(images, -0.05));
  tl.to(state, { emerge: 1, duration: images.span * 0.85, ease: 'none' }, at(images, 0.05));

  // ---- 5. Движение: кадры оживают, камера влетает в главный ----
  tl.to(bg, { backgroundColor: DARK_BG, duration: vh * 0.5 }, at(video, 0));
  tl.call(() => onDark(tl.scrollTrigger!.direction > 0), [], at(video, 0.03));
  inOut(q('[data-chapter="video"] .ai-reveal_first'), at(video, 0.0), at(video, 0.26));
  tl.to(state, { alive: 1, duration: video.span * 0.2, ease }, at(video, 0));

  const main = MEDIA_SLOTS[0]![isDesktop ? 'desktop' : 'mobile'] ?? MEDIA_SLOTS[0]!.desktop;
  tl.to(state, { camX: main.x, camY: main.y, camZ: 5.2, duration: video.span * 0.28, ease }, at(video, 0.28));
  tl.to(state, { cover: 1, duration: video.span * 0.24, ease }, at(video, 0.3));
  inOut(q('[data-chapter="video"] .ai-reveal_big'), at(video, 0.5), at(video, 0.84));
  tl.to(state, { cover: 0, camX: 0, camY: 0, camZ: 6, duration: video.span * 0.2, ease }, at(video, 0.86));

  // ---- 6. Полный цикл: плоскости уходят в сферу, вокруг — орбита ----
  inOut(q('[data-chapter="cycle"] .ai-chapter__scrim, [data-chapter="cycle"] .ai-reveal'), at(cycle, 0.0), at(cycle, 0.93));
  tl.to(state, { retract: 1, duration: cycle.span * 0.14, ease }, at(cycle, -0.04));
  tl.to(state, {
    burst: 0, orbit: 1, sphereX: L.cycleX, sphereY: L.cycleY, sphereScale: L.cycleScale,
    duration: cycle.span * 0.2, ease,
  }, at(cycle, 0.02));

  const stages = q('.ai-cycle__stage');
  const stageStart = 0.14;
  const stageLen = (0.9 - stageStart) / CYCLE_STAGES.length;
  stages.forEach((stage, i) => {
    const s = at(cycle, stageStart + stageLen * i);
    tl.fromTo(stage, { '--active': 0 }, { '--active': 1, duration: cycle.span * stageLen * 0.4 }, s);
    if (i < stages.length - 1) {
      tl.to(stage, { '--active': 0.35, duration: cycle.span * stageLen * 0.4 }, s + cycle.span * stageLen);
    }
    tl.to(state, { pulse: 0.18, duration: cycle.span * stageLen * 0.3, yoyo: true, repeat: 1, ease: 'sine.inOut' }, s);
  });
  tl.fromTo('.ai-cycle__progress', { scaleY: 0 }, { scaleY: 1, duration: cycle.span * (0.9 - stageStart) }, at(cycle, stageStart));

  // ---- 7. Под ключ: орбита раскладывается в сетку-фон ----
  tl.to(bg, { backgroundColor: LIGHT_BG, duration: vh * 0.5 }, services.start - vh * 0.9);
  tl.call(() => onDark(tl.scrollTrigger!.direction < 0), [], services.start - vh * 0.6);
  tl.to(state, {
    orbit: 0, grid: 1, sphereScale: 0.4, opacity: 0.7, mouse: isDesktop ? 1.6 : 0,
    duration: vh * 0.9, ease,
  }, services.start - vh * 0.9);

  // ---- 8–9. Цифры и финал: всё стягивается обратно в сферу ----
  tl.to(state, {
    grid: 0, opacity: 1, sphereX: 0, sphereY: isMobile ? 0.75 : 0.62, sphereScale: isDesktop ? 0.82 : 0.6, mouse: isDesktop ? 1 : 0,
    duration: Math.max(finale.start - numbers.start, vh), ease,
  }, numbers.start);
  tl.to(state, { pulse: 0.5, flash: 1, duration: finale.span * 0.25, ease: 'power2.in' }, at(finale, 0.25));
  tl.to(state, { pulse: 0, flash: 0, duration: finale.span * 0.3, ease: 'power2.out' }, at(finale, 0.5));
  tl.fromTo(q('[data-chapter="finale"] .ai-reveal'), { autoAlpha: 0, y: 70 }, {
    autoAlpha: 1, y: 0, stagger: vh * 0.04, duration: vh * 0.35, ease: 'power2.out',
  }, at(finale, -0.2));

  // Длина таймлайна строго равна прокрутке страницы
  tl.set({}, {}, total);

  // Сцену и её рендер гасим, когда страница ушла под футер
  const visibility = ScrollTrigger.create({
    trigger: page,
    start: 'top bottom',
    end: 'bottom 40%',
    onToggle: self => onActive(self.isActive),
  });

  return () => {
    visibility.kill();
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}
