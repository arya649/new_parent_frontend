import { format } from 'date-fns'
import { Clock } from 'lucide-react'
import type { AttendanceRecord, AttendanceStatus } from '../types'

interface Props {
  records: AttendanceRecord[]
}

const statusConfig = {
  present: {
    bg: 'bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0]',
    border: 'border-[#86EFAC]',
    icon: '✅',
    label: 'Present Today',
    text: 'text-[#14532D]',
    sub: 'text-[#166534]',
  },
  absent: {
    bg: 'bg-gradient-to-br from-[#FEE2E2] to-[#FECACA]',
    border: 'border-[#FCA5A5]',
    icon: '❌',
    label: 'Absent Today',
    text: 'text-[#7F1D1D]',
    sub: 'text-[#991B1B]',
  },
  late: {
    bg: 'bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A]',
    border: 'border-[#FCD34D]',
    icon: '🕐',
    label: 'Late Today',
    text: 'text-[#78350F]',
    sub: 'text-[#92400E]',
  },
}

export function TodayStatusBanner({ records }: Props) {
  const today = format(new Date(), 'yyyy-MM-dd')
  const todayRecords = records.filter((r) => r.date === today)
  const latest = todayRecords.sort((a, b) => b.period - a.period)[0]

  if (!latest) {
    return (
      <div className="bg-[#F9FAFB] border border-[#E2E8F0] rounded-2xl p-4 flex items-center gap-3">
        <span className="text-2xl">📋</span>
        <div>
          <p className="font-semibold text-[#374151] text-[15px]">No record yet today</p>
          <p className="text-[12px] text-[#9CA3AF] mt-0.5">Attendance hasn't been marked yet</p>
        </div>
      </div>
    )
  }

  const cfg = statusConfig[latest.status as AttendanceStatus]
  const markedTime = format(new Date(latest.marked_at), 'h:mm a')

  return (
    <div className={`${cfg.bg} border ${cfg.border} rounded-2xl p-4 animate-fadeIn`}>
      <div className="flex items-start gap-3">
        <span className="text-3xl leading-none mt-0.5">{cfg.icon}</span>
        <div className="flex-1">
          <p className={`font-bold text-[18px] ${cfg.text}`}>{cfg.label}</p>
          {latest.tag && (
            <p className={`text-[13px] font-medium ${cfg.sub} mt-0.5 capitalize`}>
              Reason: {latest.tag}
            </p>
          )}
          <div className={`flex items-center gap-3 mt-2 ${cfg.sub}`}>
            <span className="flex items-center gap-1 text-[12px]">
              <Clock size={11} />
              {markedTime}
            </span>
            <span className="text-[12px]">·  Period {latest.period}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
