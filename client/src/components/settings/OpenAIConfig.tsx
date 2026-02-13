
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Eye, EyeOff, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { openaiService } from '@/services/openaiService';

export const OpenAIConfig: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [assistantId, setAssistantId] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Carregar configurações salvas
    const savedApiKey = localStorage.getItem('openai_api_key');
    const savedAssistantId = localStorage.getItem('openai_assistant_id');
    
    if (savedApiKey) setApiKey(savedApiKey);
    if (savedAssistantId) {
      setAssistantId(savedAssistantId);
      if (savedApiKey) {
        setIsConnected(true);
        openaiService.setConfig({
          apiKey: savedApiKey,
          assistantId: savedAssistantId
        });
      }
    }
  }, []);

  const handleSaveConfig = async () => {
    if (!apiKey.trim() || !assistantId.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha a API Key e o Assistant ID",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔧 Configurando OpenAI...', { assistantId: assistantId.trim() });
      
      // Configurar o serviço
      openaiService.setConfig({
        apiKey: apiKey.trim(),
        assistantId: assistantId.trim()
      });

      // Testar a conexão criando uma thread
      const threadId = await openaiService.createThread();
      console.log('✅ Thread de teste criada:', threadId);

      // Salvar no localStorage
      localStorage.setItem('openai_api_key', apiKey.trim());
      localStorage.setItem('openai_assistant_id', assistantId.trim());

      setIsConnected(true);
      toast({
        title: "✅ Configuração salva!",
        description: "Seu assistente OpenAI foi configurado com sucesso.",
      });

    } catch (error) {
      console.error('❌ Erro ao testar conexão OpenAI:', error);
      toast({
        title: "❌ Erro na configuração",
        description: `Verifique suas credenciais: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('openai_api_key');
    localStorage.removeItem('openai_assistant_id');
    setApiKey('');
    setAssistantId('');
    setIsConnected(false);
    
    toast({
      title: "Desconectado",
      description: "Configuração da OpenAI removida.",
    });
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Configuração OpenAI Assistant</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure seu assistente personalizado do OpenAI
              </p>
            </div>
          </div>
          {isConnected && (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Conectado
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key da OpenAI</Label>
          <div className="relative">
            <Input
              id="apiKey"
              type={showApiKey ? "text" : "password"}
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Sua API key da OpenAI (não será compartilhada)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="assistantId">Assistant ID</Label>
          <Input
            id="assistantId"
            placeholder="asst_..."
            value={assistantId}
            onChange={(e) => setAssistantId(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            O ID do seu assistente criado no OpenAI Playground
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">Como encontrar seu Assistant ID:</p>
              <p>1. Acesse o OpenAI Playground</p>
              <p>2. Selecione seu assistente</p>
              <p>3. O ID estará no formato "asst_..." na URL ou nas configurações</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleSaveConfig} 
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Testando..." : isConnected ? "Atualizar" : "Conectar"}
          </Button>
          
          {isConnected && (
            <Button 
              variant="outline" 
              onClick={handleDisconnect}
            >
              Desconectar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
