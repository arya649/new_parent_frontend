import { format, parseISO } from 'date-fns'
import { X, Clock, Hash } from 'lucide-react'
import { StatusPill } from './StatusPill'
import type { AttendanceRecord, AttendanceStatus } from '../types'

interface Props {
  date: string
  records: AttendanceRecord[]
  onClose: () => void
}

export function DayDetailModal({ date, records, onClose }: Props) {
  const dayRecords = records
    .filter((r) => r.date === date)
    .sort((a, b) => a.period - b.period)

  const formattedDate = format(parseISO(date), 'EEEE, d MMMM yyyy')

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl
                   shadow-2xl animate-slideUp overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-[#E2E8F0] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#F3F4F6]">
          <div>
            <p className="font-bold text-[#111827] text-[16px]">{formattedDate}</p>
            <p className="text-[12px] text-[#6B7280] mt-0.5">
              {dayRecords.length === 0
                ? 'No attendance recorded'
                : `${dayRecords.length} record${dayRecords.length > 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center
                       hover:bg-[#E5E7EB] transition-colors"
          >
            <X size={16} className="text-[#374151]" />
          </button>
        </div>

        {/* Records */}
        <div className="px-5 py-4 space-y-3 max-h-72 overflow-y-auto">
          {dayRecords.length === 0 ? (
            <p className="text-center text-[#9CA3AF] text-sm py-6">
              No attendance data for this day
            </p>
          ) : (
            dayRecords.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between py-3 px-4 bg-[#F9FAFB]
                           rounded-xl border border-[#F3F4F6]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#E2E8F0]
                                  flex items-center justify-center">
                    <Hash size={13} className="text-[#6B7280]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#374151]">Period {r.period}</p>
                    <p className="text-[11px] text-[#9CA3AF] flex items-center gap-1 mt-0.5">
                      <Clock size={10} />
                      {format(new Date(r.marked_at), 'h:mm a')}
                    </p>
                  </div>
                </div>
                <StatusPill
                  status={r.status as AttendanceStatus}
                  tag={r.tag}
                  size="sm"
                />
              </div>
            ))
          )}
        </div>

        {/* Close button */}
        <div className="px-5 pb-6 pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-[#16A34A] text-white font-semibold text-[15px]
                       active:scale-[0.98] transition-transform"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
