
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCollaborators } from '@/hooks/useCollaborators';

interface EngagementMetrics {
  overallScore: number;
  participationRate: number;
  satisfactionScore: number;
  goalCompletionRate: number;
}

interface DepartmentScore {
  name: string;
  score: number;
  collaborators: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export const useEngagementMetrics = () => {
  const { user } = useAuth();
  const { collaborators } = useCollaborators();
  const calculatedRef = useRef<string | null>(null);
  
  const metrics = useMemo<EngagementMetrics>(() => ({
    overallScore: 84,
    participationRate: 92,
    satisfactionScore: 78,
    goalCompletionRate: 67
  }), []);
  
  const [departmentScores, setDepartmentScores] = useState<DepartmentScore[]>([]);
  const [trends, setTrends] = useState<Array<{ date: string; value: number }>>([]);

  // Criar um seed baseado no ID do usuário para manter consistência
  const userSeed = useMemo(() => {
    if (!user?.id) return 0;
    return user.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  }, [user?.id]);

  // Função para gerar números "aleatórios" consistentes baseados no seed
  const seededRandom = useCallback((seed: number, index: number = 0) => {
    const x = Math.sin(seed + index) * 10000;
    return x - Math.floor(x);
  }, []);

  const calculateEngagementMetrics = useCallback(() => {
    const currentUserKey = `${user?.id}_${collaborators.length}`;
    
    // Se já calculou para este usuário e quantidade de colaboradores, não recalcular
    if (calculatedRef.current === currentUserKey) {
      return;
    }

    if (!collaborators.length || !user?.id) return;

    // Agrupar colaboradores por departamento
    const deptGroups = collaborators.reduce((acc, collab) => {
      if (!acc[collab.department]) {
        acc[collab.department] = [];
      }
      acc[collab.department].push(collab);
      return acc;
    }, {} as Record<string, any[]>);

    // Calcular scores por departamento com valores consistentes
    const deptScores: DepartmentScore[] = Object.entries(deptGroups).map(([dept, collabs], index) => {
      const deptSeed = userSeed + dept.charCodeAt(0) + index;
      const baseScore = 70 + seededRandom(deptSeed) * 25; // Score base entre 70-95
      
      const randomValue = seededRandom(deptSeed, 1);
      let trend: 'up' | 'down' | 'stable';
      if (randomValue > 0.6) {
        trend = 'up';
      } else if (randomValue > 0.3) {
        trend = 'stable';
      } else {
        trend = 'down';
      }
      
      const change = Math.floor(seededRandom(deptSeed, 2) * 10) + 1;
      
      return {
        name: dept,
        score: Math.round(baseScore),
        collaborators: collabs.length,
        trend,
        change
      };
    }).sort((a, b) => b.score - a.score);

    setDepartmentScores(deptScores);

    // Gerar dados de tendência consistentes
    const trendData = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      
      trendData.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(75 + seededRandom(userSeed, i + 10) * 15 + i * 2) // Tendência crescente
      });
    }
    setTrends(trendData);
    
    // Marcar como calculado para esta combinação
    calculatedRef.current = currentUserKey;
  }, [collaborators, user?.id, userSeed, seededRandom]);

  useEffect(() => {
    const currentUserKey = `${user?.id}_${collaborators.length}`;
    
    if (user?.id && collaborators.length > 0 && calculatedRef.current !== currentUserKey) {
      // Usar setTimeout para evitar cálculos síncronos que podem causar loops
      const timeoutId = setTimeout(() => {
        calculateEngagementMetrics();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [user?.id, collaborators.length, calculateEngagementMetrics]);

  // Limpar cache quando o usuário muda completamente
  useEffect(() => {
    if (user?.id && calculatedRef.current && !calculatedRef.current.startsWith(user.id)) {
      calculatedRef.current = null;
      setDepartmentScores([]);
      setTrends([]);
    }
  }, [user?.id]);

  return {
    metrics,
    departmentScores,
    trends
  };
};
