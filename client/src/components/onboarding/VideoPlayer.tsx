import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize, CheckCircle } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  title: string;
  onComplete?: () => void;
  autoMarkComplete?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  title,
  onComplete,
  autoMarkComplete = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  const getVideoEmbedUrl = (url: string) => {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('/').pop()?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
    }

    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }

    // Direct video URL
    return url;
  };

  const handleVideoEnd = () => {
    setIsCompleted(true);
    setProgress(100);
    if (autoMarkComplete && onComplete) {
      onComplete();
    }
  };

  const handleMarkComplete = () => {
    setIsCompleted(true);
    if (onComplete) {
      onComplete();
    }
  };

  const isEmbedVideo = url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{title}</h3>
            {isCompleted && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Concluído</span>
              </div>
            )}
          </div>

          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {isEmbedVideo ? (
              <iframe
                src={getVideoEmbedUrl(url)}
                title={title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => {
                  // Simular progresso para vídeos embarcados
                  if (autoMarkComplete) {
                    setTimeout(() => handleVideoEnd(), 10000); // Mock completion after 10s
                  }
                }}
              />
            ) : (
              <video
                className="w-full h-full object-cover"
                controls
                onEnded={handleVideoEnd}
                onTimeUpdate={(e) => {
                  const video = e.target as HTMLVideoElement;
                  const progress = (video.currentTime / video.duration) * 100;
                  setProgress(progress);
                }}
              >
                <source src={url} type="video/mp4" />
                Seu navegador não suporta o elemento de vídeo.
              </video>
            )}

            {!isEmbedVideo && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/50 rounded-lg p-2">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>

                    <div className="flex-1 bg-white/20 rounded-full h-1">
                      <div 
                        className="bg-white h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!isCompleted && !autoMarkComplete && (
            <div className="flex justify-center">
              <Button onClick={handleMarkComplete} className="w-full sm:w-auto">
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar como Assistido
              </Button>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            {isCompleted ? (
              <span className="text-green-600 font-medium">✓ Vídeo assistido com sucesso</span>
            ) : (
              <span>Assista ao vídeo para continuar o onboarding</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};