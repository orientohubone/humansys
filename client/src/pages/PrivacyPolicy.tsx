
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, Users } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />
      
      <div className="container py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl mb-4">
              Política de Privacidade
            </h1>
            <p className="text-xl text-muted-foreground">
              Última atualização: 1º de dezembro de 2024
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
                  <p className="text-muted-foreground">Email: dpo@humansys.com.br</p>
                  <p className="text-muted-foreground">Telefone: (11) 9999-9999</p>
                  <p className="text-muted-foreground">Endereço: Rua Exemplo, 123 - São Paulo, SP</p>
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
    </div>
  );
};
