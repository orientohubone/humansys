import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CertificateTemplate } from '@shared/schema';

export const useCertificateTemplates = () => {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTemplates = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/certificate-templates');
      if (!response.ok) {
        throw new Error('Failed to fetch certificate templates');
      }
      
      const data = await response.json();
      setTemplates(data);
    } catch (error: any) {
      console.error('Error fetching certificate templates:', error);
      setError(error.message);
      setTemplates([]);
      
      // Only show toast for non-network errors
      if (!error.message?.includes('Failed to fetch')) {
        toast({
          title: "Erro",
          description: "Erro ao carregar templates de certificados",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const createTemplate = useCallback(async (templateData: any) => {
    if (!user) return false;
    
    try {
      const response = await fetch('/api/certificate-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...templateData,
          user_id: user.id,
          auto_fill_data: templateData.auto_fill_data || {}
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create certificate template');
      }
      
      await fetchTemplates();
      toast({
        title: "Sucesso",
        description: "Template de certificado criado com sucesso"
      });
      return true;
    } catch (error: any) {
      console.error('Error creating certificate template:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar template de certificado",
        variant: "destructive"
      });
      return false;
    }
  }, [user, fetchTemplates, toast]);

  const updateTemplate = useCallback(async (id: string, updates: any) => {
    try {
      const response = await fetch(`/api/certificate-templates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update certificate template');
      }
      
      await fetchTemplates();
      toast({
        title: "Sucesso",
        description: "Template de certificado atualizado com sucesso"
      });
      return true;
    } catch (error: any) {
      console.error('Error updating certificate template:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar template de certificado",
        variant: "destructive"
      });
      return false;
    }
  }, [fetchTemplates, toast]);

  const deleteTemplate = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/certificate-templates/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete certificate template');
      }
      
      await fetchTemplates();
      toast({
        title: "Sucesso",
        description: "Template de certificado removido com sucesso"
      });
      return true;
    } catch (error: any) {
      console.error('Error deleting certificate template:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover template de certificado",
        variant: "destructive"
      });
      return false;
    }
  }, [fetchTemplates, toast]);

  const generateCertificate = useCallback(async (collaboratorId: string, trainingId: string) => {
    if (!user) return false;
    
    try {
      // Fetch collaborator and template data
      const [collabResponse, templateResponse] = await Promise.all([
        fetch(`/api/collaborators/${collaboratorId}`),
        fetch('/api/certificate-templates')
      ]);
      
      if (!collabResponse.ok) {
        throw new Error('Failed to fetch collaborator data');
      }
      
      if (!templateResponse.ok) {
        throw new Error('Failed to fetch template data');
      }
      
      const collaborator = await collabResponse.json();
      const templates = await templateResponse.json();
      const template = templates[0]; // Use first template for now
      
      // Generate certificate
      const certificateData = {
        collaborator_id: collaboratorId,
        training_id: trainingId,
        certificate_data: {
          collaborator_name: collaborator.name,
          template_id: template.id,
          issued_at: new Date().toISOString()
        },
        user_id: user.id
      };
      
      const response = await fetch('/api/certificates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(certificateData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate certificate');
      }
      
      toast({
        title: "Sucesso",
        description: "Certificado gerado com sucesso"
      });
      return true;
    } catch (error: any) {
      console.error('Error generating certificate:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar certificado",
        variant: "destructive"
      });
      return false;
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      fetchTemplates();
    }
  }, [user, fetchTemplates]);

  return {
    templates,
    isLoading,
    error,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    generateCertificate
  };
};