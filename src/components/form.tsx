'use client'
import { useSearchParams } from 'next/navigation'
import { ChangeEvent, FormEvent, useState } from 'react'
import toast from 'react-hot-toast'

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
import { sendDrawnNumber } from '@/lib/actions'
import { CandidateType } from '@/types/candidate.type'

import { LoadingButton } from './loading-button'

export function Form() {
  const params = useSearchParams()
  const [isLoading, setLoading] = useState(false)
  const [values, setValues] = useState({
    nome: '',
    email: '',
    cpf: '',
    rg: '',
    orgaoEmissor: '',
    estado: '',
    cidade: '',
    notaFiscal: '',
    origem: params.get('utm_source') || ''
  })
  const [terms, setTerms] = useState({
    policy: false,
    privacy: false
  })
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(undefined)
  const [image, setImage] = useState<File | undefined>(undefined)

  const onChangeValues = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append(
        'content',
        JSON.stringify({
          cidade: values.cidade,
          email: values.email,
          estado: values.estado,
          nome: values.nome,
          notaFiscal: values.notaFiscal,
          origem: values.origem,
          rg: values?.rg,
          cpf: values?.cpf,
          orgaoEmissor: values?.orgaoEmissor,
          dataCompra: purchaseDate
        } satisfies Omit<CandidateType, 'fotoUrl' | 'numeroSorteado'>)
      )
      formData.append('image', image || '')

      const response = await sendDrawnNumber(formData)

      toast.success(response.message)
    } catch (err: any) {
      console.error(err)
      toast.error(
        err?.message ||
          'Não foi possível fazer o cadastro. Caso o erro persista, por favor contacte os administradores'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      id='form'
      className='flex flex-col gap-6 max-w-6xl w-full p-4'
      onSubmit={() => ({})}
    >
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>
        <div className='flex flex-col gap-2 w-full'>
          <Label htmlFor='nome'>
            Nome <span className='text-red-500'>*</span>
          </Label>
          <Input
            required
            className='w-full'
            id='nome'
            name='nome'
            value={values?.nome}
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
          <Label htmlFor='orgaoEmissor'>Órgão Emissor</Label>
          <Input
            className='w-full'
            id='orgaoEmissor'
            name='orgaoEmissor'
            value={values?.orgaoEmissor}
            onChange={onChangeValues}
          />
        </div>

        <div className='flex flex-col gap-2 w-full'>
          <Label htmlFor='estado'>
            Estado <span className='text-red-500'>*</span>
          </Label>
          <Input
            required
            className='w-full'
            id='estado'
            name='estado'
            value={values?.estado}
            onChange={onChangeValues}
          />
        </div>

        <div className='flex flex-col gap-2 w-full'>
          <Label htmlFor='cidade'>
            Cidade <span className='text-red-500'>*</span>
          </Label>
          <Input
            required
            className='w-full'
            id='cidade'
            name='cidade'
            value={values?.cidade}
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
          <Label htmlFor='notaFiscal'>
            Nota Fiscal <span className='text-red-500'>*</span>
          </Label>
          <Input
            required
            className='w-full'
            id='notaFiscal'
            name='notaFiscal'
            value={values?.notaFiscal}
            onChange={onChangeValues}
          />
        </div>

        <div className='flex flex-col gap-2 w-full'>
          <Label htmlFor='image' className='flex flex-col gap-2 w-full'>
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
                {!!image
                  ? `Arquivo: ${image?.name}`
                  : 'Clique aqui para selecionar um arquivo'}
              </span>
            </Button>
            <input
              required
              accept='image/*'
              type='file'
              id='image'
              className='hidden'
              onChange={e => {
                if (
                  e.target.files![0] &&
                  ['jpg', 'jpeg', 'png', 'svg'].includes(
                    e.target.files![0]?.name?.split('.')?.at(-1)!
                  )
                ) {
                  setImage(e.target.files![0])
                }
              }}
            />
          </Label>
        </div>

        <div className='flex flex-col gap-2 w-full'>
          <Label>
            Origem <span className='text-red-500'>*</span>
          </Label>
          <Select
            required
            value={values?.origem || ''}
            onValueChange={value =>
              setValues(prevState => ({ ...prevState, origem: value }))
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

      <LoadingButton
        type='submit'
        className='w-fit h-12 px-6 rounded-2xl text-2xl drop-shadow-md font-semibold m-auto'
        disabled={!terms.policy || !terms.privacy || !image}
        isLoading={isLoading}
      >
        Enviar
      </LoadingButton>
    </form>
  )
}
