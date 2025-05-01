
export interface ProgressData {
  id: string;
  category: string;
  value: number;
  date: string;
  notes?: string;
}

export interface ProgressDataPoint {
  date: string;
  value: number;
}
