export function slugify(text: string): string {
  return text
    .normalize('NFD') // Normaliza os caracteres para decompor acentos
    .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
    .toLowerCase() // Converte para minúsculas
    .trim() // Remove espaços no começo e no fim
    .replace(/[^\p{L}\p{N}\s-]/gu, '') // Permite caracteres unicode (letras e números) e espaços
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove múltiplos hífens consecutivos
    .replace(/^-+/, '') // Remove hífens no começo
    .replace(/-+$/, '') // Remove hífens no final
}
