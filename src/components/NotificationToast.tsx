'use client';

import { useNotificationEvents } from '@/hooks/useNotificationEvents';

export function NotificationToast() {
  const message = useNotificationEvents();

  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-md border border-brand bg-surface px-4 py-3 text-sm text-foreground shadow-lg">
      {message}
    </div>
  );
}
