import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { useSiteContent } from '../context/SiteContentContext';
import { Clock, User, ChevronRight, Calendar, ArrowLeft, Share2, BookOpen, Stethoscope } from 'lucide-react';

interface BlogDetailPageProps {
  postId: string;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ postId }) => {
  const { t, language, isRtl } = useLanguage();
  const { navigate, navigateToBlogDetail } = useNavigation();
  const { blogPosts: posts } = useSiteContent();
  const post = posts.find(p => p.id === postId) || posts[0];

  const title = language === 'ar' ? post.titleAr : post.titleFr;
  const content = language === 'ar' ? post.contentAr : post.contentFr;
  const category = language === 'ar' ? post.categoryAr : post.categoryFr;

  const otherPosts = posts.filter(p => p.id !== post.id);

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12 animate-in fade-in duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
          <button onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors">
            {language === 'ar' ? 'الرئيسية' : 'Accueil'}
          </button>
          <ChevronRight className={`w-3.5 h-3.5 text-slate-400 ${isRtl ? 'rotate-180' : ''}`} />
          <button onClick={() => navigate('/conseils-sante')} className="hover:text-blue-600 transition-colors">
            {language === 'ar' ? 'نصائح طبية' : 'Conseils Santé'}
          </button>
          <ChevronRight className={`w-3.5 h-3.5 text-slate-400 ${isRtl ? 'rotate-180' : ''}`} />
          <span className="text-slate-900 font-bold truncate max-w-xs">{title}</span>
        </nav>

        {/* Article Box */}
        <article className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-12 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100">
            <span className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-xs uppercase tracking-wider">
              {category}
            </span>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            {title}
          </h1>

          {/* Author Byline */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block leading-tight">
                {post.author}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {post.authorRole} • Cabinet Médical Salé Bettana
              </span>
            </div>
          </div>

          {/* Body Content */}
          <div className="prose prose-slate max-w-none text-slate-700 text-base leading-relaxed whitespace-pre-line pt-2">
            {content}
          </div>

          {/* Bottom sharing & back */}
          <div className="pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => navigate('/conseils-sante')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              <span>{language === 'ar' ? 'العودة لقائمة المقالات' : 'Retour aux articles'}</span>
            </button>

            <a
              href={`https://wa.me/212770558299?text=${encodeURIComponent(`Bonjour Dr. NAMBOY, j'ai lu votre article : ${post.titleFr}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
            >
              <span>{language === 'ar' ? 'استشارة الطبيب حول هذا الموضوع' : 'Poser une question au Dr. NAMBOY'}</span>
            </a>
          </div>
        </article>

        {/* Other articles */}
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-bold text-slate-900">
            {language === 'ar' ? 'مقالات طبية أخرى قد تهمكم' : 'Autres Conseils Santé'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {otherPosts.slice(0, 2).map((other) => (
              <div
                key={other.id}
                onClick={() => navigateToBlogDetail(other.id)}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer space-y-2 group"
              >
                <span className="text-[11px] font-bold text-blue-600 uppercase">
                  {language === 'ar' ? other.categoryAr : other.categoryFr}
                </span>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {language === 'ar' ? other.titleAr : other.titleFr}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
