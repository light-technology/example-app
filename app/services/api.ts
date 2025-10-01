import { getPublicLightApiBaseUrl } from '../config/light-api';
import { TokenCache } from './tokenCache';
import { GetAccountResponse } from '../types/account';
import {
  MonthlyUsageResponse,
  DailyUsageResponse,
  InvoicesResponse,
  LocationDocuments,
  LocationPlan,
  PaymentMethodResponse,
} from '../types/energy';

interface GetFlowResponse {
  flow_login_link: string;
  account_uuid: string;
}

interface GetAccountTokenResponse {
  token: string;
  expires_at: string;
}

interface ApiError {
  error: string;
}

export class ApiService {
  private static ACCOUNT_UUID_KEY = 'light_account_uuid';
  private static tokenCache = TokenCache.getInstance();

  private static getBaseUrl(): string {
    if (typeof window === 'undefined') {
      return 'http://localhost:3000';
    }
    return process.env.NODE_ENV === 'production'
      ? window.location.origin
      : 'http://localhost:3000';
  }

  static getStoredAccountUuid(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return sessionStorage.getItem(this.ACCOUNT_UUID_KEY);
  }

  static clearStoredAccountUuid(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.ACCOUNT_UUID_KEY);
      this.tokenCache.clearToken();
    }
  }

  private static getLightApiBaseUrl(): string {
    return getPublicLightApiBaseUrl();
  }

  static async getFlow(scope: string): Promise<GetFlowResponse> {
    try {
      const cachedAccountUuid =
        typeof window !== 'undefined'
          ? sessionStorage.getItem(this.ACCOUNT_UUID_KEY)
          : null;

      const url = new URL(`${this.getBaseUrl()}/api/get-flow`);
      url.searchParams.append('scope', scope);
      if (cachedAccountUuid) {
        url.searchParams.append('account_uuid', cachedAccountUuid);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || 'API request failed');
      }

      const result: GetFlowResponse = await response.json();

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(this.ACCOUNT_UUID_KEY, result.account_uuid);
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown API error');
    }
  }

  static async getAccountToken(
    accountUuid: string
  ): Promise<GetAccountTokenResponse> {
    this.tokenCache.clearIfExpired();

    const cachedToken = this.tokenCache.getToken(accountUuid);
    if (cachedToken) {
      const expiresAt = this.tokenCache.getExpiresAt();
      return {
        token: cachedToken,
        expires_at: expiresAt!,
      };
    }

    try {
      const url = new URL(`${this.getBaseUrl()}/api/account-token`);
      url.searchParams.append('account_uuid', accountUuid);

      const response = await fetch(url.toString());

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || 'API request failed');
      }

      const result: GetAccountTokenResponse = await response.json();

      this.tokenCache.setToken(accountUuid, result.token, result.expires_at);

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown API error');
    }
  }

  private static async makeAuthenticatedRequest<T>(
    accountUuid: string,
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const accountToken = await this.getAccountToken(accountUuid);

      const response = await fetch(`${this.getLightApiBaseUrl()}${endpoint}`, {
        method: 'GET',
        mode: 'cors',
        ...options,
        headers: {
          Authorization: `Bearer ${accountToken.token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        // If we get a 401 or 404, clear the stored account UUID as it may be invalid
        if (response.status === 401 || response.status === 404) {
          this.clearStoredAccountUuid();
        }

        const error: ApiError = await response.json();
        throw new Error(error.error || 'API request failed');
      }

      const result: T = await response.json();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown API error');
    }
  }

  static async getAccount(accountUuid: string): Promise<GetAccountResponse> {
    return this.makeAuthenticatedRequest<GetAccountResponse>(
      accountUuid,
      '/account'
    );
  }

  static async deleteEnrollment(accountUuid: string): Promise<void> {
    await this.makeAuthenticatedRequest<void>(
      accountUuid,
      '/account/sandbox/delete-enrollment',
      { method: 'POST' }
    );
  }

  static async seedDemoData(accountUuid: string): Promise<void> {
    await this.makeAuthenticatedRequest<void>(
      accountUuid,
      '/account/sandbox/seed-demo-data',
      { method: 'POST' }
    );
  }

  static async getMonthlyUsage(
    accountUuid: string,
    locationUuid: string
  ): Promise<MonthlyUsageResponse> {
    return this.makeAuthenticatedRequest<MonthlyUsageResponse>(
      accountUuid,
      `/account/locations/${locationUuid}/usage/monthly`
    );
  }

  static async getDailyUsage(
    accountUuid: string,
    locationUuid: string,
    month: number,
    year: number
  ): Promise<DailyUsageResponse> {
    return this.makeAuthenticatedRequest<DailyUsageResponse>(
      accountUuid,
      `/account/locations/${locationUuid}/usage/daily?month=${month}&year=${year}`
    );
  }

  static async getInvoices(accountUuid: string): Promise<InvoicesResponse> {
    return this.makeAuthenticatedRequest<InvoicesResponse>(
      accountUuid,
      '/account/billing/invoices'
    );
  }

  static async getLocationDocuments(
    accountUuid: string,
    locationUuid: string
  ): Promise<LocationDocuments> {
    return this.makeAuthenticatedRequest<LocationDocuments>(
      accountUuid,
      `/account/locations/${locationUuid}/documents`
    );
  }

  static async getLocationPlan(
    accountUuid: string,
    locationUuid: string
  ): Promise<LocationPlan> {
    return this.makeAuthenticatedRequest<LocationPlan>(
      accountUuid,
      `/account/locations/${locationUuid}/plan`
    );
  }

  static async getPaymentMethod(
    accountUuid: string
  ): Promise<PaymentMethodResponse> {
    return this.makeAuthenticatedRequest<PaymentMethodResponse>(
      accountUuid,
      '/account/billing/payment-method'
    );
  }
}
