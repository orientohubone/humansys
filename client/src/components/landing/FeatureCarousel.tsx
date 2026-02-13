
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Brain, 
  Users, 
  Trophy, 
  Target,
  UserPlus,
  MessageSquare,
  Video,
  Crown,
  Smartphone
} from "lucide-react";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface FeatureCarouselProps {
  features?: Feature[];
  autoPlayInterval?: number;
  className?: string;
  title?: string;
  subtitle?: string;
}

function FeatureCarousel({
  features,
  autoPlayInterval = 4000,
  className,
  title = "Tecnologia de Ponta para RH",
  subtitle = "Descubra como a Humansys revoluciona a gestão de pessoas com IA"
}: FeatureCarouselProps) {
  const defaultFeatures: Feature[] = [
    {
      id: "ai-analytics",
      title: "Analytics com IA Preditiva",
      description: "Machine Learning avançado prevê turnover com 85% de precisão, identifica talentos em risco e gera insights automáticos para decisões estratégicas de RH.",
      icon: <Brain className="size-6" />,
      color: "from-purple-500 to-indigo-500"
    },
    {
      id: "founder-dashboard",
      title: "Founder Dashboard Premium",
      description: "Métricas SaaS em tempo real: MRR, ARR, Churn Rate, LTV/CAC. Brainsys IAO V.1 com previsões de receita e análises de crescimento personalizadas.",
      icon: <Crown className="size-6" />,
      color: "from-yellow-500 to-orange-500"
    },
    {
      id: "gamification",
      title: "Gamificação Completa",
      description: "Sistema de badges, conquistas e ranking que aumenta engajamento em 45%. Transforme desenvolvimento profissional em uma experiência motivadora.",
      icon: <Trophy className="size-6" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "collaborators",
      title: "Gestão Inteligente de Pessoas",
      description: "Controle total de colaboradores, estagiários e terceiros. Visão unificada em tempo real com economia de 8h semanais em relatórios administrativos.",
      icon: <Users className="size-6" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "onboarding",
      title: "Onboarding Automatizado",
      description: "Processo estruturado reduz tempo de integração em 70%. De 30 dias para 9 dias até produtividade total com 95% de satisfação dos novos funcionários.",
      icon: <UserPlus className="size-6" />,
      color: "from-teal-500 to-blue-500"
    },
    {
      id: "feedback",
      title: "Feedback 360° Inteligente",
      description: "Sistema completo de avaliações aumenta comunicação em 60%. 95% dos feedbacks entregues no prazo com melhoria de 40% no clima organizacional.",
      icon: <MessageSquare className="size-6" />,
      color: "from-pink-500 to-rose-500"
    },
    {
      id: "goals",
      title: "Metas & PDI Avançado",
      description: "Plano de Desenvolvimento Individual com IA. Aumento de 55% no alcance de metas e crescimento profissional estruturado para toda equipe.",
      icon: <Target className="size-6" />,
      color: "from-indigo-500 to-purple-500"
    },
    {
      id: "training",
      title: "Treinamentos Interativos",
      description: "Plataforma completa com player de vídeo, certificação automática e 85% de conclusão. ROI de 300% em desenvolvimento de talentos.",
      icon: <Video className="size-6" />,
      color: "from-orange-500 to-red-500"
    },
    {
      id: "pwa",
      title: "Progressive Web App",
      description: "Funciona offline, instala como app nativo e mantém produtividade 24/7. Aumento de 25% na utilização com sincronização automática.",
      icon: <Smartphone className="size-6" />,
      color: "from-emerald-500 to-teal-500"
    }
  ];

  const featureList = features || defaultFeatures;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (autoPlayInterval / 100));
      } else {
        setCurrentIndex((prev) => (prev + 1) % featureList.length);
        setProgress(0);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [progress, featureList.length, autoPlayInterval]);

  const handleFeatureClick = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  const currentFeature = featureList[currentIndex];

  return (
    <div className={cn("w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
      {/* Header */}
      <div className="text-center mb-8 lg:mb-12">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-blue-300">
            <Brain className="mr-1 h-3 w-3 inline" />
            IA Avançada
          </div>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          {title}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
        {/* Feature List - Mais compacta */}
        <div className="lg:col-span-2 space-y-3">
          {featureList.map((feature, index) => (
            <motion.div
              key={feature.id}
              className={cn(
                "relative p-3 rounded-xl border-2 cursor-pointer transition-all duration-300",
                index === currentIndex
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "border-border bg-background hover:border-primary/50 hover:bg-muted/50"
              )}
              onClick={() => handleFeatureClick(index)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Progress bar for current feature */}
              {index === currentIndex && (
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-b-lg"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              )}

              <div className="flex items-start gap-3">
                <motion.div
                  className={cn(
                    "p-2.5 rounded-lg bg-gradient-to-br text-white flex-shrink-0",
                    index === currentIndex ? currentFeature.color : "from-muted-foreground to-muted-foreground"
                  )}
                  animate={{
                    scale: index === currentIndex ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {React.cloneElement(feature.icon as React.ReactElement, {
                    className: "size-5"
                  })}
                </motion.div>

                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    "text-base font-semibold mb-1 transition-colors",
                    index === currentIndex ? "text-primary" : "text-foreground"
                  )}>
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {feature.description}
                  </p>
                </div>

                {/* Active indicator */}
                <motion.div
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300 flex-shrink-0",
                    index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                  animate={{
                    scale: index === currentIndex ? 1.2 : 1,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Showcase - Ocupa mais espaço */}
        <div className="lg:col-span-3 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="relative"
              initial={{ opacity: 0, y: 20, rotateX: -10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -20, rotateX: 10 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {/* Main showcase card */}
              <div className="relative p-6 lg:p-8 rounded-2xl border-2 border-border bg-gradient-to-br from-background to-muted/30 shadow-2xl min-h-[400px] lg:min-h-[500px]">
                {/* Gradient background */}
                <div className={cn(
                  "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-10",
                  currentFeature.color
                )} />
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  <motion.div
                    className={cn(
                      "inline-flex p-4 rounded-xl bg-gradient-to-br text-white mb-6 w-fit",
                      currentFeature.color
                    )}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    {React.cloneElement(currentFeature.icon as React.ReactElement, {
                      className: "size-8"
                    })}
                  </motion.div>

                  <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-foreground">
                    {currentFeature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                    {currentFeature.description}
                  </p>

                  {/* Mockup da interface do sistema */}
                  <div className="bg-muted/50 rounded-lg p-4 mb-6 border-2 border-muted">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <div className="ml-auto text-xs text-muted-foreground">
                        Humansys Interface
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 bg-background rounded border flex items-center px-3">
                        <div className={cn(
                          "w-4 h-4 rounded bg-gradient-to-r mr-2",
                          currentFeature.color
                        )}></div>
                        <div className="text-sm font-medium">
                          {currentFeature.title}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-12 bg-background rounded border"></div>
                        <div className="h-12 bg-background rounded border"></div>
                        <div className="h-12 bg-background rounded border"></div>
                      </div>
                      <div className="h-16 bg-background rounded border flex items-center justify-center">
                        <div className="text-xs text-muted-foreground">
                          Interface Real do Sistema
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feature indicators */}
                  <div className="flex gap-2">
                    {featureList.map((_, index) => (
                      <motion.div
                        key={index}
                        className={cn(
                          "h-2 rounded-full transition-all duration-300",
                          index === currentIndex ? "bg-primary flex-1" : "bg-muted-foreground/30 w-2"
                        )}
                        animate={{
                          width: index === currentIndex ? "auto" : "8px"
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Decorative elements */}
                <motion.div
                  className="absolute -top-2 -right-2 w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-transparent"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-gradient-to-br from-secondary/20 to-transparent"
                  animate={{ 
                    scale: [1.2, 1, 1.2],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-2 mt-6 lg:mt-8">
        {featureList.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              index === currentIndex 
                ? "bg-primary scale-125" 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            onClick={() => handleFeatureClick(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default FeatureCarousel;
