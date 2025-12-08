/**
 * Helper utility to get consistent userId across the application
 * This ensures data saved with one userId format can be retrieved with the same format
 */

import { getSession } from './session';

/**
 * Get consistent userId from session
 * Priority: session.username > session.user.email > session.user.name > 'default_user'
 * 
 * @param session - NextAuth session object (optional)
 * @returns Consistent userId string
 */
export function getConsistentUserId(session?: any): string {
  // Try NextAuth session first
  if (session?.user) {
    // Check if session has username property (from localStorage sync)
    if (session.user.username) {
      return session.user.username;
    }
    // Fallback to email or name
    return session.user.email || session.user.name || 'default_user';
  }
  
  // Try localStorage session
  try {
    const localStorageSession = getSession();
    if (localStorageSession?.username) {
      return localStorageSession.username;
    }
  } catch (e) {
    console.warn('[getConsistentUserId] Error getting localStorage session:', e);
  }
  
  // Ultimate fallback
  return 'default_user';
}

/**
 * Get userId from NextAuth session with fallback to localStorage
 * This is the recommended way to get userId in client components
 */
export function getUserIdFromSession(nextAuthSession?: any): string {
  return getConsistentUserId(nextAuthSession);
}

/**
 * Async version of getConsistentUserId that properly handles dynamic imports
 * This function can be safely called with await import() to ensure the getSession helper is available
 */
export async function getConsistentUserIdAsync(session?: any): Promise<string> {
  // Try NextAuth session first
  if (session?.user) {
    // Check if session has username property (from localStorage sync)
    if (session.user.username) {
      return session.user.username;
    }
    // Fallback to email or name
    return session.user.email || session.user.name || 'default_user';
  }

  // Try localStorage session
  try {
    // Dynamically import the getSession function to avoid circular dependencies
    const { getSession } = await import('./session');
    const localStorageSession = getSession();
    if (localStorageSession?.username) {
      return localStorageSession.username;
    }
  } catch (e) {
    console.warn('[getConsistentUserIdAsync] Error getting localStorage session:', e);
  }

  // Ultimate fallback
  return 'default_user';
}

