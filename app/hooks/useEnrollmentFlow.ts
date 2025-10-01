import { useState } from 'react';
import { ApiService } from '../services/api';

export function useEnrollmentFlow() {
  const [showIframe, setShowIframe] = useState(false);
  const [flowUrl, setFlowUrl] = useState<string | null>(null);
  const [enrollLoading, setEnrollLoading] = useState(false);

  const handleEnrollClick = async (onAccountUpdate: (uuid: string) => void) => {
    try {
      setEnrollLoading(true);
      const response = await ApiService.getFlow('enrollment');
      setFlowUrl(response.flow_login_link);
      onAccountUpdate(response.account_uuid);
      setShowIframe(true);
    } catch (err) {
      console.error('Failed to fetch flow data:', err);
    } finally {
      setEnrollLoading(false);
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
    enrollLoading,
    handleEnrollClick,
    closeIframe,
  };
}
