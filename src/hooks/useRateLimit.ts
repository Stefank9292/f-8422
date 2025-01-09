import { useState, useEffect } from 'react';

interface RateLimitConfig {
  key: string;
  maxAttempts: number;
  lockoutDuration: number; // in milliseconds
}

interface RateLimitData {
  attempts: number;
  timestamp: number;
  lockedUntil?: number;
}

export const useRateLimit = ({ key, maxAttempts, lockoutDuration }: RateLimitConfig) => {
  const [isLocked, setIsLocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const isLocalhost = () => {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' || 
           window.location.hostname.includes('192.168.');
  };

  const clearRateLimit = () => {
    localStorage.removeItem(key);
    setIsLocked(false);
    setRemainingTime(0);
  };

  useEffect(() => {
    // Always clear rate limit data for development
    if (isLocalhost()) {
      clearRateLimit();
      return;
    }

    const checkRateLimit = () => {
      const rateLimitData = localStorage.getItem(key);
      if (!rateLimitData) return;

      const data: RateLimitData = JSON.parse(rateLimitData);
      const now = Date.now();

      // If there's a lockout period set
      if (data.lockedUntil) {
        if (now < data.lockedUntil) {
          setIsLocked(true);
          setRemainingTime(data.lockedUntil - now);
        } else {
          // Lockout period expired, clear the data
          clearRateLimit();
        }
      }
    };

    // Initial check
    checkRateLimit();

    // Set up interval to check remaining time
    const interval = setInterval(() => {
      checkRateLimit();
    }, 1000);

    return () => clearInterval(interval);
  }, [key]);

  const updateRateLimit = () => {
    // Skip rate limiting for localhost
    if (isLocalhost()) {
      return;
    }

    const now = Date.now();
    const rateLimitData = localStorage.getItem(key);
    let data: RateLimitData;

    if (rateLimitData) {
      data = JSON.parse(rateLimitData);
      
      // If there's an existing lockout, don't update
      if (data.lockedUntil && now < data.lockedUntil) {
        return;
      }
      
      // Reset attempts if the last attempt was more than lockoutDuration ago
      if (now - data.timestamp > lockoutDuration) {
        data = {
          attempts: 1,
          timestamp: now
        };
      } else {
        data.attempts += 1;
        if (data.attempts >= maxAttempts) {
          data.lockedUntil = now + lockoutDuration;
          setIsLocked(true);
          setRemainingTime(lockoutDuration);
        }
      }
    } else {
      data = {
        attempts: 1,
        timestamp: now
      };
    }

    localStorage.setItem(key, JSON.stringify(data));
  };

  return {
    isLocked,
    remainingTime,
    updateRateLimit,
    clearRateLimit
  };
};