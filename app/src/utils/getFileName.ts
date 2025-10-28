export const getFileNameFromUri = (uri: string | null, fallback = '') => {
  if (!uri) return fallback || `file-${Date.now()}`;
  const parts = uri.split('/');
  return parts[parts.length - 1] || fallback || `file-${Date.now()}`;
};