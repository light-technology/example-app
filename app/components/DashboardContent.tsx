import React from 'react';
import { GetAccountResponse } from '../types/account';
import ServiceCards from './dashboard/ServiceCards';
import UpcomingServices from './dashboard/UpcomingServices';
import EnergyEnrollmentCard from './energy/EnergyEnrollmentCard';
import EnrolledStatusCard from './energy/EnrolledStatusCard';
import EnergyLoadingCard from './energy/EnergyLoadingCard';

interface DashboardContentProps {
  onEnrollClick: () => void;
  enrollLoading: boolean;
  accountData: GetAccountResponse | null;
  isCheckingAccount: boolean;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  onEnrollClick,
  enrollLoading,
  accountData,
  isCheckingAccount,
}) => {
  return (
    <div className="space-y-6">
      <div className="opacity-90">
        <h1 className="text-2xl font-medium text-gray-600">Dashboard</h1>
        <p className="text-gray-500">Welcome back, John!</p>
      </div>

      <ServiceCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingServices />

        {isCheckingAccount ? (
          <EnergyLoadingCard />
        ) : accountData?.enrollment?.is_enrollment_finalized ? (
          accountData.enrollment.is_service_active ? (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-sm border border-blue-200 p-6">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">⚡</div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Energy Service Active
                </h3>
              </div>

              {accountData.locations[0] && (
                <div className="space-y-3 mb-4">
                  {accountData.locations[0].plan_name && (
                    <div className="flex items-center p-3 bg-white/50 rounded-lg">
                      <div className="text-lg mr-3">📋</div>
                      <div>
                        <div className="text-sm text-gray-600">
                          Current plan
                        </div>
                        <div className="font-semibold text-gray-900">
                          {accountData.locations[0].plan_name}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center p-3 bg-white/50 rounded-lg">
                    <div className="text-lg mr-3">🏠</div>
                    <div>
                      <div className="text-sm text-gray-600">
                        Service address
                      </div>
                      <div className="font-semibold text-gray-900">
                        {accountData.locations[0].address_1}
                      </div>
                      <div className="text-sm text-gray-700">
                        {accountData.locations[0].city},{' '}
                        {accountData.locations[0].state}{' '}
                        {accountData.locations[0].postal_code}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <a
                  href="/energy"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  View & Manage →
                </a>
              </div>
            </div>
          ) : (
            <EnrolledStatusCard accountData={accountData} />
          )
        ) : (
          <EnergyEnrollmentCard
            onEnrollClick={onEnrollClick}
            enrollLoading={enrollLoading}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
