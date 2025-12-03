import { getSession } from './session';

const getStorageKey = (username) => `fitSync_profile_${username}`;

export const saveUserProfile = (data) => {
  const session = getSession();
  if (!session?.username) {
    console.error('No active user session found');
    return null;
  }
  
  const completeProfile = {
    ...data,
    userId: session.username,
    onboardingCompleted: true,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  };
  
  const key = getStorageKey(session.username);
  localStorage.setItem(key, JSON.stringify(completeProfile));
  return completeProfile;
};

export const getUserProfile = () => {
  const session = getSession();
  if (!session?.username) {
    console.error('No active user session found');
    return null;
  }
  
  const key = getStorageKey(session.username);
  const profile = localStorage.getItem(key);
  return profile ? JSON.parse(profile) : null;
};

export const updateUserProfile = (data) => {
  const session = getSession();
  if (!session?.username) {
    console.error('No active user session found');
    return null;
  }
  
  const profile = getUserProfile();
  if (profile) {
    const updatedProfile = {
      ...profile,
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    
    const key = getStorageKey(session.username);
    localStorage.setItem(key, JSON.stringify(updatedProfile));
    return updatedProfile;
  }
  return null;
};

export const isOnboardingCompleted = () => {
  const profile = getUserProfile();
  return profile?.onboardingCompleted || false;
};

export const clearUserProfile = () => {
  const session = getSession();
  if (session?.username) {
    const key = getStorageKey(session.username);
    localStorage.removeItem(key);
  }
};

// Helper function to list all stored profiles for debugging
export const getAllStoredProfiles = () => {
  return Object.keys(localStorage).filter(k => k.startsWith('fitSync_profile_'));
};