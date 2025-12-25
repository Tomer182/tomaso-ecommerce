import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  ShoppingBag, 
  Search, 
  User, 
  Heart, 
  ChevronRight, 
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Zap,
  Plus,
  Minus,
  X,
  MessageCircle,
  TrendingUp,
  ArrowRight,
  Filter,
  CheckCircle2,
  Lock,
  Menu,
  Sparkles,
  Loader2,
  CreditCard,
  Smartphone,
  Mic,
  Home,
  LayoutGrid,
  Volume2,
  Clock,
  Instagram,
  ArrowLeft,
  Eye,
  Share2,
  ArrowUpDown,
  Tag,
  CreditCard as PaymentIcon,
  Package,
  Trophy,
  PartyPopper,
  Mail,
  Bell,
  Check,
  AlertCircle,
  MicOff,
  Globe,
  Award,
  Send,
  MessageSquare,
  Minimize2,
  Maximize2,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { GoogleGenAI, Type, Modality } from "@google/genai";

// --- Multi-Language Configuration ---

const LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸', dir: 'ltr' },
  he: { name: 'עברית', flag: '🇮🇱', dir: 'rtl' },
  de: { name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  fr: { name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  ru: { name: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  uk: { name: 'Українська', flag: '🇺🇦', dir: 'ltr' },
  es: { name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  pt: { name: 'Português', flag: '🇵🇹', dir: 'ltr' },
};

const TRANSLATIONS = {
  en: {
    home: 'Home', shop: 'Shop', newArrivals: 'New Arrivals', about: 'About Us', sale: 'SALE',
    searchPlaceholder: 'AI Search (e.g., "gift for dad")...',
    cart: 'Cart', wishlist: 'Saved',
    addToCart: 'Add To Cart', secure: 'Secure Unit', quickAdd: 'Quick Add',
    heroTitle: 'Future Ready.', heroSubtitle: 'AI-curated hardware logistics for the modern global enthusiast.',
    explore: 'Explore Collection',
    pilotGreeting: 'Hi! Need help finding something? 👋',
    pilotYes: 'Yes, help me!', pilotNo: 'Maybe later',
    pilotTitle: 'Pilot AI', pilotSubtitle: 'Personal Shopper',
    voiceStart: 'Want to talk? It\'s faster! 🎤',
    typeInstead: 'Type Instead', voiceMode: 'Voice Mode',
    shipping: 'Global Shipping', warranty: 'Secure Warranty', returns: 'Easy Returns', rated: 'Top Rated',
    backToShop: 'Back to Shop', listening: 'Listening...', speaking: 'Speaking...', askPilot: 'Ask Pilot...',
    processing: 'Processing...', viewAll: 'View All', missionSectors: 'Mission Sectors', eliteHardware: 'Elite Hardware'
  },
  he: {
    home: 'בית', shop: 'חנות', newArrivals: 'חדש באתר', about: 'עלינו', sale: 'מבצעים',
    searchPlaceholder: 'חיפוש חכם (לדוגמה: "מתנה לאבא")...',
    cart: 'עגלה', wishlist: 'שמורים',
    addToCart: 'הוסף לעגלה', secure: 'רכוש כעת', quickAdd: 'הוסף מהיר',
    heroTitle: 'מוכנים לעתיד.', heroSubtitle: 'לוגיסטיקת חומרה מבוססת AI לחובבי טכנולוגיה גלובליים.',
    explore: 'גלה את הקולקציה',
    pilotGreeting: 'היי! צריך עזרה במציאת משהו? 👋',
    pilotYes: 'כן, אשמח לעזרה!', pilotNo: 'אולי אחר כך',
    pilotTitle: 'טייס AI', pilotSubtitle: 'קניין אישי',
    voiceStart: 'רוצה לדבר? זה מהיר יותר! 🎤',
    typeInstead: 'הקלד במקום', voiceMode: 'מצב קולי',
    shipping: 'משלוח גלובלי', warranty: 'אחריות מלאה', returns: 'החזרות קלות', rated: 'דירוג גבוה',
    backToShop: 'חזרה לחנות', listening: 'מקשיב...', speaking: 'מדבר...', askPilot: 'שאל את הטייס...',
    processing: 'מעבד...', viewAll: 'הצג הכל', missionSectors: 'מגזרי המשימה', eliteHardware: 'חומרה מובחרת'
  },
  de: {
    home: 'Startseite', shop: 'Shop', newArrivals: 'Neuheiten', about: 'Über uns', sale: 'SALE',
    searchPlaceholder: 'AI Suche (z.B. "Geschenk für Papa")...',
    cart: 'Warenkorb', wishlist: 'Merkliste',
    addToCart: 'In den Warenkorb', secure: 'Jetzt Sichern', quickAdd: 'Schnell hinzufügen',
    heroTitle: 'Bereit für die Zukunft.', heroSubtitle: 'KI-kuratierte Hardware-Logistik für moderne Enthusiasten.',
    explore: 'Kollektion Entdecken',
    pilotGreeting: 'Hallo! Brauchst du Hilfe? 👋',
    pilotYes: 'Ja, hilf mir!', pilotNo: 'Vielleicht später',
    pilotTitle: 'Pilot AI', pilotSubtitle: 'Personal Shopper',
    voiceStart: 'Willst du sprechen? Es geht schneller! 🎤',
    typeInstead: 'Tippen stattdessen', voiceMode: 'Sprachmodus',
    shipping: 'Weltweiter Versand', warranty: 'Sichere Garantie', returns: 'Einfache Rückgabe', rated: 'Bestbewertet',
    backToShop: 'Zurück zum Shop', listening: 'Höre zu...', speaking: 'Spreche...', askPilot: 'Frag Pilot...',
    processing: 'Verarbeitung...', viewAll: 'Alle anzeigen', missionSectors: 'Mission Sektoren', eliteHardware: 'Elite Hardware'
  },
  fr: {
    home: 'Accueil', shop: 'Boutique', newArrivals: 'Nouveautés', about: 'À propos', sale: 'SOLDES',
    searchPlaceholder: 'Recherche AI (ex: "cadeau pour papa")...',
    cart: 'Panier', wishlist: 'Favoris',
    addToCart: 'Ajouter au panier', secure: 'Commander', quickAdd: 'Ajout rapide',
    heroTitle: 'Prêt pour le futur.', heroSubtitle: 'Logistique matérielle curatée par IA pour les passionnés.',
    explore: 'Explorer la collection',
    pilotGreeting: 'Salut ! Besoin d\'aide ? 👋',
    pilotYes: 'Oui, aidez-moi !', pilotNo: 'Peut-être plus tard',
    pilotTitle: 'Pilote AI', pilotSubtitle: 'Assistant Personnel',
    voiceStart: 'Voulez-vous parler ? C\'est plus rapide ! 🎤',
    typeInstead: 'Écrire à la place', voiceMode: 'Mode vocal',
    shipping: 'Livraison Mondiale', warranty: 'Garantie Sécurisée', returns: 'Retours Faciles', rated: 'Mieux Noté',
    backToShop: 'Retour boutique', listening: 'Écoute...', speaking: 'Parle...', askPilot: 'Demander au Pilote...',
    processing: 'Traitement...', viewAll: 'Voir tout', missionSectors: 'Secteurs Mission', eliteHardware: 'Hardware Elite'
  },
  ru: {
    home: 'Главная', shop: 'Магазин', newArrivals: 'Новинки', about: 'О нас', sale: 'РАСПРОДАЖА',
    searchPlaceholder: 'Умный поиск (например, "подарок папе")...',
    cart: 'Корзина', wishlist: 'Избранное',
    addToCart: 'В корзину', secure: 'Купить сейчас', quickAdd: 'Быстро добавить',
    heroTitle: 'Будущее здесь.', heroSubtitle: 'Логистика оборудования с ИИ для современных энтузиастов.',
    explore: 'Смотреть коллекцию',
    pilotGreeting: 'Привет! Нужна помощь? 👋',
    pilotYes: 'Да, помоги мне!', pilotNo: 'Может позже',
    pilotTitle: 'Пилот ИИ', pilotSubtitle: 'Личный Помощник',
    voiceStart: 'Хотите поговорить? Это быстрее! 🎤',
    typeInstead: 'Написать', voiceMode: 'Голосовой режим',
    shipping: 'Доставка по миру', warranty: 'Гарантия', returns: 'Возврат', rated: 'Топ рейтинг',
    backToShop: 'Назад в магазин', listening: 'Слушаю...', speaking: 'Говорю...', askPilot: 'Спросить Пилота...',
    processing: 'Обработка...', viewAll: 'Смотреть все', missionSectors: 'Секторы миссии', eliteHardware: 'Элитное оборудование'
  },
  uk: {
    home: 'Головна', shop: 'Магазин', newArrivals: 'Новинки', about: 'Про нас', sale: 'РОЗПРОДАЖ',
    searchPlaceholder: 'Розумний пошук (напр., "подарунок татові")...',
    cart: 'Кошик', wishlist: 'Збережене',
    addToCart: 'У кошик', secure: 'Замовити', quickAdd: 'Швидко додати',
    heroTitle: 'Майбутнє тут.', heroSubtitle: 'Логістика обладнання зі ШІ для сучасних ентузіастів.',
    explore: 'Дивитися колекцію',
    pilotGreeting: 'Привіт! Потрібна допомога? 👋',
    pilotYes: 'Так, допоможи!', pilotNo: 'Може пізніше',
    pilotTitle: 'Пілот ШІ', pilotSubtitle: 'Особистий Помічник',
    voiceStart: 'Хочете поговорити? Це швидше! 🎤',
    typeInstead: 'Написати', voiceMode: 'Голосовий режим',
    shipping: 'Світова доставка', warranty: 'Гарантія', returns: 'Повернення', rated: 'Топ рейтинг',
    backToShop: 'Назад до магазину', listening: 'Слухаю...', speaking: 'Говорю...', askPilot: 'Запитати Пілота...',
    processing: 'Обробка...', viewAll: 'Дивитися все', missionSectors: 'Сектори місії', eliteHardware: 'Елітне обладнання'
  },
  es: {
    home: 'Inicio', shop: 'Tienda', newArrivals: 'Novedades', about: 'Nosotros', sale: 'OFERTA',
    searchPlaceholder: 'Búsqueda IA (ej. "regalo para papá")...',
    cart: 'Carrito', wishlist: 'Favoritos',
    addToCart: 'Añadir al carrito', secure: 'Comprar ahora', quickAdd: 'Añadir rápido',
    heroTitle: 'Listo para el futuro.', heroSubtitle: 'Logística de hardware curada por IA para entusiastas.',
    explore: 'Explorar colección',
    pilotGreeting: '¡Hola! ¿Necesitas ayuda? 👋',
    pilotYes: '¡Sí, ayúdame!', pilotNo: 'Quizás luego',
    pilotTitle: 'Piloto IA', pilotSubtitle: 'Comprador Personal',
    voiceStart: '¿Quieres hablar? ¡Es más rápido! 🎤',
    typeInstead: 'Escribir', voiceMode: 'Modo voz',
    shipping: 'Envío Global', warranty: 'Garantía Segura', returns: 'Devoluciones Fáciles', rated: 'Mejor Valorado',
    backToShop: 'Volver a tienda', listening: 'Escuchando...', speaking: 'Hablando...', askPilot: 'Pregunta al Piloto...',
    processing: 'Procesando...', viewAll: 'Ver todo', missionSectors: 'Sectores Misión', eliteHardware: 'Hardware Elite'
  },
  pt: {
    home: 'Início', shop: 'Loja', newArrivals: 'Novidades', about: 'Sobre', sale: 'OFERTA',
    searchPlaceholder: 'Busca IA (ex: "presente para o pai")...',
    cart: 'Carrinho', wishlist: 'Salvos',
    addToCart: 'Adicionar', secure: 'Comprar Agora', quickAdd: 'Adicionar rápido',
    heroTitle: 'Pronto para o Futuro.', heroSubtitle: 'Logística de hardware curada por IA para entusiastas.',
    explore: 'Explorar Coleção',
    pilotGreeting: 'Olá! Precisa de ajuda? 👋',
    pilotYes: 'Sim, ajude-me!', pilotNo: 'Talvez depois',
    pilotTitle: 'Piloto IA', pilotSubtitle: 'Comprador Pessoal',
    voiceStart: 'Quer falar? É mais rápido! 🎤',
    typeInstead: 'Digitar', voiceMode: 'Modo voz',
    shipping: 'Envio Global', warranty: 'Garantia Segura', returns: 'Devoluções Fáceis', rated: 'Melhor Avaliado',
    backToShop: 'Voltar para loja', listening: 'Ouvindo...', speaking: 'Falando...', askPilot: 'Pergunte ao Piloto...',
    processing: 'Processando...', viewAll: 'Ver tudo', missionSectors: 'Setores Missão', eliteHardware: 'Hardware Elite'
  }
};

// --- Types & Interfaces ---

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  soldToday?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isSale?: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

type ViewState = 'home' | 'shop' | 'product-detail' | 'cart-page' | 'checkout' | 'success' | 'wishlist-page' | '404';

// --- Product Catalog ---

const INITIAL_PRODUCTS: Product[] = [
  { id: 'hd-1', name: 'Minimalist Sculptural Vase', price: 69.00, description: 'Hand-finished ceramic vase with a matte tactile finish. Designed for modern architectural spaces, this piece brings an organic touch to any shelving unit or side table.', category: 'Home Decor', image: 'https://images.unsplash.com/photo-1581781870027-04212e231e96?auto=format&fit=crop&q=80&w=800', rating: 4.8, reviews: 42, stock: 15, soldToday: 12, isBestSeller: true },
  { id: 'hd-2', name: 'Floating Bookshelf Pro', price: 89.00, description: 'Invisible mounting system for books. Create a stunning wall display that defies gravity and showcases your favorite hardcovers with zero visible hardware.', category: 'Home Decor', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800', rating: 4.7, reviews: 28, stock: 8, soldToday: 5, isNew: true },
  { id: 'hd-3', name: 'Abstract Silk Wall Art', price: 149.00, originalPrice: 199.00, description: 'Premium silk-screened abstract print. Each piece is hand-pulled on museum-grade silk and framed in solid sustainable walnut for a timeless gallery feel.', category: 'Home Decor', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800', rating: 4.9, reviews: 15, stock: 5, soldToday: 3, isSale: true },
  { id: 'sg-1', name: 'Smart Aroma Diffuser 2', price: 79.00, description: 'Ultra-quiet ultrasonic diffuser with app-controlled scent. Features 16 million colors and Alexa/HomeKit integration for the ultimate ambient atmosphere.', category: 'Smart Gadgets', image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=800', rating: 4.6, reviews: 156, stock: 22, soldToday: 48, isBestSeller: true },
  { id: 'sg-2', name: 'Levitating Phone Charger', price: 129.00, description: 'MagLev technology suspends your phone. The future of charging is here. Features 15W fast wireless charging and a polished carbon fiber base.', category: 'Smart Gadgets', image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=800', rating: 4.5, reviews: 64, stock: 10, soldToday: 15, isNew: true },
  { id: 'sg-3', name: 'Smart Mirror Pro', price: 249.00, originalPrice: 299.00, description: 'Gesture-controlled mirror with display. A seamless 4K touch display behind high-transmittance glass. View weather, news, and your health stats while getting ready.', category: 'Smart Gadgets', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800', rating: 4.9, reviews: 31, stock: 3, soldToday: 2, isSale: true },
  { id: 'al-1', name: 'Nebula Cloud Projector', price: 119.00, description: 'Transform any room into a galaxy. High-definition laser clouds and 12 astronomical projection modes create an immersive cosmic experience for work or rest.', category: 'Ambient Lighting', image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800', rating: 4.8, reviews: 210, stock: 40, soldToday: 67, isBestSeller: true },
  { id: 'al-2', name: 'Modular Hexagon Tiles', price: 199.00, description: 'Touch-sensitive modular light tiles. Snap them together in any pattern. Features music sync and dynamic flow effects controlled via your smartphone.', category: 'Ambient Lighting', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800', rating: 4.7, reviews: 89, stock: 12, soldToday: 8 },
  { id: 'al-3', name: 'Smart Sunset Lamp Pro', price: 59.00, originalPrice: 79.00, description: 'Perfect golden hour lighting anytime. Professional-grade optics create a realistic atmospheric sunset effect for content creation or meditation.', category: 'Ambient Lighting', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800', rating: 4.6, reviews: 340, stock: 55, soldToday: 104, isSale: true },
  { id: 'gi-1', name: 'Night Sky Map Poster', price: 49.00, description: 'Custom astronomical map of the stars. Recreate the exact alignment of the cosmos for any date and location. Printed on 300gsm matte archival paper.', category: 'Gift Ideas', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800', rating: 4.9, reviews: 75, stock: 100, soldToday: 23 },
  { id: 'gi-2', name: 'Solar System Crystal Ball', price: 85.00, description: 'K9 crystal sphere with 3D solar system. Intricate laser engraving inside a flawless optical crystal base. Features 7-color LED rotation base.', category: 'Gift Ideas', image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bc46?auto=format&fit=crop&q=80&w=800', rating: 4.8, reviews: 43, stock: 18, soldToday: 11, isNew: true },
  { id: 'gi-3', name: 'Premium Smart Mug', price: 159.00, description: 'Maintains coffee at exact temperature. Set your preferred heat level via the app and keep your beverage perfect for hours with its ceramic-coated titanium core.', category: 'Gift Ideas', image: 'https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?auto=format&fit=crop&q=80&w=800', rating: 4.7, reviews: 112, stock: 25, soldToday: 34, isBestSeller: true }
];

const IMPULSE_ITEMS: Product[] = [
  { id: 'imp-1', name: 'Microfiber Tech Cloth', price: 9.00, description: 'Ultra-soft lens and screen cleaning cloth.', category: 'Accessories', image: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=80&w=400', rating: 4.9, reviews: 1520, stock: 500 },
  { id: 'imp-2', name: 'Premium Sticker Pack', price: 12.00, description: 'Set of 12 holographic hardware stickers.', category: 'Accessories', image: 'https://images.unsplash.com/photo-1572375927902-1c09e2947199?auto=format&fit=crop&q=80&w=400', rating: 4.8, reviews: 840, stock: 200 },
  { id: 'imp-3', name: 'Organic Scent Refill', price: 19.00, description: 'Natural lavender and eucalyptus oils.', category: 'Accessories', image: 'https://images.unsplash.com/photo-1540324155974-7523202daa3f?auto=format&fit=crop&q=80&w=400', rating: 4.7, reviews: 412, stock: 150 }
];

// --- AI Service ---

// Safely initialize AI - don't crash if no API key
const apiKey = typeof process !== 'undefined' && process.env?.API_KEY ? process.env.API_KEY : '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const getSmartSearchResults = async (query: string, products: Product[], lang: string) => {
  // Fallback search if no AI available
  if (!ai) {
    const lowerQuery = query.toLowerCase();
    const matchedIds = products
      .filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
      )
      .map(p => p.id);
    return { ids: matchedIds.length > 0 ? matchedIds : products.slice(0, 4).map(p => p.id), reason: "Text search" };
  }
  
  try {
    const langName = LANGUAGES[lang as keyof typeof LANGUAGES].name;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search Query: "${query}" (Language: ${langName})
Products: ${JSON.stringify(products.map(p => ({ id: p.id, name: p.name, category: p.category, desc: p.description })))}
Match the query to product IDs. 
The user is searching in ${langName}. If the query is conversational (e.g., "gift for mom"), match items that fit.
Return JSON: { "ids": ["id1", "id2"], "reason": "Short explanation in ${langName} why these matched" }`,
      config: {
        systemInstruction: `You are a shopping brain. You understand ${langName} perfectly. Return JSON only.`,
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || '{"ids": [], "reason": ""}');
  } catch (error) {
    console.error("AI Search Error:", error);
    return { ids: [], reason: "" };
  }
};

const getAIVoiceFeedback = async (text: string, lang: string) => {
  if (!ai) return null;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say naturally in ${LANGUAGES[lang as keyof typeof LANGUAGES].name}: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    return null;
  }
};

// --- Audio Helpers ---

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytesArr = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytesArr[i] = binaryString.charCodeAt(i);
  return bytesArr;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

const playAudioBase64 = async (base64: string) => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const audioBuffer = await decodeAudioData(decode(base64), ctx, 24000, 1);
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.start();
  } catch (e) {}
};

// --- UI Base Components ---

// Fix: Made children optional to resolve TypeScript errors where children prop was considered missing
const Badge = ({ children, variant = 'new' }: { children?: React.ReactNode, variant?: 'sale' | 'new' | 'bestseller' | 'lowstock' | 'freeshipping' }) => {
  const styles = {
    sale: "bg-shop-sale text-white",
    new: "bg-shop-primary text-white",
    bestseller: "bg-[#F59E0B] text-white",
    lowstock: "bg-[#FEF3C7] text-[#92400E]",
    freeshipping: "bg-[#DCFCE7] text-[#166534]"
  };
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${styles[variant]}`}>
      {children}
    </span>
  );
};

const StarRating = ({ rating, size = 16 }: { rating: number, size?: number }) => {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={size} 
          className={i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-shop-muted fill-none"} 
        />
      ))}
    </div>
  );
};

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`shimmer rounded-xl ${className}`} />
);

const ProductCard = ({ product, onClick, onAddToCart, onQuickView, isWishlisted, onToggleWishlist, isLoading = false, t }: any) => {
  if (isLoading) {
    return (
      <div className="product-card group p-2">
        <Skeleton className="aspect-square w-full mb-4" />
        <Skeleton className="h-4 w-1/3 mb-2" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      whileInView={{ opacity: 1, scale: 1 }} 
      viewport={{ once: true }}
      className="product-card group relative h-full flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden bg-shop-bg">
        <img 
          src={product.image} 
          alt={product.name} 
          loading="lazy"
          className="product-card__image group-hover:scale-110 transition-transform duration-700 cursor-pointer object-cover w-full h-full" 
          onClick={() => onClick(product)}
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isNew && <Badge variant="new">New</Badge>}
          {product.isSale && <Badge variant="sale">Sale</Badge>}
          {product.isBestSeller && <Badge variant="bestseller">Best Seller</Badge>}
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 p-3 rounded-full bg-white/90 backdrop-blur-md shadow-lg text-shop-text-secondary hover:text-shop-sale transition-all lg:opacity-0 group-hover:opacity-100 z-10"
        >
          <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
        <div className="absolute bottom-3 left-3 right-3 translate-y-[120%] lg:group-hover:translate-y-0 transition-transform duration-500 z-10 hidden lg:block">
           <div className="flex gap-2">
             <button 
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} 
              className="flex-1 btn-cta py-3.5 text-[11px] uppercase tracking-[0.1em] font-bold shadow-xl active:scale-95 transition-transform"
             >
               {t('addToCart')}
             </button>
             <button 
              onClick={(e) => { e.stopPropagation(); onQuickView(product); }} 
              className="p-3.5 bg-white text-shop-primary rounded-xl shadow-xl hover:bg-shop-primary hover:text-white transition-colors"
             >
               <Eye size={20}/>
             </button>
           </div>
        </div>
      </div>
      <div className="product-card__content p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
           <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-shop-muted">{product.category}</p>
           <StarRating rating={product.rating} size={10} />
        </div>
        <h3 
          className="product-card__title group-hover:text-shop-accent transition-colors cursor-pointer text-sm font-semibold truncate mb-2" 
          onClick={() => onClick(product)}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-auto">
           <span className="price-main text-lg">${product.price.toFixed(2)}</span>
           {product.originalPrice && <span className="price-compare text-xs">${product.originalPrice.toFixed(2)}</span>}
        </div>
        {/* Mobile quick add button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          className="lg:hidden w-full mt-4 py-3 bg-shop-bg text-shop-primary rounded-xl text-[10px] font-bold uppercase tracking-widest border border-shop-border active:bg-shop-primary active:text-white transition-all"
        >
          {t('addToCart')} +
        </button>
      </div>
    </motion.div>
  );
};

// --- Conversion Booster Components ---

const SocialProof = () => {
  const notifications = [
    { name: "Sarah", location: "New York", product: "Minimalist Sculptural Vase" },
    { name: "Michael", location: "San Francisco", product: "Smart Mirror Pro" },
    { name: "Emma", location: "London", product: "Levitating Phone Charger" },
    { name: "Julian", location: "Berlin", product: "Nebula Cloud Projector" },
    { name: "Sophia", location: "Tokyo", product: "Premium Smart Mug" }
  ];
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(Math.floor(Math.random() * notifications.length));
      setShow(true);
      setTimeout(() => setShow(false), 5000);
    }, 18000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0, x: -30, y: 30 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -30, y: 30 }}
          className="fixed bottom-24 lg:bottom-12 left-6 z-[90] bg-white p-4 rounded-2xl shadow-2xl border border-shop-border flex items-center gap-4 max-w-[280px]"
        >
          <div className="w-10 h-10 shrink-0 rounded-full bg-shop-accent/10 flex items-center justify-center text-shop-accent">
            <User size={20} />
          </div>
          <div>
            <p className="text-[8px] font-bold uppercase tracking-widest text-shop-muted">Recently Purchased</p>
            <p className="text-[11px] font-medium leading-tight">
              <span className="font-bold">{notifications[index].name}</span> from {notifications[index].location} just bought <span className="text-shop-accent">{notifications[index].product}</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ExitIntentPopup = ({ onClaim }: { onClaim: () => void }) => {
  const [show, setShow] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ m: 14, s: 59 });
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !localStorage.getItem('autopilot_exit_intent')) {
        setShow(true);
        localStorage.setItem('autopilot_exit_intent', 'true');
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  useEffect(() => {
    if (!show) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { m: prev.m - 1, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShow(false)} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col"
      >
        <button onClick={() => setShow(false)} className="absolute top-6 right-6 p-2 text-shop-muted hover:text-shop-primary transition-all z-10"><X size={24}/></button>
        <div className="premium-gradient p-10 text-white text-center">
          <Badge variant="sale">Limited Access</Badge>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter mt-4 mb-3 uppercase">Wait! <br/>Leaving so soon?</h2>
          <p className="text-base opacity-90 font-medium">Claim an exclusive <span className="font-bold text-white underline decoration-shop-accent decoration-2">15% Discount</span> on your next hardware drop.</p>
        </div>
        <div className="p-10">
          {!success ? (
            <>
              <div className="flex justify-center gap-4 mb-8">
                <div className="text-center">
                  <div className="bg-shop-bg w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-mono font-bold">{timeLeft.m}</div>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-shop-muted mt-1">Min</span>
                </div>
                <div className="text-center">
                  <div className="bg-shop-bg w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-mono font-bold">{timeLeft.s.toString().padStart(2, '0')}</div>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-shop-muted mt-1">Sec</span>
                </div>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); setSuccess(true); onClaim(); }} className="space-y-4">
                <div className="relative">
                  <input 
                    type="email" required placeholder="Pilot Email Address" 
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full bg-shop-bg border border-shop-border px-6 py-4.5 rounded-2xl outline-none focus:ring-4 ring-shop-accent/5 font-medium transition-all text-shop-text placeholder:text-shop-muted"
                  />
                  <Mail className="absolute right-6 top-4.5 text-shop-muted" size={20}/>
                </div>
                <button type="submit" className="w-full btn-cta py-4.5 text-base uppercase tracking-widest font-bold">Secure Discount</button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-shop-cta/10 text-shop-cta rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Check size={32}/>
              </div>
              <h3 className="text-xl font-bold mb-1">Access Granted</h3>
              <p className="text-shop-text-secondary font-medium mb-6">Your code <span className="font-bold text-shop-primary">AUTOPILOT15</span> is ready.</p>
              <button onClick={() => setShow(false)} className="w-full btn-secondary py-4 font-bold text-xs uppercase tracking-widest">Return to Mission</button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const DeliveryUrgency = () => {
  const [nextDate, setNextDate] = useState("");
  const [hoursLeft, setHoursLeft] = useState(0);

  useEffect(() => {
    const now = new Date();
    const delivery = new Date();
    delivery.setDate(now.getDate() + 2);
    setNextDate(delivery.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    setHoursLeft(23 - now.getHours());
  }, []);

  return (
    <div className="flex items-center gap-3 p-4 bg-shop-cta/5 border border-shop-cta/20 rounded-2xl mb-6">
      <div className="w-10 h-10 bg-shop-cta text-white rounded-xl flex items-center justify-center shrink-0">
        <Truck size={20}/>
      </div>
      <div>
        <p className="text-[9px] font-bold uppercase tracking-widest text-shop-cta">Global Logistics Priority</p>
        <p className="text-xs font-medium">Order within <span className="font-bold">{hoursLeft}h</span> for delivery by <span className="font-bold">{nextDate}</span>.</p>
      </div>
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [view, setView] = useState<ViewState>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => JSON.parse(localStorage.getItem('autopilot_cart') || '[]'));
  const [wishlist, setWishlist] = useState<string[]>(() => JSON.parse(localStorage.getItem('autopilot_wishlist') || '[]'));
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => JSON.parse(localStorage.getItem('autopilot_recent') || '[]'));
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ ids: string[]; reason: string } | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sortBy, setSortBy] = useState('Featured');
  
  const [viewers, setViewers] = useState(3);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<null | { code: string; discount: number }>(null);
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
  
  // Language State
  const [lang, setLang] = useState<keyof typeof LANGUAGES>('en');
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  // Helper Translation Function
  const t = (key: keyof typeof TRANSLATIONS['en']) => {
    return TRANSLATIONS[lang][key] || TRANSLATIONS['en'][key];
  };

  // Use scroll progress for the progress bar
  const { scrollYProgress } = useScroll();

  // Optimistic Cart State for smooth UI
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('autopilot_cart', JSON.stringify(cart));
    localStorage.setItem('autopilot_wishlist', JSON.stringify(wishlist));
    localStorage.setItem('autopilot_recent', JSON.stringify(recentlyViewed));
  }, [cart, wishlist, recentlyViewed]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Simulate initial data load for skeleton testing
    const timer = setTimeout(() => setIsGlobalLoading(false), 800);
    
    if (localStorage.getItem('autopilot_returning_user')) setIsWelcomeVisible(true);
    localStorage.setItem('autopilot_returning_user', 'true');
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // Set RTL/LTR based on language
  useEffect(() => {
    document.documentElement.dir = LANGUAGES[lang].dir;
    document.documentElement.lang = lang;
  }, [lang]);

  const addToRecentlyViewed = (id: string) => {
    setRecentlyViewed(prev => [id, ...prev.filter(i => i !== id)].slice(0, 4));
  };

  const addToCart = (product: Product) => {
    setIsAddingToCart(product.id);
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    
    // Smooth transition to cart after a tiny delay for optimistic feedback
    setTimeout(() => {
      setIsAddingToCart(null);
    }, 400);
  };

  const updateQuantity = (id: string, d: number) => {
    setCart(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(0, i.quantity + d)} : i).filter(i => i.quantity > 0));
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  
  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const navigateToHome = () => {
    setView('home');
    setSearchResults(null);
    setSearchQuery('');
    setActiveCategory('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToShop = (category: string = 'All') => {
    setActiveCategory(category);
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProduct = (p: Product) => {
    setSelectedProduct(p);
    setView('product-detail');
    addToRecentlyViewed(p.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    // Go to shop view with loading state implied (or we can add a specific loading state)
    setView('shop');
    
    // Perform AI Search
    const results = await getSmartSearchResults(searchQuery, INITIAL_PRODUCTS, lang);
    setSearchResults(results);
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'he' ? 'he-IL' : lang === 'ru' ? 'ru-RU' : 'en-US'; // Dynamic Locale
      recognition.continuous = false;
      
      recognition.onstart = () => setIsListening(true);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
        // Automatically search
        setView('shop');
        getSmartSearchResults(transcript, INITIAL_PRODUCTS, lang).then(results => setSearchResults(results));
      };
      
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      
      recognition.start();
    } else {
      alert("Voice search is not supported in this browser.");
    }
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 500 ? 0 : (cart.length > 0 ? 15 : 0);
  const discount = appliedPromo ? subtotal * appliedPromo.discount : 0;
  const finalTotal = subtotal + shipping - discount;

  return (
    <div className="min-h-screen bg-shop-bg pb-24 lg:pb-0 font-sans selection:bg-shop-accent/20">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-shop-accent z-[100] origin-left" 
        style={{ scaleX: useSpring(scrollYProgress, { stiffness: 100, damping: 30 }) }} 
      />

      {/* Conversion Banner */}
      <div className="bg-shop-primary text-white text-[9px] font-bold uppercase tracking-[0.4em] py-2.5 text-center px-4 relative overflow-hidden hidden lg:block">
        <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 3, repeat: Infinity }}>
          Establishing High-Speed Logistics: Code <span className="text-shop-accent">AUTOPILOT15</span> for 15% Off Your Mission
        </motion.div>
      </div>

      {/* Header */}
      <header className={`sticky top-0 w-full z-50 transition-all duration-500 border-b ${isScrolled ? 'bg-white/80 backdrop-blur-xl border-shop-border/60 h-20 shadow-[0_4px_30px_rgba(0,0,0,0.03)]' : 'bg-white/60 backdrop-blur-md border-transparent h-24'}`}>
        <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between gap-8">
          
          {/* 1. Brand & Navigation */}
          <div className="flex items-center gap-12 shrink-0">
            <button 
              onClick={() => navigateToHome()} 
              className="group flex flex-col leading-none"
            >
              <span className="text-2xl font-black tracking-tighter text-shop-primary uppercase transition-transform group-active:scale-95 flex items-center gap-1">
                AUTOPILOT <span className="w-2 h-2 bg-shop-sale rounded-full animate-pulse"></span>
              </span>
              <span className="text-[9px] font-bold text-shop-muted tracking-[0.3em] pl-0.5 group-hover:text-shop-accent transition-colors">COMMERCE OS</span>
            </button>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {[
                { label: t('home'), action: () => navigateToHome(), active: view === 'home' },
                { label: t('shop'), action: () => navigateToShop('All'), active: view === 'shop' && activeCategory === 'All' },
                { label: t('newArrivals'), action: () => navigateToShop('Smart Gadgets'), active: false },
                { label: t('about'), action: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), active: false },
              ].map((link, i) => (
                <button 
                  key={i}
                  onClick={link.action} 
                  className={`relative text-[11px] font-bold uppercase tracking-[0.15em] py-2 transition-colors ${link.active ? 'text-shop-primary' : 'text-shop-text-secondary hover:text-shop-primary'}`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-shop-primary transition-all duration-300 ${link.active ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </button>
              ))}
              
              <button 
                onClick={() => navigateToShop('All')} 
                className="relative group text-[11px] font-black uppercase tracking-[0.15em] text-shop-sale hover:text-[#B91C1C] transition-colors flex items-center gap-1.5"
              >
                <Tag size={12} className="fill-shop-sale/20" />
                {t('sale')}
              </button>
            </nav>
          </div>

          {/* 2. AI Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-auto relative group z-50">
            <form onSubmit={handleSearch} className="w-full relative transition-all duration-300 transform group-hover:-translate-y-0.5">
               <div className={`absolute inset-0 bg-gradient-to-r from-shop-accent/20 to-purple-500/20 rounded-full blur-xl opacity-0 transition-opacity duration-500 ${searchQuery ? 'opacity-40' : 'group-hover:opacity-30'}`}></div>
               <input 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className={`relative w-full bg-shop-secondary/5 border border-transparent hover:bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] focus:bg-white focus:shadow-[0_8px_40px_rgba(37,99,235,0.12)] focus:border-shop-accent/20 rounded-full py-3.5 px-14 text-sm font-medium outline-none transition-all text-shop-text placeholder:text-shop-muted/80`}
                 placeholder={t('searchPlaceholder')}
                 dir={LANGUAGES[lang].dir}
               />
               <div className={`absolute top-1/2 -translate-y-1/2 text-shop-accent pointer-events-none ${LANGUAGES[lang].dir === 'rtl' ? 'right-5' : 'left-5'}`}>
                 <Sparkles size={18} className={`${searchQuery ? 'animate-pulse' : ''}`} />
               </div>
               <button 
                 type="button" 
                 onClick={handleVoiceSearch}
                 className={`absolute top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${isListening ? 'bg-shop-sale text-white shadow-lg scale-110' : 'hover:bg-shop-bg text-shop-muted hover:text-shop-primary'} ${LANGUAGES[lang].dir === 'rtl' ? 'left-3' : 'right-3'}`}
               >
                 {isListening ? <div className="animate-ping absolute inset-0 rounded-full bg-white opacity-25"></div> : null}
                 {isListening ? <MicOff size={18} /> : <Mic size={18} />}
               </button>
            </form>
          </div>

          {/* 3. Actions & Tools */}
          <div className="flex items-center gap-1 pl-4 shrink-0">
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-shop-bg transition-colors mr-2"
              >
                <span className="text-xl">{LANGUAGES[lang].flag}</span>
                <ChevronDown size={14} className="text-shop-muted"/>
              </button>
              
              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-shop-border p-2 min-w-[160px] z-[60]"
                  >
                    {Object.entries(LANGUAGES).map(([code, data]) => (
                      <button
                        key={code}
                        onClick={() => { setLang(code as any); setLangMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-shop-bg transition-colors ${lang === code ? 'bg-shop-bg text-shop-primary' : 'text-shop-text-secondary'}`}
                      >
                        <span className="text-lg">{data.flag}</span>
                        {data.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="hidden sm:flex relative p-3 text-shop-text-secondary hover:text-shop-primary hover:bg-shop-secondary/5 rounded-full transition-all group">
              <User size={22} strokeWidth={1.5} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-shop-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </button>

            <button 
              onClick={() => setView('wishlist-page')} 
              aria-label="Wishlist"
              className="relative p-3 text-shop-text-secondary hover:text-shop-sale hover:bg-shop-sale/5 rounded-full transition-all active:scale-90"
            >
              <Heart size={22} strokeWidth={1.5} className={wishlist.length > 0 ? "fill-shop-sale text-shop-sale" : ""} />
              {wishlist.length > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-shop-sale text-white text-[9px] font-bold rounded-full flex items-center justify-center border-[2px] border-white shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button 
              onClick={() => setView('cart-page')} 
              aria-label="Shopping Cart"
              className="relative p-3 text-shop-text-secondary hover:text-shop-cta hover:bg-shop-cta/5 rounded-full transition-all active:scale-90"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cart.length > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-shop-cta text-white text-[9px] font-bold rounded-full flex items-center justify-center border-[2px] border-white shadow-sm">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Returning User Welcome */}
      <AnimatePresence>
        {isWelcomeVisible && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-shop-accent/10 border-b border-shop-accent/20 py-2.5 text-center overflow-hidden"
          >
            <div className="text-[9px] font-bold text-shop-accent uppercase tracking-widest flex items-center justify-center gap-2">
              <Sparkles size={12}/> Welcome back, Pilot. Your curation has been updated.
              <button onClick={() => setIsWelcomeVisible(false)} className="p-1 hover:bg-shop-accent/20 rounded-full transition-colors"><X size={12}/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        
        {/* VIEW: HOME */}
        {view === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Hero Section */}
            <section className="relative h-[85vh] bg-shop-primary flex items-center px-4 overflow-hidden">
              <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div className="inline-block px-4 py-2 rounded-full border border-white/20 bg-white/5 text-white text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                    New Drop v3.0 Available
                  </div>
                  <h1 className="text-6xl lg:text-8xl font-bold text-white mb-6 tracking-tighter leading-none uppercase">
                    {t('heroTitle').split(' ')[0]} <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-shop-accent to-purple-400">{t('heroTitle').split(' ').slice(1).join(' ')}</span>
                  </h1>
                  <p className="text-blue-100/60 max-w-lg mb-10 font-medium text-lg leading-relaxed">
                    {t('heroSubtitle')}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                     <button 
                      onClick={() => navigateToShop('All')} 
                      className="btn-cta text-base flex items-center justify-center gap-2 px-10 py-5 active:scale-95 transition-transform"
                    >
                      {t('explore')} <ArrowRight size={20}/>
                    </button>
                     <button 
                      onClick={() => navigateToShop('Smart Gadgets')} 
                      className="px-10 py-5 rounded-lg border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white hover:text-shop-primary transition-all text-sm"
                    >
                      Smart Tech
                    </button>
                  </div>
                </motion.div>
                
                {/* Hero Feature Card (Visual) */}
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="hidden lg:block relative"
                >
                  <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-[3rem] p-6 border border-white/20 shadow-2xl">
                     <img 
                        src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800" 
                        className="rounded-[2.5rem] w-full shadow-lg"
                        alt="Hero Product"
                     />
                     <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl flex items-center gap-4 animate-bounce-slow">
                        <div className="bg-shop-accent/10 p-3 rounded-full text-shop-accent"><Zap size={24}/></div>
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-shop-muted">Trending</p>
                           <p className="font-bold text-shop-primary">Levitating Charger</p>
                        </div>
                     </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Background Ambient */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
            </section>

             {/* Trust Signals (Restored from prompt 1) */}
             <div className="bg-white border-b border-shop-border">
                <div className="max-w-7xl mx-auto py-10 px-4">
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                      <div className="flex flex-col items-center gap-3">
                         <div className="w-12 h-12 bg-shop-bg rounded-full flex items-center justify-center text-shop-primary"><Truck size={20}/></div>
                         <div>
                            <h4 className="font-bold text-sm uppercase tracking-wide">{t('shipping')}</h4>
                            <p className="text-xs text-shop-muted">Free delivery over $500</p>
                         </div>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                         <div className="w-12 h-12 bg-shop-bg rounded-full flex items-center justify-center text-shop-primary"><ShieldCheck size={20}/></div>
                         <div>
                            <h4 className="font-bold text-sm uppercase tracking-wide">{t('warranty')}</h4>
                            <p className="text-xs text-shop-muted">2-year extensive coverage</p>
                         </div>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                         <div className="w-12 h-12 bg-shop-bg rounded-full flex items-center justify-center text-shop-primary"><RotateCcw size={20}/></div>
                         <div>
                            <h4 className="font-bold text-sm uppercase tracking-wide">{t('returns')}</h4>
                            <p className="text-xs text-shop-muted">30-day autopilot returns</p>
                         </div>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                         <div className="w-12 h-12 bg-shop-bg rounded-full flex items-center justify-center text-shop-primary"><Award size={20}/></div>
                         <div>
                            <h4 className="font-bold text-sm uppercase tracking-wide">{t('rated')}</h4>
                            <p className="text-xs text-shop-muted">Verified by Pilot Network</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
            
            {/* Category Grid Portal (Visual) */}
            <section className="max-w-7xl mx-auto px-4 py-24">
               <div className="text-center mb-16">
                 <h2 className="text-3xl lg:text-5xl font-bold tracking-tighter mb-4 uppercase">Mission Sectors</h2>
                 <p className="text-shop-muted font-medium">Identify your hardware requirements</p>
               </div>
               
               <div className="grid md:grid-cols-3 gap-6">
                 {['Home Decor', 'Smart Gadgets', 'Ambient Lighting'].map((cat, i) => (
                   <motion.div 
                    key={cat}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => navigateToShop(cat)}
                    className="group relative h-96 rounded-[2rem] overflow-hidden cursor-pointer"
                   >
                     <img 
                      src={INITIAL_PRODUCTS.find(p => p.category === cat)?.image || ''} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={cat}
                     />
                     <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
                     <div className="absolute bottom-0 left-0 p-8">
                       <h3 className="text-white text-2xl font-bold uppercase tracking-tight mb-2">{cat}</h3>
                       <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest group-hover:text-white transition-colors">
                         View Sector <ArrowRight size={16} />
                       </div>
                     </div>
                   </motion.div>
                 ))}
               </div>
            </section>

             {/* Featured Spotlight (Mission Control) */}
             <section className="bg-shop-primary text-white py-24 my-12 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
                   <div>
                      <Badge variant="sale">Limited Edition</Badge>
                      <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mt-6 mb-6">MISSION CONTROL <br/>CENTER.</h2>
                      <p className="text-blue-100/60 text-lg mb-8 leading-relaxed">Upgrade your command station with our latest drop of smart displays and ambient controls.</p>
                      <button onClick={() => navigateToShop('Smart Gadgets')} className="bg-white text-shop-primary px-8 py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-blue-50 transition-colors">Scout Gear</button>
                   </div>
                   <div className="relative">
                      <div className="absolute inset-0 bg-shop-accent/20 blur-3xl rounded-full"></div>
                      <img src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800" className="relative z-10 rounded-2xl shadow-2xl border border-white/10 rotate-2 hover:rotate-0 transition-transform duration-500" alt="Featured" />
                   </div>
                </div>
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             </section>

             {/* Bestseller Teaser */}
             <section className="max-w-7xl mx-auto px-4 py-24">
                <div className="flex justify-between items-end mb-12">
                   <div>
                     <h2 className="text-3xl font-bold tracking-tighter mb-2 uppercase">Elite Hardware</h2>
                     <p className="text-shop-muted text-sm font-medium">Top rated units by the pilot network.</p>
                   </div>
                   <button onClick={() => navigateToShop('All')} className="text-xs font-bold uppercase tracking-widest border-b border-shop-border pb-1 hover:text-shop-accent hover:border-shop-accent transition-all">View All</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                   {INITIAL_PRODUCTS.filter(p => p.isBestSeller).slice(0, 4).map(p => (
                     <ProductCard 
                        key={p.id} 
                        product={p} 
                        onClick={navigateToProduct} 
                        onAddToCart={addToCart} 
                        onQuickView={setQuickViewProduct} 
                        isWishlisted={wishlist.includes(p.id)} 
                        onToggleWishlist={toggleWishlist}
                        t={t}
                      />
                   ))}
                </div>
             </section>

             {/* Testimonials (Social Proof) */}
             <section className="bg-shop-bg py-24 border-y border-shop-border">
                <div className="max-w-7xl mx-auto px-4 text-center">
                   <h2 className="text-3xl font-bold tracking-tighter mb-16 uppercase">Pilot Transmissions</h2>
                   <div className="grid md:grid-cols-3 gap-8">
                      {[
                        { name: "Alex K.", role: "Architect", text: "The minimal aesthetics fit perfectly with my studio. Shipping was incredibly fast.", rating: 5 },
                        { name: "Jordan M.", role: "Tech Lead", text: "Autopilot's curation saves me hours of searching. Every product is a hit.", rating: 5 },
                        { name: "Casey R.", role: "Designer", text: "Premium quality that matches the description exactly. The packaging is an experience itself.", rating: 5 }
                      ].map((review, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.2 }}
                          className="bg-white p-8 rounded-2xl shadow-sm border border-shop-border text-left"
                        >
                           <StarRating rating={review.rating} size={16} />
                           <p className="mt-4 mb-6 text-shop-text-secondary font-medium leading-relaxed">"{review.text}"</p>
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-shop-primary text-white rounded-full flex items-center justify-center font-bold">{review.name[0]}</div>
                              <div>
                                 <p className="font-bold text-sm">{review.name}</p>
                                 <p className="text-xs text-shop-muted uppercase tracking-wider">{review.role}</p>
                              </div>
                           </div>
                        </motion.div>
                      ))}
                   </div>
                </div>
             </section>

             {/* Newsletter / Community */}
             <section className="py-24 px-4">
               <div className="max-w-4xl mx-auto bg-shop-primary rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-4xl font-bold tracking-tighter mb-4">JOIN THE PILOT NETWORK</h2>
                    <p className="text-blue-100/70 mb-8 max-w-lg mx-auto">Get early access to drops, exclusive coordinates, and logistics updates.</p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                       <input type="email" placeholder="Enter email coordinates" className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none focus:bg-white/20 transition-all" />
                       <button className="bg-shop-accent text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-shop-accent/80 transition-all">Engage</button>
                    </div>
                  </div>
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
               </div>
             </section>
          </motion.div>
        )}

        {/* VIEW: SHOP (Category/Search Results) */}
        {view === 'shop' && (
          <motion.div key="shop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-8">
            <div className="max-w-7xl mx-auto px-4 min-h-screen">
               {/* Shop Header */}
               <div className="flex flex-col md:flex-row justify-between items-end border-b border-shop-border pb-8 mb-10 gap-6">
                 <div>
                   <button onClick={navigateToHome} className="text-xs font-bold uppercase tracking-widest text-shop-muted hover:text-shop-primary mb-2 flex items-center gap-2"><ArrowLeft size={12}/> Back Home</button>
                   <h1 className="text-4xl lg:text-6xl font-bold tracking-tighter uppercase">{searchQuery ? `Search: "${searchQuery}"` : activeCategory}</h1>
                   {searchResults && <p className="text-shop-accent font-medium mt-2 flex items-center gap-2"><Sparkles size={16}/> AI Filter Active: {searchResults.reason || "Smart Match"}</p>}
                 </div>
                 
                 {/* Mobile Search in Shop View */}
                 <div className="w-full md:hidden">
                    <form onSubmit={handleSearch} className="relative">
                       <input 
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         className="w-full bg-shop-bg border border-shop-border rounded-xl py-3 pl-10 pr-10 text-sm text-shop-text placeholder:text-shop-muted"
                         placeholder={t('searchPlaceholder')}
                       />
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-shop-muted" size={16} />
                       <Mic className="absolute right-3 top-1/2 -translate-y-1/2 text-shop-muted" size={16} onClick={handleVoiceSearch}/>
                    </form>
                 </div>
               </div>

               <div className="flex flex-col lg:flex-row gap-12">
                  {/* Sidebar Filters */}
                  <aside className="hidden lg:block w-64 shrink-0 space-y-10">
                     <div>
                       <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b pb-2">Categories</h3>
                       <ul className="space-y-3">
                         {['All', 'Home Decor', 'Smart Gadgets', 'Ambient Lighting', 'Gift Ideas'].map(cat => (
                           <li key={cat}>
                             <button 
                               onClick={() => { setActiveCategory(cat); setSearchResults(null); setSearchQuery(''); }}
                               className={`text-sm font-medium transition-colors hover:text-shop-accent ${activeCategory === cat && !searchResults ? 'text-shop-primary font-bold underline decoration-2 decoration-shop-accent underline-offset-4' : 'text-shop-muted'}`}
                             >
                               {cat}
                             </button>
                           </li>
                         ))}
                       </ul>
                     </div>
                     <div>
                       <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b pb-2">Sort By</h3>
                       <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full bg-shop-bg border border-shop-border rounded-lg p-2 text-sm font-medium outline-none"
                       >
                         <option>Featured</option>
                         <option>Price: Low to High</option>
                         <option>Price: High to Low</option>
                         <option>Newest</option>
                       </select>
                     </div>
                  </aside>

                  {/* Product Grid */}
                  <div className="flex-1">
                     {/* Mobile Category Chips */}
                     <div className="lg:hidden flex overflow-x-auto gap-2 pb-6 no-scrollbar">
                       {['All', 'Home Decor', 'Smart Gadgets', 'Ambient Lighting', 'Gift Ideas'].map(cat => (
                         <button 
                            key={cat}
                            onClick={() => { setActiveCategory(cat); setSearchResults(null); setSearchQuery(''); }}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase whitespace-nowrap border ${activeCategory === cat && !searchResults ? 'bg-shop-primary text-white border-shop-primary' : 'bg-white text-shop-muted border-shop-border'}`}
                         >
                           {cat}
                         </button>
                       ))}
                     </div>

                     <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
                        {isGlobalLoading ? (
                          [...Array(6)].map((_, i) => <ProductCard key={i} isLoading={true} />)
                        ) : (
                          INITIAL_PRODUCTS
                            .filter(p => {
                              if (searchResults) return searchResults.ids.includes(p.id);
                              return activeCategory === 'All' || p.category === activeCategory;
                            })
                            .sort((a, b) => {
                                if (sortBy === 'Price: Low to High') return a.price - b.price;
                                if (sortBy === 'Price: High to Low') return b.price - a.price;
                                if (sortBy === 'Newest') return (a.isNew === b.isNew) ? 0 : a.isNew ? -1 : 1;
                                return 0;
                            })
                            .map(p => (
                              <ProductCard 
                                key={p.id} 
                                product={p} 
                                onClick={navigateToProduct} 
                                onAddToCart={addToCart} 
                                onQuickView={setQuickViewProduct} 
                                isWishlisted={wishlist.includes(p.id)} 
                                onToggleWishlist={toggleWishlist}
                                t={t}
                              />
                            ))
                        )}
                     </div>

                     {/* Empty State */}
                     {!isGlobalLoading && INITIAL_PRODUCTS.filter(p => {
                        if (searchResults) return searchResults.ids.includes(p.id);
                        return activeCategory === 'All' || p.category === activeCategory;
                     }).length === 0 && (
                       <div className="py-20 text-center border-2 border-dashed rounded-3xl">
                         <Search className="mx-auto text-shop-muted mb-4" size={48} />
                         <p className="font-bold text-lg">No units found.</p>
                         <button onClick={() => { setSearchResults(null); setSearchQuery(''); setActiveCategory('All'); }} className="text-shop-accent font-bold mt-2 underline">Reset Filters</button>
                       </div>
                     )}
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {/* VIEW: PRODUCT DETAIL */}
        {view === 'product-detail' && selectedProduct && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-8 max-w-7xl mx-auto px-4 pb-32">
             <button 
              onClick={() => navigateToShop(activeCategory)} 
              className="flex items-center gap-2 text-[10px] font-bold uppercase mb-8 text-shop-muted hover:text-shop-primary transition-colors focus:outline-none"
             >
               <ArrowLeft size={16} className={LANGUAGES[lang].dir === 'rtl' ? 'rotate-180' : ''}/> Back to Shop
             </button>
             <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 mb-20">
                <div className="relative group">
                  <div className="aspect-square bg-white rounded-[2.5rem] overflow-hidden border p-2 shadow-sm">
                    <img 
                      src={selectedProduct.image} 
                      className="w-full h-full object-cover rounded-[2.2rem] transition-transform duration-1000 group-hover:scale-105" 
                      alt={selectedProduct.name}
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                   <div className="flex items-center gap-2 mb-6">
                      <Badge variant="bestseller">Priority Drop</Badge>
                      <span className="text-[9px] font-bold text-shop-sale uppercase tracking-widest animate-pulse flex items-center gap-1">
                        <Eye size={12}/> {viewers} scouts tracking
                      </span>
                   </div>
                   <h1 className="text-4xl lg:text-6xl font-bold mb-4 tracking-tighter leading-tight uppercase">{selectedProduct.name}</h1>
                   <div className="flex items-center gap-6 mb-8 pb-8 border-b">
                      <span className="text-4xl lg:text-5xl font-mono font-bold tracking-tighter text-shop-primary">${selectedProduct.price.toFixed(2)}</span>
                      {selectedProduct.originalPrice && <span className="text-xl text-shop-muted line-through font-mono">${selectedProduct.originalPrice.toFixed(2)}</span>}
                      <StarRating rating={selectedProduct.rating} size={18} />
                   </div>
                   <p className="text-lg text-shop-text-secondary mb-10 leading-relaxed font-medium">{selectedProduct.description}</p>
                   
                   <DeliveryUrgency />
                   
                   <div className="hidden lg:flex gap-4">
                      <button 
                        onClick={() => addToCart(selectedProduct)} 
                        className={`flex-1 btn-cta py-5 text-lg flex items-center justify-center gap-3 ${isAddingToCart === selectedProduct.id ? 'opacity-70 scale-95' : ''}`}
                      >
                        {isAddingToCart === selectedProduct.id ? <Loader2 className="animate-spin" size={20}/> : <ShoppingBag size={20}/>}
                        {isAddingToCart === selectedProduct.id ? 'Processing...' : t('secure')}
                      </button>
                      <button 
                        onClick={() => toggleWishlist(selectedProduct.id)} 
                        className={`px-8 border-2 rounded-2xl flex items-center justify-center transition-all ${wishlist.includes(selectedProduct.id) ? 'bg-shop-sale/5 border-shop-sale text-shop-sale' : 'bg-white border-shop-border text-shop-text-secondary hover:border-shop-primary'}`}
                        aria-label="Add to wishlist"
                      >
                        <Heart size={20} fill={wishlist.includes(selectedProduct.id) ? "currentColor" : "none"} />
                      </button>
                   </div>
                </div>
             </div>

             {/* Mobile Sticky Add to Cart */}
             <div className="lg:hidden fixed bottom-24 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-shop-border z-[60] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                <div className="flex gap-4">
                   <div className="flex-1">
                      <p className="text-[10px] font-bold text-shop-muted uppercase tracking-widest mb-1">Unit Price</p>
                      <p className="text-xl font-mono font-bold">${selectedProduct.price.toFixed(2)}</p>
                   </div>
                   <button 
                    onClick={() => addToCart(selectedProduct)} 
                    className="flex-[2] btn-cta py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                   >
                     {isAddingToCart === selectedProduct.id ? <Loader2 className="animate-spin" size={16}/> : <Plus size={16}/>}
                     {t('secure')}
                   </button>
                </div>
             </div>
          </motion.div>
        )}

        {/* VIEW: WISHLIST */}
        {view === 'wishlist-page' && (
          <motion.div key="wishlist" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="pt-8 max-w-7xl mx-auto px-4 pb-32">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6">
               <div className="flex items-center gap-4">
                 <button onClick={() => navigateToShop('All')} className="p-3 bg-white border rounded-2xl hover:bg-shop-bg active:scale-95 transition-all shadow-sm"><ArrowLeft size={20} className={LANGUAGES[lang].dir === 'rtl' ? 'rotate-180' : ''}/></button>
                 <h1 className="text-3xl lg:text-4xl font-bold tracking-tighter uppercase">Saved Units</h1>
               </div>
               <button 
                onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Curation link established!"); }} 
                className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-shop-border px-6 py-3.5 rounded-xl bg-white hover:bg-shop-bg active:scale-95 transition-all shadow-sm"
               >
                 <Share2 size={16}/> Share Curation
               </button>
             </div>
             
             {wishlist.length === 0 ? (
                <div className="py-32 text-center border-2 border-dashed rounded-[3rem] bg-white shadow-sm flex flex-col items-center px-6">
                  <div className="w-20 h-20 bg-shop-bg rounded-3xl flex items-center justify-center mb-6 text-shop-muted">
                    <Heart size={40} />
                  </div>
                  <h2 className="text-xl font-bold mb-2 uppercase">No scouting data found</h2>
                  <p className="text-shop-muted font-medium mb-10 max-w-xs">Your personal hardware curation is currently empty. Explore drops to save units.</p>
                  <button onClick={() => navigateToShop('All')} className="btn-secondary px-10 py-4 text-xs uppercase tracking-widest">Scout Collection</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
                  {wishlist.map(id => {
                    const p = INITIAL_PRODUCTS.find(item => item.id === id);
                    return p ? (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        onClick={navigateToProduct} 
                        onAddToCart={addToCart} 
                        onQuickView={setQuickViewProduct} 
                        isWishlisted={true} 
                        onToggleWishlist={toggleWishlist} 
                        t={t}
                      />
                    ) : null;
                  })}
                </div>
              )}
          </motion.div>
        )}

        {/* VIEW: CART */}
        {view === 'cart-page' && (
          <motion.div key="cart" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} className="pt-8 max-w-7xl mx-auto px-4 pb-32">
             <div className="flex items-center gap-4 mb-10">
               <button onClick={() => navigateToShop('All')} className="p-3 bg-white border rounded-2xl shadow-sm"><ArrowLeft size={20} className={LANGUAGES[lang].dir === 'rtl' ? 'rotate-180' : ''}/></button>
               <h1 className="text-3xl lg:text-4xl font-bold tracking-tighter uppercase">Mission Bag</h1>
             </div>
             <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-2/3 space-y-6">
                   {cart.length === 0 ? (
                     <div className="text-center py-32 bg-white rounded-[3rem] border border-shop-border shadow-sm flex flex-col items-center px-6">
                        <div className="w-20 h-20 bg-shop-bg rounded-3xl flex items-center justify-center mb-6 text-shop-muted">
                          <ShoppingBag size={40} />
                        </div>
                        <h2 className="text-xl font-bold uppercase mb-2">No hardware assigned</h2>
                        <p className="text-shop-muted font-medium mb-10 max-w-xs">Secure some high-performance units to begin logistics processing.</p>
                        <button onClick={() => navigateToShop('All')} className="btn-secondary mt-4 px-12 py-4 text-xs uppercase tracking-widest">Return to Mission</button>
                     </div>
                   ) : (
                     cart.map(item => (
                       <motion.div layout key={item.id} className="flex gap-4 lg:gap-8 p-4 lg:p-8 bg-white rounded-[2rem] lg:rounded-[2.5rem] border border-shop-border group hover:border-shop-accent/30 transition-all shadow-sm">
                          <img src={item.image} className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl object-cover cursor-pointer shadow-md" onClick={() => navigateToProduct(item)} alt={item.name} />
                          <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-start mb-2 lg:mb-4">
                                <h3 className="font-bold text-base lg:text-2xl truncate cursor-pointer hover:text-shop-accent transition-colors" onClick={() => navigateToProduct(item)}>{item.name}</h3>
                                <button onClick={() => removeFromCart(item.id)} className="text-shop-muted hover:text-shop-sale p-1 transition-colors" aria-label="Remove item"><X size={20}/></button>
                             </div>
                             <p className="font-mono font-bold text-shop-accent text-lg lg:text-xl mb-4 lg:mb-6">${item.price.toFixed(2)}</p>
                             <div className="flex items-center gap-6 bg-shop-bg w-fit px-4 py-2 rounded-xl lg:rounded-2xl border border-shop-border">
                                <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-shop-accent transition-colors"><Minus size={16}/></button>
                                <span className="font-mono font-bold text-base lg:text-lg min-w-[24px] text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-shop-accent transition-colors"><Plus size={16}/></button>
                             </div>
                          </div>
                       </motion.div>
                     ))
                   )}
                   {cart.length > 0 && (
                     <div className="mt-16">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-shop-muted mb-8 border-b border-shop-border pb-4">Essential Mission Add-ons</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                           {IMPULSE_ITEMS.map(imp => (
                             <div key={imp.id} className="bg-white p-6 rounded-[2rem] border border-shop-border text-center group hover:border-shop-accent/30 transition-all shadow-sm">
                                <img src={imp.image} className="w-full h-32 object-cover rounded-2xl mb-4 shadow-sm" alt={imp.name} />
                                <h4 className="font-bold text-sm mb-1 truncate">{imp.name}</h4>
                                <p className="font-mono font-bold text-shop-accent text-base mb-6">${imp.price}</p>
                                <button onClick={() => addToCart(imp)} className="w-full py-3.5 bg-shop-bg text-[10px] font-bold uppercase tracking-widest rounded-xl border border-shop-border hover:bg-shop-primary hover:text-white transition-all active:scale-95 shadow-sm">Add Unit +</button>
                             </div>
                           ))}
                        </div>
                     </div>
                   )}
                </div>
                <aside className="lg:w-1/3">
                   {cart.length > 0 && (
                     <div className="sticky top-24 bg-white p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] border border-shop-border shadow-2xl ring-8 ring-shop-accent/5">
                        <h2 className="text-xl lg:text-2xl font-bold mb-8 lg:mb-10 tracking-tighter uppercase">Logistics Summary</h2>
                        <DeliveryUrgency />
                        <div className="space-y-6 mb-10">
                           <div className="flex justify-between text-sm font-medium"><span>Unit Subtotal</span><span className="font-mono font-bold">${subtotal.toFixed(2)}</span></div>
                           {discount > 0 && <div className="flex justify-between text-sm text-shop-sale font-bold uppercase tracking-widest"><span>Unit Savings</span><span className="font-mono">-${discount.toFixed(2)}</span></div>}
                           <div className="flex justify-between text-sm font-medium"><span>Logistics Fee</span><span className="font-mono font-bold">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
                           <div className="h-px bg-shop-border my-6" />
                           <div className="flex justify-between items-end">
                              <span className="text-2xl lg:text-3xl font-bold tracking-tighter uppercase">Total</span>
                              <span className="text-3xl lg:text-4xl font-mono font-bold tracking-tighter text-shop-primary">${finalTotal.toFixed(2)}</span>
                           </div>
                        </div>
                        <button 
                          onClick={() => setView('checkout')} 
                          className="w-full btn-cta py-6 text-xl flex items-center justify-center gap-3 shadow-2xl active:scale-[0.98] transition-all"
                        >
                          Establish Logistics <Lock size={20}/>
                        </button>
                        <div className="mt-8 flex justify-center gap-6 opacity-40 grayscale pointer-events-none">
                          <CreditCard size={24}/>
                          <Smartphone size={24}/>
                          <Zap size={24}/>
                        </div>
                     </div>
                   )}
                </aside>
             </div>
          </motion.div>
        )}

        {view === '404' && (
          <motion.div key="404" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-20 max-w-xl mx-auto px-4 text-center py-40">
            <AlertCircle size={64} className="mx-auto text-shop-sale mb-8" />
            <h1 className="text-5xl font-bold mb-4 tracking-tighter uppercase">Route Disconnected</h1>
            <p className="text-lg text-shop-text-secondary mb-12">The scout drone could not find the requested coordinates.</p>
            <button onClick={() => navigateToHome()} className="btn-cta px-12 py-5 text-base uppercase font-bold tracking-widest">Return to Base</button>
          </motion.div>
        )}
      </AnimatePresence>

      <SocialProof />
      <ExitIntentPopup onClaim={() => setAppliedPromo({ code: 'AUTOPILOT15', discount: 0.15 })} />
      <AIAssistant 
        products={INITIAL_PRODUCTS} 
        onAddToCart={addToCart} 
        currentView={view} 
        navigateToProduct={navigateToProduct}
        lang={lang}
        t={t}
      />
      
      {/* Footer */}
      <footer className="bg-white border-t py-16 lg:py-24 px-4 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 mb-16">
            <div className="text-center lg:text-left">
              <button onClick={() => navigateToHome()} className="text-2xl font-bold tracking-tighter text-shop-primary uppercase mb-6">AUTOPILOT<span className="text-shop-accent italic font-display">COMMERCE</span></button>
              <p className="text-shop-muted max-w-sm text-sm font-medium leading-relaxed mx-auto lg:mx-0">Empowering global tech enthusiasts with precision-engineered hardware logistics.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
              <div className="text-center lg:text-left">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-6 text-shop-primary">Support</h4>
                <ul className="space-y-4">
                  {['Logistics Status', 'Priority Service', 'Hardware Warranty'].map(link => (
                    <li key={link}><button className="text-xs font-bold uppercase tracking-widest text-shop-muted hover:text-shop-accent transition-colors">{link}</button></li>
                  ))}
                </ul>
              </div>
              <div className="text-center lg:text-left">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-6 text-shop-primary">Network</h4>
                <ul className="space-y-4">
                  {['Twitter', 'Instagram', 'Discord'].map(link => (
                    <li key={link}><button className="text-xs font-bold uppercase tracking-widest text-shop-muted hover:text-shop-accent transition-colors">{link}</button></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-shop-border flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold text-shop-muted uppercase tracking-[0.5em]">
            <p>© 2026 AUTOPILOT COMMERCE. GLOBAL LOGISTICS NODES ACTIVE.</p>
            <div className="flex gap-10">
              <button className="hover:text-shop-primary transition-colors">Security</button>
              <button className="hover:text-shop-primary transition-colors">Protocol</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation - Enhanced for App feel */}
      <nav className="lg:hidden fixed bottom-0 w-full bg-white/80 backdrop-blur-2xl border-t border-shop-border h-20 flex items-center justify-around z-50 px-6 pb-2 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <button 
          onClick={() => navigateToHome()} 
          aria-label="Home"
          className={`flex flex-col items-center gap-1.5 transition-all ${view === 'home' ? 'text-shop-accent scale-110' : 'text-shop-muted'}`}
        >
          <Home size={22} className={view === 'home' ? 'fill-shop-accent/10' : ''}/>
          <span className="text-[8px] font-bold uppercase tracking-widest">Home</span>
        </button>
        <button 
          onClick={() => navigateToShop('All')} 
          aria-label="Shop"
          className={`flex flex-col items-center gap-1.5 transition-all ${view === 'shop' ? 'text-shop-accent scale-110' : 'text-shop-muted'}`}
        >
          <LayoutGrid size={22}/>
          <span className="text-[8px] font-bold uppercase tracking-widest">Shop</span>
        </button>
        <div className="relative -mt-8">
          <button 
            onClick={handleVoiceSearch} 
            aria-label="Voice Search"
            className={`w-14 h-14 premium-gradient rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-90 border-4 border-white ${isListening ? 'animate-pulse' : ''}`}
          >
            <Mic size={24} />
          </button>
        </div>
        <button 
          onClick={() => setView('wishlist-page')} 
          aria-label="Wishlist"
          className={`flex flex-col items-center gap-1.5 transition-all ${view === 'wishlist-page' ? 'text-shop-sale scale-110' : 'text-shop-muted'}`}
        >
          <Heart size={22} className={view === 'wishlist-page' ? 'fill-shop-sale/10' : ''}/>
          <span className="text-[8px] font-bold uppercase tracking-widest">Saved</span>
        </button>
        <button 
          onClick={() => setView('cart-page')} 
          aria-label="Cart"
          className={`flex flex-col items-center gap-1.5 relative transition-all ${view === 'cart-page' ? 'text-shop-accent scale-110' : 'text-shop-muted'}`}
        >
          <ShoppingBag size={22}/>
          {cart.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-shop-sale text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-white">
              {cart.length}
            </span>
          )}
          <span className="text-[8px] font-bold uppercase tracking-widest">Cart</span>
        </button>
      </nav>

      <QuickViewModal product={quickViewProduct} isOpen={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} onAddToCart={addToCart} t={t} />
    </div>
  );
};

const AIAssistant = ({ products, onAddToCart, currentView, navigateToProduct, lang, t }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'initial' | 'chat' | 'voice'>('initial');
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [peekState, setPeekState] = useState<'hidden' | 'visible' | 'dismissed'>('hidden');
  const [chatSession, setChatSession] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Initialize Chat Session with Dynamic Language
  useEffect(() => {
    const initChat = async () => {
      if (!ai) {
        setChatSession(null);
        return;
      }
      const langName = LANGUAGES[lang as keyof typeof LANGUAGES].name;
      const session = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are 'Pilot', the advanced AI shopping assistant for Autopilot Commerce.
Your personality: Warm, professional, slightly futuristic, helpful, concise.
Your goal: Help users navigate the store, find products, and make decisions.
Store Context: High-end tech, home decor, and smart gadgets.
Product Catalog: ${JSON.stringify(products.map((p: any) => ({id: p.id, name: p.name, price: p.price, stock: p.stock, desc: p.description})))}
LANGUAGE RULE: ALWAYS converse in ${langName}. Translate product names if appropriate for the conversation, but keep ID references internal.
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
      setChatSession(session);
      setMessages([]);
      setMode('initial');
    };
    initChat();
  }, [products, lang]);

  // Entrance Animation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (peekState === 'hidden') setPeekState('visible');
    }, 3000);
    return () => clearTimeout(timer);
  }, [peekState]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && mode === 'chat') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, mode]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInputValue('');
    setHasInteracted(true);
    setIsTyping(true);

    // If no AI, use fallback response
    if (!chatSession) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          text: `I found some great options for you! Check out our **Levitating Plant Pot** or **Premium Smart Mug** - both are popular choices. 🎁` 
        }]);
      }, 1000);
      return;
    }

    try {
      const result = await chatSession.sendMessage({ message: text });
      const responseText = result.text;
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);

      if (mode === 'voice') {
        const audioData = await getAIVoiceFeedback(responseText, lang);
        if (audioData) {
          setIsSpeaking(true);
          await playAudioBase64(audioData);
          setIsSpeaking(false);
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', text: "Oops! Let me try that again. What were you looking for? 🔄" }]);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'he' ? 'he-IL' : lang === 'ru' ? 'ru-RU' : 'en-US';
      recognition.continuous = false;
      
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        handleSendMessage(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      
      recognition.start();
    } else {
      alert("Voice input not supported on this device.");
      setMode('chat');
    }
  };

  const quickActions = [
    { label: "🎁 Gift ideas", query: "I need a gift" },
    { label: "⭐ Best sellers", query: "Show me best sellers" },
    { label: "💡 Smart home", query: "Smart gadgets for my home" },
  ];

  // Collapsed floating button
  if (peekState === 'dismissed' && !isOpen) {
    return (
      <motion.button 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 lg:bottom-8 z-[100] w-16 h-16 rounded-full flex items-center justify-center shadow-2xl ${LANGUAGES[lang].dir === 'rtl' ? 'left-6' : 'right-6'}`}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Sparkles size={28} className="text-white" />
        </motion.div>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      </motion.button>
    );
  }

  // Peek bubble
  if (!isOpen) {
    return (
      <AnimatePresence>
        {peekState === 'visible' && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className={`fixed bottom-24 lg:bottom-8 z-[100] flex flex-col gap-3 ${LANGUAGES[lang].dir === 'rtl' ? 'items-start left-6' : 'items-end right-6'}`}
          >
            {/* Greeting bubble */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`relative bg-gradient-to-br from-white to-gray-50 px-5 py-4 rounded-2xl shadow-2xl border border-gray-100 max-w-[280px] ${LANGUAGES[lang].dir === 'rtl' ? 'rounded-bl-sm' : 'rounded-br-sm'}`}
            >
              <button 
                onClick={(e) => { e.stopPropagation(); setPeekState('dismissed'); }} 
                className="absolute -top-2 -right-2 bg-gray-100 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-all shadow-sm"
              >
                <X size={12}/>
              </button>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Hey! 👋 Need help finding something?</p>
                  <p className="text-xs text-gray-500 mt-1">I can help you discover the perfect product</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setIsOpen(true); setMode('chat'); }}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:shadow-lg transition-all"
                >
                  Let's chat! ✨
                </motion.button>
                <button 
                  onClick={() => setPeekState('dismissed')}
                  className="px-4 py-2.5 text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors"
                >
                  Later
                </button>
              </div>
            </motion.div>

            {/* Floating avatar button */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setIsOpen(true); setMode('chat'); }}
              className="relative w-16 h-16 rounded-full shadow-2xl overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-white/20 rounded-full"
              />
              <Sparkles size={28} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Full chat window
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className={`fixed bottom-24 lg:bottom-8 z-[110] w-[92vw] max-w-[400px] h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden ${LANGUAGES[lang].dir === 'rtl' ? 'left-4 lg:left-8' : 'right-4 lg:right-8'}`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        }}
        dir={LANGUAGES[lang].dir}
      >
        {/* Header - Modern gradient */}
        <div 
          className="p-5 flex items-center justify-between text-white shrink-0 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <Sparkles size={22} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Pilot AI</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <p className="text-xs opacity-80">Online • Ready to help</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 relative z-10">
            <button onClick={() => { setPeekState('dismissed'); setIsOpen(false); }} className="p-2.5 hover:bg-white/20 rounded-xl transition-colors">
              <Minimize2 size={18}/>
            </button>
            <button onClick={() => setIsOpen(false)} className="p-2.5 hover:bg-white/20 rounded-xl transition-colors">
              <X size={18}/>
            </button>
          </div>
        </div>

        {/* Initial Mode - Quick start */}
        {mode === 'initial' && (
          <div className="flex-1 flex flex-col p-6 bg-gradient-to-b from-gray-50 to-white">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                <MessageCircle size={36} className="text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Hi there! 👋</h3>
              <p className="text-gray-500 mb-8 max-w-[250px]">I'm Pilot, your personal shopping assistant. How can I help?</p>
              
              {/* Quick actions */}
              <div className="w-full space-y-2 mb-6">
                {quickActions.map((action, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    onClick={() => { setMode('chat'); handleSendMessage(action.query); }}
                    className="w-full py-3 px-4 bg-white border border-gray-200 rounded-xl text-left text-sm font-medium text-gray-700 hover:border-violet-300 hover:bg-violet-50 transition-all flex items-center justify-between group"
                  >
                    {action.label}
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
                  </motion.button>
                ))}
              </div>
            </div>
             
            {/* Bottom buttons */}
            <div className="flex gap-3">
              <button 
                onClick={() => { setMode('voice'); startVoiceInput(); }}
                className="flex-1 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 hover:border-violet-400 hover:bg-violet-50 transition-all"
              >
                <Mic size={18} /> Voice
              </button>
              <button 
                onClick={() => setMode('chat')}
                className="flex-1 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                <MessageCircle size={18} /> Chat
              </button>
            </div>
          </div>
        )}

        {/* Chat / Voice Interface */}
        {(mode === 'chat' || mode === 'voice') && (
          <>
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-6"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-gray-500 font-medium">Pilot is ready to help!</span>
                  </div>
                </motion.div>
              )}
              
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div 
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 ${LANGUAGES[lang].dir === 'rtl' ? 'ml-2' : 'mr-2'}`}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      }}
                    >
                      <Sparkles size={14} className="text-white"/>
                    </div>
                  )}
                  <div className={`max-w-[80%] p-4 text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl rounded-br-md shadow-lg'
                      : 'bg-white text-gray-800 rounded-2xl rounded-tl-md shadow-sm border border-gray-100'
                  }`}>
                    <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-violet-600">$1</strong>') }} />
                  </div>
                </motion.div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div 
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 ${LANGUAGES[lang].dir === 'rtl' ? 'ml-2' : 'mr-2'}`}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    <Sparkles size={14} className="text-white"/>
                  </div>
                  <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-md shadow-sm border border-gray-100">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          className="w-2 h-2 bg-violet-400 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Voice indicators */}
              {(isListening || isSpeaking) && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center py-4"
                >
                  <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(i => (
                        <motion.div 
                          key={i}
                          animate={{ height: [8, 24, 8] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                          className={`w-1 rounded-full ${isSpeaking ? 'bg-purple-500' : 'bg-violet-500'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {isSpeaking ? '🔊 Speaking...' : '🎤 Listening...'}
                    </span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Modern design */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
                className="flex items-center gap-2"
              >
                <button 
                  type="button"
                  onClick={() => { setMode('voice'); startVoiceInput(); }}
                  className={`p-3.5 rounded-xl transition-all shrink-0 ${
                    mode === 'voice' || isListening
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <Mic size={20} />
                </button>
                <div className="flex-1 relative">
                  <input 
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything..."
                    className="w-full bg-gray-100 py-3.5 px-4 rounded-xl outline-none focus:ring-2 focus:ring-violet-200 focus:bg-white transition-all text-sm text-gray-800 placeholder:text-gray-400"
                    onFocus={() => setMode('chat')}
                  />
                </div>
                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3.5 rounded-xl text-white transition-all shrink-0 ${
                    inputValue.trim() 
                      ? 'shadow-lg' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  style={{
                    background: inputValue.trim() 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : '#d1d5db',
                  }}
                >
                  <Send size={18} className={LANGUAGES[lang].dir === 'rtl' ? 'rotate-180' : ''}/>
                </motion.button>
              </form>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

const QuickViewModal = ({ product, isOpen, onClose, onAddToCart, t }: any) => {
  if (!product) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-xl" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9, y: 30 }} 
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl bg-white z-[110] rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/20 max-h-[90vh]"
          >
            <button onClick={onClose} className="absolute top-6 right-6 z-20 p-2.5 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"><X size={24}/></button>
            <div className="md:w-1/2 relative bg-gray-100 h-64 md:h-auto overflow-hidden">
              <img src={product.image} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" alt={product.name} />
            </div>
            <div className="md:w-1/2 p-10 lg:p-16 flex flex-col justify-center overflow-y-auto no-scrollbar">
              <Badge variant="bestseller">Priority Choice</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tighter mb-6 uppercase mt-4">{product.name}</h2>
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-4xl lg:text-5xl font-mono font-bold text-shop-primary tracking-tighter">${product.price.toFixed(2)}</span>
              </div>
              <p className="text-shop-text-secondary leading-relaxed mb-10 text-base lg:text-lg font-medium">{product.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-shop-muted"><Zap size={14} className="text-shop-accent"/> 15W Fast Charge</div>
                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-shop-muted"><ShieldCheck size={14} className="text-shop-cta"/> 2Y Global Shield</div>
              </div>
              <button 
                onClick={() => { onAddToCart(product); onClose(); }} 
                className="w-full btn-cta py-5 text-lg font-bold uppercase tracking-widest active:scale-95 transition-all shadow-xl"
              >
                {t ? t('secure') : 'Secure Now'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);