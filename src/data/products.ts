import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  { 
    id: 'hd-1', 
    name: 'Minimalist Sculptural Vase', 
    price: 69.00, 
    description: 'Hand-finished ceramic vase with a matte tactile finish. Designed for modern architectural spaces, this piece brings an organic touch to any shelving unit or side table.', 
    category: 'Home Decor', 
    image: 'https://images.unsplash.com/photo-1581781870027-04212e231e96?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1581781870027-04212e231e96?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&q=80&w=800',
    ],
    rating: 4.8, 
    reviews: 42, 
    stock: 15, 
    soldToday: 12, 
    isBestSeller: true 
  },
  { 
    id: 'hd-2', 
    name: 'Floating Bookshelf Pro', 
    price: 89.00, 
    description: 'Invisible mounting system for books. Create a stunning wall display that defies gravity and showcases your favorite hardcovers with zero visible hardware.', 
    category: 'Home Decor', 
    image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800', 
    rating: 4.7, 
    reviews: 28, 
    stock: 8, 
    soldToday: 5, 
    isNew: true 
  },
  { 
    id: 'hd-3', 
    name: 'Abstract Silk Wall Art', 
    price: 149.00, 
    originalPrice: 199.00, 
    description: 'Premium silk-screened abstract print. Each piece is hand-pulled on museum-grade silk and framed in solid sustainable walnut for a timeless gallery feel.', 
    category: 'Home Decor', 
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800', 
    rating: 4.9, 
    reviews: 15, 
    stock: 5, 
    soldToday: 3, 
    isSale: true 
  },
  { 
    id: 'sg-1', 
    name: 'Smart Aroma Diffuser 2', 
    price: 79.00, 
    description: 'Ultra-quiet ultrasonic diffuser with app-controlled scent. Features 16 million colors and Alexa/HomeKit integration for the ultimate ambient atmosphere.', 
    category: 'Smart Gadgets', 
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=800', 
    rating: 4.6, 
    reviews: 156, 
    stock: 22, 
    soldToday: 48, 
    isBestSeller: true 
  },
  { 
    id: 'sg-2', 
    name: 'Levitating Phone Charger', 
    price: 129.00, 
    description: 'MagLev technology suspends your phone. The future of charging is here. Features 15W fast wireless charging and a polished carbon fiber base.', 
    category: 'Smart Gadgets', 
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=800', 
    rating: 4.5, 
    reviews: 64, 
    stock: 10, 
    soldToday: 15, 
    isNew: true 
  },
  { 
    id: 'sg-3', 
    name: 'Smart Mirror Pro', 
    price: 249.00, 
    originalPrice: 299.00, 
    description: 'Gesture-controlled mirror with display. A seamless 4K touch display behind high-transmittance glass. View weather, news, and your health stats while getting ready.', 
    category: 'Smart Gadgets', 
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800', 
    rating: 4.9, 
    reviews: 31, 
    stock: 3, 
    soldToday: 2, 
    isSale: true 
  },
  { 
    id: 'al-1', 
    name: 'Nebula Cloud Projector', 
    price: 119.00, 
    description: 'Transform any room into a galaxy. High-definition laser clouds and 12 astronomical projection modes create an immersive cosmic experience for work or rest.', 
    category: 'Ambient Lighting', 
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800', 
    rating: 4.8, 
    reviews: 210, 
    stock: 40, 
    soldToday: 67, 
    isBestSeller: true 
  },
  { 
    id: 'al-2', 
    name: 'Modular Hexagon Tiles', 
    price: 199.00, 
    description: 'Touch-sensitive modular light tiles. Snap them together in any pattern. Features music sync and dynamic flow effects controlled via your smartphone.', 
    category: 'Ambient Lighting', 
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800', 
    rating: 4.7, 
    reviews: 89, 
    stock: 12, 
    soldToday: 8 
  },
  { 
    id: 'al-3', 
    name: 'Smart Sunset Lamp Pro', 
    price: 59.00, 
    originalPrice: 79.00, 
    description: 'Perfect golden hour lighting anytime. Professional-grade optics create a realistic atmospheric sunset effect for content creation or meditation.', 
    category: 'Ambient Lighting', 
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800', 
    rating: 4.6, 
    reviews: 340, 
    stock: 55, 
    soldToday: 104, 
    isSale: true 
  },
  { 
    id: 'gi-1', 
    name: 'Night Sky Map Poster', 
    price: 49.00, 
    description: 'Custom astronomical map of the stars. Recreate the exact alignment of the cosmos for any date and location. Printed on 300gsm matte archival paper.', 
    category: 'Gift Ideas', 
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800', 
    rating: 4.9, 
    reviews: 75, 
    stock: 100, 
    soldToday: 23 
  },
  { 
    id: 'gi-2', 
    name: 'Solar System Crystal Ball', 
    price: 85.00, 
    description: 'K9 crystal sphere with 3D solar system. Intricate laser engraving inside a flawless optical crystal base. Features 7-color LED rotation base.', 
    category: 'Gift Ideas', 
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bc46?auto=format&fit=crop&q=80&w=800', 
    rating: 4.8, 
    reviews: 43, 
    stock: 18, 
    soldToday: 11, 
    isNew: true 
  },
  { 
    id: 'gi-3', 
    name: 'Premium Smart Mug', 
    price: 159.00, 
    description: 'Maintains coffee at exact temperature. Set your preferred heat level via the app and keep your beverage perfect for hours with its ceramic-coated titanium core.', 
    category: 'Gift Ideas', 
    image: 'https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?auto=format&fit=crop&q=80&w=800', 
    rating: 4.7, 
    reviews: 112, 
    stock: 25, 
    soldToday: 34, 
    isBestSeller: true 
  }
];

export const IMPULSE_ITEMS: Product[] = [
  { 
    id: 'imp-1', 
    name: 'Microfiber Tech Cloth', 
    price: 9.00, 
    description: 'Ultra-soft lens and screen cleaning cloth.', 
    category: 'Accessories', 
    image: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=80&w=400', 
    rating: 4.9, 
    reviews: 1520, 
    stock: 500 
  },
  { 
    id: 'imp-2', 
    name: 'Premium Sticker Pack', 
    price: 12.00, 
    description: 'Set of 12 holographic hardware stickers.', 
    category: 'Accessories', 
    image: 'https://images.unsplash.com/photo-1572375927902-1c09e2947199?auto=format&fit=crop&q=80&w=400', 
    rating: 4.8, 
    reviews: 840, 
    stock: 200 
  },
  { 
    id: 'imp-3', 
    name: 'Organic Scent Refill', 
    price: 19.00, 
    description: 'Natural lavender and eucalyptus oils.', 
    category: 'Accessories', 
    image: 'https://images.unsplash.com/photo-1540324155974-7523202daa3f?auto=format&fit=crop&q=80&w=400', 
    rating: 4.7, 
    reviews: 412, 
    stock: 150 
  }
];

export const CATEGORIES = ['All', 'Home Decor', 'Smart Gadgets', 'Ambient Lighting', 'Gift Ideas'];

