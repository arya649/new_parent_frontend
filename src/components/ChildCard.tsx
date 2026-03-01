import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { useAttendance } from '../hooks/useAttendance'
import { AvatarCircle } from './AvatarCircle'
import { StatusPill } from './StatusPill'
import type { Child, AttendanceStatus } from '../types'

interface Props {
  child: Child
}

export function ChildCard({ child }: Props) {
  const navigate = useNavigate()
  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')

  const { data: records } = useAttendance(
    child.student_id,
    today.getMonth() + 1,
    today.getFullYear()
  )

  // Find today's most recent record (latest period)
  const todayRecords = records?.filter((r) => r.date === todayStr) ?? []
  const todayRecord = todayRecords.sort((a, b) => b.period - a.period)[0]

  return (
    <button
      onClick={() => navigate(`/child/${child.student_id}`, { state: { child } })}
      className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#E2E8F0]
                 flex items-center gap-4 text-left transition-all duration-150
                 active:scale-[0.98] hover:shadow-md hover:border-[#BBF7D0]
                 animate-fadeIn"
    >
      <AvatarCircle name={child.full_name} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#111827] text-[15px] truncate">{child.full_name}</p>
        <p className="text-[#6B7280] text-[12px] mt-0.5">
          {child.roll_number ? `Roll No. ${child.roll_number}` : 'Student'}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {todayRecord ? (
          <StatusPill status={todayRecord.status as AttendanceStatus} size="sm" />
        ) : (
          <span className="text-xs text-[#9CA3AF] font-medium px-2 py-1 bg-gray-50 rounded-full">
            Not marked
          </span>
        )}
        <ChevronRight size={16} className="text-[#9CA3AF]" />
      </div>
    </button>
  )
}
