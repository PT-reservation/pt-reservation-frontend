'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ClassImage } from '@/components/ClassImage';
import { FitnessClass } from '@/types/api';

export function HomeBanner({ classes }: { classes: FitnessClass[] }) {
  const promoClasses = classes
    .filter((c) => c.currentCount < c.capacity)
    .slice(0, 3);

  const slides = [
    { type: 'welcome' as const },
    ...promoClasses.map((c) => ({ type: 'class' as const, fitnessClass: c })),
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[index];

  return (
    <div className="relative h-40 overflow-hidden rounded-2xl shadow-md shadow-black/20 sm:h-48">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
        >
          {slide.type === 'welcome' ? (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-brand/30 to-brand/5 text-center">
              <p className="text-lg font-bold text-foreground sm:text-2xl">
                그룹 PT, 실시간으로 예약하세요
              </p>
              <p className="mt-1 text-sm text-muted">
                PT팟에서 원하는 클래스를 찾아보세요
              </p>
            </div>
          ) : (
            <Link
              href={`/classes/${slide.fitnessClass.id}`}
              className="block h-full w-full"
            >
              <div className="relative h-full w-full">
                <ClassImage
                  src={slide.fitnessClass.imageUrl}
                  alt={slide.fitnessClass.title}
                  className="h-full"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-xs font-medium text-brand">
                    지금 예약 가능
                  </p>
                  <p className="text-lg font-bold text-white">
                    {slide.fitnessClass.trainerName} 트레이너 ·{' '}
                    {slide.fitnessClass.title}
                  </p>
                </div>
              </div>
            </Link>
          )}
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === index ? 'bg-white' : 'bg-white/40'
              }`}
              aria-label={`배너 ${i + 1}번으로 이동`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
