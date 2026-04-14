import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Trophy, Brain, X, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const BANNER_KEY = '@humansys:update-banner-v2.5.0';

export const UpdateBanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(BANNER_KEY);
    if (!seen && user) {
      setTimeout(() => setIsVisible(true), 800);
    }
  }, [user]);

  const dismiss = () => {
    localStorage.setItem(BANNER_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* ── Slim notification strip ─────────────────────────────────────── */}
      <div
        role="status"
        aria-live="polite"
        className="
          relative flex items-center gap-3 px-4 py-2.5 mb-4
          rounded-lg border
          bg-indigo-50 border-indigo-200 text-indigo-900
          dark:bg-indigo-950/50 dark:border-indigo-800/60 dark:text-indigo-200
          transition-colors duration-200
        "
      >
        {/* Icon */}
        <Sparkles
          className="h-4 w-4 flex-shrink-0 text-indigo-500 dark:text-indigo-400"
          aria-hidden="true"
        />

        {/* Message */}
        <p className="flex-1 text-sm font-medium min-w-0 truncate">
          <span className="font-semibold">Novidade v2.5:</span>{' '}
          Gamificação, BrainSys IAO e experiência Mobile foram adicionados à plataforma.
        </p>

        {/* CTA */}
        <button
          onClick={() => setShowDetails(true)}
          className="
            flex items-center gap-1 text-xs font-semibold whitespace-nowrap
            text-indigo-700 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-100
            transition-colors duration-150 flex-shrink-0
          "
        >
          Ver novidades <ChevronRight className="h-3 w-3" />
        </button>

        {/* Dismiss */}
        <button
          onClick={dismiss}
          aria-label="Fechar notificação"
          className="
            p-0.5 rounded flex-shrink-0
            text-indigo-400 hover:text-indigo-700 dark:text-indigo-500 dark:hover:text-indigo-200
            transition-colors duration-150
          "
        >
          <X size={15} />
        </button>
      </div>

      {/* ── Details dialog ──────────────────────────────────────────────── */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              Novidades na Plataforma — v2.5
            </DialogTitle>
            <DialogDescription>
              Conheça as novas funcionalidades que acabaram de ser lançadas.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            {[
              {
                icon: Trophy,
                color: 'text-amber-500',
                title: 'Sistema de Gamificação',
                desc: 'Conquiste badges, acumule pontos e veja seu progresso em rankings para aumentar o engajamento da equipe.',
              },
              {
                icon: Brain,
                color: 'text-purple-500',
                title: 'BrainSys IAO — IA Operacional',
                desc: 'Analytics preditiva, insights automáticos e recomendações inteligentes baseadas no contexto da sua empresa.',
              },
              {
                icon: Sparkles,
                color: 'text-blue-500',
                title: 'Experiência Mobile (PWA)',
                desc: 'Acesse a plataforma de qualquer lugar. Interface otimizada para dispositivos móveis com suporte a PWA.',
              },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-muted p-2 flex-shrink-0">
                    <Icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowDetails(false)}>
              Fechar
            </Button>
            <Button size="sm" onClick={() => { setShowDetails(false); dismiss(); navigate('/changelog'); }}>
              Ver changelog completo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
