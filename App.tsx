
import React, { useState } from 'react';
import { AdCreativeRequest, AspectRatio } from './types';
import { generateAdImages } from './services/geminiService';
import { ImageUploader } from './components/ImageUploader';
import { ImageOutput } from './components/ImageOutput';
import { Modal } from './components/Modal';
import { Loader } from './components/Loader';
import { Icon } from './components/Icon';

const Label: React.FC<{ htmlFor: string, children: React.ReactNode }> = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block mb-2 text-sm font-medium text-gray-300">{children}</label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className={`bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 placeholder-gray-400 ${props.className}`} />
);

const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
     <textarea {...props} rows={3} className={`bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 placeholder-gray-400 ${props.className}`}></textarea>
);


function App() {
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);
  const [keywords, setKeywords] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [description, setDescription] = useState('');
  const [includePeople, setIncludePeople] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    setReferenceImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setReferenceImagePreview(null);
    }
  };

  const isFormValid = referenceImage && keywords && targetAudience && description;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
        setError("Por favor, preencha todos os campos e envie uma imagem.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    const request: AdCreativeRequest = {
      referenceImage,
      keywords,
      targetAudience,
      description,
      includePeople,
      aspectRatio,
    };

    try {
      const images = await generateAdImages(request);
      const formattedImages = images.map(img => `data:image/png;base64,${img}`);
      setGeneratedImages(formattedImages);
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao gerar as imagens. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        <header className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-2">
                <Icon name="sparkles" className="w-8 h-8 text-purple-400"/>
                <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  Gerador de Anúncios com IA
                </h1>
            </div>
          <p className="text-lg text-gray-400">Transforme a foto do seu produto em um anúncio profissional</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna do Formulário */}
          <div className="bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="image-upload">1. Foto do Produto de Referência</Label>
                <ImageUploader onFileChange={handleFileChange} preview={referenceImagePreview} />
              </div>
              
              <div>
                <Label htmlFor="keywords">2. Palavras-chave (separadas por vírgula)</Label>
                <Input id="keywords" type="text" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="Ex: moderno, minimalista, natureza" />
              </div>

              <div>
                <Label htmlFor="targetAudience">3. Público Alvo</Label>
                <Input id="targetAudience" type="text" value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder="Ex: jovens adultos, atletas, amantes de café" />
              </div>

              <div>
                <Label htmlFor="description">4. Breve Descrição do Anúncio</Label>
                <TextArea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Ex: Um anúncio mostrando o produto em uma cozinha ensolarada" />
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <Label htmlFor="aspectRatio">5. Formato da Saída</Label>
                  <div className="grid grid-cols-3 gap-2">
                      {(['1:1', '16:9', '9:16'] as AspectRatio[]).map(ratio => (
                          <button key={ratio} type="button" onClick={() => setAspectRatio(ratio)} className={`py-2 px-4 rounded-md text-sm font-semibold transition-colors ${aspectRatio === ratio ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                              {ratio}
                          </button>
                      ))}
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-start sm:justify-center pt-4 sm:pt-0">
                  <div className="relative flex items-center">
                      <input type="checkbox" id="includePeople" checked={includePeople} onChange={e => setIncludePeople(e.target.checked)} className="peer shrink-0 appearance-none w-12 h-6 rounded-full bg-gray-600 checked:bg-purple-600 transition-colors cursor-pointer" />
                      <span className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-white peer-checked:translate-x-6 transition-transform"></span>
                      <label htmlFor="includePeople" className="ml-3 text-sm font-medium text-gray-300 cursor-pointer">Incluir pessoas</label>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={!isFormValid || isLoading} className="w-full inline-flex justify-center items-center gap-2 text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-3 text-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
                {isLoading ? 'Gerando...' : 'Gerar Imagens'}
                {!isLoading && <Icon name="sparkles" className="w-5 h-5" />}
              </button>

              {error && <p className="text-sm text-red-400 text-center mt-2">{error}</p>}
            </form>
          </div>

          {/* Coluna de Saída */}
          <div className="bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-gray-700 min-h-[500px] flex items-center justify-center">
            {isLoading ? (
              <Loader />
            ) : generatedImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 w-full">
                {generatedImages.map((img, index) => (
                  <ImageOutput key={index} imageUrl={img} onFullscreen={() => setFullscreenImage(img)} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p>Suas imagens geradas aparecerão aqui.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <Modal isOpen={!!fullscreenImage} onClose={() => setFullscreenImage(null)} imageUrl={fullscreenImage} />
    </div>
  );
}

export default App;
