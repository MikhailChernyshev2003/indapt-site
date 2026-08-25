import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import MorphSVG from 'gsap/MorphSVGPlugin';

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) return;

  nuxtApp.hook('app:beforeMount', () => {
    gsap.registerPlugin(SplitText, ScrollTrigger, ScrollToPlugin, ScrollSmoother, MorphSVG);

    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.indexOf('android') > -1;
    const isIos = /iphone|ipad|ipod/.test(userAgent);

    if (isAndroid) {
      ScrollTrigger.config({
        ignoreMobileResize: true,
      });
      // ScrollTrigger.normalizeScroll(true); // test
    }
    else if (isIos) {
      ScrollTrigger.config({
        ignoreMobileResize: false,
      });
      ScrollTrigger.normalizeScroll(false);
    }
  });

  // nuxtApp.hook('page:loading:end', () => {
  //   ScrollSmoother.create({
  //     smooth: 1,
  //     effects: true,
  //   });
  // });
});
