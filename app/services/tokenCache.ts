interface CachedToken {
  token: string;
  expiresAt: string;
  accountUuid: string;
}

// Buffer time before token expiry to ensure we refresh tokens proactively
const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000; // 5 minutes

export class TokenCache {
  private static instance: TokenCache;
  private cachedToken: CachedToken | null = null;

  private constructor() {}

  static getInstance(): TokenCache {
    if (!TokenCache.instance) {
      TokenCache.instance = new TokenCache();
    }
    return TokenCache.instance;
  }

  isTokenValid(accountUuid: string): boolean {
    if (!this.cachedToken || this.cachedToken.accountUuid !== accountUuid) {
      return false;
    }

    const now = new Date();
    const expiryTime = new Date(this.cachedToken.expiresAt);

    return expiryTime.getTime() - now.getTime() > TOKEN_EXPIRY_BUFFER_MS;
  }

  getToken(accountUuid: string): string | null {
    if (this.isTokenValid(accountUuid)) {
      return this.cachedToken!.token;
    }
    return null;
  }

  setToken(accountUuid: string, token: string, expiresAt: string): void {
    this.cachedToken = {
      accountUuid,
      token,
      expiresAt,
    };
  }

  clearToken(): void {
    this.cachedToken = null;
  }

  getExpiresAt(): string | null {
    return this.cachedToken?.expiresAt || null;
  }

  clearIfExpired(): void {
    if (this.cachedToken) {
      const now = new Date();
      const expiryTime = new Date(this.cachedToken.expiresAt);

      if (expiryTime.getTime() <= now.getTime()) {
        this.clearToken();
      }
    }
  }
}
