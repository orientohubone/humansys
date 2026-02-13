import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Document {
  id: string;
  title: string;
  description?: string;
  category: string;
  version: string;
  file_url?: string;
  file_size?: number;
  pages?: number;
  access_level: 'all' | 'managers' | 'admin';
  download_count: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDocumentData {
  title: string;
  description?: string;
  category: string;
  version?: string;
  file_url?: string;
  file_size?: number;
  pages?: number;
  access_level?: 'all' | 'managers' | 'admin';
}

export const useDocuments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/documents?userId=${encodeURIComponent(user.id)}`);
      
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.map((item: any) => ({
          ...item,
          download_count: item.download_count || 0
        })));
      } else {
        console.error('Failed to fetch documents');
        setDocuments([]);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createDocument = async (documentData: CreateDocumentData) => {
    if (!user?.id) return false;

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...documentData,
          user_id: user.id,
          version: documentData.version || '1.0',
          access_level: documentData.access_level || 'all'
        })
      });

      if (!response.ok) throw new Error('Failed to create document');

      toast({
        title: "Sucesso",
        description: "Documento criado com sucesso!"
      });

      await fetchDocuments();
      return true;

    } catch (error) {
      console.error('Error creating document:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o documento. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateDocument = async (id: string, updates: Partial<CreateDocumentData>) => {
    if (!user?.id) return false;

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update document');

      toast({
        title: "Sucesso",
        description: "Documento atualizado com sucesso!"
      });

      await fetchDocuments();
      return true;

    } catch (error) {
      console.error('Error updating document:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o documento. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteDocument = async (id: string) => {
    if (!user?.id) return false;

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete document');

      toast({
        title: "Sucesso",
        description: "Documento excluído com sucesso!"
      });

      await fetchDocuments();
      return true;

    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o documento. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  const downloadDocument = async (id: string) => {
    if (!user?.id) return false;

    try {
      // In a real app, this would handle file download
      // For now, just increment download count
      const document = documents.find(doc => doc.id === id);
      if (document) {
        await updateDocument(id, { 
          title: document.title // Keep existing data, just trigger update
        });
      }
      return true;
    } catch (error) {
      console.error('Error downloading document:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchDocuments();
    }
  }, [user?.id, fetchDocuments]);

  return {
    documents,
    loading,
    createDocument,
    updateDocument,
    deleteDocument,
    downloadDocument,
    fetchDocuments,
    refetch: fetchDocuments
  };
};