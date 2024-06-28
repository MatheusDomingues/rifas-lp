'use server'
import { createClient } from 'redis'

const MIN_NUMBER = Number(process.env.MIN_NUMBER)
const MAX_NUMBER = Number(process.env.MAX_NUMBER)

export async function sendDrawnNumber(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  try {
    const redis = await createClient({ url: process.env.REDIS_URL })
      .on('error', err => {
        console.error('Redis Connection Error:', err)
        throw new Error('Não foi possível conectar com a base de dados.')
      })
      .connect()

    const form = e.currentTarget
    const formData = new FormData(form)

    const email = formData.get('email') as string
    const name = formData.get('name') as string

    const number = await sortNumber(redis)

    console.log({ email, name, number })

    // const transport = createTransport({
    //   host: process.env.EMAIL_SERVER_HOST,
    //   port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
    //   auth: {
    //     user: process.env.EMAIL_SERVER_USER,
    //     pass: process.env.EMAIL_SERVER_PASSWORD
    //   }
    // })
    // const result = await transport.sendMail({
    //   to: email,
    //   from: process.env.EMAIL_FROM,
    //   subject: `Olá, ${name}. Você recebeu um número sorteado`,
    //   text: text({ name, number }),
    //   html: html({ name, number })
    // })
    // const failed = result?.rejected?.concat(result?.pending).filter(Boolean)
    // if (failed?.length) {
    //   throw new Error(
    //     `Não foi possível enviar o(s) email(s) (${failed.join(', ')})`
    //   )
    // }
  } catch (error) {
    throw error
  }
}

async function sortNumber(redis: any) {
  const redisNumbers = await redis.get(process.env.RIFA_NAME + '-numbers-sent')
  const numbersSent = JSON.parse(redisNumbers || '[]')

  let number = null

  if (numbersSent.length < MAX_NUMBER - MIN_NUMBER) {
    do {
      number =
        Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER
    } while (numbersSent.includes(number))
  } else {
    throw new Error('Número máximo de números sorteados atingido.')
  }

  numbersSent.push(number)
  await redis.set(
    process.env.RIFA_NAME + '-numbers-sent',
    JSON.stringify(numbersSent)
  )

  return number
}

function html({ name, number }: any) {
  return `<body>
    <h1>Olá, ${name}</h1>
    <p>Obrigado por preencher nosso formulário.</p>
    <p>Você recebeu um número sorteado! Seu número é:</p>
    <h3>${number}</h3>
  </body>`
}

function text({ name }: any) {
  return `Olá, ${name}. Você recebeu um número sorteado por preencher nosso formulário.`
}
