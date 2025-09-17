
import React from 'react';
import { Icon } from './Icon';

interface ImageOutputProps {
  imageUrl: string;
  onFullscreen: () => void;
}

export const ImageOutput: React.FC<ImageOutputProps> = ({ imageUrl, onFullscreen }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `anuncio-ia-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative group aspect-square bg-gray-900 rounded-lg overflow-hidden shadow-lg">
      <img src={imageUrl} alt="Imagem de anúncio gerada" className="object-cover w-full h-full" />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center gap-4">
        <button
          onClick={onFullscreen}
          className="p-3 bg-white/20 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 hover:bg-white/30"
          title="Tela Cheia"
        >
          <Icon name="fullscreen" className="w-6 h-6" />
        </button>
        <button
          onClick={handleDownload}
          className="p-3 bg-white/20 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 hover:bg-white/30"
          title="Baixar"
        >
          <Icon name="download" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
