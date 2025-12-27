import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { 
  ShoppingBag, Search, Heart, ChevronRight, Star, Truck, ShieldCheck, 
  RotateCcw, Zap, Plus, Minus, X, MessageCircle, TrendingUp, ArrowRight, 
  Filter, CheckCircle2, Lock, Menu, Sparkles, Loader2, CreditCard, 
  Smartphone, Mic, Home, LayoutGrid, Volume2, Clock, Instagram, ArrowLeft,
  Eye, Share2, ArrowUpDown, Tag, Package, Trophy, PartyPopper, Mail,
  Bell, Check, AlertCircle, MicOff, Globe, Award, Send, MessageSquare,
  Minimize2, Maximize2
} from 'lucide-react';

import { Product, CartItem, ViewState, Order, ChatMessage } from './types';
import { IMPULSE_ITEMS, fetchProducts, fetchCategories, FALLBACK_PRODUCTS, FALLBACK_CATEGORIES } from './data/products';
import { useCart, useWishlist, useRecentlyViewed } from './hooks';
import { getSmartSearchResults, createChatSession, getAIVoiceFeedback, playAudioBase64, ai } from './lib/ai';
import { CheckoutPage, SuccessPage } from './pages';
import { AdminDashboard } from './pages/AdminDashboard';
import { OwnerApp } from './admin/owner/OwnerApp';
import { ClientApp } from './admin/client/ClientApp';
import { FiltersPanel, FilterState } from './components';

// --- UI Components ---

const Badge = ({ children, variant = 'new' }: { children: React.ReactNode, variant?: 'sale' | 'new' | 'bestseller' | 'lowstock' | 'freeshipping' }) => {
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

const StarRating = ({ rating, size = 16 }: { rating: number, size?: number }) => (
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

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`shimmer rounded-xl ${className}`} />
);

const ProductCard = ({ product, onClick, onAddToCart, onQuickView, isWishlisted, onToggleWishlist, isLoading = false }: any) => {
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
          {product.stock <= 3 && product.stock > 0 && (
            <span className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider bg-red-500 text-white rounded-lg animate-pulse">
              Only {product.stock} left!
            </span>
          )}
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
              Add To Cart
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
        <button 
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          className="lg:hidden w-full mt-4 py-3 bg-shop-bg text-shop-primary rounded-xl text-[10px] font-bold uppercase tracking-widest border border-shop-border active:bg-shop-primary active:text-white transition-all"
        >
          Quick Add +
        </button>
      </div>
    </motion.div>
  );
};

// --- Conversion Boosters ---

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
            <TrendingUp size={20} />
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
      if (e.clientY <= 0 && !localStorage.getItem('sparkgear_exit_intent')) {
        setShow(true);
        localStorage.setItem('sparkgear_exit_intent', 'true');
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
                    className="w-full bg-shop-bg border border-shop-border px-6 py-4 rounded-2xl outline-none focus:ring-4 ring-shop-accent/5 font-medium transition-all"
                  />
                  <Mail className="absolute right-6 top-4 text-shop-muted" size={20}/>
                </div>
                <button type="submit" className="w-full btn-cta py-4 text-base uppercase tracking-widest font-bold">Secure Discount</button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-shop-cta/10 text-shop-cta rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Check size={32}/>
              </div>
              <h3 className="text-xl font-bold mb-1">Access Granted</h3>
              <p className="text-shop-text-secondary font-medium mb-6">Your code <span className="font-bold text-shop-primary">SPARKGEAR15</span> is ready.</p>
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

// --- AI Assistant ---

const AIAssistant = ({ products, onAddToCart, currentView, navigateToProduct }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'initial' | 'chat' | 'voice'>('initial');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [peekState, setPeekState] = useState<'hidden' | 'visible' | 'dismissed'>('hidden');
  const [chatSession, setChatSession] = useState<any>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const session = createChatSession(products);
    setChatSession(session);
  }, [products]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (peekState === 'hidden') setPeekState('visible');
    }, 3000);
    return () => clearTimeout(timer);
  }, [peekState]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !chatSession) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setInputValue('');
    setHasInteracted(true);

    try {
      const result = await chatSession.sendMessage({ message: text });
      const responseText = result.text;
      
      setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);

      if (mode === 'voice') {
        const audioData = await getAIVoiceFeedback(responseText);
        if (audioData) {
          setIsSpeaking(true);
          await playAudioBase64(audioData);
          setIsSpeaking(false);
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'assistant', text: "Connection interrupted. Please retry coordinates." }]);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
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

  if (peekState === 'dismissed' && !isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 lg:bottom-8 right-6 z-[100] w-14 h-14 bg-shop-primary rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-all border-4 border-white"
      >
        <Sparkles size={24} />
      </button>
    );
  }

  if (!isOpen) {
    return (
      <AnimatePresence>
        {peekState === 'visible' && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="fixed bottom-24 lg:bottom-8 right-6 z-[100] flex flex-col items-end gap-4"
          >
            <div className="bg-white px-5 py-4 rounded-2xl rounded-tr-sm shadow-xl border border-shop-border max-w-[250px] relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setPeekState('dismissed'); }} 
                className="absolute -top-2 -left-2 bg-shop-bg p-1 rounded-full text-shop-muted hover:text-shop-primary shadow-sm"
              >
                <X size={12}/>
              </button>
              <p className="text-sm font-medium text-shop-primary">Hi! Need help finding something? 👋</p>
              <div className="flex gap-2 mt-3">
                <button 
                  onClick={() => { setIsOpen(true); setMode('initial'); }}
                  className="bg-shop-primary text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-shop-secondary transition-colors"
                >
                  Yes, help me!
                </button>
                <button 
                  onClick={() => setPeekState('dismissed')}
                  className="bg-shop-bg text-shop-muted text-xs font-bold px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 premium-gradient rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-105 active:scale-95 transition-all border-4 border-white relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-shop-accent/20 animate-pulse"></div>
              <Sparkles size={28} className="relative z-10" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-[110] w-[90vw] max-w-[380px] h-[550px] bg-white rounded-[2rem] shadow-2xl border border-shop-border flex flex-col overflow-hidden ring-4 ring-shop-accent/10"
    >
      <div className="premium-gradient p-5 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
            <Sparkles size={20} className="text-shop-accent" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-none">Pilot AI</h3>
            <p className="text-[10px] uppercase tracking-widest opacity-70 mt-1">Personal Shopper</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setPeekState('dismissed'); setIsOpen(false); }} className="p-2 hover:bg-white/10 rounded-full transition-colors"><Minimize2 size={18}/></button>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={18}/></button>
        </div>
      </div>

      {mode === 'initial' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-shop-bg/50">
          <div className="w-20 h-20 bg-white rounded-[2rem] shadow-lg flex items-center justify-center mb-6">
            <MessageCircle size={40} className="text-shop-accent" />
          </div>
          <h3 className="text-xl font-bold mb-2">I'm your personal shopping assistant!</h3>
          <p className="text-shop-muted text-sm mb-8">I can help you find the perfect product, check stock, or compare items.</p>
          
          <p className="text-xs font-bold uppercase tracking-widest text-shop-primary mb-4">Want to talk? It's faster! 🎤</p>
          
          <div className="flex flex-col gap-3 w-full">
            <button 
              onClick={() => { setMode('voice'); startVoiceInput(); }}
              className="btn-cta py-4 w-full flex items-center justify-center gap-2 shadow-lg"
            >
              <Mic size={18} /> Enable Voice Mode
            </button>
            <button 
              onClick={() => setMode('chat')}
              className="bg-white border border-shop-border text-shop-primary font-bold py-4 w-full rounded-xl hover:bg-gray-50 transition-colors"
            >
              Type Instead
            </button>
          </div>
        </div>
      )}

      {(mode === 'chat' || mode === 'voice') && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-shop-bg/30">
            {messages.length === 0 && (
              <div className="text-center py-8 opacity-50">
                <p className="text-xs font-bold uppercase tracking-widest mb-2">Suggested Queries</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["Find a gift for dad", "What's popular?", "Show me smart gadgets"].map(q => (
                    <button key={q} onClick={() => handleSendMessage(q)} className="bg-white border px-3 py-1.5 rounded-full text-xs hover:border-shop-accent transition-colors">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-shop-primary text-white flex items-center justify-center shrink-0 mr-2 mt-1">
                    <Sparkles size={14}/>
                  </div>
                )}
                <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-shop-primary text-white rounded-tr-none' 
                    : 'bg-white border border-shop-border text-shop-text rounded-tl-none shadow-sm'
                }`}>
                  <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                </div>
              </div>
            ))}
            
            {(isListening || isSpeaking) && (
              <div className="flex justify-center py-4">
                <div className="flex items-center gap-1">
                  {[1,2,3,4].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ height: [10, 24, 10] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                      className={`w-1 rounded-full ${isSpeaking ? 'bg-shop-sale' : 'bg-shop-accent'}`}
                    />
                  ))}
                </div>
                <span className="ml-3 text-xs font-bold uppercase tracking-widest text-shop-muted">
                  {isSpeaking ? 'Speaking...' : 'Listening...'}
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-shop-border">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
              className="relative flex items-center gap-2"
            >
              <button 
                type="button"
                onClick={() => { setMode('voice'); startVoiceInput(); }}
                className={`p-3 rounded-xl transition-all ${mode === 'voice' ? 'bg-shop-accent text-white shadow-lg' : 'bg-shop-bg text-shop-muted hover:bg-gray-200'}`}
              >
                <Mic size={20} />
              </button>
              <input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Pilot..."
                className="flex-1 bg-shop-bg border-none py-3 px-4 rounded-xl outline-none focus:ring-2 focus:ring-shop-accent/10 transition-all font-medium text-sm"
                onFocus={() => setMode('chat')}
              />
              <button 
                type="submit"
                disabled={!inputValue.trim()}
                className="p-3 bg-shop-primary text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-shop-secondary transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </>
      )}
    </motion.div>
  );
};

// --- Quick View Modal ---

const QuickViewModal = ({ product, isOpen, onClose, onAddToCart }: any) => {
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
            <div className="md:w-1/2 p-10 lg:p-16 flex flex-col justify-center overflow-y-auto">
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
                Secure Now
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Main App ---

// 🔐 SECRET ADMIN ROUTE - Only accessible via direct URL
// Admin Routes
const OWNER_ADMIN_PATH = '/command-center';
const CLIENT_ADMIN_PATH = '/store-admin';
const LEGACY_ADMIN_PATH = '/autopilot-mission-control-2025';

export const App = () => {
  // Check admin routes
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const isOwnerAdminRoute = currentPath === OWNER_ADMIN_PATH;
  const isClientAdminRoute = currentPath === CLIENT_ADMIN_PATH;
  const isLegacyAdminRoute = currentPath === LEGACY_ADMIN_PATH;
  
  // If it's an admin route, render the appropriate admin app
  if (isOwnerAdminRoute) {
    return <OwnerApp />;
  }
  
  if (isClientAdminRoute) {
    return <ClientApp />;
  }

  const [view, setView] = useState<ViewState>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  
  // Products state - fetched from Supabase with fallback
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(FALLBACK_CATEGORIES);
  
  const { 
    cart, addToCart, updateQuantity, removeFromCart, clearCart,
    subtotal, shipping, discount, total, itemCount,
    appliedPromo, applyPromoCode, isAddingToCart 
  } = useCart();
  
  const { wishlist, toggleWishlist, isWishlisted, wishlistCount } = useWishlist();
  const { recentlyViewed, addToRecentlyViewed } = useRecentlyViewed();
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ ids: string[]; reason: string } | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Calculate max price for filters
  const maxPrice = Math.ceil(Math.max(...products.map(p => p.price), 500) / 50) * 50;
  
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, maxPrice],
    minRating: 0,
    stockStatus: [],
    badges: [],
    sortBy: 'trending',
  });
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
  const [viewers] = useState(3);

  const { scrollYProgress } = useScroll();

  // Fetch products from Supabase on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        if (fetchedProducts.length > 0) {
          setProducts(fetchedProducts);
        }
        if (fetchedCategories.length > 0) {
          setCategories(fetchedCategories);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const timer = setTimeout(() => setIsGlobalLoading(false), 800);
    
    if (localStorage.getItem('sparkgear_returning_user')) setIsWelcomeVisible(true);
    localStorage.setItem('sparkgear_returning_user', 'true');
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

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
    setView('shop');
    const results = await getSmartSearchResults(searchQuery, products);
    setSearchResults(results);
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
        setView('shop');
        getSmartSearchResults(transcript, products).then(results => setSearchResults(results));
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      
      recognition.start();
    } else {
      alert("Voice search is not supported in this browser.");
    }
  };

  const handleCheckoutSuccess = (order: Order) => {
    setCompletedOrder(order);
    setView('success');
  };

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
          Establishing High-Speed Logistics: Code <span className="text-shop-accent">SPARKGEAR15</span> for 15% Off Your Mission
        </motion.div>
      </div>

      {/* Header */}
      <header className={`sticky top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg h-20' : 'bg-white h-24'}`}>
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-12 w-full">
            <button 
              onClick={() => navigateToHome()} 
              className="text-xl font-bold tracking-tighter text-shop-primary uppercase transition-transform active:scale-95 shrink-0"
            >
              SPARKGEAR<span className="text-shop-accent italic font-display">COMMERCE</span>
            </button>
            
            <nav className="hidden lg:flex items-center gap-8">
              <button 
                onClick={() => navigateToHome()} 
                className={`relative text-[11px] font-bold uppercase tracking-[0.15em] py-2 transition-colors ${view === 'home' ? 'text-shop-primary' : 'text-shop-text-secondary hover:text-shop-primary'}`}
              >
                Home
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-shop-primary transition-all duration-300 ${view === 'home' ? 'w-full' : 'w-0'}`}></span>
              </button>
              <button 
                onClick={() => navigateToShop('All')} 
                className={`relative text-[11px] font-bold uppercase tracking-[0.15em] py-2 transition-colors ${view === 'shop' && activeCategory === 'All' ? 'text-shop-primary' : 'text-shop-text-secondary hover:text-shop-primary'}`}
              >
                Shop
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-shop-primary transition-all duration-300 ${view === 'shop' && activeCategory === 'All' ? 'w-full' : 'w-0'}`}></span>
              </button>
              <button 
                onClick={() => navigateToShop('Smart Gadgets')} 
                className={`relative text-[11px] font-bold uppercase tracking-[0.15em] py-2 transition-colors ${view === 'shop' && activeCategory === 'Smart Gadgets' ? 'text-shop-primary' : 'text-shop-text-secondary hover:text-shop-primary'}`}
              >
                New Arrivals
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-shop-primary transition-all duration-300 ${view === 'shop' && activeCategory === 'Smart Gadgets' ? 'w-full' : 'w-0'}`}></span>
              </button>
              <button 
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} 
                className="relative text-[11px] font-bold uppercase tracking-[0.15em] py-2 text-shop-text-secondary hover:text-shop-primary transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => navigateToShop('All')} 
                className="relative text-[11px] font-black uppercase tracking-[0.15em] text-shop-sale hover:text-[#B91C1C] transition-colors flex items-center gap-1.5"
              >
                <Tag size={12} className="fill-shop-sale/20" />
                Sale
              </button>
            </nav>

            <div className="hidden md:flex flex-1 max-w-xl mx-auto relative group">
              <form onSubmit={handleSearch} className="w-full relative">
                <input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-shop-bg border border-shop-border rounded-full py-3 pl-12 pr-12 text-sm font-medium focus:ring-2 focus:ring-shop-accent/20 focus:border-shop-accent outline-none transition-all"
                  placeholder="AI Search (e.g., 'minimalist gift under $100')..."
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-shop-muted" size={18} />
                <button 
                  type="button" 
                  onClick={handleVoiceSearch}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${isListening ? 'bg-shop-sale text-white animate-pulse' : 'hover:bg-gray-200 text-shop-muted'}`}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              </form>
            </div>
          </div>

          <div className="flex items-center gap-2 pl-4 shrink-0">
            <button 
              onClick={() => setView('wishlist-page')} 
              aria-label="Wishlist"
              className="relative p-3 text-shop-text-secondary hover:text-shop-primary active:scale-90 transition-all rounded-full hover:bg-shop-bg"
            >
              <Heart size={20} className={wishlistCount > 0 ? "fill-shop-sale text-shop-sale" : ""} />
              {wishlistCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-shop-accent text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setView('cart-page')} 
              aria-label="Shopping Cart"
              className="relative p-3 text-shop-text-secondary hover:text-shop-primary active:scale-90 transition-all rounded-full hover:bg-shop-bg"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-shop-sale text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {itemCount}
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

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {/* HOME VIEW */}
        {view === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Hero Section */}
            <section className="relative h-[85vh] bg-shop-primary flex items-center px-4 overflow-hidden">
              <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                  <div className="inline-block px-4 py-2 rounded-full border border-white/20 bg-white/5 text-white text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                    New Drop v3.0 Available
                  </div>
                  <h1 className="text-6xl lg:text-8xl font-bold text-white mb-6 tracking-tighter leading-none uppercase">
                    Future <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-shop-accent to-purple-400">Ready.</span>
                  </h1>
                  <p className="text-blue-100/60 max-w-lg mb-10 font-medium text-lg leading-relaxed">
                    AI-curated hardware logistics for the modern global enthusiast. Precision engineered for your lifestyle.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => navigateToShop('All')} className="btn-cta text-base flex items-center justify-center gap-2 px-10 py-5 active:scale-95 transition-transform">
                      Explore Collection <ArrowRight size={20}/>
                    </button>
                    <button onClick={() => navigateToShop('Smart Gadgets')} className="px-10 py-5 rounded-lg border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white hover:text-shop-primary transition-all text-sm">
                      Smart Tech
                    </button>
                  </div>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="hidden lg:block relative">
                  <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-[3rem] p-6 border border-white/20 shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800" className="rounded-[2.5rem] w-full shadow-lg" alt="Hero Product" />
                    <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl flex items-center gap-4">
                      <div className="bg-shop-accent/10 p-3 rounded-full text-shop-accent"><Zap size={24}/></div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-shop-muted">Trending</p>
                        <p className="font-bold text-shop-primary">Levitating Charger</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
            </section>

            {/* Trust Signals */}
            <div className="bg-white border-b border-shop-border">
              <div className="max-w-7xl mx-auto py-10 px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  {[
                    { icon: Truck, title: "Global Shipping", desc: "Free delivery over $500" },
                    { icon: ShieldCheck, title: "Secure Warranty", desc: "2-year extensive coverage" },
                    { icon: RotateCcw, title: "Easy Returns", desc: "30-day autopilot returns" },
                    { icon: Award, title: "Top Rated", desc: "Verified by Spark Network" },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-shop-bg rounded-full flex items-center justify-center text-shop-primary"><item.icon size={20}/></div>
                      <div>
                        <h4 className="font-bold text-sm uppercase tracking-wide">{item.title}</h4>
                        <p className="text-xs text-shop-muted">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Categories */}
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
                    <img src={products.find(p => p.category === cat)?.image || ''} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={cat} />
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

            {/* Bestsellers */}
            <section className="max-w-7xl mx-auto px-4 py-24">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-3xl font-bold tracking-tighter mb-2 uppercase">Elite Hardware</h2>
                  <p className="text-shop-muted text-sm font-medium">Top rated units by the Spark community.</p>
                </div>
                <button onClick={() => navigateToShop('All')} className="text-xs font-bold uppercase tracking-widest border-b border-shop-border pb-1 hover:text-shop-accent hover:border-shop-accent transition-all">View All</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.filter(p => p.isBestSeller).slice(0, 4).map(p => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    onClick={navigateToProduct} 
                    onAddToCart={addToCart} 
                    onQuickView={setQuickViewProduct} 
                    isWishlisted={isWishlisted(p.id)} 
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
              </div>
            </section>

            {/* Testimonials */}
            <section className="bg-shop-bg py-24 border-y border-shop-border">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter mb-16 uppercase">Pilot Transmissions</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { name: "Alex K.", role: "Architect", text: "The minimal aesthetics fit perfectly with my studio. Shipping was incredibly fast.", rating: 5 },
                    { name: "Jordan M.", role: "Tech Lead", text: "Autopilot's curation saves me hours of searching. Every product is a hit.", rating: 5 },
                    { name: "Casey R.", role: "Designer", text: "Premium quality that matches the description exactly. The packaging is an experience itself.", rating: 5 }
                  ].map((review, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }} className="bg-white p-8 rounded-2xl shadow-sm border border-shop-border text-left">
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

            {/* Newsletter */}
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

        {/* SHOP VIEW */}
        {view === 'shop' && (
          <motion.div key="shop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-8">
            <div className="max-w-7xl mx-auto px-4 min-h-screen">
              <div className="flex flex-col md:flex-row justify-between items-end border-b border-shop-border pb-8 mb-10 gap-6">
                <div>
                  <button onClick={navigateToHome} className="text-xs font-bold uppercase tracking-widest text-shop-muted hover:text-shop-primary mb-2 flex items-center gap-2"><ArrowLeft size={12}/> Back Home</button>
                  <h1 className="text-4xl lg:text-6xl font-bold tracking-tighter uppercase">{searchQuery ? `Search: "${searchQuery}"` : activeCategory}</h1>
                  {searchResults && <p className="text-shop-accent font-medium mt-2 flex items-center gap-2"><Sparkles size={16}/> AI Filter Active: {searchResults.reason || "Smart Match"}</p>}
                </div>
                {/* Mobile Filter Button */}
                <button 
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-shop-border rounded-xl text-sm font-medium hover:border-shop-accent transition-colors"
                >
                  <Filter size={16} />
                  Filters
                  {(filters.badges.length > 0 || filters.minRating > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) && (
                    <span className="w-5 h-5 bg-shop-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {filters.badges.length + (filters.minRating > 0 ? 1 : 0) + (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0)}
                    </span>
                  )}
                </button>
              </div>

              <div className="flex flex-col lg:flex-row gap-12">
                {/* Mobile Filters Drawer - Only renders when open */}
                <FiltersPanel
                  isOpen={showMobileFilters}
                  onClose={() => setShowMobileFilters(false)}
                  filters={filters}
                  onFiltersChange={setFilters}
                  maxPrice={maxPrice}
                  productCount={products.filter(p => {
                    if (searchResults) return searchResults.ids.includes(p.id);
                    return activeCategory === 'All' || p.category === activeCategory;
                  }).length}
                />

                {/* Desktop Filters Sidebar */}
                <aside className="hidden lg:block w-64 shrink-0">
                  <div className="sticky top-28 bg-white rounded-2xl border border-shop-border p-6 shadow-sm">
                    {/* Categories */}
                    <div className="mb-6 pb-6 border-b border-shop-border">
                      <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-shop-primary">Categories</h3>
                      <ul className="space-y-2">
                        {categories.map(cat => (
                          <li key={cat}>
                            <button 
                              onClick={() => { setActiveCategory(cat); setSearchResults(null); setSearchQuery(''); }}
                              className={`text-sm font-medium transition-colors hover:text-shop-accent ${activeCategory === cat && !searchResults ? 'text-shop-accent font-semibold' : 'text-shop-text-secondary'}`}
                            >
                              {cat}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Filters */}
                    <FiltersPanel
                      isOpen={false}
                      onClose={() => {}}
                      filters={filters}
                      onFiltersChange={setFilters}
                      maxPrice={maxPrice}
                      productCount={products.filter(p => {
                        if (searchResults) return searchResults.ids.includes(p.id);
                        return activeCategory === 'All' || p.category === activeCategory;
                      }).length}
                      mode="sidebar"
                    />
                  </div>
                </aside>

                <div className="flex-1">
                  <div className="lg:hidden flex overflow-x-auto gap-2 pb-6">
                    {categories.map(cat => (
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
                      products
                        .filter(p => {
                          // AI Search filter
                          if (searchResults) return searchResults.ids.includes(p.id);
                          // Category filter
                          if (activeCategory !== 'All' && p.category !== activeCategory) return false;
                          // Price filter
                          if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false;
                          // Rating filter
                          if (filters.minRating > 0 && p.rating < filters.minRating) return false;
                          // Badges filter
                          if (filters.badges.length > 0 && !filters.badges.some(badge => p[badge])) return false;
                          // Stock filter
                          if (filters.stockStatus.length > 0) {
                            const status = p.stock <= 0 ? 'out_of_stock' : p.stock <= 5 ? 'low_stock' : 'in_stock';
                            if (!filters.stockStatus.includes(status)) return false;
                          }
                          return true;
                        })
                        .sort((a, b) => {
                          switch (filters.sortBy) {
                            case 'price-low': return a.price - b.price;
                            case 'price-high': return b.price - a.price;
                            case 'newest': return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
                            case 'rating': return b.rating - a.rating;
                            case 'trending':
                            default: return (b.trendScore || 0) - (a.trendScore || 0);
                          }
                        })
                        .map(p => (
                          <ProductCard 
                            key={p.id} 
                            product={p} 
                            onClick={navigateToProduct} 
                            onAddToCart={addToCart} 
                            onQuickView={setQuickViewProduct} 
                            isWishlisted={isWishlisted(p.id)} 
                            onToggleWishlist={toggleWishlist}
                          />
                        ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* PRODUCT DETAIL VIEW */}
        {view === 'product-detail' && selectedProduct && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-8 max-w-7xl mx-auto px-4 pb-32">
            <button onClick={() => navigateToShop(activeCategory)} className="flex items-center gap-2 text-[10px] font-bold uppercase mb-8 text-shop-muted hover:text-shop-primary transition-colors">
              <ArrowLeft size={16}/> Back to Shop
            </button>
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 mb-20">
              <div className="relative group">
                <div className="aspect-square bg-white rounded-[2.5rem] overflow-hidden border p-2 shadow-sm">
                  <img src={selectedProduct.image} className="w-full h-full object-cover rounded-[2.2rem] transition-transform duration-1000 group-hover:scale-105" alt={selectedProduct.name} />
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
                    {isAddingToCart === selectedProduct.id ? 'Processing...' : 'Secure Unit'}
                  </button>
                  <button 
                    onClick={() => toggleWishlist(selectedProduct.id)} 
                    className={`px-8 border-2 rounded-2xl flex items-center justify-center transition-all ${isWishlisted(selectedProduct.id) ? 'bg-shop-sale/5 border-shop-sale text-shop-sale' : 'bg-white border-shop-border text-shop-text-secondary hover:border-shop-primary'}`}
                  >
                    <Heart size={20} fill={isWishlisted(selectedProduct.id) ? "currentColor" : "none"} />
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
                  Secure Hardware
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* WISHLIST VIEW */}
        {view === 'wishlist-page' && (
          <motion.div key="wishlist" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="pt-8 max-w-7xl mx-auto px-4 pb-32">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6">
              <div className="flex items-center gap-4">
                <button onClick={() => navigateToShop('All')} className="p-3 bg-white border rounded-2xl hover:bg-shop-bg active:scale-95 transition-all shadow-sm"><ArrowLeft size={20}/></button>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tighter uppercase">Saved Units</h1>
              </div>
            </div>
            
            {wishlistCount === 0 ? (
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
                  const p = products.find(item => item.id === id);
                  return p ? (
                    <ProductCard 
                      key={p.id} 
                      product={p} 
                      onClick={navigateToProduct} 
                      onAddToCart={addToCart} 
                      onQuickView={setQuickViewProduct} 
                      isWishlisted={true} 
                      onToggleWishlist={toggleWishlist} 
                    />
                  ) : null;
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* CART VIEW */}
        {view === 'cart-page' && (
          <motion.div key="cart" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} className="pt-8 max-w-7xl mx-auto px-4 pb-32">
            <div className="flex items-center gap-4 mb-10">
              <button onClick={() => navigateToShop('All')} className="p-3 bg-white border rounded-2xl shadow-sm"><ArrowLeft size={20}/></button>
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
                          <button onClick={() => removeFromCart(item.id)} className="text-shop-muted hover:text-shop-sale p-1 transition-colors"><X size={20}/></button>
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
                        <span className="text-3xl lg:text-4xl font-mono font-bold tracking-tighter text-shop-primary">${total.toFixed(2)}</span>
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

        {/* CHECKOUT VIEW */}
        {view === 'checkout' && (
          <CheckoutPage
            cart={cart}
            subtotal={subtotal}
            shipping={shipping}
            discount={discount}
            total={total}
            appliedPromo={appliedPromo}
            onBack={() => setView('cart-page')}
            onSuccess={handleCheckoutSuccess}
            clearCart={clearCart}
          />
        )}

        {/* SUCCESS VIEW */}
        {view === 'success' && completedOrder && (
          <SuccessPage
            order={completedOrder}
            onContinueShopping={navigateToHome}
          />
        )}

        {/* LEGACY ADMIN DASHBOARD - Access via URL only */}
        {isLegacyAdminRoute && (
          <AdminDashboard onExit={() => window.location.href = '/'} />
        )}

        {/* 404 VIEW */}
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
      <ExitIntentPopup onClaim={() => applyPromoCode('SPARKGEAR15')} />
      <AIAssistant 
        products={products} 
        onAddToCart={addToCart} 
        currentView={view} 
        navigateToProduct={navigateToProduct}
      />
      <QuickViewModal product={quickViewProduct} isOpen={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} onAddToCart={addToCart} />
      
      {/* Footer */}
      <footer className="bg-white border-t py-16 lg:py-24 px-4 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 mb-16">
            <div className="text-center lg:text-left">
              <button onClick={() => navigateToHome()} className="text-2xl font-bold tracking-tighter text-shop-primary uppercase mb-6">SPARKGEAR<span className="text-shop-accent italic font-display">COMMERCE</span></button>
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
            <p>© 2026 SPARKGEAR COMMERCE. GLOBAL LOGISTICS NODES ACTIVE.</p>
            <div className="flex gap-10">
              <button className="hover:text-shop-primary transition-colors">Security</button>
              <button className="hover:text-shop-primary transition-colors">Protocol</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 w-full bg-white/80 backdrop-blur-2xl border-t border-shop-border h-20 flex items-center justify-around z-50 px-6 pb-2 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <button onClick={() => navigateToHome()} className={`flex flex-col items-center gap-1.5 transition-all ${view === 'home' ? 'text-shop-accent scale-110' : 'text-shop-muted'}`}>
          <Home size={22}/>
          <span className="text-[8px] font-bold uppercase tracking-widest">Home</span>
        </button>
        <button onClick={() => navigateToShop('All')} className={`flex flex-col items-center gap-1.5 transition-all ${view === 'shop' ? 'text-shop-accent scale-110' : 'text-shop-muted'}`}>
          <LayoutGrid size={22}/>
          <span className="text-[8px] font-bold uppercase tracking-widest">Shop</span>
        </button>
        <div className="relative -mt-8">
          <button onClick={handleVoiceSearch} className={`w-14 h-14 premium-gradient rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-90 border-4 border-white ${isListening ? 'animate-pulse' : ''}`}>
            <Mic size={24} />
          </button>
        </div>
        <button onClick={() => setView('wishlist-page')} className={`flex flex-col items-center gap-1.5 transition-all ${view === 'wishlist-page' ? 'text-shop-sale scale-110' : 'text-shop-muted'}`}>
          <Heart size={22}/>
          <span className="text-[8px] font-bold uppercase tracking-widest">Saved</span>
        </button>
        <button onClick={() => setView('cart-page')} className={`flex flex-col items-center gap-1.5 relative transition-all ${view === 'cart-page' ? 'text-shop-accent scale-110' : 'text-shop-muted'}`}>
          <ShoppingBag size={22}/>
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-shop-sale text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-white">
              {itemCount}
            </span>
          )}
          <span className="text-[8px] font-bold uppercase tracking-widest">Cart</span>
        </button>
      </nav>
    </div>
  );
};

export default App;

