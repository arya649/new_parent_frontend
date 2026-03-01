export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E2E8F0] flex items-center gap-4">
      <div className="skeleton w-11 h-11 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-36 rounded" />
        <div className="skeleton h-3 w-24 rounded" />
      </div>
      <div className="skeleton h-7 w-20 rounded-full" />
    </div>
  )
}
