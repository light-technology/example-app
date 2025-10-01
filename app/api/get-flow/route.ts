import { NextRequest, NextResponse } from 'next/server';
import { createAccount, createFlowLogin, GetFlowResponse } from '../helpers';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get('scope');
  const account_uuid = searchParams.get('account_uuid');

  if (!scope || typeof scope !== 'string') {
    return NextResponse.json(
      { error: 'Missing or invalid scope parameter' },
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
    let finalAccountUuid: string;

    if (account_uuid && typeof account_uuid === 'string') {
      finalAccountUuid = account_uuid;
    } else {
      finalAccountUuid = await createAccount(apiToken);
    }

    const flowLoginLink = await createFlowLogin(
      apiToken,
      finalAccountUuid,
      scope
    );

    return NextResponse.json(
      {
        flow_login_link: flowLoginLink,
        account_uuid: finalAccountUuid,
      } as GetFlowResponse,
      { headers }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500, headers }
    );
  }
}
