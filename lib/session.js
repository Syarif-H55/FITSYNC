// Session utility functions - Server-safe

export const setSession = (userData) => {
  // Check if we're in the browser
  if (typeof window === "undefined") {
    console.warn("Attempted to set session in server environment");
    return;
  }
  
  try {
    localStorage.setItem('activeUser', JSON.stringify(userData));
  } catch (error) {
    console.error("Error setting session:", error);
  }
};

export const getSession = () => {
  // Check if we're in the browser
  if (typeof window === "undefined") {
    console.warn("Attempted to get session in server environment");
    return null;
  }
  
  try {
    const user = localStorage.getItem('activeUser');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
};

export const clearSession = () => {
  // Check if we're in the browser
  if (typeof window === "undefined") {
    console.warn("Attempted to clear session in server environment");
    return;
  }
  
  try {
    // Get current user before clearing to remove their profile as well
    const user = getSession();
    if (user) {
      // Remove user-specific profile data
      const profileKey = `fitSync_profile_${user.username || user.name || user.email}`;
      localStorage.removeItem(profileKey);
    }
    localStorage.removeItem('activeUser');
  } catch (error) {
    console.error("Error clearing session:", error);
  }
};

// These functions have been removed as demo functionality is no longer supported