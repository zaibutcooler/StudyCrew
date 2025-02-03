import AccountForm from './form'
import { getLoggedInUser } from '@/utils/actions/user.actions'
import { notFound } from 'next/navigation'

export default async function CreateProfilePage() {
  const user = await getLoggedInUser()

  if (!user) {
    return notFound()
  }

  return <AccountForm user={user} />
}
