
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useFounderAccess = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFounder, setIsFounder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 useFounderAccess - useEffect executando, user:', user ? user.email : 'null');
    if (user) {
      console.log('🔍 Checking founder access for user:', user.email, 'role:', user.role);
      
      // Verificar se o usuário tem acesso de founder
      const hasFounderAccess = user.email === 'fernandoluizsouzaramalho@gmail.com' || user.role === 'founder';
      
      console.log('👑 Is founder:', hasFounderAccess, 'email match:', user.email === 'fernandoluizsouzaramalho@gmail.com', 'role match:', user.role === 'founder');
      setIsFounder(hasFounderAccess);
    } else {
      console.log('❌ useFounderAccess - Usuário não encontrado');
      setIsFounder(false);
    }
    setIsLoading(false);
    console.log('✅ useFounderAccess - Loading finalizado, isFounder será:', user ? (user.email === 'fernandoluizsouzaramalho@gmail.com' || user.role === 'founder') : false);
  }, [user, navigate]);

  return { isFounder, isLoading };
};
