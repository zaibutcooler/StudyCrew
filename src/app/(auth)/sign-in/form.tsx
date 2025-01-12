'use client'

import React from 'react'
import Button from '@/components/ui/button'
import { signIn } from '@/server/actions/authentication'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField } from '@/components/ui/form'

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export type SignInSchemaType = z.infer<typeof signInSchema>

export const SignInForm: React.FC = () => {
  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema)
  })

  const onSignIn = async (data: SignInSchemaType) => {
    const response = await signIn(data)
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
