/**
 * Duração de um slot da agenda, em minutos. Cada serviço declara quantos
 * slots consome (`Service.slotsAmount`), então a duração real é sempre
 * `slotsAmount * TIME_SLOT`.
 */
export const TIME_SLOT = 15
