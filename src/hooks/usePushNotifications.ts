import { useState, useEffect, useCallback } from 'react'
import { getVapidPublicKey, subscribePush } from '../api/parentApi'

type PushState = 'idle' | 'prompt' | 'subscribed' | 'denied' | 'unsupported'

// Decode URL-safe base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// Backend returns SPKI-wrapped key (91 bytes). PushManager needs raw 65-byte key.
// P-256 SPKI header is always 26 bytes, followed by the 65-byte uncompressed key.
function vapidKeyToApplicationServerKey(vapidBase64: string): Uint8Array {
  const fullKey = urlBase64ToUint8Array(vapidBase64)

  // 65 bytes = already raw uncompressed key, use as-is
  if (fullKey.length === 65) return fullKey

  // 91 bytes = SPKI wrapped, extract raw key (bytes 26..91)
  if (fullKey.length === 91) return fullKey.slice(26)

  // Unknown format, pass through and let the browser decide
  return fullKey
}

// Promise that races SW ready against a timeout so it never hangs
function waitForServiceWorker(timeoutMs = 5000): Promise<ServiceWorkerRegistration> {
  return Promise.race([
    navigator.serviceWorker.ready,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Service worker not ready')), timeoutMs)
    ),
  ])
}

export function usePushNotifications() {
  const [state, setState] = useState<PushState>('idle')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check current state on mount
  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
      setState('unsupported')
      return
    }

    if (Notification.permission === 'denied') {
      setState('denied')
      return
    }

    if (Notification.permission === 'granted') {
      // Check if already subscribed (with timeout so it doesn't hang)
      waitForServiceWorker()
        .then((sw) => sw.pushManager.getSubscription())
        .then((sub) => setState(sub ? 'subscribed' : 'prompt'))
        .catch(() => setState('prompt'))
      return
    }

    // permission === 'default' → can ask
    setState('prompt')
  }, [])

  const subscribe = useCallback(async () => {
    if (state === 'unsupported' || state === 'denied') return

    setLoading(true)
    setError(null)

    try {
      // 1. Get VAPID public key from backend
      const vapidKey = await getVapidPublicKey()

      // 2. Get service worker registration (with timeout)
      const sw = await waitForServiceWorker(8000)

      // 3. Subscribe to push (this triggers the browser permission prompt)
      const subscription = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKeyToApplicationServerKey(vapidKey),
      })

      // 4. Send subscription to backend
      await subscribePush(subscription.toJSON())

      setState('subscribed')
    } catch (err) {
      console.error('[Push] subscribe failed:', err)
      if (Notification.permission === 'denied') {
        setState('denied')
      } else {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        setError(msg.includes('Service worker')
          ? 'Notifications require a secure connection or production build.'
          : 'Failed to enable notifications. Please try again.'
        )
      }
    } finally {
      setLoading(false)
    }
  }, [state])

  return { state, loading, error, subscribe }
}
