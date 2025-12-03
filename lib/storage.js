export const saveData = (key, value) => {
  try {
    if (typeof value === 'undefined') {
      localStorage.removeItem(key);
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving data to localStorage with key '${key}':`, error);
  }
};

export const getData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading data from localStorage with key '${key}':`, error);
    return [];
  }
};

export const clearData = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing data from localStorage with key '${key}':`, error);
  }
};

// Enhanced function to get data with default value
export const getDataWithDefault = (key, defaultValue) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error reading data from localStorage with key '${key}':`, error);
    return defaultValue;
  }
};