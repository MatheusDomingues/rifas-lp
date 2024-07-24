import { Suspense } from 'react'

import { Form } from '@/components/form'
import { Header } from '@/components/header'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function Page() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <main className='relative w-full h-full text-white scroll-smooth'>
        <Header />

        <ScrollArea className='flex w-screen h-screen relative'>
          <div className='flex flex-col gap-6 items-center justify-start pb-10 pt-16 md:pt-12 z-10 px-4 md:px-20'>
            <div id='inicio' className='flex justify-center w-full max-w-6xl'>
              <img
                alt='Compre e concorra'
                src='/images/banner.png'
                className='max-w-full max-h-full object-contain z-10'
              />
            </div>

            <div id='passos' className='flex justify-center w-full max-w-6xl'>
              <img
                alt='Compre e concorra'
                src='/images/steps.png'
                className='max-w-full max-h-full object-contain z-10 hidden md:flex'
              />
              <img
                alt='Compre e concorra'
                src='/images/steps-mobile.png'
                className='max-w-full max-h-full object-contain z-10 md:hidden'
              />
            </div>

            <Form />
          </div>
          <img
            alt='Compre e concorra'
            src='/images/bee.png'
            className='max-w-full max-h-[30%] md:max-h-[40%] object-contain absolute -right-10 top-[64px]'
          />
          <img
            alt='Compre e concorra'
            src='/images/trial.png'
            className='max-w-full max-h-[15%] md:max-h-[20%] object-contain absolute -left-6 top-[64px]'
          />
        </ScrollArea>
      </main>
    </Suspense>
  )
}
