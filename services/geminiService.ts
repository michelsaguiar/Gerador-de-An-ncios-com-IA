import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { AdCreativeRequest } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const createPrompt = (data: Omit<AdCreativeRequest, 'referenceImage'>, variation: number): string => {
  return `Gere uma imagem publicitária atraente e de alta resolução com base na foto do produto fornecida. A imagem final deve ser fotorrealista e adequada para uma campanha de marketing profissional.

Elementos-chave a incorporar:
- **Produto Principal:** O produto na imagem fornecida pelo usuário é o herói. Integre-o de forma harmoniosa e atraente em um novo cenário. Não o coloque apenas em um novo fundo; crie um ambiente coeso ao seu redor.
- **Palavras-chave:** ${data.keywords}. Elas devem influenciar o clima, os objetos e o tema geral.
- **Público-alvo:** A cena deve atrair: ${data.targetAudience}.
- **Conceito do Anúncio:** ${data.description}.
- **Presença Humana:** ${data.includePeople ? 'Inclua uma ou mais pessoas fotorrealistas interagindo ou reagindo positivamente ao produto. Elas devem corresponder à descrição do público-alvo.' : 'Não inclua pessoas ou figuras humanas na imagem.'}
- **Proporção da Imagem:** A composição final deve ser enquadrada para se ajustar a uma proporção de ${data.aspectRatio}.
- **Estilo:** Moderno, limpo, sofisticado e visualmente impressionante. A iluminação deve ser profissional e destacar as características do produto.

**Instruções Cruciais:**
- NÃO adicione texto, logotipos ou marcas d'água.
- A saída deve ser uma única imagem completa.
- Esta é a variação #${variation}. Por favor, gere um conceito distintamente diferente de quaisquer tentativas anteriores.
`;
};

const generateSingleImage = async (request: AdCreativeRequest, variation: number): Promise<string> => {
  const imagePart = await fileToGenerativePart(request.referenceImage);
  const prompt = createPrompt(request, variation);

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: [{
      parts: [
        imagePart,
        { text: prompt },
      ],
    }],
    config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });
  
  const parts = response.candidates?.[0]?.content?.parts;

  if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          return part.inlineData.data;
        }
      }
  }

  throw new Error("A API não retornou uma imagem. Isso pode ocorrer devido a políticas de segurança ou a um erro inesperado.");
};


export const generateAdImages = async (request: AdCreativeRequest): Promise<string[]> => {
    const [image1, image2] = await Promise.all([
        generateSingleImage(request, 1),
        generateSingleImage(request, 2)
    ]);
    return [image1, image2];
};
