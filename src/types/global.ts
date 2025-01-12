type ActionError = { success: false; error: string; status?: number }

type ActionSuccess = { success: true; data: any }

type ActionResponse<T = any> = {
  success: boolean
  error?: string
  data: T | any
}
