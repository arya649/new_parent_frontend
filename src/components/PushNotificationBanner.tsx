import { Bell, BellOff, Check, X } from 'lucide-react'
import { useState } from 'react'
import { usePushNotifications } from '../hooks/usePushNotifications'

export function PushNotificationBanner() {
  const { state, loading, error, subscribe } = usePushNotifications()
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem('push-banner-dismissed') === '1'
  )

  function dismiss() {
    setDismissed(true)
    sessionStorage.setItem('push-banner-dismissed', '1')
  }

  // Don't show if already subscribed, denied, unsupported, or dismissed
  if (state !== 'prompt' || dismissed) return null

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm animate-fadeIn">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
          <Bell size={18} className="text-[#16A34A]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#111827] text-[14px]">Enable notifications</p>
          <p className="text-[12px] text-[#6B7280] mt-0.5 leading-relaxed">
            Get instant alerts when your child is marked absent or late.
          </p>
          {error && (
            <p className="text-[12px] text-[#DC2626] mt-1">{error}</p>
          )}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={subscribe}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-[#16A34A] text-white text-[13px] font-semibold
                         active:scale-[0.97] transition-transform disabled:opacity-60"
            >
              {loading ? 'Enabling…' : 'Enable'}
            </button>
            <button
              onClick={dismiss}
              className="px-4 py-2 rounded-xl text-[#6B7280] text-[13px] font-medium
                         hover:bg-[#F3F4F6] transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          onClick={dismiss}
          className="w-7 h-7 rounded-full flex items-center justify-center
                     hover:bg-[#F3F4F6] transition-colors flex-shrink-0"
        >
          <X size={14} className="text-[#9CA3AF]" />
        </button>
      </div>
    </div>
  )
}

// Small inline status shown when already subscribed or denied (optional use)
export function PushStatusIndicator() {
  const { state } = usePushNotifications()

  if (state === 'subscribed') {
    return (
      <div className="flex items-center gap-1.5 text-[11px] text-[#16A34A] font-medium">
        <Check size={12} />
        Notifications on
      </div>
    )
  }

  if (state === 'denied') {
    return (
      <div className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF] font-medium">
        <BellOff size={12} />
        Notifications blocked
      </div>
    )
  }

  return null
}
