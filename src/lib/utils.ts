import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string) {
  return text
    ?.normalize('NFD') // Normaliza a string (remove acentos)
    ?.replace(/[\u0300-\u036f]/g, '') // Remove caracteres acentuados
    ?.toLowerCase() // Converter para minúsculas
    ?.replace(/ /g, '_') // Substituir espaços por underscores
    ?.replace(/[^a-z0-9_.]/g, '') // Remover caracteres não alfanuméricos (exceto ponto, underscore e hífen)
    ?.replace(/_+/g, '_') // Substituir múltiplos underscores por um único underscore
}
