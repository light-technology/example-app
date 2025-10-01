import { getLightApiBaseUrl, getDefaultEmail } from '../config/light-api';

const LIGHT_API_BASE = getLightApiBaseUrl();

export interface GetFlowResponse {
  flow_login_link: string;
  account_uuid: string;
}

export interface CreateAccountRequest {
  first_name: string;
  last_name: string;
  email: string;
}

export interface AccountCreateResponse {
  uuid: string;
}

export interface CreateFlowLoginRequest {
  scope: string;
}

export interface FlowLoginResponse {
  login_link: string;
}

export async function createAccount(apiToken: string): Promise<string> {
  const response = await fetch(`${LIGHT_API_BASE}/app/accounts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({
      first_name: 'John',
      last_name: 'Doe',
      email: getDefaultEmail(),
    } as CreateAccountRequest),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Create account failed: ${response.status} ${errorText}`);
  }

  const result: AccountCreateResponse = await response.json();
  return result.uuid;
}

export async function createFlowLogin(
  apiToken: string,
  accountUuid: string,
  scope: string
): Promise<string> {
  const response = await fetch(
    `${LIGHT_API_BASE}/app/accounts/${accountUuid}/flow-login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        scope,
      } as CreateFlowLoginRequest),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Create flow login failed: ${response.status} ${errorText}`
    );
  }

  const result: FlowLoginResponse = await response.json();
  return result.login_link;
}
