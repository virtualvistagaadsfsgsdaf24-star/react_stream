export const getStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) as T : null;
  } catch {
    return null;
  }
};

export const setStorage = (key: string, value: unknown): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeStorage = (key: string): void => {
  localStorage.removeItem(key);
};