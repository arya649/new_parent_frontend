import axios from 'axios'

// Ensure the API URL always has a protocol so axios treats it as absolute
function resolveBaseUrl(): string {
  const raw = (import.meta.env.VITE_API_URL as string) || ''
  if (!raw) {
    console.warn('[API] VITE_API_URL is not set — API calls will fail.')
    return ''
  }
  // If the env var was set without https://, prepend it
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  return `https://${raw}`
}

const BASE_URL = resolveBaseUrl()

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Attach Bearer token from localStorage on every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If 401, clear token (session expired)
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
