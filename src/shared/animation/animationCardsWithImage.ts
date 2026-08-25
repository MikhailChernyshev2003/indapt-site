export const animationCardsWithImage = (content: string, cards: string, image: string) => {
  gsap.set(cards, {
    opacity: 0,
    y: 100,
  });

  gsap.set(image, {
    opacity: 0,
    scale: 0.6,
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: content,
      start: 'top+=15% bottom',
      end: 'bottom center',
      scrub: 1,
    },
  });

  tl.to(image, {
    opacity: 1,
    scale: 1,
    duration: 6,
    delay: 3,
  });
  tl.to(cards, {
    opacity: 1,
    y: 0,
    duration: 10,
    stagger: 4,
  });
};
