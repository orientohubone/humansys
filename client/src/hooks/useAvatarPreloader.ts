import { useEffect, useState } from 'react';

interface UseAvatarPreloaderProps {
  avatarUrl?: string;
  userId?: string;
}

export const useAvatarPreloader = ({ avatarUrl, userId }: UseAvatarPreloaderProps) => {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [preloadedUrl, setPreloadedUrl] = useState<string>('');

  useEffect(() => {
    if (!avatarUrl || !userId) {
      setIsPreloaded(false);
      setPreloadedUrl('');
      return;
    }

    // Só pré-carregar se for um avatar de upload
    if (avatarUrl.startsWith('/uploads/')) {
      const img = new Image();
      
      img.onload = () => {
        setIsPreloaded(true);
        setPreloadedUrl(avatarUrl);
        console.log('✅ Avatar pré-carregado com sucesso:', avatarUrl);
      };
      
      img.onerror = () => {
        setIsPreloaded(false);
        setPreloadedUrl('');
        console.log('❌ Erro ao pré-carregar avatar:', avatarUrl);
      };
      
      // Pré-carregar a imagem
      img.src = avatarUrl;
    } else {
      setPreloadedUrl(avatarUrl);
      setIsPreloaded(true);
    }
  }, [avatarUrl, userId]);

  return {
    isPreloaded,
    preloadedUrl,
    shouldShowAvatar: isPreloaded && preloadedUrl
  };
};