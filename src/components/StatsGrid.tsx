import type { AttendanceStats } from '../types'

interface Props {
  stats: AttendanceStats
  monthLabel: string
}

function StatCard({
  icon,
  value,
  label,
  color,
  bg,
}: {
  icon: string
  value: string | number
  label: string
  color: string
  bg: string
}) {
  return (
    <div
      className={`${bg} rounded-2xl p-4 flex flex-col gap-1 border`}
      style={{ borderColor: color + '30' }}
    >
      <span className="text-2xl leading-none">{icon}</span>
      <span className="text-[26px] font-extrabold leading-none mt-1" style={{ color }}>
        {value}
      </span>
      <span className="text-[12px] font-medium text-[#6B7280] mt-0.5">{label}</span>
    </div>
  )
}

export function StatsGrid({ stats, monthLabel }: Props) {
  const pct = Math.round(stats.percentage)

  // Ring color
  const ringColor =
    pct >= 75 ? '#16A34A' : pct >= 50 ? '#D97706' : '#DC2626'

  return (
    <div>
      <p className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-4">
        {monthLabel} Stats
      </p>

      {/* Attendance % ring */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex items-center gap-5 mb-4 shadow-sm">
        {/* SVG ring */}
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
            <circle cx="32" cy="32" r="26" fill="none" stroke="#E5E7EB" strokeWidth="6" />
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke={ringColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(pct / 100) * 163.4} 163.4`}
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
          </svg>
          <span
            className="absolute inset-0 flex items-center justify-center text-[13px] font-bold"
            style={{ color: ringColor }}
          >
            {pct}%
          </span>
        </div>
        <div>
          <p className="font-bold text-[#111827] text-[17px]">
            {pct >= 75 ? 'Good attendance' : pct >= 50 ? 'Needs attention' : 'Low attendance'}
          </p>
          <p className="text-[13px] text-[#6B7280] mt-1">
            {stats.total_days} school day{stats.total_days !== 1 ? 's' : ''} recorded
          </p>
        </div>
      </div>

      {/* 2×2 grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon="✅"
          value={stats.present}
          label="Present"
          color="#16A34A"
          bg="bg-[#F0FDF4]"
        />
        <StatCard
          icon="❌"
          value={stats.absent}
          label="Absent"
          color="#DC2626"
          bg="bg-[#FEF2F2]"
        />
        <StatCard
          icon="🕐"
          value={stats.late}
          label="Late"
          color="#D97706"
          bg="bg-[#FFFBEB]"
        />
        <StatCard
          icon="📋"
          value={stats.leave_days}
          label="On Leave"
          color="#6B7280"
          bg="bg-[#F9FAFB]"
        />
      </div>
    </div>
  )
}
