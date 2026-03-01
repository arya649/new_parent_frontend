import type { AttendanceStatus } from '../types'

interface Props {
  status: AttendanceStatus
  size?: 'sm' | 'md' | 'lg'
  tag?: string | null
}

const config = {
  present: {
    bg: 'bg-[#DCFCE7]',
    text: 'text-[#14532D]',
    dot: 'bg-[#16A34A]',
    label: 'Present',
  },
  absent: {
    bg: 'bg-[#FEE2E2]',
    text: 'text-[#7F1D1D]',
    dot: 'bg-[#DC2626]',
    label: 'Absent',
  },
  late: {
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#78350F]',
    dot: 'bg-[#D97706]',
    label: 'Late',
  },
}

const sizeMap = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
}

export function StatusPill({ status, size = 'md', tag }: Props) {
  const c = config[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${c.bg} ${c.text} ${sizeMap[size]}`}
    >
      <span className={`${c.dot} rounded-full inline-block`} style={{ width: 7, height: 7 }} />
      {c.label}
      {tag && <span className="opacity-60 font-normal capitalize">· {tag}</span>}
    </span>
  )
}
