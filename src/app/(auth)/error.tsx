'use client'

import { useEffect } from 'react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error }: ErrorPageProps) {
  useEffect(() => {
    console.error('Error caught by error boundary:', error)
    if (error.digest) {
      console.error('Error Digest:', error.digest)
    }
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center gap-4 h-screen">
      <h2 className="text-2xl font-medium">Something went wrong!</h2>
      <p className="text-muted-foreground max-w-[320px] lg:max-w-[420px] text-center">
        {error.message
          ? error.message
          : 'An unexpected error occurred. Please try again or contact us.'}
      </p>
    </div>
  )
}
