import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Send, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface AdvancedFeedbackDialogProps {
  collaboratorId?: string;
  collaboratorName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

export const AdvancedFeedbackDialog = ({ 
  collaboratorId, 
  collaboratorName, 
  open, 
  onOpenChange, 
  onClose 
}: AdvancedFeedbackDialogProps) => {
  const [collaborators] = useLocalStorage('collaborators', []);
  const [feedbacks, setFeedbacks] = useLocalStorage('feedbacks', []);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    recipientId: collaboratorId || '',
    subject: '',
    message: '',
    type: 'performance',
    rating: 0,
    notificationMethod: 'email',
    sendEmail: true,
    sendNotification: false,
    anonymous: false,
    urgent: false
  });

  const feedbackTypes = [
    { value: 'performance', label: 'Avaliação de Performance' },
    { value: '360', label: 'Feedback 360°' },
    { value: 'peer', label: 'Feedback entre Pares' },
    { value: 'recognition', label: 'Reconhecimento' },
    { value: 'improvement', label: 'Área de Melhoria' }
  ];

  const handleRatingClick = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  const handleSendFeedback = () => {
    const recipientId = formData.recipientId || collaboratorId;
    
    if (!recipientId || !formData.subject || !formData.message) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const recipient = collaborators.find((c: any) => c.id === recipientId) || 
                     { name: collaboratorName, email: 'email@exemplo.com' };
    
    const newFeedback = {
      id: Date.now().toString(),
      fromUser: 'Você',
      toUser: recipient?.name || 'Colaborador',
      toEmail: recipient?.email || '',
      type: formData.type,
      subject: formData.subject,
      content: formData.message,
      rating: formData.rating || undefined,
      status: 'sent',
      createdDate: new Date().toISOString(),
      anonymous: formData.anonymous,
      urgent: formData.urgent,
      notificationMethod: formData.notificationMethod,
      sendEmail: formData.sendEmail,
      sendNotification: formData.sendNotification
    };

    setFeedbacks([...feedbacks, newFeedback]);

    // Simular envio baseado nas opções selecionadas
    if (formData.sendEmail && recipient?.email) {
      toast({
        title: "Email enviado",
        description: `Feedback enviado para ${recipient.email}`,
      });
    }

    if (formData.sendNotification) {
      toast({
        title: "Notificação enviada",
        description: "Notificação interna enviada ao colaborador",
      });
    }

    // Reset form
    setFormData({
      recipientId: collaboratorId || '',
      subject: '',
      message: '',
      type: 'performance',
      rating: 0,
      notificationMethod: 'email',
      sendEmail: true,
      sendNotification: false,
      anonymous: false,
      urgent: false
    });

    if (onOpenChange) onOpenChange(false);
    if (onClose) onClose();

    toast({
      title: "Feedback enviado com sucesso",
      description: `Feedback ${formData.type} enviado para ${recipient?.name}`,
    });
  };

  // Se não há controle de dialog externo, usar um dialog interno
  if (open !== undefined && onOpenChange) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Enviar Feedback Avançado</DialogTitle>
            <DialogDescription>
              Configure todas as opções de envio e notificação
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {/* Destinatário */}
            {!collaboratorId && (
              <div className="grid gap-2">
                <Label>Destinatário *</Label>
                <Select 
                  value={formData.recipientId} 
                  onValueChange={(value) => setFormData({...formData, recipientId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um colaborador" />
                  </SelectTrigger>
                  <SelectContent>
                    {collaborators.map((collaborator: any) => (
                      <SelectItem key={collaborator.id} value={collaborator.id}>
                        {collaborator.name} - {collaborator.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {collaboratorName && (
              <div className="grid gap-2">
                <Label>Destinatário</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <span className="font-medium">{collaboratorName}</span>
                </div>
              </div>
            )}

            {/* Tipo de Feedback */}
            <div className="grid gap-2">
              <Label>Tipo de Feedback</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData({...formData, type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {feedbackTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Assunto */}
            <div className="grid gap-2">
              <Label htmlFor="subject">Assunto *</Label>
              <Input 
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                placeholder="Digite o assunto do feedback"
              />
            </div>

            {/* Avaliação com Estrelas */}
            <div className="grid gap-2">
              <Label>Avaliação (opcional)</Label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className="p-1"
                  >
                    <Star 
                      className={`h-6 w-6 ${
                        star <= formData.rating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  </button>
                ))}
                {formData.rating > 0 && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    {formData.rating}/5
                  </span>
                )}
              </div>
            </div>

            {/* Mensagem */}
            <div className="grid gap-2">
              <Label htmlFor="message">Mensagem *</Label>
              <Textarea 
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Digite seu feedback detalhado..."
                rows={4}
              />
            </div>

            {/* Método de Notificação */}
            <div className="grid gap-3">
              <Label>Método de Notificação</Label>
              <RadioGroup 
                value={formData.notificationMethod} 
                onValueChange={(value) => setFormData({...formData, notificationMethod: value})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email" />
                  <Label htmlFor="email">Apenas Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="notification" id="notification" />
                  <Label htmlFor="notification">Apenas Notificação Interna</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both">Email + Notificação</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Opções Adicionais */}
            <div className="grid gap-3">
              <Label>Opções Adicionais</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sendEmail"
                    checked={formData.sendEmail}
                    onCheckedChange={(checked) => setFormData({...formData, sendEmail: !!checked})}
                  />
                  <Label htmlFor="sendEmail">Enviar por email</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sendNotification"
                    checked={formData.sendNotification}
                    onCheckedChange={(checked) => setFormData({...formData, sendNotification: !!checked})}
                  />
                  <Label htmlFor="sendNotification">Enviar notificação interna</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="anonymous"
                    checked={formData.anonymous}
                    onCheckedChange={(checked) => setFormData({...formData, anonymous: !!checked})}
                  />
                  <Label htmlFor="anonymous">Feedback anônimo</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="urgent"
                    checked={formData.urgent}
                    onCheckedChange={(checked) => setFormData({...formData, urgent: !!checked})}
                  />
                  <Label htmlFor="urgent">Marcar como urgente</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSendFeedback}>
              <Send className="mr-2 h-4 w-4" />
              Enviar Feedback
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Modo sem dialog wrapper (usado quando já está dentro de um Dialog)
  return (
    <div className="grid gap-6 py-4">
      {/* Destinatário */}
      {!collaboratorId && (
        <div className="grid gap-2">
          <Label>Destinatário *</Label>
          <Select 
            value={formData.recipientId} 
            onValueChange={(value) => setFormData({...formData, recipientId: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um colaborador" />
            </SelectTrigger>
            <SelectContent>
              {collaborators.map((collaborator: any) => (
                <SelectItem key={collaborator.id} value={collaborator.id}>
                  {collaborator.name} - {collaborator.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {collaboratorName && (
        <div className="grid gap-2">
          <Label>Destinatário</Label>
          <div className="p-3 bg-muted rounded-lg">
            <span className="font-medium">{collaboratorName}</span>
          </div>
        </div>
      )}

      {/* Tipo de Feedback */}
      <div className="grid gap-2">
        <Label>Tipo de Feedback</Label>
        <Select 
          value={formData.type} 
          onValueChange={(value) => setFormData({...formData, type: value})}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {feedbackTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Assunto */}
      <div className="grid gap-2">
        <Label htmlFor="subject">Assunto *</Label>
        <Input 
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({...formData, subject: e.target.value})}
          placeholder="Digite o assunto do feedback"
        />
      </div>

      {/* Avaliação com Estrelas */}
      <div className="grid gap-2">
        <Label>Avaliação (opcional)</Label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(star)}
              className="p-1"
            >
              <Star 
                className={`h-6 w-6 ${
                  star <= formData.rating 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300'
                }`} 
              />
            </button>
          ))}
          {formData.rating > 0 && (
            <span className="ml-2 text-sm text-muted-foreground">
              {formData.rating}/5
            </span>
          )}
        </div>
      </div>

      {/* Mensagem */}
      <div className="grid gap-2">
        <Label htmlFor="message">Mensagem *</Label>
        <Textarea 
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          placeholder="Digite seu feedback detalhado..."
          rows={4}
        />
      </div>

      {/* Método de Notificação */}
      <div className="grid gap-3">
        <Label>Método de Notificação</Label>
        <RadioGroup 
          value={formData.notificationMethod} 
          onValueChange={(value) => setFormData({...formData, notificationMethod: value})}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="email" />
            <Label htmlFor="email">Apenas Email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="notification" id="notification" />
            <Label htmlFor="notification">Apenas Notificação Interna</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="both" />
            <Label htmlFor="both">Email + Notificação</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Opções Adicionais */}
      <div className="grid gap-3">
        <Label>Opções Adicionais</Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="sendEmail"
              checked={formData.sendEmail}
              onCheckedChange={(checked) => setFormData({...formData, sendEmail: !!checked})}
            />
            <Label htmlFor="sendEmail">Enviar por email</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="sendNotification"
              checked={formData.sendNotification}
              onCheckedChange={(checked) => setFormData({...formData, sendNotification: !!checked})}
            />
            <Label htmlFor="sendNotification">Enviar notificação interna</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="anonymous"
              checked={formData.anonymous}
              onCheckedChange={(checked) => setFormData({...formData, anonymous: !!checked})}
            />
            <Label htmlFor="anonymous">Feedback anônimo</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="urgent"
              checked={formData.urgent}
              onCheckedChange={(checked) => setFormData({...formData, urgent: !!checked})}
            />
            <Label htmlFor="urgent">Marcar como urgente</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSendFeedback}>
          <Send className="mr-2 h-4 w-4" />
          Enviar Feedback
        </Button>
      </div>
    </div>
  );
};
