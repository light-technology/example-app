'use client';

import { useState } from 'react';
import {
  ChevronUpIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { ApiService } from '../services/api';
import { GetAccountResponse } from '../types/account';

interface DemoAction {
  name: string;
  description: string;
  action: () => Promise<void>;
  variant: 'destructive' | 'primary';
  disabled?: boolean;
  disabledReason?: string;
}

interface DemoControlsProps {
  accountData: GetAccountResponse | null;
  onRefreshAccount: () => Promise<void>;
}

export default function DemoControls({
  accountData,
  onRefreshAccount,
}: DemoControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingActions, setLoadingActions] = useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState<
    Array<{ id: string; message: string; type: 'success' | 'error' }>
  >([]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const setActionLoading = (actionName: string, loading: boolean) => {
    setLoadingActions((prev) => {
      const newSet = new Set(prev);
      if (loading) {
        newSet.add(actionName);
      } else {
        newSet.delete(actionName);
      }
      return newSet;
    });
  };

  const isEnrollmentFinalized =
    accountData?.enrollment?.is_enrollment_finalized || false;
  const isServiceActive = accountData?.enrollment?.is_service_active || false;

  const demoActions: DemoAction[] = [
    {
      name: 'Reset Account',
      description: 'Delete enrollment and refresh account data',
      variant: 'destructive',
      action: async () => {
        setActionLoading('Reset Account', true);
        try {
          const accountUuid = ApiService.getStoredAccountUuid();
          if (accountUuid) {
            await ApiService.deleteEnrollment(accountUuid);
            await onRefreshAccount();
          }

          showNotification('Account reset successfully', 'success');
        } catch (error) {
          showNotification(
            `Reset failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            'error'
          );
        } finally {
          setActionLoading('Reset Account', false);
        }
      },
    },
    {
      name: 'Simulate Service Start',
      description: 'Seed account with demo data',
      variant: 'primary',
      disabled: !isEnrollmentFinalized || isServiceActive,
      disabledReason: !isEnrollmentFinalized
        ? 'Enrollment must be finalized first'
        : isServiceActive
          ? 'Service is already active'
          : undefined,
      action: async () => {
        setActionLoading('Simulate Service Start', true);
        try {
          const accountUuid = ApiService.getStoredAccountUuid();
          if (!accountUuid) {
            throw new Error('No account UUID found in session storage');
          }

          await ApiService.seedDemoData(accountUuid);
          await onRefreshAccount();
          showNotification('Demo data seeded successfully', 'success');
        } catch (error) {
          showNotification(
            `Seed demo data failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            'error'
          );
        } finally {
          setActionLoading('Simulate Service Start', false);
        }
      },
    },
  ];

  return (
    <>
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-[60] space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-4 py-2 rounded-lg shadow-lg text-white text-sm font-medium ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>

      {/* Debug Menu */}
      <div className="fixed bottom-4 right-4 z-50">
        {isOpen && (
          <div className="mb-2 bg-violet-900/95 backdrop-blur-sm border border-violet-700 rounded-lg shadow-xl p-4 w-80">
            <div className="mb-3">
              <h3 className="text-white font-semibold text-sm">
                Demo Controls
              </h3>
              <p className="text-violet-300 text-xs mt-1">
                Demo tools for testing different account states
              </p>
            </div>

            <div className="space-y-3">
              {demoActions.map((action) => (
                <div
                  key={action.name}
                  className="border-t border-violet-700 pt-3 first:border-t-0 first:pt-0"
                >
                  <div className="mb-2">
                    <div className="text-white text-sm font-medium">
                      {action.name}
                    </div>
                    <div className="text-violet-300 text-xs">
                      {action.description}
                    </div>
                    {action.disabled && action.disabledReason && (
                      <div className="text-amber-300 text-xs mt-1 italic">
                        ⚠️ {action.disabledReason}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={action.action}
                    disabled={
                      loadingActions.has(action.name) || action.disabled
                    }
                    className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      action.variant === 'destructive'
                        ? 'bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-500'
                        : 'bg-violet-600 hover:bg-violet-700 text-white disabled:bg-gray-500'
                    }`}
                  >
                    {loadingActions.has(action.name)
                      ? 'Loading...'
                      : action.disabled
                        ? `${action.name} (Disabled)`
                        : action.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-violet-600 hover:bg-violet-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 flex items-center space-x-2 text-sm font-medium"
        >
          <WrenchScrewdriverIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Demo</span>
          <ChevronUpIcon
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
    </>
  );
}
