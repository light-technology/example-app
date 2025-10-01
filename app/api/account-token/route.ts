import { NextRequest, NextResponse } from 'next/server';
import { getLightApiUrl } from '../../config/light-api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const account_uuid = searchParams.get('account_uuid');

  if (!account_uuid || typeof account_uuid !== 'string') {
    return NextResponse.json(
      { error: 'Missing or invalid account_uuid parameter' },
      { status: 400 }
    );
  }

  const apiToken = process.env.API_SECRET;

  if (!apiToken) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const response = await fetch(
      `${getLightApiUrl()}/v1/app/accounts/${account_uuid}/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Get account token failed: ${response.status} ${errorText}`
      );
    }

    const tokenData = await response.json();

    return NextResponse.json(
      {
        token: tokenData.token,
        expires_at: tokenData.expires_at,
      },
      { headers }
    );
  } catch (error) {
    console.error('Error fetching account token:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500, headers }
    );
  }
}
