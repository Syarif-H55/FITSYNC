import { WeeklyReport } from './report-models';

export interface ReportStorageData {
  reports: WeeklyReport[];
  lastGenerated: Date;
}

export class ReportStorage {
  private static readonly STORAGE_KEY_PREFIX = 'fitsync_reports_';

  /**
   * Save a generated report
   */
  static saveReport(userId: string, report: WeeklyReport): void {
    try {
      const key = `${this.STORAGE_KEY_PREFIX}${userId}`;
      const existingReports = this.getStoredReports(userId);

      // Add the new report
      existingReports.reports.push(report);
      existingReports.lastGenerated = new Date();

      localStorage.setItem(key, JSON.stringify({
        ...existingReports,
        lastGenerated: existingReports.lastGenerated.toISOString()
      }));
    } catch (error) {
      console.error('[REPORT STORAGE] Error saving report:', error);
    }
  }

  /**
   * Get stored reports for a user
   */
  static getStoredReports(userId: string): ReportStorageData {
    try {
      const key = `${this.STORAGE_KEY_PREFIX}${userId}`;
      const storedData = localStorage.getItem(key);

      if (!storedData) {
        return {
          reports: [],
          lastGenerated: new Date(0) // Unix epoch if no reports
        };
      }

      const parsedData = JSON.parse(storedData);
      return {
        reports: parsedData.reports || [],
        lastGenerated: new Date(parsedData.lastGenerated)
      };
    } catch (error) {
      console.error('[REPORT STORAGE] Error retrieving reports:', error);
      return {
        reports: [],
        lastGenerated: new Date(0)
      };
    }
  }

  /**
   * Get the most recent report
   */
  static getMostRecentReport(userId: string): WeeklyReport | null {
    const storageData = this.getStoredReports(userId);
    if (storageData.reports.length === 0) {
      return null;
    }

    // Sort reports by date descending and return the most recent
    const sortedReports = [...storageData.reports].sort((a, b) =>
      new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime()
    );

    return sortedReports[0];
  }

  /**
   * Get all reports within a date range
   */
  static getReportsInRange(userId: string, startDate: Date, endDate: Date): WeeklyReport[] {
    const storageData = this.getStoredReports(userId);

    return storageData.reports.filter(report => {
      const reportStart = new Date(report.weekStart);
      return reportStart >= startDate && reportStart <= endDate;
    });
  }

  /**
   * Clear all stored reports for a user
   */
  static clearReports(userId: string): void {
    try {
      const key = `${this.STORAGE_KEY_PREFIX}${userId}`;
      localStorage.removeItem(key);
    } catch (error) {
      console.error('[REPORT STORAGE] Error clearing reports:', error);
    }
  }
}