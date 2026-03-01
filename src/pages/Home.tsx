import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Users } from 'lucide-react'
import { format } from 'date-fns'
import { useChildren } from '../hooks/useChildren'
import { ChildCard } from '../components/ChildCard'
import { SkeletonCard } from '../components/SkeletonCard'
import { AvatarCircle } from '../components/AvatarCircle'
import { ChildDetailContent } from '../components/ChildDetailContent'
import { PushNotificationBanner } from '../components/PushNotificationBanner'
import type { Child } from '../types'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function MobileChildCard({ child }: { child: Child }) {
  const navigate = useNavigate()
  return (
    <div onClick={() => navigate(`/child/${child.student_id}`, { state: { child } })}>
      <ChildCard child={child} />
    </div>
  )
}

function TabletChildRow({
  child,
  isSelected,
  onClick,
}: {
  child: Child
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all
        ${isSelected
          ? 'bg-[#DCFCE7] border border-[#86EFAC]'
          : 'hover:bg-[#F0FDF4] border border-transparent'
        }`}
    >
      <AvatarCircle name={child.full_name} size="sm" />
      <div className="flex-1 min-w-0">
        <p className={`text-[14px] font-semibold truncate ${isSelected ? 'text-[#14532D]' : 'text-[#111827]'}`}>
          {child.full_name}
        </p>
        {child.roll_number && (
          <p className="text-[11px] text-[#6B7280]">Roll No. {child.roll_number}</p>
        )}
      </div>
      {isSelected && <span className="w-2 h-2 rounded-full bg-[#16A34A] flex-shrink-0" />}
    </button>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-16 h-16 bg-[#DCFCE7] rounded-full flex items-center justify-center mb-4">
        <Users size={28} className="text-[#16A34A]" />
      </div>
      <h2 className="font-semibold text-[#111827] text-[17px] mb-2">No children linked</h2>
      <p className="text-[#6B7280] text-sm leading-relaxed max-w-xs">
        Please contact your school administration to link your children to this account.
      </p>
    </div>
  )
}

export function Home() {
  const { data: children, isLoading, error } = useChildren()
  const todayLabel = format(new Date(), 'EEEE, d MMM yyyy')
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)

  return (
    <div className="min-h-screen bg-[#F0FDF4] flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-[#E2E8F0] px-5 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#16A34A] flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="font-bold text-[#111827] text-[15px]">School Attendance</span>
        </div>
        <span className="text-[12px] text-[#6B7280] font-medium">{todayLabel}</span>
      </header>

      {/* Mobile layout (< md) */}
      <main className="flex-1 md:hidden px-4 py-6 max-w-2xl mx-auto w-full">
        <div className="mb-5">
          <h1 className="text-[22px] font-bold text-[#111827]">{getGreeting()} 👋</h1>
          <p className="text-[14px] text-[#6B7280] mt-1">Here's today's attendance update</p>
        </div>
        <div className="mb-4">
          <PushNotificationBanner />
        </div>
        {isLoading && (
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}
        {error && (
          <div className="bg-[#FEE2E2] border border-[#FECACA] rounded-2xl p-4 text-[#7F1D1D] text-sm">
            Failed to load. Please check your connection.
          </div>
        )}
        {!isLoading && !error && children?.length === 0 && <EmptyState />}
        {!isLoading && !error && children && children.length > 0 && (
          <div className="space-y-3">
            <p className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
              Your Children
            </p>
            {children.map((child) => (
              <MobileChildCard key={child.student_id} child={child} />
            ))}
          </div>
        )}
      </main>

      {/* Tablet layout (>= md) */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <aside className="w-72 bg-white border-r border-[#E2E8F0] flex flex-col overflow-y-auto flex-shrink-0">
          <div className="px-4 pt-5 pb-3">
            <h2 className="text-[14px] font-bold text-[#111827]">{getGreeting()} 👋</h2>
            <p className="text-[11px] text-[#6B7280] mt-0.5">Your children</p>
          </div>
          <div className="px-3 pb-3">
            <PushNotificationBanner />
          </div>
          <div className="flex-1 px-2 pb-4 space-y-1">
            {isLoading && (
              <div className="px-2 space-y-2 pt-2">
                <div className="skeleton h-14 w-full" />
                <div className="skeleton h-14 w-full" />
              </div>
            )}
            {!isLoading && children?.map((child) => (
              <TabletChildRow
                key={child.student_id}
                child={child}
                isSelected={selectedChild?.student_id === child.student_id}
                onClick={() => setSelectedChild(child)}
              />
            ))}
            {!isLoading && children?.length === 0 && (
              <p className="text-[12px] text-[#9CA3AF] text-center py-8 px-4">
                No children linked yet.
              </p>
            )}
          </div>
        </aside>

        {/* Right panel */}
        <main className="flex-1 overflow-y-auto">
          {selectedChild ? (
            <div className="max-w-2xl mx-auto px-6 py-6">
              <div className="flex items-center gap-3 mb-5">
                <AvatarCircle name={selectedChild.full_name} size="md" />
                <div>
                  <h2 className="text-[18px] font-bold text-[#111827]">{selectedChild.full_name}</h2>
                  {selectedChild.roll_number && (
                    <p className="text-[12px] text-[#6B7280]">Roll No. {selectedChild.roll_number}</p>
                  )}
                </div>
              </div>
              <ChildDetailContent child={selectedChild} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-16 h-16 bg-[#DCFCE7] rounded-full flex items-center justify-center mb-4">
                <GraduationCap size={28} className="text-[#16A34A]" />
              </div>
              <p className="font-semibold text-[#374151] text-[16px]">Select a child</p>
              <p className="text-[#9CA3AF] text-sm mt-1 max-w-xs">
                Choose from the list on the left to view their attendance
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
