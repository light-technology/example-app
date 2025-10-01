import { renderHook, act } from '@testing-library/react';
import { useAccount } from './useAccount';
import { ApiService } from '../services/api';
import { GetAccountResponse } from '../types/account';

// Mock the ApiService
jest.mock('../services/api');
const mockApiService = ApiService as jest.Mocked<typeof ApiService>;

describe('useAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error in tests
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize with default state when no stored account', async () => {
    mockApiService.getStoredAccountUuid.mockReturnValue(null);

    const { result } = renderHook(() => useAccount());

    // Initially checking account
    expect(result.current.accountUuid).toBe(null);
    expect(result.current.accountData).toBe(null);
    expect(typeof result.current.refreshAccountData).toBe('function');
    expect(typeof result.current.updateAccountUuid).toBe('function');

    // After initial check completes
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isCheckingAccount).toBe(false);
  });

  it('should load stored account UUID and fetch account data on mount', async () => {
    const storedUuid = 'stored-account-uuid';
    const mockAccountData: GetAccountResponse = {
      uuid: storedUuid,
      name: 'Test Account',
      email: 'test@example.com',
      // Add other required fields based on the actual interface
    };

    mockApiService.getStoredAccountUuid.mockReturnValue(storedUuid);
    mockApiService.getAccount.mockResolvedValue(mockAccountData);

    const { result } = renderHook(() => useAccount());

    // Should immediately set account UUID from storage
    expect(result.current.accountUuid).toBe(storedUuid);

    // Wait for account data fetch to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockApiService.getAccount).toHaveBeenCalledWith(storedUuid);
    expect(result.current.accountData).toEqual(mockAccountData);
    expect(result.current.isCheckingAccount).toBe(false);
  });

  it('should handle case when no stored account UUID exists', async () => {
    mockApiService.getStoredAccountUuid.mockReturnValue(null);

    const { result } = renderHook(() => useAccount());

    // Wait for initial check to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.accountUuid).toBe(null);
    expect(result.current.accountData).toBe(null);
    expect(result.current.isCheckingAccount).toBe(false);
    expect(mockApiService.getAccount).not.toHaveBeenCalled();
  });

  it('should handle error when fetching account data', async () => {
    const storedUuid = 'stored-account-uuid';

    mockApiService.getStoredAccountUuid.mockReturnValue(storedUuid);
    mockApiService.getAccount.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useAccount());

    // Wait for account data fetch to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.accountUuid).toBe(storedUuid);
    expect(result.current.accountData).toBe(null);
    expect(result.current.isCheckingAccount).toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      'Failed to fetch account data for stored UUID:',
      expect.any(Error)
    );
  });

  it('should refresh account data when refreshAccountData is called', async () => {
    const accountUuid = 'test-account-uuid';
    const mockAccountData: GetAccountResponse = {
      uuid: accountUuid,
      name: 'Updated Account',
      email: 'updated@example.com',
    };

    mockApiService.getStoredAccountUuid.mockReturnValue(accountUuid);
    mockApiService.getAccount.mockResolvedValue(mockAccountData);

    const { result } = renderHook(() => useAccount());

    // Wait for initial load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Clear the mock to track new calls
    mockApiService.getAccount.mockClear();

    // Call refresh
    await act(async () => {
      await result.current.refreshAccountData();
    });

    expect(mockApiService.getAccount).toHaveBeenCalledWith(accountUuid);
    expect(result.current.accountData).toEqual(mockAccountData);
  });

  it('should not refresh when accountUuid is null', async () => {
    mockApiService.getStoredAccountUuid.mockReturnValue(null);

    const { result } = renderHook(() => useAccount());

    // Wait for initial check
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Try to refresh
    await act(async () => {
      await result.current.refreshAccountData();
    });

    expect(mockApiService.getAccount).not.toHaveBeenCalled();
  });

  it('should handle error during refresh', async () => {
    const accountUuid = 'test-account-uuid';

    mockApiService.getStoredAccountUuid.mockReturnValue(accountUuid);
    mockApiService.getAccount
      .mockResolvedValueOnce({
        uuid: accountUuid,
        name: 'Test',
        email: 'test@test.com',
      })
      .mockRejectedValueOnce(new Error('Refresh Error'));

    const { result } = renderHook(() => useAccount());

    // Wait for initial load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Try to refresh (this should fail)
    await act(async () => {
      await result.current.refreshAccountData();
    });

    expect(console.error).toHaveBeenCalledWith(
      'Failed to fetch account info:',
      expect.any(Error)
    );
  });

  it('should update account UUID when updateAccountUuid is called', () => {
    mockApiService.getStoredAccountUuid.mockReturnValue(null);

    const { result } = renderHook(() => useAccount());

    const newUuid = 'new-account-uuid';

    act(() => {
      result.current.updateAccountUuid(newUuid);
    });

    expect(result.current.accountUuid).toBe(newUuid);
  });

  it('should work with changing stored account UUID during initial load', async () => {
    // First, no stored UUID
    mockApiService.getStoredAccountUuid.mockReturnValueOnce(null);

    const { result } = renderHook(() => useAccount());

    // Wait for initial check
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.accountUuid).toBe(null);
    expect(result.current.isCheckingAccount).toBe(false);
  });

  it('should handle multiple refresh calls correctly', async () => {
    const accountUuid = 'test-account-uuid';
    const mockAccountData: GetAccountResponse = {
      uuid: accountUuid,
      name: 'Test Account',
      email: 'test@example.com',
    };

    mockApiService.getStoredAccountUuid.mockReturnValue(accountUuid);
    mockApiService.getAccount.mockResolvedValue(mockAccountData);

    const { result } = renderHook(() => useAccount());

    // Wait for initial load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Clear mock to count new calls
    mockApiService.getAccount.mockClear();

    // Call refresh multiple times
    await act(async () => {
      await Promise.all([
        result.current.refreshAccountData(),
        result.current.refreshAccountData(),
        result.current.refreshAccountData(),
      ]);
    });

    expect(mockApiService.getAccount).toHaveBeenCalledTimes(3);
  });
});
