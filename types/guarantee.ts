export type GuaranteeType = 'VEHICLE' | 'REAL_ESTATE' | 'FURNITURE' | 'OTHER';

export type GuaranteeStatus = 'AVAILABLE' | 'IN_USE' | 'RELEASED';

export interface Guarantee {
  id: string;
  clientId: string;
  type: GuaranteeType;
  description: string;
  estimatedValue: number | null;
  status: GuaranteeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGuaranteeInput {
  clientId: string;
  type: GuaranteeType;
  description: string;
  estimatedValue?: number | null;
}

export interface UpdateGuaranteeInput {
  type?: GuaranteeType;
  description?: string;
  estimatedValue?: number | null;
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
