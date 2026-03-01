import { useQuery } from '@tanstack/react-query'
import { getMyChildren } from '../api/parentApi'

export function useChildren() {
  return useQuery({
    queryKey: ['children'],
    queryFn: getMyChildren,
    staleTime: 5 * 60 * 1000, // 5 min
  })
}
