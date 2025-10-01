'use client';

import React, { useEffect, useCallback } from 'react';
import { ApiService } from '../../services/api';
import { PaymentMethodResponse } from '../../types/energy';
import {
  Card,
  ErrorDisplay,
  LoadingContainer,
  EmptyState,
  LoadingSpinner,
} from '../ui';
import { useApiRequest } from '../../hooks';
import { formatCardBrand, formatCardExpiry } from '../../utils/formatters';

interface PaymentMethodSectionProps {
  accountUuid: string;
  onUpdateClick: () => void;
  updateLoading: boolean;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  accountUuid,
  onUpdateClick,
  updateLoading,
}) => {
  const apiCall = useCallback(
    () => ApiService.getPaymentMethod(accountUuid),
    [accountUuid]
  );

  const {
    data: paymentMethod,
    isLoading,
    error,
    execute,
  } = useApiRequest<PaymentMethodResponse>(apiCall, {
    errorMessage: 'Failed to load payment method',
  });

  useEffect(() => {
    execute();
  }, [execute]);

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      default:
        return '💳';
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Payment Method</h2>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <span>💳</span>
          <span>Manage billing</span>
        </div>
      </div>

      {error && <ErrorDisplay message={error} className="mb-6" />}

      {isLoading ? (
        <LoadingContainer size="lg" />
      ) : paymentMethod ? (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {getCardIcon(paymentMethod.card_brand)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      {formatCardBrand(paymentMethod.card_brand)}
                    </span>
                    <span className="text-gray-600">
                      •••• {paymentMethod.card_last4}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Expires{' '}
                    {formatCardExpiry(
                      paymentMethod.card_exp_month,
                      paymentMethod.card_exp_year
                    )}
                  </div>
                  {paymentMethod.card_postal_code && (
                    <div className="text-sm text-gray-500">
                      ZIP: {paymentMethod.card_postal_code}
                    </div>
                  )}
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✓ Active
              </span>
            </div>
          </div>

          <button
            onClick={onUpdateClick}
            disabled={updateLoading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
          >
            {updateLoading ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" color="white" />
                <span>Loading...</span>
              </div>
            ) : (
              'Update Payment Method'
            )}
          </button>
        </div>
      ) : (
        <EmptyState
          icon="💳"
          title="No payment method on file"
          description="Add a payment method to manage your billing"
          action={
            <button
              onClick={onUpdateClick}
              disabled={updateLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
            >
              {updateLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" color="white" />
                  <span>Loading...</span>
                </div>
              ) : (
                'Add Payment Method'
              )}
            </button>
          }
        />
      )}
    </Card>
  );
};

export default PaymentMethodSection;
