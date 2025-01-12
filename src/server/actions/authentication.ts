'use server'

import { SignInSchemaType } from '@/app/(auth)/sign-in/form'
import { SignUpSchemaType } from '@/app/(auth)/sign-up/form'
import { createClient } from '@/utils/supabase/server'

export async function signIn(
  values: SignInSchemaType
): Promise<ActionResponse> {
  try {
    const supabase = createClient()

    const { error, data } = await supabase.auth.signInWithPassword(values)

    if (error) {
      throw new Error(error.message)
    }

    return { success: true, data }
  } catch (e) {
    console.log('[ERROR]', e)
    return { success: false, data: {} }
  }
}

export async function signUp(
  values: SignUpSchemaType
): Promise<ActionResponse> {
  try {
    const supabase = createClient()

    const { error, data } = await supabase.auth.signUp(values)

    if (error) {
      throw new Error(error.message)
    }

    return { success: true, data }
  } catch (e) {
    console.log('[ERROR]', e)
    return { success: false, data: {} }
  }
}

export async function createProfile(): Promise<ActionResponse> {
  return { success: true, data: {} }
}
