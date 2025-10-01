import { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { GetAccountResponse } from '../types/account';

export function useAccount() {
  const [accountUuid, setAccountUuid] = useState<string | null>(null);
  const [accountData, setAccountData] = useState<GetAccountResponse | null>(
    null
  );
  const [isCheckingAccount, setIsCheckingAccount] = useState(true);

  useEffect(() => {
    const checkExistingAccount = async () => {
      const storedAccountUuid = ApiService.getStoredAccountUuid();
      if (storedAccountUuid) {
        setAccountUuid(storedAccountUuid);
        try {
          const fetchedAccountData =
            await ApiService.getAccount(storedAccountUuid);
          setAccountData(fetchedAccountData);
        } catch (error) {
          console.error('Failed to fetch account data for stored UUID:', error);
        }
      }
      setIsCheckingAccount(false);
    };

    checkExistingAccount();
  }, []);

  const refreshAccountData = async () => {
    if (accountUuid) {
      try {
        const fetchedAccountData = await ApiService.getAccount(accountUuid);
        setAccountData(fetchedAccountData);
      } catch (error) {
        console.error('Failed to fetch account info:', error);
      }
    }
  };

  const updateAccountUuid = (uuid: string) => {
    setAccountUuid(uuid);
  };

  return {
    accountUuid,
    accountData,
    isCheckingAccount,
    refreshAccountData,
    updateAccountUuid,
  };
}
