export const formatNumber = (num: number): string => {
  return num.toLocaleString('de-DE').replace(/,/g, '.');
};

export const truncateText = (text: string, maxLength: number = 15): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

export const formatEngagement = (engagement: string | number): string => {
  const value = typeof engagement === 'string' 
    ? parseFloat(engagement.replace('%', '')) 
    : engagement;
  return `${value.toFixed(2)}%`;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString();
};