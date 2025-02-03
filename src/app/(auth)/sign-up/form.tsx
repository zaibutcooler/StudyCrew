'use client'

import React from 'react'
import Button from '@/components/ui/button'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField } from '@/components/ui/form'
import routes from '@/config/routes'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useSupabaseClient } from '@/hooks/use-supabase'

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export type SignUpSchemaType = z.infer<typeof signUpSchema>

export const SignUpForm: React.FC = () => {
  const supabase = useSupabaseClient()
  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema)
  })
  const router = useRouter()
  const toaster = useToast()

  const onSignUp = async (values: SignUpSchemaType) => {
    const response = await supabase.auth.signUp(values)

    if (response.error) {
      toaster.toast({
        title: response.error.name,
        description: response.error.message,
        variant: 'destructive'
      })
      console.log('[SIGN_UP_ERROR]', response.error)
      return
    }

    toaster.toast({
      title: 'Successful',
      description:
        "You've successfully signed up. please confirm your email and continue"
    })

    router.push(routes.SIGN_IN + '?redirect=profile')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSignUp)}
        className="flex flex-col gap-[20px]"
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
          text="Sign Up"
          className="uppercase py-2 bg-primary-500 text-white h-[40px] rounded-lg mt-4"
        />
      </form>
    </Form>
  )
}
