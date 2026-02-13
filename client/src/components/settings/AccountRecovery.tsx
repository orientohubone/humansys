
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

import { Mail, RefreshCw, CheckCircle } from 'lucide-react';

export const AccountRecovery = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('amanda@vendasimples.com.br');
  const [isLoading, setIsLoading] = useState(false);

  const handleRecovery = async () => {
    setIsLoading(true);
    try {
      // Primeiro, tentar resetar a senha

        redirectTo: `${window.location.origin}/login`,
      });

      if (resetError && !resetError.message.includes('User not found')) {
        throw resetError;
      }

      // Se o usuário não existir, vamos verificar na tabela de colaboradores


      if (collaboratorData) {
        toast({
          title: "Usuário encontrado",
          description: `O usuário ${email} existe na base de colaboradores. Um email de reset será enviado.`,
        });
      } else {
        toast({
          title: "Email de recuperação enviado",
          description: `Se o email ${email} estiver cadastrado, você receberá um link para redefinir sua senha.`,
        });
      }
    } catch (error: any) {
      console.error('Recovery error:', error);
      toast({
        title: "Erro na recuperação",
        description: error.message || "Não foi possível processar a recuperação.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Recuperação de Conta
        </CardTitle>
        <CardDescription>
          Digite o email para enviar um link de recuperação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Esta ferramenta ajuda a recuperar contas existentes ou resetar senhas.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="recovery-email">Email para recuperação</Label>
          <Input
            id="recovery-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite o email da conta"
          />
        </div>

        <Button 
          onClick={handleRecovery}
          disabled={isLoading || !email}
          className="w-full"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Mail className="h-4 w-4 mr-2" />
          )}
          Enviar Link de Recuperação
        </Button>

        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Se a conta existir, você receberá um email com instruções</p>
          <p>• Verifique sua caixa de spam se não receber o email</p>
          <p>• O link de recuperação expira em 1 hora</p>
        </div>
      </CardContent>
    </Card>
  );
};
