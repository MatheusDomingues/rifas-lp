import { Suspense } from 'react'

import { Form } from '@/components/form'
import { Header } from '@/components/header'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function Page() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <main className='relative w-screen h-screen bg-lp bg-center bg-no-repeat bg-fixed bg-cover text-white scroll-smooth'>
        <Header />

        <ScrollArea className='flex w-full h-full'>
          <div className='flex flex-col gap-6 items-center justify-start pb-10 pt-20'>
            <div
              id='inicio'
              className='flex p-4 max-h-[70%] justify-center w-full'
            >
              <img
                alt='Compre e concorra'
                src='/images/banner.png'
                className='w-full max-w-full max-h-full object-contain'
              />
            </div>

            <div id='passos' className='flex p-4 justify-center w-full'>
              <img
                alt='Compre e concorra'
                src='/images/steps.png'
                className='w-full max-w-full max-h-full object-contain'
              />
            </div>

            <Form />
          </div>
        </ScrollArea>
      </main>
    </Suspense>
  )
}
