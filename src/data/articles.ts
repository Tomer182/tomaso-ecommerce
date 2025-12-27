// SparkGear Blog Articles - SEO & Content Marketing

export interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  readingTime: string;
  publishDate: string;
  keywords: string[];
  image: string;
  content: string;
}

export const ARTICLES: Article[] = [
  {
    id: "1",
    slug: "smart-home-revolution-2025",
    title: "The Smart Home Revolution of 2025: Why Everyone's Upgrading Right Now",
    description: "Real talk about smart home technology in 2025 - actual costs, savings, and whether it's worth it. No marketing fluff, just honest experience.",
    category: "Home Technology",
    readingTime: "10 min read",
    publishDate: "December 2025",
    keywords: ["smart home", "home automation", "IoT", "smart lighting", "home technology", "energy savings"],
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=600&fit=crop",
    content: "01-smart-home-revolution-2025.md"
  },
  {
    id: "2",
    slug: "minimalist-living-ultimate-guide",
    title: "Minimalist Living in 2025: The Ultimate Guide to Owning Less and Living More",
    description: "From owning too much stuff to living with intention. A brutally honest guide to minimalism that actually works for regular people.",
    category: "Lifestyle",
    readingTime: "12 min read",
    publishDate: "December 2025",
    keywords: ["minimalism", "decluttering", "simple living", "minimalist lifestyle", "downsizing", "intentional living"],
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=600&fit=crop",
    content: "02-minimalist-living-ultimate-guide.md"
  },
  {
    id: "3",
    slug: "psychology-color-home-design",
    title: "The Psychology of Color in Home Design: Science-Backed Guide",
    description: "Why your paint color matters more than you think. Science-based guide to choosing colors that actually affect your mood and productivity.",
    category: "Home Design",
    readingTime: "11 min read",
    publishDate: "December 2025",
    keywords: ["color psychology", "interior design", "home decor", "paint colors", "room design", "home aesthetics"],
    image: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=800&h=600&fit=crop",
    content: "03-psychology-color-home-design.md"
  },
  {
    id: "4",
    slug: "sustainable-living-practical-guide",
    title: "Sustainable Living Without the Pretentious BS: A Realistic Guide",
    description: "Real sustainability advice for people with jobs and budgets. Save money, reduce waste, and skip the judgment.",
    category: "Sustainability",
    readingTime: "10 min read",
    publishDate: "December 2025",
    keywords: ["sustainability", "eco-friendly living", "green lifestyle", "reduce waste", "environmental impact", "conscious consumption"],
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop",
    content: "04-sustainable-living-practical-guide.md"
  },
  {
    id: "5",
    slug: "work-from-home-productivity-setup",
    title: "Work From Home: The Complete Productivity Setup Guide (2025 Edition)",
    description: "Five years of WFH experience distilled into one guide. The gear that matters, the routines that work, and the boundaries that save your sanity.",
    category: "Productivity",
    readingTime: "11 min read",
    publishDate: "December 2025",
    keywords: ["work from home", "home office setup", "remote work", "productivity", "ergonomics", "WFH tips"],
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop",
    content: "05-work-from-home-productivity-setup.md"
  },
  {
    id: "6",
    slug: "perfect-gift-giving-guide",
    title: "The Science of Perfect Gift Giving: A Data-Driven Guide",
    description: "After tracking 200+ gifts over 5 years, here's what actually makes a great gift. Hint: it's not about the price tag.",
    category: "Gift Guides",
    readingTime: "9 min read",
    publishDate: "December 2025",
    keywords: ["gift giving", "gift ideas", "thoughtful gifts", "present ideas", "gift guide", "shopping tips"],
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&h=600&fit=crop",
    content: "06-perfect-gift-giving-guide.md"
  },
  {
    id: "7",
    slug: "better-sleep-science-guide",
    title: "The Ultimate Guide to Better Sleep: Science-Based Strategies That Actually Work",
    description: "From sleeping 5 terrible hours to 8 great ones. Evidence-based sleep strategies that don't require expensive gadgets or supplements.",
    category: "Health & Wellness",
    readingTime: "10 min read",
    publishDate: "December 2025",
    keywords: ["better sleep", "sleep quality", "sleep science", "insomnia solutions", "sleep hygiene", "healthy sleep"],
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=600&fit=crop",
    content: "07-better-sleep-science-guide.md"
  },
  {
    id: "8",
    slug: "digital-minimalism-complete-guide",
    title: "Decluttering Digital Life: The Complete Guide to Digital Minimalism",
    description: "Cut screen time from 8 hours to 2 hours per day. Practical strategies to take back your attention from your devices.",
    category: "Digital Wellness",
    readingTime: "9 min read",
    publishDate: "December 2025",
    keywords: ["digital minimalism", "screen time", "phone addiction", "digital detox", "productivity", "focus"],
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
    content: "08-digital-minimalism-complete-guide.md"
  },
  {
    id: "9",
    slug: "budget-home-upgrades-guide",
    title: "Budget-Friendly Home Upgrades That Actually Increase Value",
    description: "Sold my apartment for $18K over asking after spending less than $2K on upgrades. Here's exactly what worked.",
    category: "Home Improvement",
    readingTime: "10 min read",
    publishDate: "December 2025",
    keywords: ["home upgrades", "home improvement", "DIY projects", "home value", "budget renovations", "home staging"],
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
    content: "09-budget-home-upgrades-guide.md"
  },
  {
    id: "10",
    slug: "stress-management-science-guide",
    title: "The Ultimate Guide to Stress Management: Science-Backed Techniques",
    description: "From panic attacks to peace of mind. Evidence-based stress management strategies that address symptoms, daily habits, and root causes.",
    category: "Mental Health",
    readingTime: "11 min read",
    publishDate: "December 2025",
    keywords: ["stress management", "anxiety relief", "mental health", "wellness", "stress reduction", "self-care"],
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
    content: "10-stress-management-science-guide.md"
  }
];

// Get article by slug
export const getArticleBySlug = (slug: string) => 
  ARTICLES.find(article => article.slug === slug);

// Get related articles (same category, exclude current)
export const getRelatedArticles = (articleId: string, limit: number = 3) => {
  const currentArticle = ARTICLES.find(a => a.id === articleId);
  if (!currentArticle) return [];
  
  return ARTICLES
    .filter(a => a.id !== articleId && a.category === currentArticle.category)
    .slice(0, limit);
};

// Get all categories
export const getCategories = () => {
  const categories = ARTICLES.map(a => a.category);
  return Array.from(new Set(categories));
};

