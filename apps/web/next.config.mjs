/** @type {import('next').NextConfig} */

// O deploy no GitHub Pages é servido a partir de /Barbearia, e não da raiz do
// domínio. Como isso mudaria todas as URLs em desenvolvimento, a configuração
// só é aplicada quando DEPLOY_TARGET=gh-pages.
const paraGitHubPages = process.env.DEPLOY_TARGET === 'gh-pages'
const caminhoBase = '/Barbearia'

const nextConfig = {
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  ...(paraGitHubPages && {
    // Gera HTML estático em out/ — o Pages não executa Node.
    output: 'export',
    basePath: caminhoBase,
    assetPrefix: caminhoBase,
    // O otimizador de imagens do Next depende de servidor.
    images: { unoptimized: true },
    // Cada rota vira uma pasta com index.html, que é o que o Pages espera.
    trailingSlash: true,
  }),
}

export default nextConfig
