export type AttendanceStatus = 'present' | 'absent' | 'late'

export interface Child {
  student_id: string
  full_name: string
  class_id?: string
  roll_number?: string
}

export interface AttendanceRecord {
  id: string
  school_id: string
  class_id: string
  student_id: string
  date: string          // "2026-02-23"
  period: number
  status: AttendanceStatus
  tag: string | null
  marked_by: string
  marked_at: string
  created_at: string
  updated_at: string
}

export interface AttendanceStats {
  student_id: string
  total_days: number
  present: number
  absent: number
  late: number
  leave_days: number
  percentage: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string | null
  data: T
}
