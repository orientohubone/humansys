import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  MessageSquare, 
  Send, 
  Minimize2, 
  Maximize2,
  Sparkles,
  Users,
  Target,
  Crown,
  Zap,
  Phone,
  Mail,
  ArrowRight,
  Heart,
  Activity,
  Network
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export const BrainBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [livingPulse, setLivingPulse] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simula o "pulso" da inteligência viva
  useEffect(() => {
    const interval = setInterval(() => {
      setLivingPulse(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Auto scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mensagem inicial do bot
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addBotMessage(
          "👋 Olá! Eu sou o Brain, sua inteligência viva da Humansys!\n\nEstou aqui para ajudar você a descobrir como nossa plataforma pode transformar a gestão de RH da sua empresa. Como posso ajudar você hoje?",
          [
            "Ver funcionalidades principais",
            "Conhecer preços e planos", 
            "Agendar demonstração",
            "Falar com especialista"
          ]
        );
      }, 500);
    }
  }, [isOpen]);

  const addBotMessage = (content: string, suggestions?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content,
      timestamp: new Date(),
      suggestions
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    addUserMessage(inputValue);
    setInputValue('');
    setIsTyping(true);

    // Simula processamento do bot
    setTimeout(() => {
      const response = generateBotResponse(inputValue.toLowerCase());
      setIsTyping(false);
      addBotMessage(response.content, response.suggestions);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Verificar se é uma ação de redirecionamento
    if (suggestion.toLowerCase().includes('whatsapp') || 
        suggestion.toLowerCase().includes('agendar agora') ||
        suggestion === 'Abrir WhatsApp agora') {
      const whatsappNumber = '551433337323'; // Número sem caracteres especiais
      const message = encodeURIComponent('Olá! Vim através do site da Humansys e gostaria de conversar com um especialista sobre a plataforma.');
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
      window.open(whatsappUrl, '_blank');
      return;
    }

    if (suggestion === 'Falar com especialista' || 
        suggestion === 'Falar com consultor' ||
        suggestion === 'Quero falar com founder') {
      const whatsappNumber = '551433337323';
      const message = encodeURIComponent('Olá! Gostaria de falar com um especialista da Humansys sobre a plataforma.');
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
      window.open(whatsappUrl, '_blank');
      return;
    }

    if (suggestion === 'Copiar número') {
      navigator.clipboard.writeText('+55 (14) 3333-7323').then(() => {
        addBotMessage("📱 Número copiado! +55 (14) 3333-7323\n\nAgora é só colar no seu WhatsApp e iniciar a conversa!");
      });
      return;
    }

    if (suggestion === 'Enviar email') {
      const emailUrl = 'mailto:humansys.iao@proton.me?subject=Interesse na plataforma Humansys&body=Olá! Gostaria de conhecer mais sobre a plataforma Humansys.';
      window.open(emailUrl, '_blank');
      return;
    }

    // Comportamento normal para outras sugestões
    addUserMessage(suggestion);
    setIsTyping(true);

    setTimeout(() => {
      const response = generateBotResponse(suggestion.toLowerCase());
      setIsTyping(false);
      addBotMessage(response.content, response.suggestions);
    }, 1500);
  };

  const generateBotResponse = (input: string) => {
    if (input.includes('funcionalidades') || input.includes('recursos')) {
      return {
        content: "🚀 A Humansys oferece um ecossistema completo de RH com IA:\n\n🧠 **BrainSys IAO** - Inteligência que prevê turnover com 85% de precisão\n👑 **Founder Dashboard** - Métricas SaaS em tempo real (MRR, Churn, LTV/CAC)\n🎮 **Gamificação Completa** - Sistema de badges e ranking\n📊 **Analytics Avançados** - Insights automáticos com ML\n🎯 **Gestão de Metas & PDI** - Desenvolvimento estruturado\n📹 **Treinamentos Interativos** - Plataforma completa com certificação\n\nQual área te interessa mais?",
        suggestions: [
          "Como funciona a IA preditiva?",
          "Quero ver o Founder Dashboard",
          "Gamificação aumenta engajamento?",
          "Agendar demonstração completa"
        ]
      };
    }

    if (input.includes('preços') || input.includes('planos') || input.includes('valores')) {
      return {
        content: "💎 **Planos Humansys** - Transforme seu RH hoje:\n\n🌱 **Inicial** - R$ 127/mês\n• 15 colaboradores\n• Dashboard principal\n• Treinamentos básicos\n\n🚀 **Em Crescimento** - R$ 247/mês ⭐ *Mais Popular*\n• 75 colaboradores\n• IA DISC + Analytics\n• Gamificação completa\n\n👑 **Profissional** - R$ 497/mês\n• 500 colaboradores\n• BrainSys IAO completo\n• Founder Dashboard Premium\n• API + White Label\n\n✨ **30 dias grátis** para testar tudo!",
        suggestions: [
          "Teste grátis 30 dias",
          "Qual plano é melhor para mim?",
          "Posso personalizar recursos?",
          "Falar com consultor"
        ]
      };
    }

    if (input.includes('demonstração') || input.includes('demo') || input.includes('apresentação')) {
      return {
        content: "📅 **Demonstração Personalizada**\n\nAdoro sua iniciativa! Nossa equipe de especialistas pode mostrar como a Humansys vai revolucionar seu RH.\n\n✨ **O que você verá:**\n• IA preditiva funcionando ao vivo\n• Founder Dashboard com seus dados\n• Simulação de ROI personalizada\n• Implementação sem fricção\n\n📞 **Contato direto:**\n• WhatsApp: +55 (14) 3333-7323\n• Email: humansys.iao@proton.me\n\nOu posso direcionar você agora mesmo!",
        suggestions: [
          "Agendar agora no WhatsApp", 
          "Enviar email para agendar",
          "Falar com especialista",
          "Quero falar com founder"
        ]
      };
    }

    if (input.includes('whatsapp') || input.includes('telefone') || input.includes('contato')) {
      return {
        content: "📱 **Fale Conosco Agora!**\n\nNosso time está online e pronto para atender:\n\n💬 **WhatsApp Business:** +55 (14) 3333-7323\n📧 **Email Principal:** humansys.iao@proton.me\n📍 **Localização:** Pompeia, SP - Brasil\n⏰ **Horário:** Seg-Sex 8h às 18h\n\n🎯 **Resposta garantida em até 2 horas!**\n\nClique no botão abaixo para ser direcionado:",
        suggestions: [
          "Abrir WhatsApp agora",
          "Copiar número", 
          "Enviar email",
          "Falar com especialista"
        ]
      };
    }

    if (input.includes('ia') || input.includes('inteligência') || input.includes('preditiva')) {
      return {
        content: "🧠 **BrainSys IAO - Inteligência Que Transforma**\n\nNossa IA não apenas processa dados, ela *entende* pessoas:\n\n🎯 **85% de precisão** na previsão de turnover\n🔄 **Aprende continuamente** com comportamentos\n💡 **Insights automáticos** sobre clima organizacional\n📈 **Otimiza alocação** de talentos\n🌟 **Detecta potenciais** ocultos\n\n**Exemplo real:** Cliente TechCorp evitou perder 12 talentos-chave usando nossos alertas preditivos, economizando R$ 180mil em recontratações.\n\nQuer ver funcionando?",
        suggestions: [
          "Agendar demo da IA",
          "Ver casos de sucesso",
          "Como implementar na empresa?",
          "Integra com nossos sistemas?"
        ]
      };
    }

    // Resposta padrão
    return {
      content: "🤔 Entendi sua pergunta! Como sua inteligência assistente, posso ajudar com:\n\n✨ **Recursos da plataforma**\n💰 **Informações sobre planos**\n📅 **Agendamento de demonstrações**\n📞 **Contato com especialistas**\n🎯 **Cases de sucesso**\n⚡ **Implementação rápida**\n\nSobre o que gostaria de saber mais?",
      suggestions: [
        "Ver todas as funcionalidades",
        "Preços e planos",
        "Agendar demonstração",
        "Cases de sucesso"
      ]
    };
  };

  if (!isOpen) {
    return (

      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-transparent hover:bg-transparent border-none p-0 shadow-none hover:shadow-none transition-all duration-300 group relative"
          style={{
            width: 'auto',
            height: 'auto'
          }}
        >
          {/* Logo como botão principal */}
          <img 
            src="/brainsys1.png" 
            alt="BrainSys IAO" 
            className="w-14 h-14 object-contain cursor-pointer hover:scale-110 transition-transform duration-300"
            style={{ 
              transform: `scale(${1 + Math.sin(livingPulse * 0.08) * 0.08})`,
              filter: 'drop-shadow(0 4px 10px rgba(168, 85, 247, 0.4)) drop-shadow(0 0 20px rgba(168, 85, 247, 0.3))'
            }} 
          />

          {/* Indicadores de status */}
          <div className="absolute -top-1 -right-1 flex space-x-1">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
            <Heart className="h-3 w-3 text-white animate-pulse" />
          </div>
        </Button>

        {/* Tooltip */}
        <div className="absolute bottom-20 right-0 bg-white p-3 rounded-lg shadow-lg border-2 border-purple-200 min-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="flex items-center space-x-2 mb-1">
            <Brain className="h-4 w-4 text-purple-600" />
            <span className="font-semibold text-purple-800">Brain Assistant</span>
            <Badge className="bg-green-500 text-white text-xs">Online</Badge>
          </div>
          <p className="text-xs text-gray-600">Clique para conversar comigo!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`transition-all duration-300 border-2 border-purple-200 shadow-2xl ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src="/brainsys1.png" 
                alt="BrainSys IAO" 
                className="w-10 h-10 object-contain"
                style={{ 
                  transform: `scale(${1 + Math.sin(livingPulse * 0.1) * 0.05})`,
                  transition: 'transform 0.1s ease-in-out',
                  filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))'
                }} 
              />
              <div className="absolute -top-1 -right-1 flex space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              </div>
            </div>
            <div>
              <h3 className="font-bold">Brain Assistant</h3>
              <div className="flex items-center space-x-2 text-xs">
                <div className="flex items-center gap-1">
                  <Activity className="h-3 w-3 text-green-400" />
                  <span>Online</span>
                </div>
                <div className="flex items-center gap-1">
                  <Network className="h-3 w-3 text-blue-400" />
                  <span>Inteligência Viva</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-white/20"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              ×
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 h-[440px] overflow-y-auto bg-gradient-to-br from-gray-50 to-purple-50">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-purple-600 text-white ml-4' 
                      : 'bg-white border border-purple-200 mr-4 shadow-sm'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.suggestions && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="w-full text-left justify-start text-xs border-purple-200 hover:bg-purple-50"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <ArrowRight className="h-3 w-3 mr-1" />
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-purple-200 p-3 rounded-lg mr-4 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <Brain className="h-4 w-4 text-purple-600 animate-pulse" />
                      <span className="text-sm text-purple-600">Brain está digitando...</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 border-purple-200 focus:border-purple-400"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};