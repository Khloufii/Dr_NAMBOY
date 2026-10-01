import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { BlogPost } from '../../types';
import { BookOpen, Clock, User, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

export const BlogSection: React.FC = () => {
  const { t, language, isRtl } = useLanguage();
  const { navigate, navigateToBlogDetail } = useNavigation();
  const { blogPosts: posts } = useSiteContent();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = Array.from(new Set(posts.map(p => language === 'ar' ? p.categoryAr : p.categoryFr)));

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(p => (language === 'ar' ? p.categoryAr : p.categoryFr) === selectedCategory);

  return (
    <section id="blog" className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.blog.tagline}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.blog.title}
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            {t.blog.subtitle}
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {t.blog.filterAll}
          </button>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div>
                {/* Meta info */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3 font-medium">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px]">
                    {language === 'ar' ? post.categoryAr : post.categoryFr}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Title */}
                <h3
                  onClick={() => navigateToBlogDetail(post.id)}
                  className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-3 leading-snug cursor-pointer"
                >
                  {language === 'ar' ? post.titleAr : post.titleFr}
                </h3>

                {/* Summary */}
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {language === 'ar' ? post.summaryAr : post.summaryFr}
                </p>
              </div>

              {/* Author & Read button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      {post.author}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {post.authorRole}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigateToBlogDetail(post.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  <span>{t.blog.readArticle}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* View All Articles Link */}
        <div className="text-center pt-2">
          <button
            onClick={() => navigate('/conseils-sante')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 shadow-xs transition-colors cursor-pointer"
          >
            <span>{language === 'ar' ? 'عرض جميع النصائح والمقالات الطبية' : 'Consulter l’ensemble des articles de santé'}</span>
            <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </section>
  );
};
