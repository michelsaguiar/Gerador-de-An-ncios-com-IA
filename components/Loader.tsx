
import React from 'react';
import { Icon } from './Icon';

const messages = [
  "Consultando a musa da criatividade...",
  "Misturando pixels e possibilidades...",
  "Ensinando a IA sobre o seu produto...",
  "Ajustando a iluminação virtual...",
  "Gerando uma obra-prima de marketing...",
  "Polindo os detalhes finais...",
];

export const Loader: React.FC = () => {
  const [message, setMessage] = React.useState(messages[0]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = messages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-900/50 rounded-lg h-full">
        <Icon name="sparkles" className="w-16 h-16 text-purple-400 animate-pulse mb-6" />
        <h3 className="text-xl font-semibold text-white mb-2">Criando suas imagens...</h3>
        <p className="text-gray-300 transition-opacity duration-500 ease-in-out">{message}</p>
    </div>
  );
};
