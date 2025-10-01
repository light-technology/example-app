'use client';

import DashboardContent from './components/DashboardContent';
import FlowIframe from './components/FlowIframe';
import DashboardLayout from './components/layout/DashboardLayout';
import { useAccount } from './hooks/useAccount';
import { useEnrollmentFlow } from './hooks/useEnrollmentFlow';

export default function HomePage() {
  const {
    accountData,
    isCheckingAccount,
    refreshAccountData,
    updateAccountUuid,
  } = useAccount();
  const { showIframe, flowUrl, enrollLoading, handleEnrollClick, closeIframe } =
    useEnrollmentFlow();

  const onEnrollClick = () => {
    handleEnrollClick(updateAccountUuid);
  };

  const onCloseIframe = () => {
    closeIframe(refreshAccountData);
  };

  return (
    <>
      <DashboardLayout
        accountData={accountData}
        onRefreshAccount={refreshAccountData}
      >
        <DashboardContent
          onEnrollClick={onEnrollClick}
          enrollLoading={enrollLoading}
          accountData={accountData}
          isCheckingAccount={isCheckingAccount}
        />
      </DashboardLayout>

      {showIframe && flowUrl && (
        <FlowIframe url={flowUrl} onClose={onCloseIframe} />
      )}
    </>
  );
}
