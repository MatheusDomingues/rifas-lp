import { Suspense } from 'react'

import { LandingPage } from '@/components/landing-page'

export default function Page() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <LandingPage />
    </Suspense>
  )
}
