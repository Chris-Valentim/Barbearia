/** @type {import('next').NextConfig} */

// O deploy no GitHub Pages é servido a partir de /Barbearia, e não da raiz do
// domínio. Como isso mudaria todas as URLs em desenvolvimento, a configuração
// só é aplicada quando DEPLOY_TARGET=gh-pages.
const paraGitHubPages = process.env.DEPLOY_TARGET === 'gh-pages'
const caminhoBase = paraGitHubPages ? '/Barbearia' : ''

const nextConfig = {
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],

  // Exposto ao cliente para o loader de imagens montar o caminho correto.
  env: {
    NEXT_PUBLIC_BASE_PATH: caminhoBase,
  },

  images: {
    // Loader próprio em vez de `unoptimized: true`: com unoptimized o
    // next/image devolve o src cru e não aplica o basePath, o que fazia todas
    // as imagens darem 404 no site publicado. O loader é JS puro, então segue
    // compatível com output:'export', que não tem servidor para otimizar nada.
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.ts',
  },

  ...(paraGitHubPages && {
    // Gera HTML estático em out/ — o Pages não executa Node.
    output: 'export',
    basePath: caminhoBase,
    assetPrefix: caminhoBase,
    // Cada rota vira uma pasta com index.html, que é o que o Pages espera.
    trailingSlash: true,
  }),
}

export default nextConfig
