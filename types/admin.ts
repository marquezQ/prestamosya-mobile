export interface RecalculateOverdueResult {
  processedAt: string;
  todayReference: string;
  updatedInstallmentsCount: number;
  markedDelinquentClientsCount: number;
  restoredCurrentClientsCount: number;
}

export interface RecalculateOverdueResponse {
  data: RecalculateOverdueResult;
  message: string;
}
