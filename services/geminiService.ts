// gemini-2.5-flash + v1beta + googleSearch grounding - CALISTIRILDI
import { GoogleGenAI } from "@google/genai";
import { Participant, User } from "../types";

// FINAL FIX: googleSearch + responseMimeType BIRLIKTE CALISMIYOR
// Cozum: responseMimeType/responseSchema kaldirildi, JSON prompt ile isteniyor
const GEMINI_MODEL = 'gemini-2.5-flash';

const getAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY tanimlı degil. Vercel Environment Variables'a ekleyin.");
  }
  return new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1beta' } });
};

const parseJSON = (text: string): Record<string, unknown> => {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  try { return JSON.parse(cleaned); }
  catch { return {}; }
};

export const findCompanyIntel = async (
  name: string,
  website?: string,
  sector?: string,
  sender?: User,
  onRetry?: (msg: string) => void
): Promise<Partial<Participant>> => {
  const ai = getAI();
  const senderContext = `
BİZİM ŞİRKETİMİZ: ${sender?.companyName || 'DeepVera AI'}
BİZİM ÇÖZÜMÜMÜZ: ${sender?.globalPitch || 'Yapay Zeka Destekli Satış ve İstihbarat'}
TEMSİLCİMİZ: ${sender?.authorizedPerson || sender?.name}
  `;
  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `
HEDEF ŞİRKET: "${name}" (${website || 'N/A'})
SEKTÖR: ${sector}
${senderContext}
GÖREV: Şirketi araştır ve SADECE aşağıdaki JSON formatında cevap ver (başka hiçbir metin ekleme):
{
  "email": "email adresi veya boş string",
  "phone": "telefon veya boş string",
  "linkedin": "linkedin url veya boş string",
  "instagram": "instagram url veya boş string",
  "facebook": "facebook url veya boş string",
  "twitter": "twitter url veya boş string",
  "industry": "sektör açıklaması",
  "description": "şirket açıklaması",
  "starRating": 4,
  "competitors": ["rakip1", "rakip2"],
  "painPoints": ["acı nokta 1", "acı nokta 2"],
  "emailSubject": "stratejik e-posta konusu",
  "emailDraft": "3-4 paragraf, paragraflar arası <br><br> - profesyonel İstanbul Türkçesi satış emaili",
  "prestigeNote": "prestij notu"
}
E-posta; merak uyandırıcı konu, şirkete özel buz kıran paragraf, değer önerisi, sosyal kanıt ve düşük baskılı CTA içermeli. Akıcı İstanbul Türkçesiyle.
`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    const raw = response.text || '{}';
    return parseJSON(raw) as Partial<Participant>;
  }, onRetry);
};

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
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      if (err.status === 404) {
        throw new Error(`Model bulunamadı: ${err.message}.`);
      }
      if (i < retries - 1 && (err.status === 429 || (err.status !== undefined && err.status >= 500))) {
        if (onRetry) onRetry(`Sistem yoğun, tekrar deneniyor... (${i + 1}/${retries})`);
        await new Promise(r => setTimeout(r, currentDelay));
        currentDelay *= 2;
        continue;
      }
      throw error;
    }
  }
  throw new Error("Bağlantı sağlanamadı.");
}

export const extractLeadList = async (
  queryContext: string,
  sector: string,
  location: string,
  limit: number,
  excludeNames: string[],
  advancedFilters?: {
    companySize?: string;
    employeeCount?: string;
    techStack?: string;
  }
): Promise<Partial<Participant>[]> => {
  const ai = getAI();
  const isUrl = queryContext.startsWith('http');
  let filterContext = "";
  if (advancedFilters) {
    if (advancedFilters.companySize) filterContext += ` Firma büyüklüğü: ${advancedFilters.companySize}.`;
    if (advancedFilters.employeeCount) filterContext += ` Çalışan sayısı: ${advancedFilters.employeeCount}.`;
    if (advancedFilters.techStack) filterContext += ` Kullandığı teknolojiler: ${advancedFilters.techStack}.`;
  }
  const prompt = isUrl
    ? `"${queryContext}" sitesindeki katilimci listesini cikar. Her firmanin TELEFON ve web sitesini tespit et. Limit: ${limit}.${filterContext} SADECE JSON dondur: {"leads":[{"name":"","website":"","phone":"","location":""}]}`
    : `Google'da "${location} ${sector} firmalar" ara. GERCEK var olan firmalarin isimlerini bul. UYDURMA, PLACEHOLDER veya "Restoran 1", "Firma 2" gibi sahte isimler KESINLIKLE yazma. Sadece gercekten var olan firmalari listele. Bulamadiginda daha az firma dondur, asla sahte isim uretme. ${location} bolgesindeki "${sector}" sektorunden maksimum ${limit} gercek sirket. Atla: ${excludeNames.join(", ")}.${filterContext} SADECE JSON dondur: {"leads":[{"name":"","website":"","phone":"","location":""}]}`;
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    }
  });
  const result = parseJSON(response.text || '{"leads":[]}') as { leads?: Partial<Participant>[] };
  return result.leads || [];
};

export const analyzeOwnWebsite = async (url: string): Promise<Partial<User>> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: `Web sitesini analiz et: ${url}. SADECE JSON döndür: {"companyName":"","description":"","globalPitch":"","sector":""}`,
    config: {
      tools: [{ googleSearch: {} }],
    }
  });
  return parseJSON(response.text || '{}') as Partial<User>;
};
