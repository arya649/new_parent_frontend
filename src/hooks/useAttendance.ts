import { useQuery } from '@tanstack/react-query'
import { getChildAttendance } from '../api/parentApi'

export function useAttendance(studentId: string, month: number, year: number) {
  return useQuery({
    queryKey: ['attendance', studentId, month, year],
    queryFn: () => getChildAttendance(studentId, month, year),
    staleTime: 5 * 60 * 1000,
    enabled: !!studentId,
  })
}
