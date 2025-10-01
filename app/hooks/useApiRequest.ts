'use client';

import { useState, useCallback } from 'react';

interface UseApiRequestOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  errorMessage?: string;
}

interface UseApiRequestReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  execute: () => Promise<void>;
  reset: () => void;
}

export function useApiRequest<T>(
  apiCall: () => Promise<T>,
  options: UseApiRequestOptions<T> = {}
): UseApiRequestReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { onSuccess, onError, errorMessage = 'An error occurred' } = options;

  const execute = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
      onSuccess?.(result);
    } catch {
      const errorMsg = errorMessage;
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, onSuccess, onError, errorMessage]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { data, isLoading, error, execute, reset };
}
