export type GuaranteeType = 'VEHICLE' | 'REAL_ESTATE' | 'FURNITURE' | 'OTHER';

export type GuaranteeStatus = 'AVAILABLE' | 'IN_USE' | 'RELEASED';

export interface Guarantee {
  id: string;
  clientId: string;
  type: GuaranteeType;
  description: string;
  estimatedValue: number | null;
  status: GuaranteeStatus;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Imagen seleccionada desde la galería (expo-image-picker), desacoplada
 * del tipo Asset de la librería para no filtrar dependencias al servicio.
 */
export interface GuaranteeImagePayload {
  uri: string;
  name: string;
  mimeType?: string;
}

export interface CreateGuaranteeInput {
  clientId: string;
  type: GuaranteeType;
  description: string;
  estimatedValue?: number | null;
  image?: GuaranteeImagePayload;
}

export interface UpdateGuaranteeInput {
  type?: GuaranteeType;
  description?: string;
  estimatedValue?: number | null;
  image?: GuaranteeImagePayload;
}

export interface GuaranteeResponse {
  data: Guarantee;
  message?: string;
}

export interface GuaranteeListResponse {
  data: Guarantee[];
}

export const GUARANTEE_TYPE_OPTIONS: { label: string; value: GuaranteeType }[] = [
  { label: 'Vehículo', value: 'VEHICLE' },
  { label: 'Inmueble / Bien Raíz', value: 'REAL_ESTATE' },
  { label: 'Muebles / Enseres', value: 'FURNITURE' },
  { label: 'Otro', value: 'OTHER' },
];
