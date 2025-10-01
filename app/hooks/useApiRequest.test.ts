import { renderHook, act } from '@testing-library/react';
import { useApiRequest } from './useApiRequest';

describe('useApiRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress React act warnings for this specific hook test
    jest.spyOn(console, 'error').mockImplementation((message) => {
      if (
        typeof message === 'string' &&
        message.includes(
          'An update to TestComponent inside a test was not wrapped in act'
        )
      ) {
        return; // Suppress act warnings
      }
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize with default state', () => {
    const mockApiCall = jest.fn();
    const { result } = renderHook(() => useApiRequest(mockApiCall));

    expect(result.current.data).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.execute).toBe('function');
    expect(typeof result.current.reset).toBe('function');
  });

  it('should handle successful API call', async () => {
    const mockData = { id: 1, name: 'Test' };
    const mockApiCall = jest.fn().mockResolvedValue(mockData);
    const onSuccess = jest.fn();

    const { result } = renderHook(() =>
      useApiRequest(mockApiCall, { onSuccess })
    );

    await act(async () => {
      await result.current.execute();
    });

    expect(mockApiCall).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(onSuccess).toHaveBeenCalledWith(mockData);
  });

  it('should handle API call error', async () => {
    const mockApiCall = jest.fn().mockRejectedValue(new Error('API Error'));
    const onError = jest.fn();
    const errorMessage = 'Something went wrong';

    const { result } = renderHook(() =>
      useApiRequest(mockApiCall, { onError, errorMessage })
    );

    await act(async () => {
      await result.current.execute();
    });

    expect(mockApiCall).toHaveBeenCalledTimes(1);
    expect(result.current.data).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(onError).toHaveBeenCalledWith(errorMessage);
  });

  it('should use default error message when none provided', async () => {
    const mockApiCall = jest.fn().mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useApiRequest(mockApiCall));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.error).toBe('An error occurred');
  });

  it('should set loading state during API call', async () => {
    let resolveApiCall: (value: unknown) => void;
    const mockApiCall = jest.fn().mockReturnValue(
      new Promise((resolve) => {
        resolveApiCall = resolve;
      })
    );

    const { result } = renderHook(() => useApiRequest(mockApiCall));

    let executePromise: Promise<void>;

    // Start the API call
    act(() => {
      executePromise = result.current.execute();
    });

    // Should be loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);

    // Resolve the API call and wait for completion
    await act(async () => {
      resolveApiCall({ success: true });
      await executePromise;
    });

    // Should no longer be loading
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual({ success: true });
  });

  it('should reset state', () => {
    const mockApiCall = jest.fn();
    const { result } = renderHook(() => useApiRequest(mockApiCall));

    // Set some state
    act(() => {
      result.current.execute();
    });

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.isLoading).toBe(false);
  });

  it('should clear error on new execution', async () => {
    const mockApiCall = jest
      .fn()
      .mockRejectedValueOnce(new Error('First error'))
      .mockResolvedValueOnce({ success: true });

    const { result } = renderHook(() => useApiRequest(mockApiCall));

    // First call fails
    await act(async () => {
      await result.current.execute();
    });
    expect(result.current.error).toBe('An error occurred');

    // Second call succeeds
    await act(async () => {
      await result.current.execute();
    });
    expect(result.current.error).toBe(null);
    expect(result.current.data).toEqual({ success: true });
  });

  it('should handle multiple executions correctly', async () => {
    const mockApiCall = jest
      .fn()
      .mockResolvedValueOnce({ id: 1 })
      .mockResolvedValueOnce({ id: 2 });

    const { result } = renderHook(() => useApiRequest(mockApiCall));

    // First execution
    await act(async () => {
      await result.current.execute();
    });
    expect(result.current.data).toEqual({ id: 1 });

    // Second execution
    await act(async () => {
      await result.current.execute();
    });
    expect(result.current.data).toEqual({ id: 2 });

    expect(mockApiCall).toHaveBeenCalledTimes(2);
  });

  it('should not call callbacks if apiCall is undefined in options', async () => {
    const mockApiCall = jest.fn().mockResolvedValue({ success: true });
    const { result } = renderHook(() => useApiRequest(mockApiCall));

    await act(async () => {
      await result.current.execute();
    });

    // Should not throw when callbacks are undefined
    expect(result.current.data).toEqual({ success: true });
    expect(result.current.error).toBe(null);
  });

  it('should handle apiCall function changes', async () => {
    const mockApiCall1 = jest.fn().mockResolvedValue({ version: 1 });
    const mockApiCall2 = jest.fn().mockResolvedValue({ version: 2 });

    let apiCall = mockApiCall1;
    const { result, rerender } = renderHook(() => useApiRequest(apiCall));

    // Execute with first API call
    await act(async () => {
      await result.current.execute();
    });
    expect(result.current.data).toEqual({ version: 1 });

    // Change API call and rerender
    apiCall = mockApiCall2;
    act(() => {
      rerender();
    });

    // Execute with second API call
    await act(async () => {
      await result.current.execute();
    });
    expect(result.current.data).toEqual({ version: 2 });

    expect(mockApiCall1).toHaveBeenCalledTimes(1);
    expect(mockApiCall2).toHaveBeenCalledTimes(1);
  });
});
