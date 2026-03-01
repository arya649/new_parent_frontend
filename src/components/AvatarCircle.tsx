interface Props {
  name: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'w-9 h-9 text-sm',
  md: 'w-11 h-11 text-base',
  lg: 'w-14 h-14 text-xl',
}

function getInitials(name: string) {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return parts[0].slice(0, 2).toUpperCase()
}

// Deterministic color from name
const colors = [
  'bg-[#BBF7D0] text-[#14532D]',
  'bg-[#BFDBFE] text-[#1E3A8A]',
  'bg-[#FDE68A] text-[#78350F]',
  'bg-[#FBCFE8] text-[#831843]',
  'bg-[#DDD6FE] text-[#4C1D95]',
  'bg-[#BAE6FD] text-[#0C4A6E]',
]

function getColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export function AvatarCircle({ name, size = 'md' }: Props) {
  return (
    <div
      className={`${sizeMap[size]} ${getColor(name)} rounded-full flex items-center justify-center font-bold flex-shrink-0`}
    >
      {getInitials(name)}
    </div>
  )
}
