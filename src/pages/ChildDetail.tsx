import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AvatarCircle } from '../components/AvatarCircle'
import { ChildDetailContent } from '../components/ChildDetailContent'
import type { Child } from '../types'

export function ChildDetail() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const child = (location.state as { child: Child } | null)?.child

  const name = child?.full_name ?? 'Student'
  const resolvedChild: Child = {
    student_id: id ?? '',
    full_name: name,
    roll_number: child?.roll_number,
  }

  return (
    <div className="min-h-screen bg-[#F0FDF4] flex flex-col">
      {/* Sticky header */}
      <header className="bg-white border-b border-[#E2E8F0] px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center
                     hover:bg-[#F3F4F6] active:bg-[#E5E7EB] transition-colors"
        >
          <ArrowLeft size={18} className="text-[#374151]" />
        </button>
        <AvatarCircle name={name} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[#111827] text-[15px] truncate">{name}</p>
          {resolvedChild.roll_number && (
            <p className="text-[11px] text-[#6B7280]">Roll No. {resolvedChild.roll_number}</p>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <ChildDetailContent child={resolvedChild} />
        </div>
      </main>
    </div>
  )
}
