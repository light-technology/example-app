import { useState } from 'react';
import { ApiService } from '../services/api';

export function usePaymentMethodFlow() {
  const [showIframe, setShowIframe] = useState(false);
  const [flowUrl, setFlowUrl] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const handleUpdateClick = async (onAccountUpdate: (uuid: string) => void) => {
    try {
      setUpdateLoading(true);
      const response = await ApiService.getFlow('update-payment-method');
      setFlowUrl(response.flow_login_link);
      onAccountUpdate(response.account_uuid);
      setShowIframe(true);
    } catch (err) {
      console.error('Failed to fetch payment method flow data:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const closeIframe = async (onRefreshAccount: () => Promise<void>) => {
    setShowIframe(false);
    setFlowUrl(null);
    await onRefreshAccount();
  };

  return {
    showIframe,
    flowUrl,
    updateLoading,
    handleUpdateClick,
    closeIframe,
  };
}
