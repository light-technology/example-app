export interface MonthlyUsageDay {
  month: string;
  consumption: string;
  generation: string;
  vehicle_charging: string;
  eligible_vehicle_charging: string;
}

export interface DailyUsageDay {
  date: string; // YYYY-MM-DD format
  consumption: string;
  generation: string;
  vehicle_charging: string;
  eligible_vehicle_charging: string;
}

export interface MonthlyUsageSummary {
  units: string;
  months: MonthlyUsageDay[];
}

export interface MonthlyUsageResponse {
  year: number;
  units: string;
  months: MonthlyUsageDay[];
  next?: string | null;
  previous?: string | null;
}

export interface DailyUsageResponse {
  month: number;
  year: number;
  units: string;
  days: DailyUsageDay[];
  next?: string;
  previous?: string;
}

export interface Invoice {
  number: string;
  invoice_date: string;
  payment_due_date: string;
  billing_period_start: string;
  billing_period_end: string;
  total_cents: number;
  total: string;
  total_kwh: string;
  avg_cents_per_kwh: string;
  pdf?: string;
  paid_at?: string;
  voided_at?: string;
}

export interface InvoicesResponse {
  data: Invoice[];
  has_more: boolean;
  limit: number;
  offset: number;
  next_page_url?: string | null;
}

export interface LocationDocuments {
  efl: string;
  tos: string;
  yrac: string;
  contract_start: string;
  contract_end: string;
}

export interface LocationPlan {
  name: string;
  uuid: string;
  plan_type: string;
  rate_structure: string;
}

export interface PaymentMethodResponse {
  type: string;
  card_brand: string;
  card_last4: string;
  card_exp_month: number;
  card_exp_year: number;
  card_postal_code: string;
}
