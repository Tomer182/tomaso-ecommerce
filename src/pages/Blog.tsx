import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { ARTICLES } from '../data/articles';

export const BlogPage = ({ onNavigate }: { onNavigate: (slug: string) => void }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-shop-primary/5 to-shop-accent/5">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="text-shop-accent" size={28} />
              <span className="text-shop-accent font-bold text-lg uppercase tracking-wider">Blog & Insights</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-shop-primary">
              Life, Design & Innovation
            </h1>
            
            <p className="text-xl md:text-2xl text-shop-text-secondary max-w-3xl mx-auto">
              Practical guides, honest reviews, and real experiences. No fluff, just value.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ARTICLES.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <button
                  onClick={() => onNavigate(article.slug)}
                  className="group block h-full text-left w-full"
                >
                  <article className="h-full bg-white border border-shop-border rounded-3xl overflow-hidden hover:border-shop-accent hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-shop-bg">
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="text-shop-muted" size={64} />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Category Badge */}
                      <div className="absolute bottom-4 right-4">
                        <span className="px-3 py-1 bg-shop-accent text-white text-xs font-bold uppercase tracking-wider rounded-full">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-shop-primary mb-3 line-clamp-2 group-hover:text-shop-accent transition-colors">
                        {article.title}
                      </h2>
                      
                      <p className="text-shop-text-secondary mb-4 line-clamp-3 text-sm">
                        {article.description}
                      </p>
                      
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-shop-muted uppercase tracking-wider font-bold">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{article.readingTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{article.publishDate}</span>
                        </div>
                      </div>
                      
                      {/* Read More */}
                      <div className="mt-4 flex items-center gap-2 text-shop-accent font-bold text-sm uppercase tracking-wider group-hover:gap-3 transition-all">
                        <span>Read Article</span>
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </article>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-shop-primary/5 to-shop-accent/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <BookOpen className="mx-auto text-shop-accent mb-6" size={48} />
            <h2 className="text-3xl md:text-4xl font-bold text-shop-primary mb-4">
              Want More Insights?
            </h2>
            <p className="text-xl text-shop-text-secondary mb-8">
              Join our newsletter for weekly tips, exclusive content, and early access to new products.
            </p>
            <button className="btn-cta px-8 py-4">
              Subscribe to Newsletter
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export const ArticlePage = ({ 
  slug, 
  onBack, 
  onNavigate 
}: { 
  slug: string; 
  onBack: () => void;
  onNavigate: (slug: string) => void;
}) => {
  const article = ARTICLES.find(a => a.slug === slug);
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <button onClick={onBack} className="text-shop-accent hover:underline font-bold">
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  const relatedArticles = ARTICLES
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  // Load markdown content
  const [content, setContent] = React.useState<string>('');
  
  React.useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(`/content/articles/${article.content}`);
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error('Error loading article:', error);
        setContent('# Content Loading Error\n\nSorry, we couldn\'t load this article. Please try again later.');
      }
    };
    
    loadContent();
  }, [article.content]);

  // Simple markdown to HTML converter (basic implementation)
  const renderMarkdown = (md: string) => {
    return md
      .split('\n')
      .map((line, i) => {
        // Headers
        if (line.startsWith('# ')) return <h1 key={i} className="text-4xl font-bold text-shop-primary mt-8 mb-4">{line.substring(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-3xl font-bold text-shop-primary mt-8 mb-4">{line.substring(3)}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-2xl font-bold text-shop-primary mt-6 mb-3">{line.substring(4)}</h3>;
        
        // Bold
        const boldLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-shop-primary">$1</strong>');
        
        // Links
        const linkLine = boldLine.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-shop-accent hover:underline">$1</a>');
        
        // Paragraphs
        if (line.trim() && !line.startsWith('#') && !line.startsWith('-') && !line.startsWith('*')) {
          return <p key={i} className="text-shop-text-secondary leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: linkLine }} />;
        }
        
        return null;
      })
      .filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-shop-primary/5 to-shop-accent/5">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Link */}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-shop-text-secondary hover:text-shop-primary mb-8 transition-colors font-bold uppercase tracking-wider text-xs"
          >
            <ArrowRight size={20} className="rotate-180" />
            <span>Back to Blog</span>
          </button>

          {/* Category */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-1.5 bg-shop-accent text-white text-xs font-bold uppercase tracking-wider rounded-full">
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-shop-primary mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-shop-text-secondary text-sm font-bold uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{article.readingTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{article.publishDate}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <article className="prose prose-lg max-w-none">
            {content ? renderMarkdown(content) : (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-shop-accent"></div>
                <p className="mt-4 text-shop-text-secondary">Loading article...</p>
              </div>
            )}
          </article>

          {/* Keywords */}
          <div className="mt-12 pt-8 border-t border-shop-border">
            <div className="flex flex-wrap gap-2">
              {article.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-shop-bg border border-shop-border rounded-full text-xs text-shop-text-secondary font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16 bg-shop-bg">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-shop-primary mb-8 uppercase tracking-wider">
              Related Articles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <button
                  key={relatedArticle.id}
                  onClick={() => onNavigate(relatedArticle.slug)}
                  className="group block text-left"
                >
                  <article className="bg-white border border-shop-border rounded-2xl overflow-hidden hover:border-shop-accent hover:shadow-xl transition-all">
                    <div className="h-40 overflow-hidden bg-shop-bg flex items-center justify-center">
                      <BookOpen className="text-shop-muted" size={48} />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-shop-primary group-hover:text-shop-accent transition-colors line-clamp-2">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-xs text-shop-muted mt-2 uppercase tracking-wider font-bold">{relatedArticle.readingTime}</p>
                    </div>
                  </article>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Sparkles className="mx-auto text-shop-accent mb-6" size={48} />
          <h2 className="text-3xl md:text-4xl font-bold text-shop-primary mb-4">
            Enjoyed This Article?
          </h2>
          <p className="text-xl text-shop-text-secondary mb-8">
            Explore more insights, guides, and reviews on our blog
          </p>
          <button
            onClick={onBack}
            className="btn-cta px-8 py-4"
          >
            View All Articles
          </button>
        </div>
      </section>
    </div>
  );
};

