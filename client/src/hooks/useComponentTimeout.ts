import { useState, useEffect } from 'react';

interface UseComponentTimeoutOptions {
  timeout?: number;
  onTimeout?: () => void;
}

export const useComponentTimeout = (options: UseComponentTimeoutOptions = {}) => {
  const { timeout = 8000, onTimeout } = options;
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimedOut(true);
      setIsLoading(false);
      onTimeout?.();
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout, onTimeout]);

  const markAsLoaded = () => {
    setIsLoading(false);
  };

  const reset = () => {
    setIsTimedOut(false);
    setIsLoading(true);
  };

  return { isTimedOut, isLoading, markAsLoaded, reset };
};
