/**
 * Save an item to localStorage (automatically handles JSON serialization).
 */
export function setLocalStorageItem(key, value) {
  try {
    if (typeof value == "string") {
      localStorage.setItem(key, value);
      return true;
    }
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error(`Error saving key "${key}" to localStorage:`, error);
    return false;
  }
}

/**
 * Get an item from localStorage (automatically parses JSON back to its original type).
 */
export function getLocalStorageItem(key) {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return null;
    }
    if (typeof serializedValue == "string") {
      return serializedValue;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error(`Error reading key "${key}" from localStorage:`, error);
    return null;
  }
}

/**
 * Remove an item from localStorage.
 */
export function removeLocalStorageItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing key "${key}" from localStorage:`, error);
    return false;
  }
}
