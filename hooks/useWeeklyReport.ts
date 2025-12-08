import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getSession } from '@/lib/session';
import { ReportGenerator } from '@/lib/reports/report-generator';

export const useWeeklyReport = () => {
  const { data: session } = useSession();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState<boolean>(false);

  useEffect(() => {
    loadWeeklyReport();
  }, [session]);

  const loadWeeklyReport = async (weekDate?: Date) => {
    try {
      setLoading(true);
      setError(null);

      // Get user ID
      let userId = 'default_user';
      if (session && session.user) {
        // Use the consistent userId helper to ensure we use the same format as data storage
        const { getConsistentUserId } = await import('@/lib/userId-helper');
        userId = getConsistentUserId(session);
      } else {
        const fallbackSession = getSession();
        userId = fallbackSession?.username || 'default_user';
      }

      // Generate report
      const generatedReport = await ReportGenerator.generateWeeklyReport(userId, weekDate);

      setReport(generatedReport);
    } catch (err) {
      console.error('[HOOK - useWeeklyReport] Error loading weekly report:', err);
      setError('Failed to load weekly report');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (weekDate?: Date) => {
    try {
      setGenerating(true);
      setError(null);

      // Get user ID
      let userId = 'default_user';
      if (session && session.user) {
        // Use the consistent userId helper to ensure we use the same format as data storage
        const { getConsistentUserId } = await import('@/lib/userId-helper');
        userId = getConsistentUserId(session);
      } else {
        const fallbackSession = getSession();
        userId = fallbackSession?.username || 'default_user';
      }

      // Generate report
      const generatedReport = await ReportGenerator.generateWeeklyReport(userId, weekDate);

      setReport(generatedReport);
    } catch (err) {
      console.error('[HOOK - useWeeklyReport] Error generating weekly report:', err);
      setError('Failed to generate weekly report');
    } finally {
      setGenerating(false);
    }
  };

  return {
    report,
    loading,
    error,
    generating,
    loadWeeklyReport,
    generateReport
  };
};