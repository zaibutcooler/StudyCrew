'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { type User } from '@supabase/supabase-js'
import Image from 'next/image'
import Avatar from './avatar'
import Button from '@/components/ui/button'
import Logo from 'public/assets/Logo.svg'
import { Switch } from '@/components/ui/switch'
import { Form, FormField } from '@/components/ui/form'
import { useSupabaseClient } from '@/hooks/use-supabase'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import routes from '@/config/routes'

const accountSchema = z.object({
  name: z.string().max(100),
  about: z.string().max(400),
  showGroups: z.boolean(),
  emailNotifications: z.boolean()
})

type AccountSchemaType = z.infer<typeof accountSchema>

interface AccountFormProps {
  user: User | null
}

export default function AccountForm({ user }: AccountFormProps): JSX.Element {
  const supabase = useSupabaseClient()
  const [loading, setLoading] = useState<boolean>(true)
  const [avatar, setAvatar] = useState<string | null>(null)
  const toaster = useToast()
  const router = useRouter()

  const form = useForm<AccountSchemaType>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: '',
      about: '',
      showGroups: false,
      emailNotifications: false
    }
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('users')
          .select('name, about, avatar')
          .eq('user_id', user.id)
          .single()

        if (error) throw error

        if (data) {
          form.reset({
            name: data.name || '',
            about: data.about || ''
          })
          setAvatar(data.avatar)
        }

        const { data: settingsData } = await supabase
          .from('settings')
          .select('show_groups, email_notifications')
          .eq('user_id', user.id)
          .single()

        if (settingsData) {
          form.reset({
            showGroups: settingsData.show_groups,
            emailNotifications: settingsData.email_notifications
          })
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user, supabase, form])

  const handleSubmit = async (data: AccountSchemaType) => {
    setLoading(true)
    try {
      await supabase.from('users').upsert({
        user_id: user?.id,
        name: data.name,
        about: data.about,
        avatar
      })

      await supabase.from('settings').upsert({
        user_id: user?.id,
        show_groups: data.showGroups,
        email_notifications: data.emailNotifications
      })

      toaster.toast({
        title: 'Profile updated!',
        description: 'Your profile has been updated successfully.'
      })

      router.push(routes.DASHBOARD)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full">
      <header className="flex flex-row items-center justify-start p-4 gap-2 w-full">
        <Image src={Logo} alt="StudyCrew Logo" className="w-[45px] h-[45px]" />
        <h1 className="relative text-primary-500 text-[30px] font-bold">
          StudyCrew
          <span className="absolute uppercase bg-[#D3E4FF] text-[8px] text-gray-900 rounded-md px-1 py-0.5 -right-5 bottom-0">
            beta
          </span>
        </h1>
        <h2 className="font-bold text-center text-[40px] w-full">
          Create Your Profile
        </h2>
      </header>
      <div className="grid grid-cols-2 h-full px-[125px] gap-10 py-10">
        <div>
          <h3 className="text-2xl font-bold">Avatar</h3>
          <Avatar onAvatarChange={setAvatar} />
        </div>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-4"
            >
              <h3 className="text-2xl font-bold">Account</h3>
              <div className="bg-gray-200 rounded-lg py-[25px] px-[35px] flex flex-col gap-3">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="border border-grey rounded-lg px-2 outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your username"
                      maxLength={100}
                    />
                  )}
                />
                <FormField
                  name="about"
                  control={form.control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="border border-grey rounded-lg px-2 outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Excited to join the community and share knowledge!"
                      maxLength={400}
                    />
                  )}
                />
              </div>
              <h3 className="text-2xl font-bold">Settings</h3>
              <div className="bg-gray-200 rounded-lg py-[25px] px-[35px] flex flex-col gap-2.5">
                <FormField
                  name="showGroups"
                  control={form.control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <FormField
                  name="emailNotifications"
                  control={form.control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                text={loading ? 'Loading...' : 'Join StudyCrew'}
                className="uppercase py-2 bg-primary-500 text-white rounded-lg"
              />
            </form>
          </Form>
        </div>
      </div>
      <div className="bg-primary-100 py-1">
        <p className="text-center text-xs">
          The avatar style{' '}
          <a
            href="https://www.dicebear.com/styles/big-ears/"
            className="underline hover:text-primary-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            "Big Ears"
          </a>{' '}
          from{' '}
          <a
            href="https://www.dicebear.com/"
            className="underline hover:text-primary-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            DiceBear
          </a>{' '}
          is a remix of{' '}
          <a
            href="https://www.figma.com/community/file/986078800058673824"
            className="underline hover:text-primary-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            "Face Generator"
          </a>{' '}
          by{' '}
          <a
            href="https://thevisual.team/"
            className="underline hover:text-primary-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Visual Team
          </a>
          , licensed under{' '}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            className="underline hover:text-primary-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC BY 4.0
          </a>
          .
        </p>
      </div>
    </div>
  )
}
