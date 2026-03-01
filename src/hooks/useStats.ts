import { useQuery } from '@tanstack/react-query'
import { getChildStats } from '../api/parentApi'
import { format, startOfMonth, endOfMonth } from 'date-fns'

export function useStats(studentId: string, month: number, year: number) {
  const refDate = new Date(year, month - 1, 1)
  const startDate = format(startOfMonth(refDate), 'yyyy-MM-dd')
  const endDate = format(endOfMonth(refDate), 'yyyy-MM-dd')

  return useQuery({
    queryKey: ['stats', studentId, month, year],
    queryFn: () => getChildStats(studentId, startDate, endDate),
    staleTime: 5 * 60 * 1000,
    enabled: !!studentId,
  })
}
