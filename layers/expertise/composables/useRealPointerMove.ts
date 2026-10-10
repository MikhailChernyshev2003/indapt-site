// Браузеры шлют mouseover/mouseenter (а Safari и mousemove) и без движения мыши — когда контент сам проезжает
// под неподвижным курсором: скролл колесом, анимация соседних блоков. Hover-эффекты, которые меняют раскладку,
// должны реагировать только на настоящее движение мыши, иначе блоки переключаются сами во время скролла.
export const useRealPointerMove = () => {
  let pointerX = -1;
  let pointerY = -1;
  let pointerMoved = false;

  // capture на window срабатывает раньше обработчиков на элементах, поэтому флаг уже актуален для текущего события
  useEventListener(window, 'pointermove', (event: PointerEvent) => {
    pointerMoved = event.clientX !== pointerX || event.clientY !== pointerY;
    pointerX = event.clientX;
    pointerY = event.clientY;
  }, { capture: true, passive: true });

  return (event: PointerEvent): boolean => event.pointerType === 'mouse' && pointerMoved;
};
