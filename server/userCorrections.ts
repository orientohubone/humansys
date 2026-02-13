import { storage } from './storage';

// Sistema de correção para isolamento multi-tenant e trial adequado
export class UserCorrections {
  
  // Corrige o isolamento de usuários criando tenant_id único para cada usuário
  static async fixUserIsolation() {
    console.log('🔧 Iniciando correção de isolamento de usuários...');
    
    try {
      const allUsers = await storage.getAllUsers();
      
      for (const user of allUsers) {
        // Se o usuário não tem tenant_id, criar um baseado no próprio ID
        if (!user.tenant_id) {
          const updates = {
            tenant_id: user.id, // Cada usuário é seu próprio tenant
            is_founder: user.role === 'founder',
            email_verified: false, // Reset para forçar verificação
            email_verification_token: Math.random().toString(36).substring(2) + Date.now().toString(36)
          };
          
          await storage.updateUser(user.id, updates);
          console.log(`✅ Usuário ${user.email} atualizado com tenant isolado`);
        }
      }
      
      console.log('✅ Correção de isolamento concluída');
    } catch (error) {
      console.error('❌ Erro na correção de isolamento:', error);
    }
  }
  
  // Corrige o sistema de trial para novos usuários
  static async fixTrialSystem() {
    console.log('🔧 Iniciando correção do sistema de trial...');
    
    try {
      const allUsers = await storage.getAllUsers();
      
      for (const user of allUsers) {
        // Se não tem trial_ends_at definido, definir para 30 dias a partir de hoje
        if (!user.trial_ends_at && user.plan_type === 'trial') {
          const trialEndDate = new Date();
          trialEndDate.setDate(trialEndDate.getDate() + 30);
          
          const updates = {
            trial_ends_at: trialEndDate,
            plan_type: 'trial',
            total_credits: 1000,
            used_credits: 0,
            remaining_credits: 1000
          };
          
          await storage.updateUser(user.id, updates);
          console.log(`✅ Trial configurado para ${user.email} até ${trialEndDate.toLocaleDateString()}`);
        }
      }
      
      console.log('✅ Correção de trial concluída');
    } catch (error) {
      console.error('❌ Erro na correção de trial:', error);
    }
  }
  
  // Limpa colaboradores que não pertencem ao tenant do usuário
  static async fixCollaboratorIsolation() {
    console.log('🔧 Iniciando correção de isolamento de colaboradores...');
    
    try {
      const allCollaborators = await storage.getAllCollaborators();
      
      for (const collaborator of allCollaborators) {
        const user = await storage.getUser(collaborator.user_id);
        if (user && user.tenant_id) {
          // Atualizar colaborador com tenant_id do usuário proprietário
          if (!collaborator.tenant_id || collaborator.tenant_id !== user.tenant_id) {
            await storage.updateCollaborator(collaborator.id, {
              tenant_id: user.tenant_id
            });
            console.log(`✅ Colaborador ${collaborator.name} isolado no tenant ${user.tenant_id}`);
          }
        }
      }
      
      console.log('✅ Correção de colaboradores concluída');
    } catch (error) {
      console.error('❌ Erro na correção de colaboradores:', error);
    }
  }
  
  // Executa todas as correções
  static async runAllCorrections() {
    console.log('🚀 Iniciando correções do sistema multi-tenant...');
    
    await this.fixUserIsolation();
    await this.fixTrialSystem();
    await this.fixCollaboratorIsolation();
    
    console.log('✅ Todas as correções concluídas!');
  }
  
  // Verifica se um usuário está em trial válido
  static isTrialValid(user: any): boolean {
    if (!user.trial_ends_at) return false;
    
    const now = new Date();
    const trialEnd = new Date(user.trial_ends_at);
    return now < trialEnd;
  }
  
  // Calcula dias restantes do trial
  static getTrialDaysRemaining(user: any): number {
    if (!user.trial_ends_at) return 0;
    
    const now = new Date();
    const trialEnd = new Date(user.trial_ends_at);
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }
}

// Exportação da função para uso no server/index.ts
export const runUserCorrections = async () => {
  await UserCorrections.runAllCorrections();
};