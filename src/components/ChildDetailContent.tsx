import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import { useAttendance } from '../hooks/useAttendance'
import { useStats } from '../hooks/useStats'
import { TodayStatusBanner } from './TodayStatusBanner'
import { AttendanceCalendar } from './AttendanceCalendar'
import { StatsGrid } from './StatsGrid'
import type { Child } from '../types'

function SkeletonSection({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton h-12 w-full" />
      ))}
    </div>
  )
}

interface Props {
  child: Child
}

export function ChildDetailContent({ child }: Props) {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  const {
    data: records,
    isLoading: loadingRecords,
    isFetching,
    refetch,
  } = useAttendance(child.student_id, month, year)

  const { data: stats, isLoading: loadingStats } = useStats(child.student_id, month, year)

  const monthLabel = format(new Date(year, month - 1, 1), 'MMMM yyyy')

  return (
    <div className="flex flex-col h-full">
      {/* Refresh row */}
      <div className="flex items-center justify-between px-1 mb-4">
        <p className="text-[13px] text-[#6B7280]">
          {isFetching ? 'Updating…' : `Viewing ${monthLabel}`}
        </p>
        <button
          onClick={() => refetch()}
          className={`w-8 h-8 rounded-full flex items-center justify-center
                      hover:bg-[#F3F4F6] transition-colors ${isFetching ? 'animate-spin' : ''}`}
        >
          <RefreshCw size={14} className="text-[#6B7280]" />
        </button>
      </div>

      <div className="space-y-5 flex-1 overflow-y-auto">
        {/* Today banner */}
        <section>
          <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
            Today
          </p>
          {loadingRecords ? (
            <div className="skeleton h-20 w-full" />
          ) : (
            <TodayStatusBanner records={records ?? []} />
          )}
        </section>

        {/* Calendar */}
        <section>
          <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
            Monthly View
          </p>
          {loadingRecords ? (
            <SkeletonSection lines={4} />
          ) : (
            <AttendanceCalendar
              records={records ?? []}
              month={month}
              year={year}
              onMonthChange={(m, y) => { setMonth(m); setYear(y) }}
            />
          )}
        </section>

        {/* Stats */}
        <section className="pb-6">
          {loadingStats ? (
            <SkeletonSection lines={3} />
          ) : stats ? (
            <StatsGrid stats={stats} monthLabel={monthLabel} />
          ) : null}
        </section>
      </div>
    </div>
  )
}
