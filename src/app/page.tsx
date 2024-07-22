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
                className='max-w-full max-h-full object-contain z-10'
              />
            </div>

            <Form />
          </div>
          <img
            alt='Compre e concorra'
            src='/images/bee.png'
            className='max-w-full max-h-[20%] md:max-h-[30%] object-contain absolute right-2 md:right-12 top-14 md:top-10'
          />
          <img
            alt='Compre e concorra'
            src='/images/trial.png'
            className='max-w-full max-h-[15%] md:max-h-[25%] object-contain absolute left-2 md:left-10 top-[74px] md:top-20'
          />
        </ScrollArea>
      </main>
    </Suspense>
  )
}
