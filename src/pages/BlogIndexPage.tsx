import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { useSiteContent } from '../context/SiteContentContext';
import { BlogPost } from '../types';
import { BookOpen, Clock, User, ChevronRight, Sparkles, Search, ArrowRight } from 'lucide-react';

export const BlogIndexPage: React.FC = () => {
  const { t, language, isRtl } = useLanguage();
  const { navigateToBlogDetail } = useNavigation();
  const { blogPosts: posts } = useSiteContent();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const categories = Array.from(new Set(posts.map(p => language === 'ar' ? p.categoryAr : p.categoryFr)));

  const filteredPosts = posts.filter(p => {
    const categoryMatches = selectedCategory === 'all' || (language === 'ar' ? p.categoryAr : p.categoryFr) === selectedCategory;
    const title = language === 'ar' ? p.titleAr : p.titleFr;
    const summary = language === 'ar' ? p.summaryAr : p.summaryFr;
    const searchMatches = title.toLowerCase().includes(search.toLowerCase()) || summary.toLowerCase().includes(search.toLowerCase());
    return categoryMatches && searchMatches;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.blog.tagline}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.blog.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {t.blog.subtitle}
          </p>
        </div>

        {/* Search & Categories Bar */}
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder={language === 'ar' ? 'ابحث في النصائح والمقالات الطبية...' : 'Rechercher un sujet de santé (cœur, grossesse, fièvre, urgence)...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden shadow-xs"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap items-center justify-center gap-2">
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
        </div>

        {/* Articles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {filteredPosts.map((post) => {
            const title = language === 'ar' ? post.titleAr : post.titleFr;
            const summary = language === 'ar' ? post.summaryAr : post.summaryFr;
            const category = language === 'ar' ? post.categoryAr : post.categoryFr;

            return (
              <article
                key={post.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px]">
                      {category}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <h2
                    onClick={() => navigateToBlogDetail(post.id)}
                    className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer leading-snug"
                  >
                    {title}
                  </h2>

                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {summary}
                  </p>
                </div>

                <div className="pt-5 border-t border-slate-100 mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
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
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    <span>{t.blog.readArticle}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};
