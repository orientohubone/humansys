
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DiscQuestion, DiscAnswer } from '@/types/disc';
import { discService } from '@/services/discService';
import { Brain, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface DiscAssessmentProps {
  onComplete: (answers: DiscAnswer[]) => void;
  onCancel: () => void;
}

export const DiscAssessment: React.FC<DiscAssessmentProps> = ({
  onComplete,
  onCancel
}) => {
  const questions = discService.getQuestions();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<DiscAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const canProceed = selectedOption !== null;

  const handleAnswer = () => {
    if (selectedOption === null) return;

    const newAnswer: DiscAnswer = {
      question_id: questions[currentQuestion].id,
      selected_option: selectedOption,
      weight: 1
    };

    const updatedAnswers = [...answers];
    const existingIndex = updatedAnswers.findIndex(a => a.question_id === newAnswer.question_id);
    
    if (existingIndex >= 0) {
      updatedAnswers[existingIndex] = newAnswer;
    } else {
      updatedAnswers.push(newAnswer);
    }

    setAnswers(updatedAnswers);

    if (isLastQuestion) {
      onComplete(updatedAnswers);
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      const prevAnswer = answers.find(a => a.question_id === questions[currentQuestion - 1].id);
      setSelectedOption(prevAnswer ? prevAnswer.selected_option : null);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      D: 'bg-red-100 text-red-800 border-red-200',
      I: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      S: 'bg-green-100 text-green-800 border-green-200',
      C: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Análise de Perfil DISC
            <Badge variant="secondary">
              {currentQuestion + 1} de {questions.length}
            </Badge>
          </CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progresso da Avaliação</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge className={getCategoryColor(questions[currentQuestion].category)}>
              Categoria {questions[currentQuestion].category}
            </Badge>
            <div className="text-sm text-muted-foreground">
              Questão {currentQuestion + 1}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {questions[currentQuestion].question}
            </h3>
            
            <RadioGroup
              value={selectedOption?.toString()}
              onValueChange={(value) => setSelectedOption(parseInt(value))}
              className="space-y-3"
            >
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={currentQuestion === 0 ? onCancel : handlePrevious}
            >
              {currentQuestion === 0 ? (
                'Cancelar'
              ) : (
                <>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </>
              )}
            </Button>

            <Button
              onClick={handleAnswer}
              disabled={!canProceed}
              className={isLastQuestion ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {isLastQuestion ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Finalizar Análise
                </>
              ) : (
                <>
                  Próxima
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-blue-800 font-medium mb-1">
                Dica para esta questão:
              </p>
              <p className="text-sm text-blue-700">
                Escolha a opção que melhor descreve seu comportamento natural, 
                não como você gostaria de ser ou como acha que deveria responder.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
