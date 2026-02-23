'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';

interface SwipeWrapperProps {
  children: ReactNode;
  currentPage: number;
}

export default function SwipeWrapper({ children, currentPage }: SwipeWrapperProps) {
  const router = useRouter();
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    const nextPage = currentPage + newDirection;
    if (nextPage >= 1 && nextPage <= 604) {
      setDirection(newDirection);
      router.push(`/page/${nextPage}`);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="relative overflow-hidden w-full h-full flex flex-col">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
           key={currentPage}
           custom={direction}
           variants={variants}
           initial="enter"
           animate="center"
           transition={{
             x: { type: "spring", stiffness: 300, damping: 30 },
             opacity: { duration: 0.2 },
           }}
           className="w-full h-full flex flex-col items-center justify-start absolute inset-0 py-4 px-4 overflow-y-auto custom-scrollbar"
           drag="x"
           dragConstraints={{ left: 0, right: 0 }}
           dragElastic={1}
           onDragEnd={(e, { offset, velocity }) => {
             const swipe = offset.x;

             // Swipe right (next page)
             if (swipe > 100) {
               paginate(1);
             } 
             // Swipe left (previous page)
             else if (swipe < -100) {
               paginate(-1);
             }
           }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
