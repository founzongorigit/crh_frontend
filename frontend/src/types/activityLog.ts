export type ActivityLogAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'STATUS_UPDATE'
  | 'LOGIN'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'PASSWORD_CHANGE'
  | 'RESET_PASSWORD'

export interface ActivityLog {
  id: string
  actor_id: string | null
  actor_email: string | null
  action: ActivityLogAction
  description: string
  target_user_id: string | null
  target_user_email: string | null
  object_type: string | null
  object_id: string | null
  ip_address: string | null
  user_agent: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface ActivityLogFilters {
  user_id?: string
  action?: ActivityLogAction
  limit?: number
}
