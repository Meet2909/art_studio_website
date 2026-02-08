import React, { useLayoutEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';

export const ScrollStackItem = ({ children, itemClassName = '', style = {} }) => (
  <div
    className={`
      scroll-stack-card sticky top-[15vh]
      w-[96%] mx-auto 
      h-fit min-h-[60vh] 
      my-4 p-6 sm:p-8 
      rounded-[32px] 
      shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.15)] 
      border-t border-white/60
      box-border origin-top flex flex-col justify-start
      bg-white
      ${itemClassName}
    `.trim()}
    style={{
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d',
      willChange: 'transform, filter',
      transform: 'translateZ(0)',
      ...style
    }}
  >
    {children}
  </div>
);

const ScrollStack = ({
  children,
  className = '',
  itemScale = 0.05,
  itemStackDistance = 45,
  stackPosition = '15%',
  scaleEndPosition = '5%',
  baseScale = 1,
}) => {
  const scrollerRef = useRef(null);
  const cardsRef = useRef([]);
  const cardTopsRef = useRef([]);
  const lenisRef = useRef(null);
  const animationFrameRef = useRef(null);

  const getScrollData = useCallback(() => {
    return {
      scrollTop: window.scrollY,
      containerHeight: window.innerHeight,
    };
  }, []);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length) return;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = (parseFloat(stackPosition) / 100) * containerHeight;
    const scaleEndPositionPx = (parseFloat(scaleEndPosition) / 100) * containerHeight;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const isLastCard = i === cardsRef.current.length - 1;
      const cardTop = cardTopsRef.current[i];

      const triggerStart = cardTop - stackPositionPx - (itemStackDistance * i);
      const triggerEnd = cardTop - scaleEndPositionPx;

      let progress = 0;
      if (!isLastCard && scrollTop > triggerStart) {
        progress = (scrollTop - triggerStart) / (triggerEnd - triggerStart);
      }
      if (progress > 1) progress = 1;
      if (progress > 0.995) progress = 1;

      // TRANSLATE (stop once fully stacked)
      let translateY = 0;
      if (scrollTop >= triggerStart) {
        translateY = Math.min(
          scrollTop - cardTop + stackPositionPx + (itemStackDistance * i),
          itemStackDistance * i
        );
      }

      // SCALE
      const targetScale = baseScale + (i * itemScale);
      const currentScale = isLastCard ? 1 : (1 - (progress * (1 - targetScale)));

      // BLUR
      let currentBlur = 0;

      if (!isLastCard && progress >= 1) {
        const cardBottom = cardTop + card.offsetHeight;
        const stackLine = scrollTop + stackPositionPx;

        // Start blur ONLY after card is fully stacked AND its bottom goes above stack line
        if (cardBottom < stackLine) {
          const blurProgress = Math.min((stackLine - cardBottom) / 120, 1);
          currentBlur = blurProgress * 8; // smoother, lighter blur
        }
      }



      // stabilize subpixels
      const y = Math.round(translateY * 100) / 100;
      const s = Math.round(currentScale * 1000) / 1000;

      card.style.transform = `translate3d(0, ${y}px, 0) scale(${s})`;
      card.style.filter = `blur(${currentBlur}px)`;

      if (isLastCard) {
        card.style.opacity = 1;
        card.style.filter = 'none';
      }
    });
  }, [baseScale, itemScale, itemStackDistance, scaleEndPosition, stackPosition, getScrollData]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    cardsRef.current = Array.from(scroller.querySelectorAll('.scroll-stack-card'));

    // cache card top positions once
    cardTopsRef.current = cardsRef.current.map(card => {
      const rect = card.getBoundingClientRect();
      return rect.top + window.scrollY;
    });

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    });

    lenis.on('scroll', updateCardTransforms);

    const raf = (time) => {
      lenis.raf(time);
      animationFrameRef.current = requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    lenisRef.current = lenis;
    updateCardTransforms();

    return () => {
      if (lenisRef.current) lenisRef.current.destroy();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [updateCardTransforms]);

  return (
    <div
      ref={scrollerRef}
      className={`relative w-full min-h-screen bg-[#fafafa] ${className}`}
    >
      {/* reduced bottom padding so stack doesn’t drift */}
      <div className="scroll-stack-inner pt-[15vh] px-0 pb-[30vh]">
        {children}
      </div>
    </div>
  );
};

export default ScrollStack;
