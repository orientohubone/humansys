import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, Zap, Activity, ArrowRight, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: LucideIcon;
  relatedIds: number[];
  status: 'completed' | 'in-progress' | 'pending';
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
  className?: string;
}

const RadialOrbitalTimeline: React.FC<RadialOrbitalTimelineProps> = ({ 
  timelineData, 
  className 
}) => {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [orbitTranslateX, setOrbitTranslateX] = useState<number>(0);
  const [orbitTranslateY, setOrbitTranslateY] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(err => console.error('Fullscreen error:', err));
      }
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        // Calcular ângulo do nó e animar órbita para trazer ele para cima
        const itemIndex = timelineData.findIndex((item) => item.id === id);
        const totalNodes = timelineData.length;
        const nodeAngle = ((itemIndex / totalNodes) * 360);
        const targetRotation = 270 - nodeAngle; // Trazer para cima (270 graus)
        setRotationAngle(targetRotation);

        // Calcular offset para centralizar melhor o card (apenas translação Y para cima)
        setOrbitTranslateX(0);
        setOrbitTranslateY(-80); // Move órbita para cima para dar espaço ao card

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setOrbitTranslateX(0);
        setOrbitTranslateY(0);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer: NodeJS.Timeout;

    if (autoRotate) {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.3) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [autoRotate]);

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 160;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.4,
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const getStatusColor = (status: TimelineItem['status']): string => {
    switch (status) {
      case 'completed':
        return 'from-green-500 to-emerald-500';
      case 'in-progress':
        return 'from-blue-500 to-cyan-500';
      case 'pending':
        return 'from-gray-500 to-slate-500';
      default:
        return 'from-purple-500 to-indigo-500';
    }
  };

  const getStatusLabel = (status: TimelineItem['status']): string => {
    switch (status) {
      case 'completed':
        return 'COMPLETO';
      case 'in-progress':
        return 'PROCESSANDO';
      case 'pending':
        return 'PENDENTE';
      default:
        return 'DESCONHECIDO';
    }
  };

  return (
    <div
      className={cn(
        "relative w-full h-[400px] xs:h-[500px] sm:h-[600px] flex items-center justify-center overflow-hidden rounded-lg xs:rounded-xl",
        isFullscreen ? "fixed inset-0 z-50 w-screen h-screen rounded-none" : "",
        "bg-white dark:bg-slate-950",
        className
      )}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      {/* Orbital Background */}
      <div className="absolute inset-0 rounded-lg xs:rounded-xl overflow-hidden pointer-events-none bg-white dark:bg-slate-950" />

      {/* Fullscreen Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFullscreen();
        }}
        className="absolute top-4 right-4 z-40 p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 transition-all"
        title={isFullscreen ? "Sair de tela cheia" : "Tela cheia"}
      >
        {isFullscreen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V5m0 0H5m4 0l-4 4m15 0v4m0 0h4m-4 0l4-4M9 15v4m0 0H5m4 0l-4-4" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5v4m0 0h4m-4 0l-5 5M4 20v-4m0 0H0m4 0l5-5m11 5v-4m0 0h4m-4 0l-5-5" />
          </svg>
        )}
      </button>

      {/* Orbital Container */}
      <div
        className="absolute w-full h-full flex items-center justify-center transition-all duration-500"
        ref={orbitRef}
        style={{
          perspective: "1000px",
          transform: `translate(${orbitTranslateX}px, ${orbitTranslateY}px)`,
        }}
      >
        {/* Center Core */}
        <div className="absolute w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-purple-500 via-blue-600 to-cyan-600 flex items-center justify-center z-10 shadow-2xl shadow-purple-500/50 dark:shadow-purple-600/30">
          <div className="absolute w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 rounded-full border-2 border-purple-400/50 animate-ping opacity-60"></div>
          <div
            className="absolute w-28 w-28 xs:w-32 xs:h-32 sm:w-36 sm:h-36 rounded-full border border-blue-400/30 animate-ping opacity-40"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center justify-center"
          >
            <Brain className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 text-white" />
          </motion.div>
        </div>

        {/* Orbital Rings */}
        <div className="absolute w-64 h-64 xs:w-80 xs:h-80 sm:w-96 sm:h-96 rounded-full border border-purple-500/30 dark:border-purple-500/20"></div>
        <div className="absolute w-72 h-72 xs:w-96 xs:h-96 sm:w-[28rem] sm:h-[28rem] rounded-full border border-blue-500/20 dark:border-blue-500/10"></div>
        <div className="absolute w-80 h-80 xs:w-[26rem] xs:h-[26rem] sm:w-[36rem] sm:h-[36rem] rounded-full border border-cyan-500/10 dark:border-cyan-500/5"></div>

        {/* Orbital Nodes */}
        {timelineData.map((item, index) => {
          const position = calculateNodePosition(index, timelineData.length);
          const isExpanded = expandedItems[item.id];
          const isRelated = isRelatedToActive(item.id);
          const isPulsing = pulseEffect[item.id];
          const Icon = item.icon;

          const nodeStyle = {
            transform: `translate(${position.x}px, ${position.y}px)`,
            zIndex: isExpanded ? 200 : position.zIndex,
            opacity: isExpanded ? 1 : position.opacity,
          };

          return (
            <div
              key={item.id}
              ref={(el) => (nodeRefs.current[item.id] = el)}
              className="absolute transition-all duration-700 cursor-pointer"
              style={nodeStyle}
              onClick={(e) => {
                e.stopPropagation();
                toggleItem(item.id);
              }}
            >
              {/* Glow effect */}
              <div
                className={`absolute rounded-full -inset-1 ${
                  isPulsing ? "animate-pulse" : ""
                }`}
                style={{
                  background: `radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(168,85,247,0) 70%)`,
                  width: `${item.energy * 0.5 + 50}px`,
                  height: `${item.energy * 0.5 + 50}px`,
                  left: `-${(item.energy * 0.5 + 50 - 40) / 2}px`,
                  top: `-${(item.energy * 0.5 + 50 - 40) / 2}px`,
                  animationDuration: isPulsing ? "1s" : "2s",
                }}
              ></div>

              {/* Node circle */}
              <div
                className={`
                w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center
                border-2 transition-all duration-300 transform relative z-10
                ${
                  isExpanded
                    ? "bg-white text-black border-white shadow-2xl shadow-white/50 scale-125"
                    : isRelated
                    ? "bg-white/60 text-black border-white/80 shadow-lg shadow-white/30 animate-pulse"
                    : `bg-gradient-to-br ${getStatusColor(item.status)} text-white border-white/30 shadow-lg shadow-purple-500/20`
                }
              `}
              >
                <Icon size={20} />
              </div>

              {/* Label */}
              <div
                className={`
                absolute top-14 xs:top-16 sm:top-20 left-1/2 -translate-x-1/2 whitespace-nowrap
                text-xs xs:text-sm font-semibold tracking-wide
                transition-all duration-300
                ${isExpanded ? "text-slate-900 dark:text-white scale-110" : "text-slate-600 dark:text-slate-300"}
              `}
              >
                {item.title}
              </div>

              {/* Expanded Card */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="fixed sm:absolute inset-4 sm:inset-auto top-1/2 sm:top-auto sm:left-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:translate-y-0 sm:top-24 xs:top-28 w-auto sm:w-96 max-h-[90vh] sm:max-h-[70vh] overflow-y-auto z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 dark:from-slate-900/95 dark:to-slate-800/95 backdrop-blur-xl border-slate-600/50 dark:border-slate-600/40 shadow-2xl">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-gradient-to-b from-slate-400 to-transparent"></div>

                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge className={`px-2 py-0.5 text-xs font-semibold bg-gradient-to-r ${getStatusColor(item.status)} text-white border-0`}>
                          {getStatusLabel(item.status)}
                        </Badge>
                        <span className="text-xs text-slate-400 dark:text-slate-400">{item.date}</span>
                      </div>
                      <CardTitle className="text-sm xs:text-base text-slate-100 dark:text-slate-100">
                        {item.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <p className="text-xs xs:text-sm text-slate-300 dark:text-slate-300">{item.content}</p>

                      {/* Energy Level */}
                      <div className="space-y-2 pt-3 border-t border-slate-700/50">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center text-slate-400">
                            <Zap size={12} className="mr-1.5" />
                            Energia
                          </span>
                          <span className="font-mono text-slate-300">{item.energy}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getStatusColor(item.status)} transition-all duration-300`}
                            style={{ width: `${item.energy}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Category */}
                      <div className="pt-3 border-t border-slate-700/50">
                        <Badge variant="outline" className="bg-slate-800/50 text-slate-200 border-slate-600/50 text-xs">
                          {item.category}
                        </Badge>
                      </div>

                      {/* Connected Nodes */}
                      {item.relatedIds.length > 0 && (
                        <div className="space-y-2 pt-3 border-t border-slate-700/50">
                          <h4 className="text-xs uppercase font-semibold text-slate-400 flex items-center">
                            <Activity size={12} className="mr-1.5" />
                            Nós Conectados
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find((i) => i.id === relatedId);
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="h-6 px-2 py-0 text-xs rounded-full border-slate-600/50 bg-slate-800/50 hover:bg-slate-700/70 text-slate-300 hover:text-slate-100 transition-all"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight size={10} className="ml-1 opacity-50" />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={() => setExpandedItems({})}
                        className="w-full mt-4 h-8 bg-slate-700/50 hover:bg-slate-700/70 text-slate-100 text-xs font-medium transition-all"
                      >
                        Fechar
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-2 xs:bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 text-center z-50 pointer-events-none">
        <p className="text-xs text-slate-500 dark:text-slate-400">Clique em um nó para explorar</p>
      </div>
    </div>
  );
};

export default RadialOrbitalTimeline;
