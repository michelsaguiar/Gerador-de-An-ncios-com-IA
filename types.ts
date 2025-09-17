
export type AspectRatio = '1:1' | '16:9' | '9:16';

export interface AdCreativeRequest {
  referenceImage: File;
  keywords: string;
  targetAudience: string;
  description: string;
  includePeople: boolean;
  aspectRatio: AspectRatio;
}
