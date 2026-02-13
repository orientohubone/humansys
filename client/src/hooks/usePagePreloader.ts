
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import React, { useLocation } from 'react-router-dom';

export const usePagePreloader = (delay: number = 100) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [location.pathname, delay]);

  return isLoading;
};
