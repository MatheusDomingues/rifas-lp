'use client'
import { useSearchParams } from 'next/navigation'
import { ChangeEvent, useState } from 'react'

import { DatePicker } from '@/components/date-picker'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export function Form() {
  const params = useSearchParams()
  const origin = params.get('utm_source')
  const [values, setValues] = useState({
    name: '',
    email: '',
    cpf: '',
    rg: '',
    rge: '',
    state: '',
    city: '',
    nf: '',
    origin: origin || ''
  })
  const [terms, setTerms] = useState({
    policy: false,
    privacy: false
  })
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(undefined)
  const [file, setFile] = useState<File | undefined>(undefined)

  const onChangeValues = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  return (
    <form id='form' className='flex flex-col gap-6 max-w-6xl w-full p-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>
        <div className='flex flex-col gap-2 w-full'>
          <Label htmlFor='name'>
            Nome <span className='text-red-500'>*</span>
          </Label>
          <Input
            required
            className='w-full'
            id='name'
            name='name'
            value={values?.name}
            onChange={onChangeValues}
          />
        </div>

        <div className='flex flex-col gap-2 w-full'>
          <Label htmlFor='email'>
            Email <span className='text-red-500'>*</span>
          </Label>
          <Input
            required
            className='w-full'
            type='email'
            id='email'
            name='email'
            value={values?.email}
            onChange={onChangeValues}
          />
        </div>

        <div className='flex flex-col gap-2 w-full'>
          <Label htmlFor='cpf'>CPF</Label>
          <Input
            className='w-full'
            id='cpf'
            name='cpf'
            value={values?.cpf}
            onChange={onChangeValues}
          />
        </div>

        <div className='flex flex-col gap-2 w-full'>
          <Label htmlFor='rg'>RG</Label>
          <Input
            className='w-full'
            id='rg'
            name='rg'
            value={values?.rg}
            onChange={onChangeValues}
          />
        </div>

        <div className='flex flex-col gap-2 w-full'>
          <Label htmlFor='rge'>Órgão Emissor</Label>
          <Input
            className='w-full'
            id='rge'
            name='rge'
            value={values?.rge}
            onChange={onChangeValues}
          />
        </div>

        <div className='flex flex-col gap-2 w-full'>
          <Label htmlFor='state'>
            Estado <span className='text-red-500'>*</span>
          </Label>
          <Input
            required
            className='w-full'
            id='state'
            name='state'
            value={values?.state}
            onChange={onChangeValues}
          />
        </div>

        <div className='flex flex-col gap-2 w-full'>
          <Label htmlFor='city'>
            Cidade <span className='text-red-500'>*</span>
          </Label>
          <Input
            required
            className='w-full'
            id='city'
            name='city'
            value={values?.city}
            onChange={onChangeValues}
          />
        </div>

        <div className='flex flex-col gap-2 w-full'>
          <Label htmlFor='purchaseDate'>Data da Compra</Label>
          <DatePicker
            className='w-full h-12 text-black'
            id='purchaseDate'
            name='purchaseDate'
            value={purchaseDate}
            onChange={setPurchaseDate}
          />
        </div>

        <div className='flex flex-col gap-2 w-full'>
          <Label htmlFor='nf'>
            Nota Fiscal <span className='text-red-500'>*</span>
          </Label>
          <Input
            required
            className='w-full'
            id='nf'
            name='nf'
            value={values?.nf}
            onChange={onChangeValues}
          />
        </div>

        <div className='flex flex-col gap-2 w-full'>
          <Label htmlFor='file' className='flex flex-col gap-2 w-full'>
            <p>
              Foto da NF <span className='text-red-500'>*</span>
            </p>
            <Button
              type='button'
              asChild
              variant='outline'
              className='h-12 text-black font-normal'
            >
              <span className='cursor-pointer'>
                {!!file
                  ? `Arquivo: ${file?.name}`
                  : 'Clique aqui para selecionar um arquivo'}
              </span>
            </Button>
            <input
              required
              accept='image/*'
              type='file'
              id='file'
              className='hidden'
              onChange={e => {
                if (
                  e.target.files![0] &&
                  ['jpg', 'jpeg', 'png', 'svg'].includes(
                    e.target.files![0]?.name?.split('.')?.at(-1)!
                  )
                ) {
                  setFile(e.target.files![0])
                }
              }}
            />
          </Label>
        </div>

        <div className='flex flex-col gap-2 w-full'>
          <Label htmlFor='origin'>
            Origem <span className='text-red-500'>*</span>
          </Label>
          <Select
            required
            value={values?.origin || ''}
            onValueChange={value =>
              setValues(prevState => ({ ...prevState, origin: value }))
            }
          >
            <SelectTrigger className='h-12'>
              <SelectValue className='text-black' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='vitrine'>Vitrine</SelectItem>
                <SelectItem value='wobbler'>Wobbler</SelectItem>
                <SelectItem value='anuncio'>Anúncio</SelectItem>
                <SelectItem value='email'>Email</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <Checkbox
            checked={terms.policy}
            onCheckedChange={value =>
              setTerms(prevState => ({ ...prevState, policy: !!value }))
            }
          />
          <div>
            Li e aceito a{' '}
            <a
              type='button'
              className='font-bold hover:underline'
              target='_blank'
              href='https://google.com/'
            >
              Política de Privacidade
            </a>{' '}
            <span className='text-red-500'>*</span>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <Checkbox
            checked={terms.privacy}
            onCheckedChange={value =>
              setTerms(prevState => ({
                ...prevState,
                privacy: !!value
              }))
            }
          />
          <div>
            Li e aceito o{' '}
            <a
              type='button'
              className='font-bold hover:underline'
              target='_blank'
              href='https://google.com/'
            >
              Regulamento de participação
            </a>{' '}
            <span className='text-red-500'>*</span>
          </div>
        </div>
      </div>

      <Button
        className='w-fit h-12 px-6 rounded-2xl text-2xl drop-shadow-md font-semibold m-auto'
        disabled={!terms.policy || !terms.privacy || !file}
      >
        Enviar
      </Button>
    </form>
  )
}
