'use server'

import { createTransport } from 'nodemailer'

import { CandidateType } from '@/types/candidate.type'

import prisma from './prisma'
import { uploadFile } from './s3-client'
import { slugify } from './utils'

const MIN_NUMBER = Number(process.env.MIN_NUMBER)
const MAX_NUMBER = Number(process.env.MAX_NUMBER)
const EMAIL_BACKUP = String(process.env.EMAIL_BACKUP)

export async function sendDrawnNumber(formData: FormData) {
  try {
    const content = JSON.parse(formData.get('content') as string) as Omit<
      CandidateType,
      'fotoUrl' | 'numeroSorteado'
    >

    const drawnNumbers = await prisma.candidato
      .findMany({
        orderBy: { numeroSorteado: 'asc' },
        select: { numeroSorteado: true }
      })
      .then(candidates =>
        candidates.map(candidate => Number(candidate.numeroSorteado))
      )

    const number = await drawNumber(drawnNumbers)
    // const fotoUrl = await processImage(formData)
    const fotoUrl = 'imagem.png'

    if (!fotoUrl) throw new Error('Falha ao processar a imagem.')

    const candidate = await createCandidate({
      ...content,
      fotoUrl,
      numeroSorteado: String(number)
    })

    const transport = createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT ?? 465),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD
      }
    })

    const result = await transport.sendMail({
      to: [content?.email, EMAIL_BACKUP],
      from: process.env.EMAIL_FROM,
      subject: `Olá, ${content.nome}. Você recebeu um número sorteado`,
      html: html(content.nome, number),
      text: text(content.nome)
    })
    const resultBackup = await transport.sendMail({
      to: EMAIL_BACKUP,
      from: process.env.EMAIL_FROM,
      subject: 'Novo preenchimento do formulário.',
      html: htmlBackup(content.nome, candidate?.id, number),
      text: textBackup(content.nome)
    })
    const failed =
      result?.rejected?.concat(result?.pending).filter(Boolean) ||
      resultBackup?.rejected?.concat(result?.pending).filter(Boolean)

    if (failed?.length) {
      throw new Error(
        `Não foi possível enviar o(s) email(s) (${failed.join(', ')})`
      )
    }

    return { message: 'Número sorteado enviado com sucesso!' }
  } catch (error) {
    throw error
  }
}

async function drawNumber(drawnNumbers: number[]) {
  let number: number =
    Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER

  if (drawnNumbers.length <= MAX_NUMBER - MIN_NUMBER) {
    while (
      drawnNumbers.some(num => num === number) ||
      number > MAX_NUMBER ||
      number < MIN_NUMBER
    ) {
      number =
        Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER
    }
  } else {
    throw new Error('Limite de números sorteados atingido.')
  }

  return number
}

export async function createCandidate(candidate: CandidateType) {
  try {
    return await prisma.candidato.create({
      data: {
        cidade: candidate.cidade,
        email: candidate.email,
        cpf: candidate.cpf,
        estado: candidate.estado,
        nome: candidate.nome,
        numeroSorteado: String(candidate.numeroSorteado),
        orgaoEmissor: candidate.orgaoEmissor,
        notaFiscal: candidate.notaFiscal,
        origem: candidate.origem,
        dataCompra: candidate.dataCompra,
        fotoUrl: candidate.fotoUrl
      }
    })
  } catch (error) {
    throw error
  }
}

const processImage = async (
  formData: FormData
): Promise<string | undefined> => {
  const imageFormData = formData.get('image') as any

  if (!imageFormData || ['null', '[]', 'undefined'].includes(imageFormData))
    return undefined

  const file = formData.get('image') as File
  const image = await (formData.get('image') as Blob).arrayBuffer()
  const fileName = slugify(file.name)
  const path = `${process.env.AWS_S3_URL}/candidatos/img/${fileName}`

  // Realiza o upload para o AWS S3
  await uploadFile(`candidatos/img/${fileName}`, image)

  return path
}

function html(name: string, number: number) {
  return `<body>
    <h1>Olá, ${name}</h1>
    <p>Obrigado por preencher nosso formulário.</p>
    <p>Você recebeu um número sorteado! Seu número é:</p>
    <h2>${number}</h2>
  </body>`
}

function text(name: string) {
  return `Olá, ${name}. Você recebeu um número sorteado por preencher nosso formulário.`
}

function htmlBackup(name: string, id: string, number: number) {
  return `<body>
    <h1>Novo preenchimento</h1>
    <p>${name} preencheu o formulário.</p>
    <p>ID de ${name} é: ${id}.</p>
    <p>O número sorteado de ${name} é:</p>
    <h2>${number}</h2>
  </body>`
}

function textBackup(name: string) {
  return `Novo preenchimento. ${name} preencheu o formulário.`
}
