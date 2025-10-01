'use client';

import React, { useEffect, useCallback } from 'react';
import { ApiService } from '../../services/api';
import { InvoicesResponse, Invoice } from '../../types/energy';
import { Card, ErrorDisplay, LoadingContainer, EmptyState } from '../ui';
import { useApiRequest } from '../../hooks';
import {
  formatCurrency,
  formatDateShort,
  formatKwh,
  formatRate,
} from '../../utils/formatters';

interface BillsSectionProps {
  accountUuid: string;
}

const BillsSection: React.FC<BillsSectionProps> = ({ accountUuid }) => {
  const apiCall = useCallback(
    () => ApiService.getInvoices(accountUuid),
    [accountUuid]
  );

  const {
    data: invoicesData,
    isLoading,
    error,
    execute,
  } = useApiRequest<InvoicesResponse>(apiCall, {
    errorMessage: 'Failed to load invoices',
  });

  useEffect(() => {
    execute();
  }, [execute]);

  const getPaymentStatus = (invoice: Invoice) => {
    return invoice.paid_at ? 'paid' : 'unpaid';
  };

  const isOverdue = (invoice: Invoice) => {
    if (invoice.paid_at) return false;
    const dueDate = new Date(invoice.payment_due_date);
    const today = new Date();
    return dueDate < today;
  };

  const handleDownloadPdf = (invoice: Invoice) => {
    if (invoice.pdf) {
      window.open(invoice.pdf, '_blank');
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Energy Bills</h2>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <span>⚡</span>
          <span>Energy billing history</span>
        </div>
      </div>

      {error && <ErrorDisplay message={error} className="mb-6" />}

      {isLoading ? (
        <LoadingContainer size="lg" />
      ) : invoicesData?.data && invoicesData.data.length > 0 ? (
        <div className="space-y-3">
          {invoicesData.data.slice(0, 5).map((invoice) => (
            <div
              key={invoice.number}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        Invoice #{invoice.number}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {formatDateShort(invoice.invoice_date)}
                        {getPaymentStatus(invoice) === 'unpaid' && (
                          <span
                            className={`ml-2 ${
                              isOverdue(invoice)
                                ? 'text-red-600'
                                : 'text-amber-600'
                            }`}
                          >
                            • {isOverdue(invoice) ? 'Overdue' : 'Due'}{' '}
                            {formatDateShort(invoice.payment_due_date)}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          getPaymentStatus(invoice) === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : isOverdue(invoice)
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {getPaymentStatus(invoice) === 'paid'
                          ? '✓ Paid'
                          : isOverdue(invoice)
                            ? '⚠ Overdue'
                            : 'Unpaid'}
                      </span>
                      {invoice.pdf && (
                        <button
                          onClick={() => handleDownloadPdf(invoice)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          PDF
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-8 text-sm">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(invoice.total_cents)}
                    </div>
                    <div className="text-gray-500">
                      {formatKwh(invoice.total_kwh)} kWh •{' '}
                      {formatRate(invoice.avg_cents_per_kwh)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {invoicesData.data.length > 5 && (
            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">
                Showing latest 5 invoices of {invoicesData.data.length} total
              </p>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          icon="📄"
          title="No bills available"
          description="Your bills will appear here once service begins"
        />
      )}
    </Card>
  );
};

export default BillsSection;
