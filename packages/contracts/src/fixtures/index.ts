/**
 * Dados de demonstração usados enquanto a web e o mobile não consomem a API.
 *
 * TODO: a api já persiste profissionais e serviços via Prisma (ver
 * apps/api/prisma/seed.ts, que popula o banco a partir daqui). Os clientes
 * ainda não têm tabela. Substituir por chamadas HTTP e manter estas fixtures
 * apenas como massa de seed.
 */
import clients from "./clients";
import professionals from "./professionals";
import services from "./services";

export { clients, professionals, services };
