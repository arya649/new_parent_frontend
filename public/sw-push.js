// Push notification handler — injected alongside Workbox SW

self.addEventListener('push', (event) => {
  if (!event.data) return

  let payload
  try {
    payload = event.data.json()
  } catch {
    payload = { title: 'School Attendance', body: event.data.text() }
  }

  const title = payload.title || 'School Attendance'
  const options = {
    body: payload.body || '',
    icon: '/pwa-192.png',
    badge: '/pwa-192.png',
    tag: payload.tag || 'attendance-notification',
    data: payload.data || {},
    vibrate: [100, 50, 100],
    actions: payload.actions || [],
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Handle notification click — open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const urlToOpen = event.notification.data?.url || '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing window if open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(urlToOpen)
          return client.focus()
        }
      }
      // Otherwise open a new window
      return self.clients.openWindow(urlToOpen)
    })
  )
})
