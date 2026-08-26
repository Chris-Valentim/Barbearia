# @barba/client-shared

Código compartilhado **entre a web e o mobile** — a camada que os dois
clientes têm em comum e que a api não usa.

## O que entra aqui

| Pasta | Conteúdo |
|---|---|
| `src/utils/` | Formatação e cálculo de datas, agenda e telefone |
| `src/hooks/` | Hooks de acesso a dados de catálogo (serviços, profissionais) |

## O que **não** entra aqui

- Entidades e contratos de domínio → `@barba/contracts` (também usados pela api)
- Regras de negócio de servidor → `apps/api/src/*/domain/`
- Componentes visuais → cada cliente tem o seu, porque React DOM e React
  Native não compartilham primitivos de renderização

## Resolução

Diferente de `@barba/contracts`, este pacote é **source-first**: `main` aponta
para `./src/index.ts` e não há passo de build. Os dois consumidores são
bundlers que transpilam TypeScript nativamente (Next.js via SWC, Expo via
Metro/Babel), então distribuir um `dist/` pré-compilado só adicionaria um
passo e o risco de o alvo de compilação não bater com o Hermes.

`@barba/contracts` é buildado com tsup porque também é consumido pela api,
que roda em Node via `tsc` e espera JavaScript.
