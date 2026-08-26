/** Centro por defecto del mapa: Cochabamba, Bolivia. */
export const DEFAULT_MAP_COORDS = {
  latitude: -17.385381,
  longitude: -66.147229,
} as const;

/** Zoom por defecto para fijar/seleccionar direcciones. */
export const DEFAULT_MAP_ZOOM = 15;

const ROUND_DECIMALS = 6;

/**
 * Redondea una coordenada a 6 decimales antes de enviarla al backend
 * (NestJS valida maxDecimalPlaces: 8 — ver FORMS.md / DATA_AND_STATE.md).
 */
export function roundCoord(value: number): number {
  return Number(value.toFixed(ROUND_DECIMALS));
}
