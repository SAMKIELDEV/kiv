export {};
const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener('push', (event) => {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = { title: 'Kiv', body: event.data.text() };
  }

  const { title, body, icon, data: customData } = data as any;

  const options = {
    body: body || 'Time for your daily check-in.',
    icon: icon || '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    data: customData || { url: '/app' },
    vibrate: [100, 50, 100],
  };

  event.waitUntil(
    sw.registration.showNotification(title || 'Kiv', options)
  );
});

sw.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = (event.notification.data as any)?.url || '/app';

  event.waitUntil(
    sw.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (sw.clients.openWindow) {
        return sw.clients.openWindow(urlToOpen);
      }
    })
  );
});
