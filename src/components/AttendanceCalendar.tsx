import { useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameMonth,
  isToday,
  parseISO,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { AttendanceRecord, AttendanceStatus } from '../types'
import { DayDetailModal } from './DayDetailModal'

interface Props {
  records: AttendanceRecord[]
  month: number
  year: number
  onMonthChange: (month: number, year: number) => void
}

const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const dotColors: Record<AttendanceStatus, string> = {
  present: '#16A34A',
  absent:  '#DC2626',
  late:    '#D97706',
}

// Get dominant status for a day (worst-case: absent > late > present)
function getDominantStatus(recs: AttendanceRecord[]): AttendanceStatus | null {
  if (!recs.length) return null
  if (recs.some((r) => r.status === 'absent')) return 'absent'
  if (recs.some((r) => r.status === 'late')) return 'late'
  return 'present'
}

export function AttendanceCalendar({ records, month, year, onMonthChange }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const refDate = new Date(year, month - 1, 1)
  const days = eachDayOfInterval({ start: startOfMonth(refDate), end: endOfMonth(refDate) })

  // day-of-week offset so Mon=0
  const startDow = (getDay(days[0]) + 6) % 7 // Mon-based

  // Group records by date
  const recordsByDate: Record<string, AttendanceRecord[]> = {}
  for (const r of records) {
    if (!recordsByDate[r.date]) recordsByDate[r.date] = []
    recordsByDate[r.date].push(r)
  }

  function prevMonth() {
    if (month === 1) onMonthChange(12, year - 1)
    else onMonthChange(month - 1, year)
  }
  function nextMonth() {
    if (month === 12) onMonthChange(1, year + 1)
    else onMonthChange(month + 1, year)
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      {/* Month nav */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
        <button
          onClick={prevMonth}
          className="w-9 h-9 rounded-full flex items-center justify-center
                     hover:bg-[#F3F4F6] active:bg-[#E5E7EB] transition-colors"
        >
          <ChevronLeft size={18} className="text-[#374151]" />
        </button>
        <span className="font-bold text-[#111827] text-[15px]">
          {format(refDate, 'MMMM yyyy')}
        </span>
        <button
          onClick={nextMonth}
          className="w-9 h-9 rounded-full flex items-center justify-center
                     hover:bg-[#F3F4F6] active:bg-[#E5E7EB] transition-colors"
        >
          <ChevronRight size={18} className="text-[#374151]" />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 px-3 pt-3">
        {DOW.map((d) => (
          <div key={d} className="text-center text-[11px] font-semibold text-[#9CA3AF] pb-2">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1 px-3 pb-4">
        {/* Empty cells before first day */}
        {Array.from({ length: startDow }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const dayRecs = recordsByDate[dateStr] ?? []
          const dominant = getDominantStatus(dayRecs)
          const todayCell = isToday(day)
          const isWeekend = [5, 6].includes((getDay(day) + 6) % 7) // Sat=5,Sun=6 Mon-based
          const hasTapableData = dayRecs.length > 0

          return (
            <button
              key={dateStr}
              onClick={() => hasTapableData && setSelectedDate(dateStr)}
              disabled={!hasTapableData}
              className={`flex flex-col items-center py-1.5 rounded-xl transition-all duration-100
                ${hasTapableData ? 'hover:bg-[#F0FDF4] active:scale-95 cursor-pointer' : 'cursor-default'}
                ${todayCell ? 'bg-[#F0FDF4]' : ''}
              `}
            >
              <span
                className={`text-[13px] font-medium leading-none mb-1.5
                  ${todayCell ? 'text-[#16A34A] font-bold' : ''}
                  ${isWeekend && !dominant ? 'text-[#CBD5E1]' : ''}
                  ${!isWeekend && !dominant && isSameMonth(day, refDate) ? 'text-[#374151]' : ''}
                `}
              >
                {format(day, 'd')}
              </span>

              {/* Status dot */}
              {dominant ? (
                <span
                  className="rounded-full"
                  style={{
                    width: 7,
                    height: 7,
                    backgroundColor: dotColors[dominant],
                    display: 'block',
                  }}
                />
              ) : (
                <span style={{ width: 7, height: 7, display: 'block' }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 py-3 border-t border-[#F3F4F6]">
        {[
          { color: '#16A34A', label: 'Present' },
          { color: '#DC2626', label: 'Absent' },
          { color: '#D97706', label: 'Late' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className="rounded-full"
              style={{ width: 8, height: 8, backgroundColor: color, display: 'block' }}
            />
            <span className="text-[11px] text-[#6B7280] font-medium">{label}</span>
          </div>
        ))}
      </div>

      {/* Day detail modal */}
      {selectedDate && (
        <DayDetailModal
          date={selectedDate}
          records={records}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  )
}
