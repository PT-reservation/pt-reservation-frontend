'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useNotificationEvents } from '@/hooks/useNotificationEvents';

export function NotificationToast() {
  const message = useNotificationEvents();

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, x: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-4 right-4 z-50 rounded-2xl border border-brand bg-surface px-4 py-3 text-sm text-foreground shadow-lg shadow-black/30"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
