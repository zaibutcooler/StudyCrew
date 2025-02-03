'use client'

import React from 'react'
import Image from 'next/image'
import GoogleAccount from 'public/assets/web_light_sq_ctn 1.svg'
import { useSupabaseClient } from '@/hooks/use-supabase'
import { getURL } from '@/utils'

export function GoogleOauthButton(): React.ReactElement {
  const supabase = useSupabaseClient()

  const onSignInClick = async () => {
    const redirectURL = getURL('/auth/callback')
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectURL
      }
    })
  }

  return (
    <Image
      src={GoogleAccount}
      alt="Google Account"
      className="w-[234px] h-[50px] cursor-pointer mt-8"
      onClick={onSignInClick}
    />
  )
}
