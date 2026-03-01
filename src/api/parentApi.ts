import { apiClient } from './client'
import type { ApiResponse, AttendanceRecord, AttendanceStats, Child } from '../types'

// P1 — list of children linked to this parent
export async function getMyChildren(): Promise<Child[]> {
  const res = await apiClient.get<ApiResponse<Child[]>>('/parent/attendance/my-children')
  return res.data.data
}

// P2 — monthly attendance records for a child
export async function getChildAttendance(
  studentId: string,
  month: number,
  year: number
): Promise<AttendanceRecord[]> {
  const res = await apiClient.get<ApiResponse<AttendanceRecord[]>>(
    `/parent/attendance/child/${studentId}`,
    { params: { month, year } }
  )
  return res.data.data
}

// P3 — stats for a child in a date range
export async function getChildStats(
  studentId: string,
  startDate: string,
  endDate: string
): Promise<AttendanceStats> {
  const res = await apiClient.get<ApiResponse<AttendanceStats>>(
    `/parent/attendance/child/${studentId}/stats`,
    { params: { start_date: startDate, end_date: endDate } }
  )
  return res.data.data
}

// Auth — login
export async function login(email: string, password: string) {
  const res = await apiClient.post('/auth/login', { email, password })
  return res.data.data
}

// Push — get VAPID public key
export async function getVapidPublicKey(): Promise<string> {
  const res = await apiClient.get<ApiResponse<{ vapid_public_key: string }>>(
    '/parent/push/vapid-public-key'
  )
  return res.data.data.vapid_public_key
}

// Push — send subscription to backend
export async function subscribePush(subscription: PushSubscriptionJSON): Promise<void> {
  await apiClient.post('/parent/push/subscribe', subscription)
}
