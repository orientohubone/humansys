
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const FeedbackDialog = () => {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState({
    recipient: '',
    subject: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSendFeedback = () => {
    if (!feedback.recipient || !feedback.subject || !feedback.message) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    // Salvar feedback no localStorage
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    const newFeedback = {
      id: Date.now().toString(),
      ...feedback,
      date: new Date().toISOString(),
      status: 'sent'
    };
    feedbacks.push(newFeedback);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

    setFeedback({ recipient: '', subject: '', message: '' });
    setOpen(false);
    
    toast({
      title: "Feedback enviado",
      description: "Seu feedback foi enviado com sucesso.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="justify-start h-auto p-4">
          <MessageSquare className="mr-2 h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">Enviar Feedback</div>
            <div className="text-xs text-muted-foreground">Avaliação de performance</div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar Feedback</DialogTitle>
          <DialogDescription>
            Envie um feedback construtivo para um colaborador
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="recipient">Destinatário</Label>
            <Input 
              id="recipient" 
              placeholder="Digite o nome do colaborador"
              value={feedback.recipient}
              onChange={(e) => setFeedback({...feedback, recipient: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">Assunto</Label>
            <Input 
              id="subject" 
              placeholder="Digite o assunto do feedback"
              value={feedback.subject}
              onChange={(e) => setFeedback({...feedback, subject: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea 
              id="message" 
              placeholder="Digite sua mensagem..."
              value={feedback.message}
              onChange={(e) => setFeedback({...feedback, message: e.target.value})}
              rows={4}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSendFeedback}>
            Enviar Feedback
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
