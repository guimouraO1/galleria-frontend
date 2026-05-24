export interface DashboardMoneyMetric {
    current: number;
    previous: number;
    percentage: number;
}

export interface DashboardCountMetric {
    current: number;
    previous: number;
    percentage: number;
}

export interface DashboardResponse {
    date: string;
    currentStartDate: string;
    currentEndDate: string;
    previousStartDate: string;
    previousEndDate: string;
    ordersTotal: DashboardMoneyMetric;
    ordersCount: DashboardCountMetric;
    newProducts: DashboardCountMetric;
    newClients: DashboardCountMetric;
    newUsers: DashboardCountMetric;
}
