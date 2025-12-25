import { GoogleGenAI, Modality } from "@google/genai";
import { Product, AISearchResult } from '../types';

// Initialize AI client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Smart search using AI
export const getSmartSearchResults = async (query: string, products: Product[]): Promise<AISearchResult> => {
  if (!ai) {
    console.warn('AI not initialized - using fallback search');
    // Fallback: simple text matching
    const matchedIds = products
      .filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
      .map(p => p.id);
    return { ids: matchedIds, reason: "Text-based search" };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Search Query: "${query}"
Products: ${JSON.stringify(products.map(p => ({ id: p.id, name: p.name, category: p.category, desc: p.description })))}
Match the query to product IDs. If the query is conversational (e.g., "gift for mom"), match items that fit.
Return JSON: { "ids": ["id1", "id2"], "reason": "Short explanation why these matched" }`,
      config: {
        systemInstruction: "You are a shopping brain. You understand intent. Return JSON only.",
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || '{"ids": [], "reason": ""}');
  } catch (error) {
    console.error("AI Search Error:", error);
    return { ids: [], reason: "" };
  }
};

// Get AI voice feedback (TTS)
export const getAIVoiceFeedback = async (text: string): Promise<string | null> => {
  if (!ai) return null;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say naturally: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

// Audio helpers
export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytesArr = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytesArr[i] = binaryString.charCodeAt(i);
  return bytesArr;
}

export async function decodeAudioData(
  data: Uint8Array, 
  ctx: AudioContext, 
  sampleRate: number, 
  numChannels: number
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const playAudioBase64 = async (base64: string): Promise<void> => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const audioBuffer = await decodeAudioData(decodeBase64(base64), ctx, 24000, 1);
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.start();
  } catch (e) {
    console.error("Audio playback error:", e);
  }
};

// Create chat session for AI assistant
export const createChatSession = (products: Product[]) => {
  if (!ai) return null;
  
  return ai.chats.create({
    model: 'gemini-2.0-flash',
    config: {
      systemInstruction: `You are 'Pilot', the advanced AI shopping assistant for Autopilot Commerce.
Your personality: Warm, professional, slightly futuristic, helpful, concise.
Your goal: Help users navigate the store, find products, and make decisions.
Store Context: High-end tech, home decor, and smart gadgets.
Product Catalog: ${JSON.stringify(products.map((p: Product) => ({id: p.id, name: p.name, price: p.price, stock: p.stock, desc: p.description})))}
Rules:
1. If a user asks for a gift, ALWAYS ask who it is for and the budget (Under $50, $50-150, $150+) before recommending.
2. If asked about stock, check the 'stock' field.
3. If asked about shipping, 'Free global shipping over $500. Secure logistics.'
4. If the user mentions a specific product name from the catalog, provide its price and a brief compelling description.
5. Keep responses short (under 3 sentences) unless listing products.
6. When recommending products, put their names in **bold**.
7. If you recommend a product, act as if you are showing it to them.`,
    }
  });
};

