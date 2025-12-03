import { getSession as getLocalSession, setSession as setLocalSession, clearSession as clearLocalSession } from '@/lib/session';

/**
 * Session synchronization manager
 * Synchronizes NextAuth session with localStorage to ensure consistency
 */
export class SessionManager {
  /**
   * Synchronize NextAuth session with localStorage
   */
  static syncSessionWithStorage(nextAuthSession: any): void {
    if (!nextAuthSession) {
      // If no NextAuth session, clear localStorage
      clearLocalSession();
      return;
    }

    // Prepare user data for localStorage storage
    const userData = {
      id: nextAuthSession.user?.id,
      name: nextAuthSession.user?.name,
      email: nextAuthSession.user?.email,
      username: nextAuthSession.user?.name || nextAuthSession.user?.email || 'default_user',
      image: nextAuthSession.user?.image,
      // Preserve any additional data that might exist
      ...nextAuthSession
    };

    // Store in localStorage
    setLocalSession(userData);
  }

  /**
   * Get the current user session from both NextAuth and localStorage
   * Prioritizes NextAuth session but falls back to localStorage
   */
  static getCurrentSession(nextAuthSession: any): any {
    if (nextAuthSession && nextAuthSession.user) {
      // NextAuth session is available, sync with localStorage and return
      this.syncSessionWithStorage(nextAuthSession);
      return {
        ...nextAuthSession.user,
        username: nextAuthSession.user.name || nextAuthSession.user.email || 'default_user'
      };
    }

    // No NextAuth session available, try localStorage
    const localStorageSession = getLocalSession();
    
    if (localStorageSession) {
      // Return localStorage session data formatted to match NextAuth
      return {
        id: localStorageSession.id,
        name: localStorageSession.name,
        email: localStorageSession.email,
        image: localStorageSession.image,
        username: localStorageSession.username,
      };
    }

    // No session available anywhere
    return null;
  }

  /**
   * Check if user has completed onboarding
   */
  static hasCompletedOnboarding(userId: string): boolean {
    if (!userId) return false;

    try {
      const profileKey = `fitSync_profile_${userId}`;
      const profileData = localStorage.getItem(profileKey);
      
      if (!profileData) return false;

      const profile = JSON.parse(profileData);
      // Check if profile has required onboarding data
      return !!(profile.age && profile.gender && profile.weight && profile.height && profile.fitnessGoal);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  }

  /**
   * Check if session is valid and user has completed onboarding
   */
  static isSessionValid(nextAuthSession: any): boolean {
    const currentSession = this.getCurrentSession(nextAuthSession);
    
    if (!currentSession) {
      return false;
    }

    // Check if user has completed onboarding
    const userId = currentSession.id || currentSession.email || currentSession.name || currentSession.username;
    
    return this.hasCompletedOnboarding(userId);
  }

  /**
   * Clear all session-related data
   */
  static clearAllSessionData(): void {
    clearLocalSession();
    
    // Clear any user-specific data
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('fitSync_profile_') || 
          key?.startsWith('activities_') || 
          key?.startsWith('meals_') || 
          key?.startsWith('sleep_') ||
          key?.startsWith('fitsync_')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
}

/**
 * Utility to get the effective user ID from either NextAuth or localStorage
 */
export const getUserId = (nextAuthSession: any): string => {
  if (nextAuthSession?.user) {
    return nextAuthSession.user.email || nextAuthSession.user.name || 'default_user';
  }

  const localStorageSession = getLocalSession();
  return localStorageSession?.username || 'default_user';
};

/**
 * Hook to synchronize session data
 */
export const useSessionSync = (nextAuthSession: any, nextAuthStatus: string) => {
  // This would typically be used in a React component context
  // For now, we're providing the utilities above
};