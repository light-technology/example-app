import { renderHook, act } from '@testing-library/react';
import { usePaymentMethodFlow } from './usePaymentMethodFlow';
import { ApiService } from '../services/api';

// Mock the ApiService
jest.mock('../services/api');
const mockApiService = ApiService as jest.Mocked<typeof ApiService>;

describe('usePaymentMethodFlow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error in tests
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => usePaymentMethodFlow());

    expect(result.current.showIframe).toBe(false);
    expect(result.current.flowUrl).toBe(null);
    expect(result.current.updateLoading).toBe(false);
    expect(typeof result.current.handleUpdateClick).toBe('function');
    expect(typeof result.current.closeIframe).toBe('function');
  });

  it('should handle payment method update click successfully', async () => {
    const mockFlowResponse = {
      flow_login_link: 'https://example.com/payment-flow',
      account_uuid: 'test-account-uuid',
    };

    mockApiService.getFlow.mockResolvedValue(mockFlowResponse);
    const onAccountUpdate = jest.fn();

    const { result } = renderHook(() => usePaymentMethodFlow());

    await act(async () => {
      await result.current.handleUpdateClick(onAccountUpdate);
    });

    expect(mockApiService.getFlow).toHaveBeenCalledWith(
      'update-payment-method'
    );
    expect(result.current.showIframe).toBe(true);
    expect(result.current.flowUrl).toBe(mockFlowResponse.flow_login_link);
    expect(result.current.updateLoading).toBe(false);
    expect(onAccountUpdate).toHaveBeenCalledWith(mockFlowResponse.account_uuid);
  });

  it('should set loading state during payment method flow fetch', async () => {
    let resolveApiCall: (value: unknown) => void;
    const mockFlowResponse = {
      flow_login_link: 'https://example.com/payment-flow',
      account_uuid: 'test-account-uuid',
    };

    mockApiService.getFlow.mockReturnValue(
      new Promise((resolve) => {
        resolveApiCall = resolve;
      })
    );

    const onAccountUpdate = jest.fn();
    const { result } = renderHook(() => usePaymentMethodFlow());

    // Start the payment method update process
    act(() => {
      result.current.handleUpdateClick(onAccountUpdate);
    });

    // Should be loading
    expect(result.current.updateLoading).toBe(true);
    expect(result.current.showIframe).toBe(false);
    expect(result.current.flowUrl).toBe(null);

    // Resolve the API call
    await act(async () => {
      resolveApiCall(mockFlowResponse);
    });

    // Should no longer be loading and iframe should be shown
    expect(result.current.updateLoading).toBe(false);
    expect(result.current.showIframe).toBe(true);
    expect(result.current.flowUrl).toBe(mockFlowResponse.flow_login_link);
  });

  it('should handle payment method flow API error', async () => {
    mockApiService.getFlow.mockRejectedValue(new Error('API Error'));
    const onAccountUpdate = jest.fn();

    const { result } = renderHook(() => usePaymentMethodFlow());

    await act(async () => {
      await result.current.handleUpdateClick(onAccountUpdate);
    });

    expect(mockApiService.getFlow).toHaveBeenCalledWith(
      'update-payment-method'
    );
    expect(result.current.updateLoading).toBe(false);
    expect(result.current.showIframe).toBe(false);
    expect(result.current.flowUrl).toBe(null);
    expect(onAccountUpdate).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Failed to fetch payment method flow data:',
      expect.any(Error)
    );
  });

  it('should close iframe and refresh account', async () => {
    const mockFlowResponse = {
      flow_login_link: 'https://example.com/payment-flow',
      account_uuid: 'test-account-uuid',
    };

    mockApiService.getFlow.mockResolvedValue(mockFlowResponse);
    const onAccountUpdate = jest.fn();
    const onRefreshAccount = jest.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() => usePaymentMethodFlow());

    // First, open the payment method flow
    await act(async () => {
      await result.current.handleUpdateClick(onAccountUpdate);
    });

    expect(result.current.showIframe).toBe(true);
    expect(result.current.flowUrl).toBe(mockFlowResponse.flow_login_link);

    // Then close it
    await act(async () => {
      await result.current.closeIframe(onRefreshAccount);
    });

    expect(result.current.showIframe).toBe(false);
    expect(result.current.flowUrl).toBe(null);
    expect(onRefreshAccount).toHaveBeenCalled();
  });

  it('should handle multiple update clicks correctly', async () => {
    const mockFlowResponse1 = {
      flow_login_link: 'https://example.com/payment-flow-1',
      account_uuid: 'test-account-uuid-1',
    };

    const mockFlowResponse2 = {
      flow_login_link: 'https://example.com/payment-flow-2',
      account_uuid: 'test-account-uuid-2',
    };

    mockApiService.getFlow
      .mockResolvedValueOnce(mockFlowResponse1)
      .mockResolvedValueOnce(mockFlowResponse2);

    const onAccountUpdate = jest.fn();
    const { result } = renderHook(() => usePaymentMethodFlow());

    // First update
    await act(async () => {
      await result.current.handleUpdateClick(onAccountUpdate);
    });

    expect(result.current.flowUrl).toBe(mockFlowResponse1.flow_login_link);
    expect(onAccountUpdate).toHaveBeenCalledWith(
      mockFlowResponse1.account_uuid
    );

    // Close iframe
    const onRefreshAccount = jest.fn().mockResolvedValue(undefined);
    await act(async () => {
      await result.current.closeIframe(onRefreshAccount);
    });

    // Second update
    await act(async () => {
      await result.current.handleUpdateClick(onAccountUpdate);
    });

    expect(result.current.flowUrl).toBe(mockFlowResponse2.flow_login_link);
    expect(onAccountUpdate).toHaveBeenCalledWith(
      mockFlowResponse2.account_uuid
    );
    expect(mockApiService.getFlow).toHaveBeenCalledTimes(2);
    expect(mockApiService.getFlow).toHaveBeenLastCalledWith(
      'update-payment-method'
    );
  });

  it('should handle payment method update while already loading', async () => {
    let resolveFirstCall: (value: unknown) => void;
    const mockFlowResponse = {
      flow_login_link: 'https://example.com/payment-flow',
      account_uuid: 'test-account-uuid',
    };

    // First call hangs
    mockApiService.getFlow.mockImplementationOnce(
      () =>
        new Promise<unknown>((resolve) => {
          resolveFirstCall = resolve;
        })
    );

    // Second call resolves immediately
    mockApiService.getFlow.mockResolvedValueOnce(mockFlowResponse);

    const onAccountUpdate = jest.fn();
    const { result } = renderHook(() => usePaymentMethodFlow());

    // Start first update (hangs)
    act(() => {
      result.current.handleUpdateClick(onAccountUpdate);
    });

    expect(result.current.updateLoading).toBe(true);

    // Start second update while first is loading
    await act(async () => {
      await result.current.handleUpdateClick(onAccountUpdate);
    });

    // Should handle the second call
    expect(mockApiService.getFlow).toHaveBeenCalledTimes(2);
    expect(result.current.updateLoading).toBe(false);
    expect(result.current.showIframe).toBe(true);

    // Resolve first call (should not affect state since second call completed)
    act(() => {
      resolveFirstCall(mockFlowResponse);
    });
  });

  it('should handle error during iframe close', async () => {
    const mockFlowResponse = {
      flow_login_link: 'https://example.com/payment-flow',
      account_uuid: 'test-account-uuid',
    };

    mockApiService.getFlow.mockResolvedValue(mockFlowResponse);
    const onAccountUpdate = jest.fn();
    const onRefreshAccount = jest.fn().mockImplementation(() => {
      throw new Error('Refresh Error');
    });

    const { result } = renderHook(() => usePaymentMethodFlow());

    // Open the payment method flow
    await act(async () => {
      await result.current.handleUpdateClick(onAccountUpdate);
    });

    // Close it (refresh will fail, but iframe should still close)
    await act(async () => {
      try {
        await result.current.closeIframe(onRefreshAccount);
      } catch {
        // Expected to throw, but iframe should still be closed
      }
    });

    expect(result.current.showIframe).toBe(false);
    expect(result.current.flowUrl).toBe(null);
  });

  it('should handle undefined callback function by throwing error', async () => {
    const mockFlowResponse = {
      flow_login_link: 'https://example.com/payment-flow',
      account_uuid: 'test-account-uuid',
    };

    mockApiService.getFlow.mockResolvedValue(mockFlowResponse);

    const { result } = renderHook(() => usePaymentMethodFlow());

    // Test with undefined callback function - should throw error
    await act(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await result.current.handleUpdateClick(undefined as any);
    });

    // The flow should fail due to undefined callback error, so iframe won't be shown
    expect(result.current.showIframe).toBe(false);
    expect(result.current.updateLoading).toBe(false);
  });

  it('should call correct API endpoint for payment method flow', async () => {
    const mockFlowResponse = {
      flow_login_link: 'https://example.com/payment-flow',
      account_uuid: 'test-account-uuid',
    };

    mockApiService.getFlow.mockResolvedValue(mockFlowResponse);
    const onAccountUpdate = jest.fn();

    const { result } = renderHook(() => usePaymentMethodFlow());

    await act(async () => {
      await result.current.handleUpdateClick(onAccountUpdate);
    });

    // Verify the specific flow type is called
    expect(mockApiService.getFlow).toHaveBeenCalledWith(
      'update-payment-method'
    );
    expect(mockApiService.getFlow).toHaveBeenCalledTimes(1);
  });
});
