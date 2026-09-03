'use client';

import { useEffect, useRef } from 'react';
import { animate, useMotionValue, useTransform } from 'framer-motion';

export function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.6,
      ease: 'easeOut',
    });
    return controls.stop;
  }, [value]);

  useEffect(() => {
    return rounded.on('change', (latest) => {
      if (ref.current) ref.current.textContent = String(latest);
    });
  }, [rounded]);

  return <span ref={ref}>0</span>;
}
