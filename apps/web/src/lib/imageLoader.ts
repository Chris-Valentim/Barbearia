/**
 * Resolução de caminho de asset estático.
 *
 * O deploy no GitHub Pages é servido a partir de /Barbearia, e não da raiz do
 * domínio. O next/image não aplica o basePath sozinho no export estático, e
 * tags <img> cruas nunca aplicam — o resultado era 404 em toda imagem do site
 * publicado.
 *
 * Em desenvolvimento NEXT_PUBLIC_BASE_PATH é vazio, então a função devolve o
 * caminho intacto.
 */
export function withBasePath(src: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

  // URLs absolutas passam intactas.
  if (/^https?:\/\//.test(src)) return src

  // Evita prefixar duas vezes.
  if (basePath && src.startsWith(`${basePath}/`)) return src

  return `${basePath}${src.startsWith('/') ? '' : '/'}${src}`
}

/**
 * Loader do next/image. É JavaScript puro, então continua compatível com
 * `output: 'export'`, que não tem servidor para otimizar imagem alguma.
 */
export default function imageLoader({ src }: { src: string }): string {
  return withBasePath(src)
}
