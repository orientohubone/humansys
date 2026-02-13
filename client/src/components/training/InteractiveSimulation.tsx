import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  PlayCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw,
  Target,
  Clock,
  Trophy,
  Brain,
  Lightbulb
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DecisionPoint {
  situation: string;
  options: string[];
  correct_answer: string;
  feedback: string;
}

interface Simulation {
  id: string;
  name: string;
  scenario: string;
  challenge_type: string;
  difficulty_level: string;
  estimated_duration: string;
  decision_points: DecisionPoint[];
}

interface InteractiveSimulationProps {
  simulation: Simulation;
  onComplete: (results: SimulationResults) => void;
  onClose: () => void;
}

interface SimulationResults {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: string;
  feedback: string[];
  completed: boolean;
}

export const InteractiveSimulation: React.FC<InteractiveSimulationProps> = ({
  simulation,
  onComplete,
  onClose
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [startTime] = useState<Date>(new Date());
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<SimulationResults | null>(null);

  const currentDecision = simulation.decision_points[currentStep];
  const totalSteps = simulation.decision_points.length;
  const progress = ((currentStep + (showFeedback ? 1 : 0)) / totalSteps) * 100;

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption) {
      toast({
        title: "Selecione uma opção",
        description: "Por favor, escolha uma resposta antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setShowFeedback(true);
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption('');
      setShowFeedback(false);
    } else {
      completeSimulation();
    }
  };

  const completeSimulation = () => {
    const endTime = new Date();
    const timeSpent = Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60);
    
    const correctAnswers = answers.filter((answer, index) => 
      answer === simulation.decision_points[index].correct_answer
    ).length;

    const score = Math.round((correctAnswers / totalSteps) * 100);
    
    const simulationResults: SimulationResults = {
      score,
      totalQuestions: totalSteps,
      correctAnswers,
      timeSpent: `${timeSpent} min`,
      feedback: simulation.decision_points.map((dp, index) => 
        answers[index] === dp.correct_answer ? dp.feedback : `Resposta incorreta: ${dp.feedback}`
      ),
      completed: true
    };

    setResults(simulationResults);
    setIsCompleted(true);
    onComplete(simulationResults);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers([]);
    setShowFeedback(false);
    setSelectedOption('');
    setIsCompleted(false);
    setResults(null);
  };

  const isCorrectAnswer = selectedOption === currentDecision.correct_answer;

  if (isCompleted && results) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Simulação Concluída!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Results Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-green-600">{results.score}%</div>
                <p className="text-sm text-muted-foreground">Pontuação Final</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold">{results.correctAnswers}/{results.totalQuestions}</div>
                <p className="text-sm text-muted-foreground">Respostas Corretas</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold">{results.timeSpent}</div>
                <p className="text-sm text-muted-foreground">Tempo Gasto</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Badge */}
          <div className="text-center">
            {results.score >= 80 && (
              <Badge className="bg-green-500 text-white text-lg px-4 py-2">
                <Trophy className="mr-2 h-4 w-4" />
                Excelente Desempenho!
              </Badge>
            )}
            {results.score >= 60 && results.score < 80 && (
              <Badge className="bg-yellow-500 text-white text-lg px-4 py-2">
                <Target className="mr-2 h-4 w-4" />
                Bom Desempenho!
              </Badge>
            )}
            {results.score < 60 && (
              <Badge className="bg-blue-500 text-white text-lg px-4 py-2">
                <Lightbulb className="mr-2 h-4 w-4" />
                Continue Praticando!
              </Badge>
            )}
          </div>

          {/* Detailed Feedback */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Feedback Detalhado:</h3>
            {results.feedback.map((feedback, index) => (
              <Card key={index}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    {answers[index] === simulation.decision_points[index].correct_answer ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">Pergunta {index + 1}</p>
                      <p className="text-sm text-muted-foreground mt-1">{feedback}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={handleRestart} variant="outline" className="flex-1">
              <RotateCcw className="mr-2 h-4 w-4" />
              Refazer Simulação
            </Button>
            <Button onClick={onClose} className="flex-1">
              Fechar Simulação
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-blue-600" />
            {simulation.name}
          </CardTitle>
          <Badge variant="outline">
            {currentStep + 1} de {totalSteps}
          </Badge>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progresso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Scenario Introduction (only on first step) */}
        {currentStep === 0 && !showFeedback && (
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Cenário da Simulação
              </h3>
              <p className="text-sm">{simulation.scenario}</p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline">
                  <Target className="mr-1 h-3 w-3" />
                  {simulation.difficulty_level}
                </Badge>
                <Badge variant="outline">
                  <Clock className="mr-1 h-3 w-3" />
                  {simulation.estimated_duration}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Decision Point */}
        {!showFeedback && (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Situação {currentStep + 1}:</h3>
                <p className="text-sm leading-relaxed">{currentDecision.situation}</p>
              </CardContent>
            </Card>

            {/* Options */}
            <div className="space-y-3">
              <h4 className="font-medium">Como você responderia?</h4>
              {currentDecision.options.map((option, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedOption === option 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => handleOptionSelect(option)}
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 mt-0.5 ${
                        selectedOption === option 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {selectedOption === option && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                        )}
                      </div>
                      <p className="text-sm flex-1">{option}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button 
              onClick={handleSubmitAnswer} 
              disabled={!selectedOption}
              className="w-full"
            >
              Confirmar Resposta
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Feedback Display */}
        {showFeedback && (
          <div className="space-y-4">
            <Card className={`${isCorrectAnswer ? 'bg-green-50 dark:bg-green-950/20 border-green-200' : 'bg-red-50 dark:bg-red-950/20 border-red-200'}`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  {isCorrectAnswer ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                  <div>
                    <h3 className="font-semibold">
                      {isCorrectAnswer ? 'Resposta Correta!' : 'Resposta Incorreta'}
                    </h3>
                    <p className="text-sm mt-1">{currentDecision.feedback}</p>
                  </div>
                </div>

                {!isCorrectAnswer && (
                  <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-sm">
                      <strong>Resposta recomendada:</strong> {currentDecision.correct_answer}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button onClick={handleNextStep} className="w-full">
              {currentStep < totalSteps - 1 ? 'Próxima Situação' : 'Finalizar Simulação'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};