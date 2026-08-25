export const animationBgImage = (block: string, image: string, end: string = 'bottom center') => {
  gsap.set(image, {
    opacity: 0,
    scale: 0.6,
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: block,
      start: 'top+=15% bottom',
      end: end,
      scrub: 1,
    },
  });

  tl.to(image, {
    opacity: 1,
    scale: 1,
    duration: 6,
    delay: 3,
  });
};
