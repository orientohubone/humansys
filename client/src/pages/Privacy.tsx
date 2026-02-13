
import React from 'react';
import { Header } from '@/components/layout/Header';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MouseTrail } from '@/components/ui/mouse-trail';
import { Shield, Lock, Eye, Users, Linkedin, Instagram, Facebook, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Privacy = () => {
  const navigate = useNavigate();
  const { actualTheme } = useTheme();
  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl mb-4">
              Política de Privacidade
            </h1>
            <p className="text-xl text-muted-foreground">
              Última atualização: 21 de junho de 2025
            </p>
          </div>

          <div className="grid gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Compromisso com sua Privacidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A HumanSys está comprometida em proteger sua privacidade e os dados de seus colaboradores. 
                  Esta política descreve como coletamos, usamos e protegemos suas informações pessoais em 
                  conformidade com a Lei Geral de Proteção de Dados (LGPD) e regulamentações internacionais.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Informações que Coletamos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Dados Pessoais dos Colaboradores:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Nome completo, email e telefone</li>
                    <li>Cargo, departamento e data de admissão</li>
                    <li>Dados de performance e avaliações</li>
                    <li>Histórico de treinamentos e certificações</li>
                    <li>Feedbacks e pesquisas de clima organizacional</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Dados de Uso da Plataforma:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Logs de acesso e atividade na plataforma</li>
                    <li>Preferências e configurações do usuário</li>
                    <li>Dados de gamificação e engajamento</li>
                    <li>Métricas de uso das funcionalidades</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Como Usamos suas Informações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Fornecer funcionalidades da plataforma de gestão de RH</li>
                  <li>Gerar insights e analytics preditivas com IA</li>
                  <li>Personalizar a experiência de gamificação</li>
                  <li>Melhorar nossos serviços e desenvolver novas funcionalidades</li>
                  <li>Cumprir obrigações legais e regulatórias</li>
                  <li>Prevenir fraudes e garantir a segurança da plataforma</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Proteção e Segurança dos Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Medidas de Segurança:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Criptografia SSL/TLS para transmissão de dados</li>
                    <li>Criptografia AES-256 para armazenamento</li>
                    <li>Autenticação multifator (MFA)</li>
                    <li>Controle de acesso baseado em funções (RBAC)</li>
                    <li>Monitoramento contínuo de segurança</li>
                    <li>Backups regulares e plano de recuperação</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Armazenamento:</h4>
                  <p className="text-muted-foreground">
                    Todos os dados são armazenados em servidores seguros na nuvem, com infraestrutura 
                    certificada ISO 27001 e SOC 2. Mantemos os dados apenas pelo tempo necessário 
                    para cumprir nossas obrigações contratuais e legais.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seus Direitos (LGPD)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Conforme a LGPD, você tem os seguintes direitos em relação aos seus dados pessoais:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Confirmação da existência de tratamento de dados</li>
                  <li>Acesso aos dados pessoais</li>
                  <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                  <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
                  <li>Portabilidade dos dados a outro fornecedor</li>
                  <li>Eliminação dos dados pessoais tratados com consentimento</li>
                  <li>Revogação do consentimento</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Uso de IA e Analytics Preditivas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Nossa plataforma utiliza Inteligência Artificial para:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Prever tendências de turnover e identificar talentos em risco</li>
                  <li>Recomendar ações de desenvolvimento e engajamento</li>
                  <li>Personalizar a experiência de gamificação</li>
                  <li>Gerar insights automáticos sobre performance da equipe</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Todos os algoritmos são auditados regularmente para evitar viés e discriminação, 
                  e você pode solicitar explicações sobre decisões automatizadas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contato e DPO</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta política, 
                  entre em contato com nosso Encarregado de Proteção de Dados (DPO):
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-semibold">Encarregado de Proteção de Dados</p>
                  <p className="text-muted-foreground">Email: humansys.iao@proton.me</p>
                  <p className="text-muted-foreground">Telefone: (14) 3333-7323</p>
                  <p className="text-muted-foreground">Endereço: Rua Eduardo Paulo de Souza, 296 - Pompeia, SP</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas 
              através da plataforma e por email.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t py-12 sm:py-16 relative overflow-hidden">
        <MouseTrail colors={['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#3b82f6', '#22c55e', '#f97316']} particleCount={4} particleLife={80} />
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Produto</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><button onClick={() => navigate('/app/dashboard')} className="hover:text-primary text-left">Funcionalidades</button></li>
                <li><button onClick={() => navigate('/brainsys')} className="hover:text-primary text-left">BrainSys</button></li>
                <li><button onClick={() => navigate('/plans')} className="hover:text-primary text-left">Preços</button></li>
                <li><button onClick={() => navigate('/changelog')} className="hover:text-primary text-left">Novidades</button></li>
                <li><button onClick={() => navigate('/app/settings')} className="hover:text-primary text-left">Integrações</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => navigate('/about')} className="hover:text-primary text-left">Sobre</button></li>
                <li><button onClick={() => navigate('/careers')} className="hover:text-primary text-left">Carreiras</button></li>
                <li><button onClick={() => navigate('/blog')} className="hover:text-primary text-left">Blog</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => navigate('/documentation')} className="hover:text-primary text-left">Documentação</button></li>
                <li><button onClick={() => navigate('/help')} className="hover:text-primary text-left">Ajuda</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-primary text-left">Contato</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => navigate('/privacy')} className="hover:text-primary text-left">Política de Privacidade</button></li>
                <li><button onClick={() => navigate('/termsofservices')} className="hover:text-primary text-left">Termos de Uso</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 hidden md:block">
              <img src="/seloontotech.png" alt="Seloontotech Logo" className="w-32 h-auto opacity-75 hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-center flex flex-col items-center space-y-2">
              <img src={actualTheme === 'dark' ? "/Humansysbranco.png" : "/Humansys.png"} alt="Logotipo da Humansys" className="w-40 h-auto mb-2 object-contain" />
              <p className="text-muted-foreground text-sm">&copy; 2024 Humansys. Todos os direitos reservados.</p>
              <p className="text-muted-foreground text-xs">CNPJ: 61.209.173/0001-09</p>
              <div className="flex space-x-4 mt-2">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return <a key={index} href={social.href} className="text-muted-foreground hover:text-primary transition-colors" aria-label={social.label}><Icon className="h-5 w-5" /></a>;
                })}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};