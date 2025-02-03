'use client'

import React from 'react'
import Button from '@/components/ui/button'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField } from '@/components/ui/form'
import { useRouter, useSearchParams } from 'next/navigation'
import routes from '@/config/routes'
import { useToast } from '@/hooks/use-toast'
import { useSupabaseClient } from '@/hooks/use-supabase'

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export type SignInSchemaType = z.infer<typeof signInSchema>

export const SignInForm: React.FC = () => {
  const supabase = useSupabaseClient()
  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema)
  })
  const searchParams = useSearchParams()
  const router = useRouter()
  const toaster = useToast()

  const onSignIn = async (values: SignInSchemaType) => {
    const { error, data } = await supabase.auth.signInWithPassword(values)

    if (error) {
      toaster.toast({
        title: error.name || 'Error',
        description:
          error.message || "We couldn't sign you in. Please try again.",
        variant: 'destructive'
      })
      return
    }

    const redirect = searchParams.get('redirect')

    if (redirect == 'profile') {
      toaster.toast({
        title: 'Successful',
        description: 'You can create your account now!'
      })

      router.push(routes.CREATE_PROFILE)
      return
    }

    toaster.toast({
      title: 'Successful',
      description: "You've successfully signed in."
    })
    router.push(routes.DASHBOARD)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSignIn)}
        className="flex flex-col  gap-[20px]"
      >
        <FormField
          name={'email'}
          control={form.control}
          render={({ field }) => (
            <div className="flex flex-col">
              <label htmlFor="email">Email:</label>
              <input
                {...field}
                type="email"
                className="rounded-lg border border-grey px-3 h-12"
                placeholder="email@address.com"
              />
            </div>
          )}
        />

        <FormField
          name={'password'}
          control={form.control}
          render={({ field }) => (
            <div className="flex flex-col">
              <label htmlFor="password"> Password:</label>
              <input
                {...field}
                type="password"
                className="rounded-lg border border-grey px-3 h-12"
                placeholder="*****"
                required
              />
            </div>
          )}
        />

        <Button
          disabled={form.formState.isSubmitting}
          type={'submit'}
          text="Log in"
          className="uppercase py-2 bg-primary-500 text-white h-[40px] rounded-lg mt-4"
        />
      </form>
    </Form>
  )
}
