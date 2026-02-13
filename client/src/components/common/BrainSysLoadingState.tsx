import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

const loadingMessages = [
  '🧠 BrainSys está acordando...',
  '⚡ Ativando neurônios de IA...',
  '🔮 Consultando a inteligência coletiva...',
  '🚀 Decolando para o futuro de RH...',
  '💡 Carregando insights valiosos...',
  '🎯 Preparando dados estratégicos...',
  '✨ Transformando dados em decisões...',
  '🌟 Conectando talentos com potencial...',
  '🔥 Gerando magia de dados...',
  '🎨 Pintando o quadro do seu RH...'
];

export const BrainSysLoadingState: React.FC<{ module?: string }> = ({ module = 'BrainSys' }) => {
  const [messageIndex] = React.useState(Math.floor(Math.random() * loadingMessages.length));
  const message = loadingMessages[messageIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2">
        <div className="p-8 space-y-6 text-center">
          {/* Animated spinner */}
          <div className="flex justify-center">
            <div className="relative w-20 h-20">
              <Loader2 className="w-20 h-20 text-purple-600 dark:text-purple-400 animate-spin" />
              <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-yellow-500 dark:text-yellow-400" />
            </div>
          </div>

          {/* Module name */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
              {module}
            </h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              {message}
            </p>
          </div>

          {/* Loading bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 rounded-full"
              style={{
                animation: 'loading 2s ease-in-out infinite'
              }}
            />
          </div>

          {/* Subtitle */}
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Não se preocupe, está tudo sob controle da IA 🤖
          </p>
        </div>
      </Card>

      <style>{`
        @keyframes loading {
          0% {
            width: 0%;
          }
          50% {
            width: 100%;
          }
          100% {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default BrainSysLoadingState;
