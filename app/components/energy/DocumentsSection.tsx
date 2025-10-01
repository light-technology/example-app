'use client';

import React, { useEffect, useCallback } from 'react';
import { ApiService } from '../../services/api';
import { LocationDocuments } from '../../types/energy';
import { Card, ErrorDisplay, LoadingContainer, EmptyState } from '../ui';
import { useApiRequest } from '../../hooks';
import { formatDateLong } from '../../utils/formatters';

interface DocumentsSectionProps {
  accountUuid: string;
  locationUuid: string;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  accountUuid,
  locationUuid,
}) => {
  const apiCall = useCallback(
    () => ApiService.getLocationDocuments(accountUuid, locationUuid),
    [accountUuid, locationUuid]
  );

  const {
    data: documents,
    isLoading,
    error,
    execute,
  } = useApiRequest<LocationDocuments>(apiCall, {
    errorMessage: 'Failed to load documents',
  });

  useEffect(() => {
    execute();
  }, [execute]);

  const handleDocumentClick = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const documentItems = [
    {
      name: 'Electricity Facts Label (EFL)',
      url: documents?.efl,
    },
    {
      name: 'Terms of Service',
      url: documents?.tos,
    },
    {
      name: 'Your Rights as a Customer (YRAC)',
      url: documents?.yrac,
    },
  ];

  return (
    <Card padding="sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          Important Documents
        </h2>
        <div className="text-sm text-gray-500">Contract & legal info</div>
      </div>

      {error && <ErrorDisplay message={error} className="mb-4" />}

      {isLoading ? (
        <LoadingContainer size="md" className="py-8" />
      ) : documents ? (
        <div className="space-y-3">
          {documents.contract_start && documents.contract_end && (
            <div className="pb-3 mb-3 border-b border-gray-200">
              <h3 className="font-medium text-gray-900 text-sm mb-1">
                Contract Period
              </h3>
              <p className="text-gray-600 text-sm">
                {formatDateLong(documents.contract_start)} -{' '}
                {formatDateLong(documents.contract_end)}
              </p>
            </div>
          )}

          <div className="space-y-2">
            {documentItems.map((doc) => (
              <div key={doc.name} className="py-1">
                {doc.url ? (
                  <button
                    onClick={() => handleDocumentClick(doc.url!)}
                    className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium text-left transition-colors duration-200"
                  >
                    {doc.name}
                  </button>
                ) : (
                  <span className="text-gray-400 text-sm font-medium">
                    {doc.name}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4">
            <p className="text-xs text-gray-500">
              Keep these documents readily available for your records
            </p>
          </div>
        </div>
      ) : (
        <EmptyState
          icon="📋"
          title="No documents available"
          description="Documents will be available once service is active"
          className="py-8"
        />
      )}
    </Card>
  );
};

export default DocumentsSection;
