export interface IPieChartItem {
  label: string;
  value: number;
  percentage: number;
}

export interface IDashboardOverview {
  totalProducers: number;
  totalFarms: number;
  totalHectares: number;
}

export interface IDashboardStats {
  overview: IDashboardOverview;
  byState: IPieChartItem[];
  byCrop: IPieChartItem[];
  byLandUse: IPieChartItem[];
}

export interface IDashboardService {
  getStats(): Promise<IDashboardStats>;
}
