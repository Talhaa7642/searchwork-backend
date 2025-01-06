// utils/helpers.ts
export function generateRandomEmail(userData: any): string {
    const platform = userData?.platform || 'unknown';
    return `${platform}_${Math.random().toString(36).substr(2, 9)}@searchwork.com`;
  }
  