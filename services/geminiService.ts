
import { GoogleGenAI, Type } from "@google/genai";
import { Participant, User } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callWithRetry<T>(
  fn: () => Promise<T>, 
  onRetry?: (msg: string) => void,
  retries = 3, 
  initialDelay = 4000
): Promise<T> {
  let currentDelay = initialDelay;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const isRetryable = error.status === 429 || error.status === 503 || error.status === 500;
      if (i < retries - 1 && isRetryable) {
        if (onRetry) onRetry(`Bağlantı tazeleniyor... (${i + 1}/${retries})`);
        await sleep(currentDelay);
        currentDelay *= 2;
        continue;
      }
      throw error;
    }
  }
  throw new Error("Maksimum deneme sayısına ulaşıldı.");
}

export const extractLeadList = async (
  queryContext: string, 
  sector: string, 
  location: string,
  excludeNames: string[],
  onRetry?: (msg: string) => void
): Promise<Partial<Participant>[]> => {
  const ai = getAI();
  
  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `GÖREV: ${location} bölgesindeki veya belirtilen kaynaktaki "${sector}" firmalarını bul. 
      EK BİLGİ: ${queryContext}
      Şunları hariç tut: ${excludeNames.slice(-20).join(", ")}
      TALİMAT: Mümkün olduğunca çok (en az 15-20) gerçek firma bul.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            leads: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  website: { type: Type.STRING },
                  location: { type: Type.STRING }
                },
                required: ["name"]
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || '{"leads":[]}');
    return data.leads || [];
  }, onRetry);
};

export const findCompanyIntel = async (
  name: string, 
  website?: string, 
  sector?: string,
  sender?: Partial<User>,
  onRetry?: (msg: string) => void
): Promise<Partial<Participant>> => {
  const ai = getAI();
  
  const senderContext = `GÖNDEREN: ${sender?.companyName || 'Hizmet Firması'} (${sender?.companyDescription || 'Kurumsal Çözümler'})`;

  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `HEDEF: "${name}" (${website || 'Web sitesi aranmalı'}) 
      BAĞLAM: ${senderContext}
      GÖREV: Şirketin kurumsal e-postasını bul. Varsa şirketin LinkedIn, Instagram ve Twitter profillerini tespit et. Bu şirkete özel, etkileyici bir satış teklifi e-postası hazırla.
      
      ÖNEMLİ TALİMATLAR:
      1. E-posta taslağı kesinlikle "Normal Cümle Düzeni" (Sentence Case) ile yazılmalıdır. Sadece cümle başları ve özel isimler büyük harfle başlamalıdır. Kesinlikle TAMAMI BÜYÜK HARF kullanma.
      2. Metin mutlaka paragraflara bölünmüş, giriş, gelişme ve sonuç bölümleri olan profesyonel bir yapıda olmalıdır.
      3. Teklif için ilgi çekici ve profesyonel bir "E-posta Başlığı" (Subject) oluştur.
      4. Sosyal medya linklerini (linkedin, instagram, twitter) web sitesinden veya arama motorlarından doğrula.`,
      config: { 
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            icebreaker: { type: Type.STRING },
            emailSubject: { type: Type.STRING },
            emailDraft: { type: Type.STRING },
            linkedin: { type: Type.STRING },
            instagram: { type: Type.STRING },
            twitter: { type: Type.STRING },
            competitors: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      },
    });

    return JSON.parse(response.text || '{}');
  }, onRetry);
};
