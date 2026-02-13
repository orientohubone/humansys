
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Training } from '@/types/training';

const CACHE_KEY = 'trainings_cache';
const CACHE_TIMESTAMP_KEY = 'trainings_cache_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const useTrainingCache = () => {
  const saveToCache = useCallback((trainings: Training[]) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(trainings));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      console.log('Treinamentos salvos no cache local:', trainings.length);
    } catch (error) {
      console.warn('Erro ao salvar no cache:', error);
    }
  }, []);

  const getFromCache = useCallback((): { data: Training[] | null; isStale: boolean } => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

      if (!cachedData || !cachedTimestamp) {
        return { data: null, isStale: false };
      }

      const data = JSON.parse(cachedData);
      const timestamp = parseInt(cachedTimestamp);
      const isStale = (Date.now() - timestamp) > CACHE_DURATION;

      console.log('Dados recuperados do cache:', data.length, 'items, stale:', isStale);
      return { data, isStale };
    } catch (error) {
      console.warn('Erro ao recuperar do cache:', error);
      return { data: null, isStale: false };
    }
  }, []);

  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      console.log('Cache de treinamentos limpo');
    } catch (error) {
      console.warn('Erro ao limpar cache:', error);
    }
  }, []);

  const clearAppData = useCallback(() => {
    try {
      // Limpar todos os dados relacionados à aplicação
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('training')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log('Dados da aplicação limpos:', keysToRemove);
      
      // Recarregar a página para renovar a sessão
      window.location.reload();
    } catch (error) {
      console.warn('Erro ao limpar dados da aplicação:', error);
    }
  }, []);

  return {
    saveToCache,
    getFromCache,
    clearCache,
    clearAppData
  };
};
