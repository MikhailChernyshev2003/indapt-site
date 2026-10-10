import { MathUtils, Vector3 } from 'three';
import { CustomEase } from 'gsap/CustomEase';
import { CustomWiggle } from 'gsap/CustomWiggle';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(CustomEase, CustomWiggle);

let tl;
let introTimeoutId = null;
const splitInstances = [];
let autoScrollLockedUntil = 0;

// Элементы, которым десктопный и адаптивный таймлайны пишут инлайн-стили.
// При пересборке анимаций (ресайз через 1024) их нужно сбросить: иначе стили
// одного режима (x: 50vw, y: 30vh, x: 100vw, скрытые карточки) остаются в другом
const RESET_SELECTORS = [
  '.main__background',
  '.main__info',
  '.main__development-experts',
  '.main__services',
  '.main__projects',
  '.main__partners',
  '.main__vacancies',
  '.digital-conductor',
  '.digital-conductor__container',
  '.digital-conductor__info',
  '.digital-conductor__scroll-button-wrapper',
  '.digital-conductor__scroll-button',
  '.digital-info__info-text_2',
  '.digital-info__info-text-gradient',
  '.digital-info__link',
  '.development-experts__shape',
  '.development-experts__list-item',
  '.digital-services__list',
  '.digital-services__list-item .service-card__inner',
  '.digital-services__list-item .service-card__decor',
  '.digital-services__list-item .service-card__img',
  '.digital-services__list-item .service-card__title',
  '.our-projects',
  '.our-projects__info',
  '.our-projects__content',
  '.our-projects__row',
  '.our-projects__row-item',
  '.project-card__wrapper',
  '.our-partners__row-item',
  '.our-partners__row-item-overlay',
  '.our-partners__shape',
  '.vacancies__info-text',
  '.vacancies__info-button',
  '.vacancies__shape-wrapper',
];
const RESET_PROPS = 'transform,opacity,visibility,zIndex,filter,pointerEvents,height,overflow,top,background,color,transition';

export const getTimeline = () => tl;

// Пока анимации восстанавливают позицию после пересборки, onStart-колбэки
// таймлайна не должны уводить страницу авто-скроллом к другой секции
export const lockAutoScroll = (ms) => {
  autoScrollLockedUntil = performance.now() + ms;
};

// При prefers-reduced-motion не перебрасываем страницу программным скроллом
// к следующей секции: пользователь листает сам, сценарий таймлайна тот же
const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const isAutoScrollLocked = () => prefersReducedMotion() || performance.now() < autoScrollLockedUntil;

// Доводка к секции работает только вперёд: если страница уже ниже цели
// (утащили скроллбар, End, сильный флик), onStart, догнавший скролл,
// не должен возвращать её назад к 1740/3480/1600
const canAutoScrollTo = position => !isAutoScrollLocked() && !(position > 0 && window.scrollY >= position);

// Адаптив: секции выше экрана. Прижатые к низу сцены (проекты, партнёры,
// вакансии, эксперты на мобильном) уходили заголовком под шапку, прижатые
// к верху — низом за экран. Секцию сначала ставим так, чтобы заголовок был
// под шапкой (enterY), затем «прокручиваем» её до низа (settleY)
const ADAPTIVE_SCROLL_DISTANCE_PX = 10000;
const SECTION_FIT_HEADER_GAP_PX = 8;
const SECTION_FIT_TOLERANCE_PX = 24;
const SCROLL_THROUGH_UNITS_PER_SCREEN = 24; // ≈1:1 со скроллом пальцем
const SCROLL_THROUGH_MIN_UNITS = 3;
const SCROLL_THROUGH_MAX_UNITS = 40;
const SCROLL_THROUGH_HOLD_UNITS = 3;

const getSectionFit = (selector, titleSelector) => {
  const section = document.querySelector(selector);
  const wrapper = document.querySelector('.main__wrapper');
  if (!section || !wrapper) return { enterY: 0, settleY: 0, viewportHeight: 0 };

  const viewportHeight = wrapper.offsetHeight;
  // offsetHeight, а не rect: при пересборке посреди страницы шапка может быть спрятана
  const headerHeight = document.querySelector('.header')?.offsetHeight ?? 0;
  // offsetTop не учитывает transform, который уже выставлен секции
  const top = section.offsetTop;
  const bottom = top + section.offsetHeight;
  const title = section.querySelector(titleSelector);
  const titleTop = top + (title ? title.getBoundingClientRect().top - section.getBoundingClientRect().top : 0);
  const minTitleTop = headerHeight + SECTION_FIT_HEADER_GAP_PX;

  // Верх секции — к верху экрана: её собственный отступ рассчитан под шапку
  const enterY = titleTop < minTitleTop ? Math.max(-top, minTitleTop - titleTop) : 0;
  const overflowBottom = bottom + enterY - viewportHeight;
  const settleY = overflowBottom > SECTION_FIT_TOLERANCE_PX ? enterY - overflowBottom : enterY;

  return { enterY, settleY, viewportHeight };
};

const resetMainPageStyles = (sphere) => {
  const targets = RESET_SELECTORS.flatMap(selector => [...document.querySelectorAll(selector)]);

  if (targets.length) {
    gsap.set(targets, { clearProps: RESET_PROPS });
  }

  // У path внутри svg чистим только opacity: сброс transform удалил бы их собственный атрибут
  gsap.set('.development-experts__shape path', { clearProps: 'opacity' });

  // Новый таймлайн запишет стартовое значение прогресса сферы из текущего,
  // поэтому возвращаем её в исходное состояние
  if (sphere?.animation && sphere.animation.progress > 0) {
    sphere.animation.progress = 0;
  }
};

const fittedDistance = ref({
  distance: 0,
});

const trackSplit = (target, vars) => {
  const split = new SplitText(target, vars);
  splitInstances.push(split);
  return split;
};

export const cleanupMainPageAnimations = ({ camera, sphere, resetStyles = false } = {}) => {
  if (introTimeoutId) {
    clearTimeout(introTimeoutId);
    introTimeoutId = null;
  }

  if (tl) {
    tl.scrollTrigger?.kill();
    tl.kill();
    tl = null;
  }

  splitInstances.splice(0).forEach(split => split.revert());

  gsap.killTweensOf(window);

  if (camera?.position) {
    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(camera.rotation);
  }

  if (sphere?.animation) {
    gsap.killTweensOf(sphere.animation);
  }

  if (resetStyles) {
    resetMainPageStyles(sphere);
  }

  fittedDistance.value.distance = 0;
};

// При быстром скролле туда-обратно появление и скрытие заголовка стартуют
// почти одновременно, и последние буквы «застревали» видимыми. Гасим только
// предыдущий твин этого же заголовка: overwrite убил бы и пустой твин
// таймлайна с onStart/onReverseComplete на тех же буквах
const textTweens = new WeakMap();

const animText = (el, reversed = false) => {
  textTweens.get(el)?.kill();

  if (reversed) {
    textTweens.set(el, gsap.to([...el].reverse(), {
      opacity: 0,
      y: 20,
      duration: 0.05,
      stagger: 0.01,
    }));
    return;
  }

  textTweens.set(el, gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.05,
    stagger: 0.01,
  }));
};

export const desktopAnim = (hero, camera, sphere, options = {}) => {
  if (!hero || !camera || !sphere) return;

  const { skipIntro = false } = options;

  const viewportWidth = window.innerWidth;
  const isBelow1200 = viewportWidth < 1200;
  const isBetween1200And1400 = viewportWidth >= 1200 && viewportWidth < 1400;

  const sphereRadius = isBelow1200 ? 1.25 : isBetween1200And1400 ? 1.6 : 1;
  const sphereEdgeOffset = isBelow1200 ? 0.85 : isBetween1200And1400 ? 0.7 : 1.1;
  fittedDistance.value.distance = hero.getDistanceToFitSphere(
    sphereRadius * 1.2,
  );

  const getLeftEdgeX = () => {
    const distance = Math.abs(camera.position.z - fittedDistance.value.distance);
    const vFOV = MathUtils.degToRad(camera.fov);

    const frustumHeight = 2 * distance * Math.tan(vFOV / 2);
    const frustumWidth = frustumHeight * hero.threeComponent.aspect;

    return frustumWidth - sphereRadius * sphereEdgeOffset;
  };

  const splitTitleDigitalConductor = trackSplit(
    '.digital-conductor__title',
    { type: 'chars' },
  );
  const splitTitleDevelopmentExpert = trackSplit(
    '.development-experts__title',
    { type: 'chars' },
  );
  const splitTitleOurProject = trackSplit('.our-projects__title', {
    type: 'chars',
  });
  const splitTitleVacancies = trackSplit('.vacancies__info-title', {
    type: 'chars',
  });
  const splitTitleServices = trackSplit('.digital-services__title', {
    type: 'chars',
  });
  const splitTitleOurPartners = trackSplit('.our-partners__title', {
    type: 'chars',
  });
  const desktopSphereState = {
    isResettingToHero: false,
    isAnimationInitialized: false,
  };

  const scrollWindowTo = (position, duration = 1.5) => {
    if (!canAutoScrollTo(position)) return;

    gsap.killTweensOf(window);
    gsap.to(window, {
      duration,
      scrollTo: position,
      ease: 'linear',
      overwrite: 'auto',
    });
  };

  const alignCameraToHero = () => {
    gsap.set(camera.position, {
      x: 0,
      y: sphereRadius,
      z: fittedDistance.value.distance / 2,
    });
    gsap.set(camera.rotation, {
      y: 0,
    });
  };

  const ensureSphereAnimationInit = () => {
    sphere.initAnimation(new Vector3(getLeftEdgeX(), 0, 0));
    desktopSphereState.isAnimationInitialized = true;
  };

  const resetToHeroStage = () => {
    if (desktopSphereState.isResettingToHero) return;
    const timelineProgress = tl?.progress() ?? 1;
    const sphereProgress = sphere.animation?.progress ?? 0;
    const shouldForceReset = timelineProgress < 0.07 && sphereProgress > 0.2;

    scrollWindowTo(0, 1.2);
    gsap.delayedCall(1.25, () => {
      if (window.scrollY <= 5) {
        alignCameraToHero();
      }
    });

    if (!shouldForceReset) return;
    desktopSphereState.isResettingToHero = true;

    if (!desktopSphereState.isAnimationInitialized) {
      ensureSphereAnimationInit();
    }

    gsap.to(camera.position, {
      x: 0,
      y: sphereRadius,
      z: fittedDistance.value.distance / 2,
      duration: 0.25,
      overwrite: 'auto',
    });
    gsap.to(camera.rotation, {
      y: 0,
      duration: 0.25,
      overwrite: 'auto',
    });
    gsap.to(sphere.animation, {
      progress: 0,
      duration: 0.25,
      overwrite: 'auto',
    });
    gsap.delayedCall(0.3, () => {
      desktopSphereState.isResettingToHero = false;
    });
  };

  const initAnimations = () => {
    gsap.set('.development-experts__shape path', {
      opacity: 0,
    });

    gsap.set(
      [
        splitTitleDigitalConductor.chars,
        splitTitleDevelopmentExpert.chars,
        splitTitleOurProject.chars,
        splitTitleVacancies.chars,
        splitTitleServices.chars,
        splitTitleOurPartners.chars,
      ],
      {
        opacity: 0,
        y: 20,
      },
    );

    gsap.set('.vacancies__info-text', {
      opacity: 0,
      y: 50,
    });

    gsap.set('.vacancies__info-button', {
      y: 50,
    });

    gsap.set('.our-projects__content', {
      opacity: 0,
      y: 50,
    });

    gsap.set('.digital-conductor__info', {
      opacity: 0,
      y: 100,
    });

    gsap.set('.development-experts__list-item', {
      opacity: 0,
      y: 30,
    });

    gsap.set('.development-experts__shape path:nth-child(9)', {
      opacity: 1,
    });

    gsap.set('.development-experts__shape', {
      scale: 0.13,
      x: '15rem',
      opacity: 0,
    });

    gsap.set('.vacancies__shape-wrapper', {
      scale: 0.4,
    });

    gsap.set('.main__partners', {
      autoAlpha: 0,
      zIndex: 0,
    });

    gsap.set('.our-partners__row-item', {
      autoAlpha: 0,
      top: -70,
    });

    gsap.set('.__anim', {
      position: 'static',
      opacity: 1,
    });

    gsap.set('.main__info', {
      autoAlpha: 0,
      y: '50vh',
      x: '50vw',
      zIndex: 100,
      filter: 'blur(5px)',
    });

    gsap.set('.main__services', {
      y: '80vh',
    });

    gsap.set('.main__development-experts', {
      pointerEvents: 'none',
    });

    gsap.set(
      ['.main__development-experts', '.main__services', '.main__vacancies'],
      {
        autoAlpha: 0,
        zIndex: 0,
      },
    );

    gsap.set(['.main__projects', '.main__vacancies'], {
      autoAlpha: 0.7,
      y: '90%',
      zIndex: 0,
    });

    gsap.set('.digital-info__info-text_2', {
      autoAlpha: 0,
      height: 0,
      overflow: 'hidden',
    });

    gsap.set('.digital-info__link', {
      autoAlpha: 0,
    });

    runIntro();
  };

  const applyIntroCompleteState = () => {
    alignCameraToHero();
    gsap.set('.header', { y: 0 });
    gsap.set('.main__wrapper', { autoAlpha: 1 });
    gsap.set(splitTitleDigitalConductor.chars, { opacity: 1, y: 0 });
    gsap.set('.digital-conductor__info', { opacity: 1, y: 0 });
    document.body.classList.add('after-init');
  };

  const runIntro = () => {
    if (skipIntro) {
      applyIntroCompleteState();
      return;
    }

    hero.playInitAnimation(1);

    gsap.fromTo(
      camera.position,
      {
        y: 0,
        z: fittedDistance.value.distance,
      },
      {
        duration: 1,
        delay: 2.5,
        y: sphereRadius,
        z: fittedDistance.value.distance / 2,
      },
    );

    gsap.fromTo(
      '.header',
      {
        y: '-100%',
      },
      {
        y: 0,
        duration: 0.8,
        delay: 3.1,
      });

    gsap.fromTo(
      '.main__wrapper',
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
        duration: 0.8,
        delay: 3.1,
      });

    gsap.to(splitTitleDigitalConductor.chars, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.03,
      delay: 3,
    });

    gsap.to('.digital-conductor__info', {
      opacity: 1,
      y: 0,
      delay: 3.5,
      duration: 0.4,
      onComplete: () => {
        document.body.classList.add('after-init');
      },
    });
  };

  const pageAnimations = () => {
    ensureSphereAnimationInit();

    gsap.set('.main__scroll-top', {
      opacity: 1,
    });

    gsap.set('.anim__footer', {
      display: 'block',
    });

    tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.main__wrapper',
        start: 'top top',
        pin: true,
        end: '+=15000px',
        scrub: 1,
        anticipatePin: 1,
        enabled: false,
      },
    });

    tl.to('.digital-conductor', {
      pointerEvents: 'none',
      delay: 2,
    });

    tl.to('.digital-conductor__container', {
      y: -300,
      autoAlpha: 0,
      duration: 1.5,
    }, '<').addLabel('hero-leave');

    tl.to(
      camera.position,
      {
        y: 0,
        z: fittedDistance.value.distance,
        duration: 5,
      },
      'hero-leave-=1.5',
    ).addLabel('sphere-to-center');

    tl.to(
      '.digital-conductor__scroll-button-wrapper',
      {
        y: 900,
        autoAlpha: 0,
        duration: 1.5,
      },
      'hero-leave-=1.45',
    ).addLabel('hero-button-leave');
    tl.set(
      '.anim__header',
      {
        backdropFilter: 'blur(0px)',
        delay: 1.5,
      },
      '<',
    );

    // поднятие текста вверх
    tl.to(
      '.main__info',
      {
        duration: 7,
      },
      'hero-leave+=6',
    ).addLabel('info-in');

    tl.to(
      hero,
      {
        sphere8Progress: 1,
        duration: 7,
      },
      'sphere-to-center',
    );
    tl.to(
      sphere.animation,
      {
        progress: 1.01,
        duration: 20,
        onStart() {
          ensureSphereAnimationInit();
          scrollWindowTo(1740, 2);
        },
      },
      'hero-leave+=2',
    );

    tl.to('.main__info', {
      y: 0,
      filter: 'blur(0px)',
      autoAlpha: 1,
      ease: 'easeOut',
      duration: 7,
      delay: 10,
    }, '<');
    tl.to('.main__info', {
      onReverseComplete: () => {
        resetToHeroStage();
      },
    }, '<+=7');

    tl.to(
      '.main__info',
      {
        x: 0,
        delay: 10,
        duration: 15,
        ease: 'sine.inOut',
        onStart: () => {
          scrollWindowTo(3480, 1.5);
        },
      },
      'info-in',
    ).addLabel('info-title-left-shift');

    const sphereFlipProperties = {
      x: 0,
      rotationY: 0,
      distance: fittedDistance.value.distance,
    };

    tl.to(
      sphereFlipProperties,
      {
        duration: 15,
        distance: -fittedDistance.value.distance,
        rotationY: -180 * MathUtils.DEG2RAD,
        ease: 'sine.inOut',
        onUpdate: () => {
          camera.rotation.y = sphereFlipProperties.rotationY;
          camera.position.z = sphereFlipProperties.distance;
        },
      },
      'info-title-left-shift-=15',
    );

    tl.to(
      sphereFlipProperties,
      {
        x: -getLeftEdgeX(
          camera,
          fittedDistance.value.distance,
          sphereRadius * 1.2,
        ),
        duration: 15,
        ease: CustomWiggle.create('wave', {
          wiggles: 1,
          type: 'uniform',
        }),
        onUpdate: () => {
          camera.position.x = sphereFlipProperties.x;
        },
      },
      'info-title-left-shift-=15',
    );

    tl.to('.digital-info__info-text_2', {
      height: 'auto',
      autoAlpha: 1,
      duration: 5,
    });
    tl.to(
      '.development-experts__shape',
      {
        opacity: 1,
        x: 0,
        duration: 2,
      },
      '<-=7',
    );
    tl.to('.digital-info__info-text-gradient', {
      opacity: 0,
      duration: 2,
    });

    tl.to('.digital-info__link', {
      autoAlpha: 1,
      duration: 1,
    });

    tl.to('.main__info', {
      y: '-50vh',
      autoAlpha: 0,
      filter: 'blur(0px)',
      ease: 'easeOut',
      duration: 10,
    });

    tl.to(
      sphereFlipProperties,
      {
        distance: '+=3',
        x: -getLeftEdgeX(
          camera,
          fittedDistance.value.distance,
          sphereRadius * 1.2,
        ),
        duration: 10,
        onUpdate() {
          camera.position.z = sphereFlipProperties.distance;
          camera.position.x = sphereFlipProperties.x;
        },
      },
      '<',
    );

    tl.to(
      '.development-experts__shape',
      {
        scale: 0.6,
        duration: 10,
      },
      '<',
    );

    tl.to(
      '.main__background',
      {
        x: 0,
        opacity: 0,
        duration: 2,
      },
      '-=2',
    );

    tl.set(hero, {
      sphereOpacity: 0,
    });
    tl.set('.anim__header', {
      backdropFilter: 'blur(5px)',
    });

    tl.to(
      '.development-experts__shape path',
      {
        opacity: 0.1,
        stagger: 2,
        duration: 3,
        reversed: true,
      },
      '<-=3',
    );
    tl.to(
      '.development-experts__shape',
      {
        scale: 1.65,
        y: '9vw',
        duration: 15,
      },
      '<',
    );

    tl.to(
      '.main__development-experts',
      {
        autoAlpha: 1,
        filter: 'blur(0px)',
        zIndex: 3,
        duration: 3,
        pointerEvents: 'all',
      }, '<-=10');
    tl.to(splitTitleDevelopmentExpert.chars, {
      onStart: () => {
        animText(splitTitleDevelopmentExpert.chars);
      },
      onReverseComplete: () => {
        animText(splitTitleDevelopmentExpert.chars, true);
      },
    }, '-=5');
    tl.to(
      '.development-experts__list-item',
      {
        opacity: 1,
        y: 0,
        duration: 10,
        stagger: 0.5,
      },
      '<',
    ).addLabel('experts-in-=5');

    tl.to(
      '.main__development-experts',
      {
        y: '-80vh',
        zIndex: 0,
        duration: 10,
      },
      'experts-in+=5',
    );
    tl.to(
      '.development-experts__shape',
      {
        // scale: 1.1,
        duration: 9,
        x: '3%',
        // y: '-100%',
        // y: -600,
        // y: '-37.5rem',
        y: '-80vh',
      },
      '<',
    );
    tl.to(
      '.development-experts__shape',
      {
        duration: 6,
        opacity: 0,
      },
      '<',
    ).addLabel('experts-out');

    tl.to(
      '.main__services',
      {
        y: 0,
        autoAlpha: 1,
        filter: 'blur(0px)',
        zIndex: 4,
        duration: 10,
      },
      'experts-out-=10',
    );

    tl.to(
      '.main__background',
      {
        opacity: 0,
        duration: 10,
      },
      'experts-out-=10',
    );

    // tl.to('.digital-services__list', {
    //   x: '-103%',
    //   duration: 30,
    //   delay: 5,
    // });
    tl.to('.main__services', {
      autoAlpha: 0,
      // y: '-80vh',
      zIndex: 0,
      duration: 5,
      delay: 3,
    });
    tl.to(splitTitleServices.chars, {
      onStart: () => {
        animText(splitTitleServices.chars);
      },
      onReverseComplete: () => {
        animText(splitTitleServices.chars, true);
      },
    }, '<-=10');
    tl.to('.main__projects', {
      autoAlpha: 1,
      y: '40%',
      filter: 'blur(0px)',
      zIndex: 5,
      duration: 20,
    });
    tl.to(
      splitTitleOurProject.chars,
      {
        onStart: () => {
          animText(splitTitleOurProject.chars);
        },
        onReverseComplete: () => {
          animText(splitTitleOurProject.chars, true);
        },
        delay: 2,
      },
      '<',
    );
    tl.to(
      '.our-projects__content',
      {
        opacity: 1,
        y: 0,
        duration: 5,
      },
      '<',
    );
    tl.to('.main__projects', {
      y: 0,
      delay: 5,
      duration: 20,
    }).addLabel('projects-in');
    tl.to(
      '.main__background',
      {
        opacity: 0,
        duration: 10,
      },
      'projects-in-=25',
    );

    tl.to(
      '.our-projects__row',
      {
        autoAlpha: 1,
        duration: 10,
      },
      'projects-in-=35',
    );

    tl.to(
      ['.our-projects__row'],
      {
        // autoAlpha: 0.9,
        duration: 5,
      },
      'projects-in',
    );
    tl.to(
      '.our-projects__info',
      {
        autoAlpha: 0,
        duration: 5,
      },
      'projects-in',
    );

    tl.set(
      '.our-projects__row-item',
      {
        pointerEvents: 'none',
      },
      '<',
    );
    tl.to(
      '.__anim',
      {
        background: '#F6F8FF',
        duration: 10,
      },
      '<',
    );

    tl.to(
      '.our-projects__row',
      {
        y: '-80vh',
        pointerEvents: 'none',
        duration: 25,
        delay: 2,
      },
      '<',
    );

    tl.to(
      '.our-projects__row_1 .our-projects__row-item_1',
      {
        transition: 'none',
        pointerEvents: 'none',
        scaleX: 0.15,
        scaleY: 0.3,
        duration: 10,
        background: '#dee7ffff',
        x: '18vw',
        y: '85vh',
        delay: 2,
      },
      '<',
    );

    tl.to(
      '.our-projects__row_1 .our-projects__row-item_0',
      {
        transition: 'none',
        pointerEvents: 'none',
        scaleX: 0.15,
        scaleY: 0.3,
        // autoAlpha: 0.5,
        duration: 10,
        background: '#dee7ffff',
        x: '50vw',
        y: '85vh',
        delay: 0.3,
      },
      '<',
    );

    tl.to(
      '.our-projects__row_0 .our-projects__row-item_1',
      {
        transition: 'none',
        pointerEvents: 'none',
        scaleX: 0.15,
        scaleY: 0.3,
        duration: 10,
        background: '#dee7ffff',
        x: '10vw',
        y: '120vh',
        delay: 1,
      },
      '<',
    );

    tl.to(
      '.our-projects__row_0 .our-projects__row-item_0',
      {
        transition: 'none',
        pointerEvents: 'none',
        scaleX: 0.15,
        scaleY: 0.3,
        duration: 10,
        background: '#dee7ffff',
        x: '40vw',
        y: '120vh',
        delay: 1.5,
      },
      '<',
    );

    tl.to(
      '.project-card__wrapper',
      {
        opacity: 0,
        duration: 2,
      },
      '<',
    );

    tl.to(
      '.our-projects__shape',
      {
        opacity: 0,
        duration: 2,
      },
      '<-=3',
    );

    tl.to(
      '.our-projects',
      {
        opacity: 0,
        duration: 16,
      },
      '<',
    ).addLabel('projects-out');

    tl.to(
      '.main__partners',
      {
        autoAlpha: 1,
        zIndex: 6,
        duration: 10,
      },
      'projects-out-=15',
    );
    tl.to(splitTitleOurPartners.chars, {
      onStart: () => {
        animText(splitTitleOurPartners.chars);
      },
      onReverseComplete: () => {
        animText(splitTitleOurPartners.chars, true);
      },
    }, '<').addLabel('partners-in');

    tl.to(
      '.our-partners__row-item',
      {
        autoAlpha: 1,
        top: 0,
        stagger: 1,
        duration: 7,
        reversed: true,
      },
      '<-=5',
    );
    tl.to(
      '.our-partners__row-item-overlay',
      {
        opacity: 0,
        duration: 6,
      },
      '-=7',
    );
    tl.to(
      '.our-projects__row',
      {
        autoAlpha: 0,
        duration: 10,
      },
      '<+=5',
    );
    tl.to('.main__partners', {
      autoAlpha: 0,
      zIndex: 0,
      duration: 10,
    });
    tl.to(
      '.main__vacancies',
      {
        autoAlpha: 1,
        y: 0,
        zIndex: 7,
        duration: 20,
      },
      '-=3',
    );
    tl.to(splitTitleVacancies.chars, {
      onStart: () => {
        animText(splitTitleVacancies.chars);
      },
      onReverseComplete: () => {
        animText(splitTitleVacancies.chars, true);
      },
    }, '<+=3');

    tl.to(
      '.vacancies__shape-wrapper',
      {
        scale: 1.45,
        duration: 15,
      },
      '<',
    );
    tl.to('.vacancies__info-text', {
      opacity: 1,
      y: 0,
      duration: 5,
      delay: 5,
    }, '<').addLabel('vacancies-in');

    tl.to('.vacancies__info-button', {
      y: 0,
      duration: 5,
      delay: 5,
    }, '<');

    if (import.meta.dev) {
      let lastLabel = null;
      tl.eventCallback('onUpdate', () => {
        const currentTime = tl.time();
        // Convert labels object to array of { name, time }
        const labels = Object.entries(tl.labels)
          .map(([name, time]) => ({ name, time }))
          .sort((a, b) => a.time - b.time);

        let currentLabel = null;
        for (let i = labels.length - 1; i >= 0; i--) {
          if (currentTime >= labels[i].time) {
            currentLabel = labels[i].name;
            break;
          }
        }
        if (currentLabel !== lastLabel) {
          lastLabel = currentLabel;
          console.log(
            'Current label: %c' + currentLabel,
            'color: green; font-weight: bold;',
          );
        }
      });
    }
  };

  const schedulePageAnimations = () => {
    if (skipIntro) {
      pageAnimations();
      return;
    }

    introTimeoutId = setTimeout(() => {
      introTimeoutId = null;
      pageAnimations();
    }, 3200);
  };

  initAnimations();

  schedulePageAnimations();
};

export const adaptiveAnim = (
  hero,
  controls,
  digitalServicesRef,
  ourProjectsRef,
  camera,
  sphere,
  options = {},
) => {
  if (!hero || !camera || !sphere) return;

  const { skipIntro = false } = options;
  const sphereRadius = 1.1;
  fittedDistance.value.distance = hero.getDistanceToFitSphere(
    sphereRadius * 1.1,
  );

  const getTopEdgeY = () => {
    const distance = Math.abs(camera.position.z - fittedDistance.value.distance);
    const vFOV = MathUtils.degToRad(camera.fov);

    const frustumHeight = 2 * distance * Math.tan(vFOV / 2);
    const frustumWidth = frustumHeight * hero.threeComponent.aspect;

    return frustumWidth - sphereRadius * 1.1;
  };
  const isMobile = window.innerWidth <= 576;

  gsap.set('.main__scroll-top', {
    opacity: 1,
  });

  gsap.set('.digital-info__link', {
    autoAlpha: 0,
  });

  gsap.set('.our-partners__shape', {
    opacity: 0,
  });

  gsap.set('.development-experts__shape path', {
    opacity: 0,
  });

  gsap.set('.development-experts__shape path:nth-child(9)', {
    opacity: 1,
  });

  gsap.set('.development-experts__shape', {
    scale: 0.13,
    x: '15rem',
    opacity: 0,
  });

  gsap.set('.digital-info__info-text_2', {
    autoAlpha: 0,
    height: 0,
    overflow: 'hidden',
  });

  const splitTitleDigitalConductor = trackSplit(
    '.digital-conductor__title',
    { type: 'chars' },
  );
  const splitTitleDevelopmentExpert = trackSplit(
    '.development-experts__title',
    { type: 'chars' },
  );
  const splitTitleOurProject = trackSplit('.our-projects__title', {
    type: 'chars',
  });
  const splitTitleVacancies = trackSplit('.vacancies__info-title', {
    type: 'chars',
  });
  const splitTitleServices = trackSplit('.digital-services__title', {
    type: 'chars',
  });
  const splitTitleOurPartners = trackSplit('.our-partners__title', {
    type: 'chars',
  });

  gsap.set(
    [
      splitTitleDigitalConductor.chars,
      splitTitleDevelopmentExpert.chars,
      splitTitleOurProject.chars,
      splitTitleVacancies.chars,
      splitTitleServices.chars,
      splitTitleOurPartners.chars,
    ],
    {
      opacity: 0,
      y: 20,
    },
  );

  const applyAdaptiveIntroCompleteState = () => {
    gsap.set('.main__wrapper', { autoAlpha: 1 });
    gsap.set(camera.position, {
      y: sphereRadius,
      z: fittedDistance.value.distance / 1.6,
    });
    gsap.set(splitTitleDigitalConductor.chars, { opacity: 1, y: 0 });
    gsap.set('.digital-conductor__info', { opacity: 1, y: 0 });
    document.body.classList.add('after-init');
  };

  const runAdaptiveIntro = () => {
    if (skipIntro) {
      applyAdaptiveIntroCompleteState();
      return;
    }

    gsap.fromTo(
      '.main__wrapper',
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
        duration: 0.8,
        delay: 1.6,
      },
    );

    hero.playInitAnimation(1);

    gsap.fromTo(
      camera.position,
      {
        y: 0,
        z: fittedDistance.value.distance,
      },
      {
        duration: 1,
        delay: 2,
        y: sphereRadius,
        z: fittedDistance.value.distance / 1.6,
      },
    );

    gsap.to(splitTitleDigitalConductor.chars, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.03,
      delay: 3,
    });

    gsap.to('.digital-conductor__info', {
      opacity: 1,
      y: 0,
      delay: 3.5,
      duration: 0.4,
      onComplete: () => {
        document.body.classList.add('after-init');
      },
    });
  };

  gsap.set('.__anim', {
    position: 'static',
    opacity: 1,
  });

  gsap.set('.anim__footer', {
    display: 'block',
  });

  gsap.set('.digital-conductor__info', {
    opacity: 0,
    y: 100,
  });

  gsap.set(['.main__partners', '.main__vacancies'], {
    autoAlpha: 0,
    y: '100vh',
    zIndex: 0,
  });

  gsap.set('.our-projects__row', {
    x: '100vw',
  });

  gsap.set('.main__info', {
    autoAlpha: 0,
    y: '50vh',
    filter: 'blur(5px)',
  });

  gsap.set(
    '.main__development-experts',
    {
      autoAlpha: isMobile ? 1 : 0,
      y: isMobile ? '100%' : '30vh',
      zIndex: 0,
    },
  );

  gsap.set('.main__services', {
    autoAlpha: 0,
    filter: 'blur(5px)',
    y: '50vh',
    zIndex: 0,
  });

  gsap.set('.main__projects', {
    autoAlpha: 0.7,
    y: '100%',
    zIndex: 0,
  });

  runAdaptiveIntro();

  const pageAnimations = () => {
    gsap.set(
      camera.position,
      {
        y: sphereRadius,
        z: fittedDistance.value.distance / 1.6,
      },
    );

    const sectionFit = {
      experts: getSectionFit('.main__development-experts', '.development-experts__title'),
      projects: getSectionFit('.main__projects', '.our-projects__title'),
      partners: getSectionFit('.main__partners', '.our-partners__title'),
      vacancies: getSectionFit('.main__vacancies', '.vacancies__info-title'),
    };
    // Время, добавленное «прокруткой» секций: на него удлиняем скролл, чтобы
    // px на единицу таймлайна не менялись и все прежние позиции (1600 и т. д.) остались
    let addedUnits = 0;

    tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.main__wrapper',
        start: 'top top',
        pin: true,
        // Таймлайн к первому refresh уже собран: ScrollTrigger откладывает его на тик
        end: (self) => {
          const total = self.animation?.duration() ?? 0;
          const base = total - addedUnits;
          const distance = addedUnits > 0 && base > 0
            ? Math.round(ADAPTIVE_SCROLL_DISTANCE_PX * total / base)
            : ADAPTIVE_SCROLL_DISTANCE_PX;
          return `+=${distance}px`;
        },
        scrub: 1,
        anticipatePin: 1,
      },
    });

    // Досматриваем высокую секцию до низа: пауза, затем сдвиг ≈1:1 со скроллом.
    // holdAfter — пауза на низу секции, если следом она сразу исчезает
    const scrollSectionThrough = (selector, { enterY, settleY, viewportHeight }, position, holdAfter = 0) => {
      const distance = Math.abs(enterY - settleY);
      if (distance < 1 || !viewportHeight) return;

      const before = tl.duration();
      tl.to(selector, {
        y: settleY,
        duration: gsap.utils.clamp(
          SCROLL_THROUGH_MIN_UNITS,
          SCROLL_THROUGH_MAX_UNITS,
          SCROLL_THROUGH_UNITS_PER_SCREEN * distance / viewportHeight,
        ),
        delay: SCROLL_THROUGH_HOLD_UNITS,
        ease: 'none',
      }, position);
      if (holdAfter) {
        tl.to({}, { duration: holdAfter }, '>');
      }
      addedUnits += tl.duration() - before;
    };

    tl.to('.digital-conductor__container', {
      y: -300,
      autoAlpha: 0,
      filter: 'blur(5px)',
      duration: 10,
    });
    tl.to(
      '.digital-conductor__scroll-button',
      {
        y: 600,
        autoAlpha: 0,
        filter: 'blur(5px)',
        duration: 10,
      },
      '<',
    );

    tl.to(
      camera.position,
      {
        y: 0,
        z: fittedDistance.value.distance,
        duration: 10,
      },
      '<',
    );

    tl.to(
      sphere.animation,
      {
        progress: 1.01,
        duration: 20,
        onStart() {
          sphere.initAnimation(new Vector3(0, -getTopEdgeY() / 2, 0));
          if (!canAutoScrollTo(1600)) return;
          gsap.to(window, { duration: 2, scrollTo: 1600, ease: 'linear' });
        },
      },
      '<+=10',
    );

    tl.to(
      '.main__info',
      {
        y: 0,
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: 10,
        delay: 10,
      },
      '<',
    );

    tl.to(camera.position, {
      y: -3,
      duration: 15,
    }, '<-=7');
    tl.set(camera.position, {
      y: 5,
    }, '-=7');
    tl.to(camera.position, {
      y: 2.2,
      z: 5,
      duration: 15,
    }, '<');
    tl.to('.main__info', {
      x: 0,
      duration: 15,
    }, '<');
    tl.to('.digital-info__info-text_2', {
      height: 'auto',
      autoAlpha: 1,
      duration: 5,
    });
    tl.to('.digital-info__info-text-gradient', {
      y: 100,
      duration: 2,
    }, '<');
    tl.to('.digital-info__link', {
      autoAlpha: 1,
      duration: 5,
      onReverseComplete: () => {
        if (isAutoScrollLocked()) return;
        gsap.to(window, { duration: 3, scrollTo: 0, ease: 'linear' });
      },
    });
    tl.to(
      '.development-experts__shape',
      {
        opacity: 1,
        x: 0,
        y: '50vw',
        duration: 2,
      },
      '<-=2',
    );
    tl.to('.main__info', {
      x: '-20vw',
      autoAlpha: 0,
      pointerEvents: 'none',
      duration: 10,
    });

    tl.to('.main__development-experts', {
      autoAlpha: 1,
      y: sectionFit.experts.enterY,
      zIndex: 3,
      duration: 25,
      delay: 10,
    });
    tl.to(
      '.development-experts__shape path',
      {
        opacity: 0.1,
        stagger: 2,
        duration: 3,
        reversed: true,
      },
      '<-=3',
    );
    tl.to(
      '.development-experts__shape',
      {
        scale: 1,
        y: '9vw',
        duration: 15,
      },
      '<',
    );
    tl.to(camera.position, {
      z: 1,
      y: 0,
      duration: 15,
    }, '<');
    tl.to('.main__background', {
      opacity: 0,
      duration: 10,
    }, '<');
    tl.to(splitTitleDevelopmentExpert.chars, {
      onStart: () => {
        animText(splitTitleDevelopmentExpert.chars);
      },
      onReverseComplete: () => {
        animText(splitTitleDevelopmentExpert.chars, true);
      },
    }, '<');
    scrollSectionThrough('.main__development-experts', sectionFit.experts);
    tl.to('.main__development-experts', {
      autoAlpha: 0,
      filter: 'blur(5px)',
      zIndex: 0,
      duration: 10,
      delay: isMobile ? 10 : 5,
    });
    tl.to('.main__services', {
      autoAlpha: 1,
      filter: 'blur(0px)',
      y: 0,
      zIndex: 4,
      duration: 10,
    });
    tl.to(
      '.development-experts__shape',
      {
        scale: 1.6,
        duration: 9,
        y: '-100%',
        x: isMobile ? '-15%' : '15%',
      },
      '<',
    );
    tl.to(
      '.development-experts__shape',
      {
        duration: 4,
        opacity: 0,
      },
      '<',
    );
    tl.to(splitTitleServices.chars, {
      onStart: () => {
        animText(splitTitleServices.chars);
      },
      onReverseComplete: () => {
        animText(splitTitleServices.chars, true);
      },
    }, '<+=5');
    const serviceShapes = [
      'hexagonOrange',
      'square',
      'star',
      'triangle',
      'hexagonPurple',
      'circle',
      'flower',
      'hexagonGreen',
    ];

    if (digitalServicesRef && digitalServicesRef.handlerChangeShape) {
      digitalServicesRef.handlerChangeShape('hexagon');
    }

    tl.to('.digital-services__list', {
      x: isMobile ? '-580%' : '-410%',
      duration: 60,
      delay: 5,
      ease: 'linear',
      onStart: () => {
        if (digitalServicesRef && digitalServicesRef.handlerChangeShape) {
          digitalServicesRef.handlerChangeShape('hexagon');
        }
      },
      onReverseComplete: () => {
        if (digitalServicesRef && digitalServicesRef.handlerChangeShape) {
          digitalServicesRef.handlerChangeShape('hexagon');
        }
      },
      onUpdate: function () {
        const progress = this.progress();
        const currentIndex = Math.floor(progress * serviceShapes.length);
        const clampedIndex = Math.min(currentIndex, serviceShapes.length - 1);

        if (digitalServicesRef && digitalServicesRef.handlerChangeShape) {
          digitalServicesRef.handlerChangeShape(serviceShapes[clampedIndex]);
        }
      },
    });

    // enter hover anim
    tl.to(
      '.digital-services__list-item .service-card__inner',
      {
        background: 'var(--hover-bg)',
        stagger: 8,
        duration: 8,
        ease: 'linear',
      },
      '<-=5',
    );
    tl.to(
      '.digital-services__list-item .service-card__decor',
      {
        scale: 1,
        stagger: 8,
        duration: 8,
        ease: 'linear',
      },
      '<',
    );
    tl.to(
      '.digital-services__list-item .service-card__img',
      {
        y: 0,
        stagger: 8,
        duration: 8,
        ease: 'linear',
      },
      '<',
    );
    tl.to(
      '.digital-services__list-item .service-card__title',
      {
        y: isMobile ? -60 : -80,
        color: 'var(--hover-color)',
        stagger: 8,
        duration: 8,
        ease: 'linear',
      },
      '<',
    );

    // leave hover anim
    tl.to(
      '.digital-services__list-item .service-card__inner',
      {
        autoAlpha: 0,
        stagger: 8,
        duration: 8,
        ease: 'linear',
      },
      '<+=8',
    );
    tl.to(
      '.digital-services__list-item .service-card__decor',
      {
        autoAlpha: 0,
        stagger: 8,
        duration: 3,
        ease: 'linear',
      },
      '<',
    );
    tl.to(
      '.digital-services__list-item .service-card__img',
      {
        autoAlpha: 0,
        stagger: 8,
        duration: 2,
        ease: 'linear',
      },
      '<',
    );
    tl.to(
      '.digital-services__list-item .service-card__title',
      {
        y: 0,
        color: '#000',
        stagger: 8,
        duration: 8,
        ease: 'linear',
      },
      '<',
    );
    tl.to(
      '.main__services',
      {
        autoAlpha: 0,
        filter: 'blur(5px)',
        zIndex: 0,
        duration: 5,
      },
      '<+=55',
    );
    tl.to(
      '.main__projects',
      {
        autoAlpha: 1,
        y: sectionFit.projects.enterY,
        filter: 'blur(0px)',
        zIndex: 5,
        duration: 20,
      },
      '<',
    );
    const projectsEnteredAt = tl.recent().endTime();
    tl.to(
      splitTitleOurProject.chars,
      {
        onStart: () => {
          animText(splitTitleOurProject.chars);
        },
        onReverseComplete: () => {
          animText(splitTitleOurProject.chars, true);
        },
        delay: 2,
      },
      isMobile ? '<' : '<+=3',
    );
    const projectShapes = [
      '/images/projects/gaz-shape.svg',
      '/images/projects/bmw-shape.svg',
      '/images/projects/university-shape.svg',
      '/images/projects/kassir-shape.svg',
    ];

    tl.to(
      '.our-projects__row',
      {
        x: '-278vw', // 68.75vw * кол-во элементов
        duration: 40, // 10 * кол-во элементов
        onUpdate: function () {
          const progress = this.progress();
          const currentIndex = Math.floor(progress * projectShapes.length);
          const clampedIndex = Math.min(currentIndex, projectShapes.length - 1);

          if (ourProjectsRef && ourProjectsRef.handlerActiveShapeForAnim) {
            ourProjectsRef.handlerActiveShapeForAnim(projectShapes[clampedIndex]);
          }
        },
      },
      '<+=5',
    );
    // Пока карточки едут, поднимаем секцию, чтобы их низ был виден целиком
    scrollSectionThrough('.main__projects', sectionFit.projects, projectsEnteredAt);
    tl.to('.our-projects__shape', {
      opacity: 0,
      duration: 2,
    });
    tl.to('.main__projects', {
      autoAlpha: 0,
      zIndex: 0,
      y: '-50vh',
      duration: isMobile ? 10 : 5,
    });
    tl.to(
      '.main__partners',
      {
        autoAlpha: 1,
        y: sectionFit.partners.enterY,
        zIndex: 6,
        duration: isMobile ? 20 : 10,
        delay: isMobile ? 7 : 0,
      },
      '<',
    );
    tl.to(splitTitleOurPartners.chars, {
      onStart: () => {
        animText(splitTitleOurPartners.chars);
      },
      onReverseComplete: () => {
        animText(splitTitleOurPartners.chars, true);
      },
    }, isMobile ? '<' : '<+=3');

    tl.to('.our-partners__shape', {
      opacity: 1,
      duration: 6,
    }, '<+=5');
    scrollSectionThrough('.main__partners', sectionFit.partners, undefined, SCROLL_THROUGH_HOLD_UNITS * 2);
    tl.to('.main__partners', {
      autoAlpha: 0,
      zIndex: 0,
      duration: isMobile ? 10 : 5,
    });
    tl.to(
      '.main__vacancies',
      {
        autoAlpha: 1,
        y: sectionFit.vacancies.enterY,
        zIndex: 7,
        duration: 20,
        delay: isMobile ? 15 : 0,
      },
      '<',
    );
    tl.to(splitTitleVacancies.chars, {
      onStart: () => {
        animText(splitTitleVacancies.chars);
      },
      onReverseComplete: () => {
        animText(splitTitleVacancies.chars, true);
      },
    }, isMobile ? '<' : '<+=3');
    scrollSectionThrough('.main__vacancies', sectionFit.vacancies);
  };

  const schedulePageAnimations = () => {
    if (skipIntro) {
      pageAnimations();
      return;
    }

    introTimeoutId = setTimeout(() => {
      introTimeoutId = null;
      pageAnimations();
    }, 3200);
  };

  schedulePageAnimations();
};
