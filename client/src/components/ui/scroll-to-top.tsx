import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

export const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Mostrar se scroll > 300 E está descendo
      if (currentScrollY > 300 && currentScrollY > lastScrollY) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className={`transition-opacity duration-300 ${showButton ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{height: showButton ? 'auto' : '0'}}>
      {showButton && (
        <div className="flex justify-center py-4">
          <Button onClick={scrollToTop} className="gap-2">
            <ArrowUp className="h-4 w-4" />
            Voltar ao Topo
          </Button>
        </div>
      )}
    </div>
  );
};
