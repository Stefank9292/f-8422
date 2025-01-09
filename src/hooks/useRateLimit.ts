import { useState, useEffect } from 'react';

interface RateLimitConfig {
  key: string;
  maxAttempts: number;
  lockoutDuration: number;
}

export const useRateLimit = ({ key, maxAttempts, lockoutDuration }: RateLimitConfig) => {
  const [isLocked, setIsLocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // Clear existing rate limit data for development
  useEffect(() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      localStorage.removeItem(key);
    }
  }, [key]);

  useEffect(() => {
    // Skip rate limiting for localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      setIsLocked(false);
      setRemainingTime(0);
      return;
    }

    const checkRateLimit = () => {
      const rateLimitData = localStorage.getItem(key);
      if (rateLimitData) {
        const { attempts, timestamp } = JSON.parse(rateLimitData);
        const timeElapsed = Date.now() - timestamp;
        
        if (attempts >= maxAttempts && timeElapsed < lockoutDuration) {
          setIsLocked(true);
          setRemainingTime(Math.ceil((lockoutDuration - timeElapsed) / 1000));
        } else if (timeElapsed >= lockoutDuration) {
          localStorage.removeItem(key);
          setIsLocked(false);
          setRemainingTime(0);
        }
      }
    };

    checkRateLimit();
    const interval = setInterval(checkRateLimit, 1000);
    return () => clearInterval(interval);
  }, [key, maxAttempts, lockoutDuration]);

  const updateRateLimit = () => {
    // Skip rate limiting for localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return;
    }

    const rateLimitData = localStorage.getItem(key);
    const now = Date.now();
    
    if (rateLimitData) {
      const { attempts, timestamp } = JSON.parse(rateLimitData);
      const timeElapsed = now - timestamp;
      
      if (timeElapsed < lockoutDuration) {
        localStorage.setItem(key, JSON.stringify({
          attempts: attempts + 1,
          timestamp: now
        }));
      } else {
        localStorage.setItem(key, JSON.stringify({
          attempts: 1,
          timestamp: now
        }));
      }
    } else {
      localStorage.setItem(key, JSON.stringify({
        attempts: 1,
        timestamp: now
      }));
    }
  };

  return { isLocked, remainingTime, updateRateLimit };
};