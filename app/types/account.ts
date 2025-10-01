export interface GetAccountResponse {
  uuid: string;
  account_number?: string | null;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string | null;
  enrollment?: {
    has_accepted_plan: boolean;
    has_payment_method: boolean;
    is_billing_address_confirmed: boolean;
    is_identity_verified: boolean;
    is_enrollment_finalized: boolean;
    is_service_active: boolean;
  };
  app: {
    uuid: string;
    name: string;
  };
  locations: Array<{
    uuid: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postal_code: string;
    utility_number: string;
    service_start_date: string;
    final_service_date?: string | null;
    is_service_active: boolean;
    has_usage_history: boolean;
    estimated_next_reading_date?: string | null;
    plan_name?: string | null;
    plan_uuid?: string | null;
  }>;
}
