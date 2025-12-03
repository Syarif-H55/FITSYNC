import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getSession } from '@/lib/session';
import { ReportGenerator } from '@/lib/reports/report-generator';
import { WeeklyReport } from '@/lib/reports/report-models';

interface WeeklyReportHook {
  report: WeeklyReport | null;
  loading: boolean;
  error: string | null;
  generateReport: (weekDate?: Date) => void;
}

export const useWeeklyReport = (): WeeklyReportHook => {
  const { data: session } = useSession();
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async (weekDate?: Date) => {
    try {
      setLoading(true);
      setError(null);

      let userId = 'default_user';
      if (session && session.user) {
        userId = session.user.email || session.user.name || 'default_user';
      } else {
        const fallbackSession = getSession();
        userId = fallbackSession?.username || 'default_user';
      }

      if (!userId) {
        throw new Error('User ID not available');
      }

      const generatedReport = await ReportGenerator.generateWeeklyReport(userId, weekDate);
      setReport(generatedReport);
    } catch (err) {
      console.error('[HOOK - useWeeklyReport] Error generating report:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate report');
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  // Load report on component mount
  useEffect(() => {
    generateReport();
  }, [session]);

  return {
    report,
    loading,
    error,
    generateReport
  };
};