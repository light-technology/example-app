'use client';

import DashboardLayout from '../components/layout/DashboardLayout';
import EnergyEnrollmentCard from '../components/energy/EnergyEnrollmentCard';
import EnrolledStatusCard from '../components/energy/EnrolledStatusCard';
import EnergyLoadingCard from '../components/energy/EnergyLoadingCard';
import UsageChart from '../components/energy/UsageChart';
import BillsSection from '../components/energy/BillsSection';
import DocumentsSection from '../components/energy/DocumentsSection';
import PaymentMethodSection from '../components/energy/PaymentMethodSection';
import { useAccount } from '../hooks/useAccount';
import { useEnrollmentFlow } from '../hooks/useEnrollmentFlow';
import { usePaymentMethodFlow } from '../hooks/usePaymentMethodFlow';
import FlowIframe from '../components/FlowIframe';

export default function EnergyPage() {
  const {
    accountData,
    isCheckingAccount,
    refreshAccountData,
    updateAccountUuid,
  } = useAccount();
  const { showIframe, flowUrl, enrollLoading, handleEnrollClick, closeIframe } =
    useEnrollmentFlow();
  const {
    showIframe: showPaymentIframe,
    flowUrl: paymentFlowUrl,
    updateLoading,
    handleUpdateClick,
    closeIframe: closePaymentIframe,
  } = usePaymentMethodFlow();

  const onEnrollClick = () => {
    handleEnrollClick(updateAccountUuid);
  };

  const onCloseIframe = () => {
    closeIframe(refreshAccountData);
  };

  const onUpdatePaymentClick = () => {
    handleUpdateClick(updateAccountUuid);
  };

  const onClosePaymentIframe = () => {
    closePaymentIframe(refreshAccountData);
  };

  const renderEnergyContent = () => {
    if (isCheckingAccount) {
      return <EnergyLoadingCard />;
    }

    if (accountData?.enrollment?.is_enrollment_finalized) {
      // If service is active, show energy dashboard
      if (
        accountData.enrollment.is_service_active &&
        accountData.locations[0]
      ) {
        const location = accountData.locations[0];
        return (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-sm border border-blue-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-lg">
                    {location.address_1}, {location.city}, {location.state}
                  </p>
                  {location.plan_name && (
                    <p className="text-sm text-blue-700 font-medium mt-1">
                      {location.plan_name} Plan
                    </p>
                  )}
                </div>
                <div className="text-4xl">⚡</div>
              </div>
            </div>

            {/* Usage Chart */}
            <UsageChart
              accountUuid={accountData.uuid}
              locationUuid={location.uuid}
            />

            {/* Bills and Right Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BillsSection accountUuid={accountData.uuid} />
              <div className="space-y-4">
                <DocumentsSection
                  accountUuid={accountData.uuid}
                  locationUuid={location.uuid}
                />
                <PaymentMethodSection
                  accountUuid={accountData.uuid}
                  onUpdateClick={onUpdatePaymentClick}
                  updateLoading={updateLoading}
                />
              </div>
            </div>
          </div>
        );
      }

      // Service not active yet, show enrolled status
      return (
        <div className="max-w-2xl">
          <EnrolledStatusCard accountData={accountData} />
        </div>
      );
    }

    // Not enrolled, show enrollment card
    return (
      <div className="max-w-2xl">
        <EnergyEnrollmentCard
          onEnrollClick={onEnrollClick}
          enrollLoading={enrollLoading}
        />
      </div>
    );
  };

  return (
    <>
      <DashboardLayout
        accountData={accountData}
        onRefreshAccount={refreshAccountData}
      >
        <div className="space-y-6">
          <div className="opacity-90">
            <h1 className="text-2xl font-medium text-gray-600">Energy</h1>
            <p className="text-gray-500">
              Manage your energy plan and view usage insights
            </p>
          </div>

          {renderEnergyContent()}
        </div>
      </DashboardLayout>

      {showIframe && flowUrl && (
        <FlowIframe url={flowUrl} onClose={onCloseIframe} />
      )}

      {showPaymentIframe && paymentFlowUrl && (
        <FlowIframe url={paymentFlowUrl} onClose={onClosePaymentIframe} />
      )}
    </>
  );
}
