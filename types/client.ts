export interface Client {
  id: string;
  fullName: string;
  phone: string;
  idNumber: string;
  phoneAlt: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  status: 'NO_LOAN' | 'WITH_LOAN' | 'OVERDUE' | string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ClientListResponse {
  data: Client[];
}
