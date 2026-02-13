
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import React, { useNavigate } from 'react-router-dom';

export const useDebounceNavigation = (delay: number = 300) => {
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedNavigate = useCallback((path: string) => {
    // Limpar timeout anterior se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Criar novo timeout
    timeoutRef.current = setTimeout(() => {
      console.log('Navegando para:', path);
      navigate(path);
    }, delay);
  }, [navigate, delay]);

  const cancelNavigation = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return { debouncedNavigate, cancelNavigation };
};
