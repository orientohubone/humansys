import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Target,
  Heart,
  TrendingUp,
  AlertCircle,
  Loader2,
  Crown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { StrategicContext } from '@shared/schema';

// Form schema for strategic context
const contextFormSchema = z.object({
  // Step 1: Vision & Mission
  vision_3_5_years: z.string().min(20, 'A visão deve ter pelo menos 20 caracteres'),
  growth_objectives: z.string().min(20, 'Os objetivos devem ter pelo menos 20 caracteres'),
  
  // Step 2: Core Values
  core_values: z.array(z.string()).min(3, 'Adicione pelo menos 3 valores fundamentais'),
  
  // Step 3: Market Context
  competitive_advantage: z.string().optional(),
  market_trends: z.array(z.string()).optional(),
  
  // Step 4: Challenges & Opportunities
  challenges: z.array(z.string()).optional(),
  opportunities: z.array(z.string()).optional(),
  
  // Step 5: Growth Metrics
  sector: z.string().optional(),
  stage: z.string().optional(),
  headcount: z.coerce.number().optional(),
  current_arr: z.coerce.number().optional(),
});

type ContextFormValues = z.infer<typeof contextFormSchema>;

const STEPS = [
  { 
    id: 1, 
    title: 'Visão & Missão', 
    icon: Target,
    description: 'Defina o futuro que você quer construir',
    color: 'text-purple-500'
  },
  { 
    id: 2, 
    title: 'Valores Fundamentais', 
    icon: Heart,
    description: 'Os princípios que guiam suas decisões',
    color: 'text-red-500'
  },
  { 
    id: 3, 
    title: 'Contexto de Mercado', 
    icon: TrendingUp,
    description: 'Sua posição e vantagens competitivas',
    color: 'text-blue-500'
  },
  { 
    id: 4, 
    title: 'Desafios & Oportunidades', 
    icon: AlertCircle,
    description: 'Obstáculos e potenciais a explorar',
    color: 'text-yellow-500'
  },
  { 
    id: 5, 
    title: 'Métricas de Crescimento', 
    icon: Crown,
    description: 'Onde você está e para onde vai',
    color: 'text-emerald-500'
  },
];

export function ContextConfiguration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [coreValueInput, setCoreValueInput] = useState('');
  const [trendInput, setTrendInput] = useState('');
  const [challengeInput, setChallengeInput] = useState('');
  const [opportunityInput, setOpportunityInput] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch existing context if any
  const { data: existingContext, isLoading: loadingContext } = useQuery<StrategicContext>({
    queryKey: ['/api/strategic-vision/context'],
  });

  const form = useForm<ContextFormValues>({
    resolver: zodResolver(contextFormSchema),
    defaultValues: {
      vision_3_5_years: '',
      growth_objectives: '',
      core_values: [],
      competitive_advantage: '',
      market_trends: [],
      challenges: [],
      opportunities: [],
      sector: '',
      stage: 'growth',
      headcount: 0,
      current_arr: 0,
    },
  });

  // Populate form with existing data
  useEffect(() => {
    if (existingContext) {
      form.reset({
        vision_3_5_years: existingContext.vision_3_5_years || '',
        growth_objectives: existingContext.growth_objectives || '',
        core_values: existingContext.core_values || [],
        competitive_advantage: existingContext.competitive_advantage || '',
        market_trends: existingContext.market_trends || [],
        challenges: existingContext.challenges || [],
        opportunities: existingContext.opportunities || [],
        sector: existingContext.sector || '',
        stage: existingContext.stage || 'growth',
        headcount: existingContext.headcount || 0,
        current_arr: existingContext.current_arr || 0,
      });
    }
  }, [existingContext, form]);

  // Save/update context mutation
  const saveMutation = useMutation({
    mutationFn: async (data: ContextFormValues) => {
      if (existingContext?.id) {
        return apiRequest(`/api/strategic-vision/context/${existingContext.id}`, { 
          method: 'PATCH', 
          body: JSON.stringify(data) 
        });
      } else {
        return apiRequest('/api/strategic-vision/context', { 
          method: 'POST', 
          body: JSON.stringify(data) 
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/strategic-vision/context'] });
      toast({
        title: '✅ Contexto Estratégico Salvo!',
        description: 'Suas informações foram salvas com sucesso.',
      });
      navigate('/app/strategic-vision');
    },
    onError: (error: any) => {
      toast({
        title: '❌ Erro ao Salvar',
        description: error.message || 'Não foi possível salvar o contexto.',
        variant: 'destructive',
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: ContextFormValues) => {
    saveMutation.mutate(data);
  };

  // Helper functions for array fields
  const addCoreValue = () => {
    if (coreValueInput.trim()) {
      const currentValues = form.getValues('core_values') || [];
      form.setValue('core_values', [...currentValues, coreValueInput.trim()]);
      setCoreValueInput('');
    }
  };

  const removeCoreValue = (index: number) => {
    const currentValues = form.getValues('core_values') || [];
    form.setValue('core_values', currentValues.filter((_, i) => i !== index));
  };

  const addTrend = () => {
    if (trendInput.trim()) {
      const currentTrends = form.getValues('market_trends') || [];
      form.setValue('market_trends', [...currentTrends, trendInput.trim()]);
      setTrendInput('');
    }
  };

  const removeTrend = (index: number) => {
    const currentTrends = form.getValues('market_trends') || [];
    form.setValue('market_trends', currentTrends.filter((_, i) => i !== index));
  };

  const addChallenge = () => {
    if (challengeInput.trim()) {
      const currentChallenges = form.getValues('challenges') || [];
      form.setValue('challenges', [...currentChallenges, challengeInput.trim()]);
      setChallengeInput('');
    }
  };

  const removeChallenge = (index: number) => {
    const currentChallenges = form.getValues('challenges') || [];
    form.setValue('challenges', currentChallenges.filter((_, i) => i !== index));
  };

  const addOpportunity = () => {
    if (opportunityInput.trim()) {
      const currentOpportunities = form.getValues('opportunities') || [];
      form.setValue('opportunities', [...currentOpportunities, opportunityInput.trim()]);
      setOpportunityInput('');
    }
  };

  const removeOpportunity = (index: number) => {
    const currentOpportunities = form.getValues('opportunities') || [];
    form.setValue('opportunities', currentOpportunities.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = STEPS[currentStep - 1];
  const Icon = currentStepData.icon;

  if (loadingContext) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-purple-500" />
          <p className="text-lg font-medium">Carregando contexto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-blue-950/20 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/app/strategic-vision')}
            className="mb-4"
            data-testid="button-back"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Strategic Vision
          </Button>

          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Configuração de Contexto Estratégico
            </h1>
            <p className="text-muted-foreground">
              Configure os fundamentos da sua estratégia em 5 passos
            </p>
          </div>
        </div>

        {/* Step Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        isActive
                          ? 'bg-purple-600 border-purple-600 text-white scale-110'
                          : isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        <StepIcon className="h-6 w-6" />
                      )}
                    </div>
                    <p className={`text-xs mt-2 text-center ${isActive ? 'font-bold text-purple-600 dark:text-purple-400' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-3 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30`}>
                    <Icon className={`h-6 w-6 ${currentStepData.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
                    <CardDescription>{currentStepData.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Step 1: Vision & Mission */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="vision_3_5_years"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">Visão 3-5 Anos 🔭</FormLabel>
                          <FormDescription>
                            Onde você quer que sua empresa esteja em 3-5 anos? Seja ambicioso e específico.
                          </FormDescription>
                          <FormControl>
                            <Textarea
                              placeholder="Ex: Ser a plataforma líder de RH com IA na América Latina, servindo 10.000+ empresas e transformando a gestão de pessoas através de tecnologia..."
                              className="min-h-[120px]"
                              data-testid="input-vision"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="growth_objectives"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">Objetivos de Crescimento 🎯</FormLabel>
                          <FormDescription>
                            Quais são seus principais objetivos estratégicos? O que você precisa alcançar?
                          </FormDescription>
                          <FormControl>
                            <Textarea
                              placeholder="Ex: Alcançar $10M ARR, expandir para 5 países, lançar 3 novos produtos, construir time de 100 pessoas..."
                              className="min-h-[120px]"
                              data-testid="input-objectives"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Core Values */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="core_values"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">Valores Fundamentais ❤️</FormLabel>
                          <FormDescription>
                            Quais princípios guiam todas as decisões da empresa? Adicione pelo menos 3 valores.
                          </FormDescription>
                          
                          <div className="flex gap-2">
                            <Input
                              placeholder="Ex: Transparência, Inovação, Foco no Cliente..."
                              value={coreValueInput}
                              onChange={(e) => setCoreValueInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addCoreValue();
                                }
                              }}
                              data-testid="input-core-value"
                            />
                            <Button type="button" onClick={addCoreValue} data-testid="button-add-value">
                              Adicionar
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {field.value?.map((value, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="px-3 py-1.5 text-sm"
                                data-testid={`badge-value-${index}`}
                              >
                                {value}
                                <button
                                  type="button"
                                  onClick={() => removeCoreValue(index)}
                                  className="ml-2 hover:text-red-500"
                                  data-testid={`button-remove-value-${index}`}
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 3: Market Context */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="competitive_advantage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">Vantagem Competitiva 💎</FormLabel>
                          <FormDescription>
                            O que te diferencia da concorrência? Por que clientes escolhem você?
                          </FormDescription>
                          <FormControl>
                            <Textarea
                              placeholder="Ex: Única plataforma com IA preditiva integrada, atendimento personalizado, tecnologia proprietária..."
                              className="min-h-[100px]"
                              data-testid="input-advantage"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="market_trends"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">Tendências de Mercado 📈</FormLabel>
                          <FormDescription>
                            Quais tendências estão moldando seu mercado?
                          </FormDescription>
                          
                          <div className="flex gap-2">
                            <Input
                              placeholder="Ex: Adoção de IA, Trabalho remoto, ESG..."
                              value={trendInput}
                              onChange={(e) => setTrendInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addTrend();
                                }
                              }}
                              data-testid="input-trend"
                            />
                            <Button type="button" onClick={addTrend} data-testid="button-add-trend">
                              Adicionar
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {field.value?.map((trend, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="px-3 py-1.5 text-sm"
                                data-testid={`badge-trend-${index}`}
                              >
                                {trend}
                                <button
                                  type="button"
                                  onClick={() => removeTrend(index)}
                                  className="ml-2 hover:text-red-500"
                                  data-testid={`button-remove-trend-${index}`}
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 4: Challenges & Opportunities */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="challenges"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">Desafios 🚧</FormLabel>
                          <FormDescription>
                            Quais obstáculos você enfrenta ou antecipa?
                          </FormDescription>
                          
                          <div className="flex gap-2">
                            <Input
                              placeholder="Ex: Competição acirrada, Recrutamento de talentos..."
                              value={challengeInput}
                              onChange={(e) => setChallengeInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addChallenge();
                                }
                              }}
                              data-testid="input-challenge"
                            />
                            <Button type="button" onClick={addChallenge} data-testid="button-add-challenge">
                              Adicionar
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {field.value?.map((challenge, index) => (
                              <Badge
                                key={index}
                                variant="destructive"
                                className="px-3 py-1.5 text-sm"
                                data-testid={`badge-challenge-${index}`}
                              >
                                {challenge}
                                <button
                                  type="button"
                                  onClick={() => removeChallenge(index)}
                                  className="ml-2 hover:text-white"
                                  data-testid={`button-remove-challenge-${index}`}
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="opportunities"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">Oportunidades 🌟</FormLabel>
                          <FormDescription>
                            Que oportunidades você pode explorar?
                          </FormDescription>
                          
                          <div className="flex gap-2">
                            <Input
                              placeholder="Ex: Novos mercados, Parcerias estratégicas..."
                              value={opportunityInput}
                              onChange={(e) => setOpportunityInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addOpportunity();
                                }
                              }}
                              data-testid="input-opportunity"
                            />
                            <Button type="button" onClick={addOpportunity} data-testid="button-add-opportunity">
                              Adicionar
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {field.value?.map((opportunity, index) => (
                              <Badge
                                key={index}
                                variant="default"
                                className="px-3 py-1.5 text-sm bg-green-600"
                                data-testid={`badge-opportunity-${index}`}
                              >
                                {opportunity}
                                <button
                                  type="button"
                                  onClick={() => removeOpportunity(index)}
                                  className="ml-2 hover:text-white"
                                  data-testid={`button-remove-opportunity-${index}`}
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 5: Growth Metrics */}
                {currentStep === 5 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="sector"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Setor</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: SaaS, E-commerce, Fintech..." data-testid="input-sector" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="stage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estágio</FormLabel>
                            <FormControl>
                              <select
                                className="w-full p-2 border rounded-md bg-background"
                                data-testid="select-stage"
                                {...field}
                              >
                                <option value="pre-seed">Pre-Seed</option>
                                <option value="seed">Seed</option>
                                <option value="series-a">Series A</option>
                                <option value="series-b">Series B</option>
                                <option value="growth">Growth</option>
                                <option value="mature">Mature</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="headcount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Headcount Atual</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Ex: 50"
                                data-testid="input-headcount"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="current_arr"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ARR Atual (USD)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Ex: 1000000"
                                data-testid="input-arr"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 mt-6">
                      <div className="flex items-start gap-3">
                        <Sparkles className="h-6 w-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                            Pronto para desbloquear o poder da IA! 🚀
                          </h4>
                          <p className="text-sm text-emerald-800 dark:text-emerald-200">
                            Com essas informações, a IA poderá gerar análises preditivas, simular decisões estratégicas,
                            sugerir estruturas organizacionais ideais e muito mais!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={previousStep}
                disabled={currentStep === 1}
                data-testid="button-previous"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>

              <div className="text-sm text-muted-foreground">
                Passo {currentStep} de {STEPS.length}
              </div>

              {currentStep < STEPS.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  data-testid="button-next"
                >
                  Próximo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  data-testid="button-save"
                >
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Salvar Contexto
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
