'use client';

import { useRouter } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import { ReactNode, useEffect, useCallback, useState } from 'react';

interface SwipeWrapperProps {
  children: ReactNode;
  currentPage: number;
}

export default function SwipeWrapper({ children, currentPage }: SwipeWrapperProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Embla setup with RTL support
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    direction: 'rtl',
    startIndex: 1, // Start at the current page (middle slide)
    loop: false,
    dragFree: false,
    duration: 30
  });

  const onSelect = useCallback(() => {
    if (!emblaApi || isNavigating) return;
    
    const index = emblaApi.selectedScrollSnap();
    
    // In RTL [0, 1, 2] = [Previous, Current, Next]
    // Swipe Right (drag ->) moves to Index 2 -> Next (+1)
    // Swipe Left (drag <-) moves to Index 0 -> Previous (-1)
    
    if (index === 0) {
      const prevPage = currentPage - 1;
      if (prevPage >= 1) {
        setIsNavigating(true);
        router.push(`/page/${prevPage}`);
      } else {
        emblaApi.scrollTo(1);
      }
    } else if (index === 2) {
      const nextPage = currentPage + 1;
      if (nextPage <= 604) {
        setIsNavigating(true);
        router.push(`/page/${nextPage}`);
      } else {
        emblaApi.scrollTo(1);
      }
    }
  }, [emblaApi, currentPage, router, isNavigating]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    
    // Cleanup listener on unmount or re-render
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    
    // When currentPage changes (route matched), reset carousel to center
    emblaApi.scrollTo(1, true); // true for jump without animation
    setIsNavigating(false);
  }, [currentPage, emblaApi]);

  return (
    <div className="embla overflow-hidden w-full h-full relative" ref={emblaRef}>
      <div className="embla__container flex h-full">
        {/* Previous page slide (Index 0) */}
        <div className="embla__slide flex-[0_0_100%] min-w-0 h-full flex flex-col items-center justify-center bg-gray-50/50 select-none">
           <div className="text-gray-300 font-serif text-2xl animate-pulse">
             Halaman {currentPage > 1 ? currentPage - 1 : '-'}
           </div>
        </div>
        
        {/* Current page slide (Index 1) */}
        <div className="embla__slide flex-[0_0_100%] min-w-0 h-full relative overflow-y-auto custom-scrollbar px-4 py-4">
          <div className="flex flex-col items-center justify-start w-full min-h-full">
            {children}
          </div>
        </div>
        
        {/* Next page slide (Index 2) */}
        <div className="embla__slide flex-[0_0_100%] min-w-0 h-full flex flex-col items-center justify-center bg-gray-50/50 select-none">
           <div className="text-gray-300 font-serif text-2xl animate-pulse">
             Halaman {currentPage < 604 ? currentPage + 1 : '-'}
           </div>
        </div>
      </div>
    </div>
  );
}
