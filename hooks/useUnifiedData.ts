import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { getSession } from '@/lib/session';
import { getInsightsData, getWeeklyStats, getDailyStats, getSummaryStats } from '@/lib/storage/unified-aggregator-wrapper';

interface UnifiedData {
  today: any;
  week: any;
  recentActivities: any[];
  recentMeals: any[];
  recentSleep: any[];
}

interface UseUnifiedDataReturn {
  data: UnifiedData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch unified data with proper dependency management and debouncing
 * This hook implements several optimizations to prevent double renders and excessive API calls
 */
const useUnifiedData = (userId?: string, options: { refreshInterval?: number } = {}): UseUnifiedDataReturn => {
  const { data: session } = useSession();
  const [data, setData] = useState<UnifiedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to track ongoing requests and prevent race conditions
  const requestCount = useRef(0);
  const latestRequestId = useRef(0);
  const debouncedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to fetch unified data with proper cleanup
  const fetchUnifiedData = useCallback(async () => {
    // Increment request counter for this request
    const requestId = ++requestCount.current;
    latestRequestId.current = requestId;

    try {
      setLoading(true);
      setError(null);

      // Determine user ID
      let actualUserId = userId;
      if (!actualUserId) {
        // Use the consistent userId helper to ensure we use the same format as data storage
        const { getConsistentUserId } = await import('@/lib/userId-helper');
        actualUserId = getConsistentUserId(session);
      }

      if (!actualUserId) {
        throw new Error('User ID not available');
      }

      // Fetch data using unified aggregator
      const insightsData = await getInsightsData(actualUserId);

      // Only update state if this is the latest request (prevent race conditions)
      if (requestId === latestRequestId.current) {
        setData(insightsData);
      }
    } catch (err) {
      console.error('Error in useUnifiedData:', err);
      // Only update error state if this is the latest request
      if (requestId === latestRequestId.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch unified data');
        setData(null);
      }
    } finally {
      // Only update loading state if this is the latest request
      if (requestId === latestRequestId.current) {
        setLoading(false);
      }
    }
  }, [session, userId]);

  // Memoized refetch function that clears any debounce timeout
  const refetch = useCallback(() => {
    if (debouncedTimeoutRef.current) {
      clearTimeout(debouncedTimeoutRef.current);
    }
    fetchUnifiedData();
  }, [fetchUnifiedData]);

  // Handle refresh interval if specified
  useEffect(() => {
    if (options.refreshInterval) {
      const interval = setInterval(() => {
        fetchUnifiedData();
      }, options.refreshInterval);

      return () => {
        clearInterval(interval);
        if (debouncedTimeoutRef.current) {
          clearTimeout(debouncedTimeoutRef.current);
        }
      };
    }
  }, [options.refreshInterval, fetchUnifiedData]);

  // Initial data fetch - using useCallback dependencies properly
  useEffect(() => {
    // Debounce the initial fetch to prevent rapid multiple calls
    if (debouncedTimeoutRef.current) {
      clearTimeout(debouncedTimeoutRef.current);
    }

    debouncedTimeoutRef.current = setTimeout(() => {
      fetchUnifiedData();
    }, 300); // 300ms debounce

    // Cleanup on unmount
    return () => {
      if (debouncedTimeoutRef.current) {
        clearTimeout(debouncedTimeoutRef.current);
      }
    };
  }, [fetchUnifiedData]); // Only re-run when fetchUnifiedData changes

  return {
    data,
    loading,
    error,
    refetch
  };
};

export default useUnifiedData;