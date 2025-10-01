import React from 'react';
import { GetAccountResponse } from '../../types/account';
import { parseLocalDate } from '../../utils/dateUtils';

interface EnrolledStatusCardProps {
  accountData: GetAccountResponse;
}

const EnrolledStatusCard: React.FC<EnrolledStatusCardProps> = ({
  accountData,
}) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 rounded-lg shadow-lg border-2 border-purple-300 p-8 transform hover:scale-[1.01] transition-all duration-200">
      <div className="flex items-center mb-5">
        <div className="text-3xl mr-4">🎉</div>
        <h2 className="text-xl font-bold text-gray-900">You're All Set!</h2>
      </div>
      <div className="mb-6">
        <div className="space-y-4">
          {accountData.locations[0] && (
            <>
              {accountData.locations[0].plan_name && (
                <div className="text-center mb-4">
                  <div className="text-lg font-bold text-gray-900">
                    You've enrolled in the [EXAMPLE]{' '}
                    {accountData.locations[0].plan_name} Plan!
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                {accountData.locations[0].service_start_date && (
                  <div className="flex items-center p-3 bg-white/50 rounded-lg">
                    <div className="text-xl mr-3">📅</div>
                    <div>
                      <div className="text-sm text-gray-600">
                        Service starts
                      </div>
                      <div className="font-semibold text-gray-900">
                        {parseLocalDate(
                          accountData.locations[0].service_start_date
                        ).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center p-3 bg-white/50 rounded-lg">
                  <div className="text-xl mr-3">🏠</div>
                  <div>
                    <div className="text-sm text-gray-600">Service address</div>
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
            </>
          )}
        </div>
      </div>

      {/* Demo Controls Hint */}
      <div className="mt-6 p-4 bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-dashed border-violet-300 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="text-lg mr-2">💡</div>
              <h3 className="text-sm font-semibold text-violet-700">
                Try the Demo!
              </h3>
            </div>
            <p className="text-xs text-violet-600 mb-2">
              Want to see what happens after service starts? Use the demo
              controls to simulate service activation and explore the full
              dashboard.
            </p>
          </div>
          <div className="ml-4 flex flex-col items-center">
            <div className="animate-pulse">
              <div className="w-8 h-8 bg-violet-200 rounded-full flex items-center justify-center mb-1">
                <svg
                  className="w-4 h-4 text-violet-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>
            <span className="text-xs text-violet-500 font-medium">
              Demo Controls
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledStatusCard;
