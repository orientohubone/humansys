

import { Training, CreateTrainingData } from '@/types/training';
import { convertToTraining } from '@/utils/trainingConverters';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Dados mock para demonstração quando não há dados no banco
const getMockTrainings = (): Training[] => {
  return [
    {
      id: 'mock-1',
      title: 'Introdução à Segurança no Trabalho',
      description: 'Curso fundamental sobre normas de segurança e prevenção de acidentes no ambiente de trabalho.',
      duration: '2 horas',
      instructor: 'Dr. Carlos Silva',
      status: 'active' as const,
      participants: 25,
      user_id: 'demo',
      created_at: new Date().toISOString(),
      category: 'safety'
    },
    {
      id: 'mock-2',
      title: 'Comunicação Eficaz e Liderança',
      description: 'Desenvolva habilidades de comunicação interpessoal e técnicas de liderança para melhorar a produtividade da equipe.',
      duration: '3 horas',
      instructor: 'Prof. Ana Santos',
      status: 'active' as const,
      participants: 18,
      user_id: 'demo',
      created_at: new Date().toISOString(),
      category: 'leadership'
    }
  ];
};

const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      console.warn(`Tentativa ${attempt} falhou:`, error?.message || error);
      
      // Se é um erro de rede e não é a última tentativa
      if (error?.message?.includes('Failed to fetch') && attempt < maxRetries) {
        const backoffDelay = delayMs * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`Aguardando ${backoffDelay}ms antes da próxima tentativa...`);
        await delay(backoffDelay);
        continue;
      }
      
      // Para outros tipos de erro ou última tentativa, parar
      break;
    }
  }
  
  throw lastError;
};

export const fetchTrainings = async (userId: string): Promise<Training[]> => {
  if (!userId) {
    console.warn('❌ fetchTrainings: User ID não fornecido');
    throw new Error('User ID is required');
  }

  console.log('🚀 fetchTrainings: INICIANDO para userId:', userId);
  console.log('🌍 fetchTrainings: URL base:', window.location.origin);
  
  return retryOperation(async () => {
    try {
      const url = `/api/trainings?userId=${encodeURIComponent(userId)}`;
      console.log('📡 Fazendo requisição para:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📨 Resposta recebida - Status:', response.status);

      if (!response.ok) {
        let errorText = 'Unknown error';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorText = errorData.error || errorData.message || `HTTP ${response.status}`;
          } else {
            errorText = await response.text();
          }
        } catch (parseError) {
          console.warn('Erro ao parsear resposta de erro:', parseError);
          errorText = `HTTP ${response.status}`;
        }
        
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`Failed to fetch trainings: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Dados recebidos da API:', data?.length || 0, 'treinamentos');
      
      if (!Array.isArray(data)) {
        console.warn('⚠️ API retornou dados em formato inesperado:', typeof data);
        return getMockTrainings();
      }
      
      // Se não há dados, retornar dados mock para evitar tela vazia
      if (data.length === 0) {
        console.log('📚 API retornou array vazio - usando dados mock');
        return getMockTrainings();
      }
      
      const convertedData = data.map(convertToTraining);
      console.log('📋 Dados convertidos com sucesso:', convertedData.length, 'itens');
      return convertedData;
    } catch (error) {
      console.error('❌ Network error in fetchTrainings:', error);
      console.log('🔄 Erro na API - retornando dados mock como fallback');
      return getMockTrainings();
    }
  });
};

export const createTraining = async (
  trainingData: CreateTrainingData,
  userId: string
): Promise<Training> => {
  const insertData = {
    title: trainingData.title.trim(),
    description: trainingData.description.trim(),
    duration: trainingData.duration.trim(),
    instructor: trainingData.instructor?.trim() || '',
    status: 'active' as const,
    category: 'general' as const,
    participants: 0,
    user_id: userId
  };

  console.log('📤 Enviando dados para criação de treinamento:', insertData);

  return retryOperation(async () => {
    try {
      const response = await fetch('/api/trainings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(insertData)
      });

      console.log('📨 Resposta recebida - Status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erro do servidor:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Treinamento criado com sucesso:', data);
      
      return convertToTraining(data);
    } catch (error) {
      console.error('❌ Erro ao criar treinamento:', error);
      throw error;
    }
  });
};
