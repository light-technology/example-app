export function getLightApiUrl(): string {
  return process.env.LIGHT_API_URL || 'https://api.light.dev';
}

export function getLightApiBaseUrl(): string {
  return `${getLightApiUrl()}/v1`;
}

export function getPublicLightApiUrl(): string {
  return process.env.NEXT_PUBLIC_LIGHT_API_URL || 'https://api.light.dev';
}

export function getPublicLightApiBaseUrl(): string {
  return `${getPublicLightApiUrl()}/v1`;
}

export function getDefaultEmail(): string {
  return process.env.DEFAULT_ACCOUNT_EMAIL || 'example-app@light.dev';
}
