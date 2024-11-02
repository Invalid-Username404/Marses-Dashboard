export interface Statistic {
  _id: string;
  title: string;
  value: string;
}

export interface ChartData {
  chart_type: string;
  data: Array<{
    name: string;
    value: number;
    values?: Array<{
      date: string;
      value: number;
    }>;
  }>;
}

export interface Region {
  name: string;
  values: Array<{
    date: string;
    value: number;
  }>;
}

export interface DashboardData {
  success: boolean;
  charts: ChartData[];
  statistics: Statistic[];
  regions: Region[];
}
