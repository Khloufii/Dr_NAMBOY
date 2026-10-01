import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Star,
  Quote,
  MessageSquarePlus,
  Send,
  CheckCircle2,
  Loader2,
  X,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import {
  type Review,
  subscribeToReviews,
  addReview,
  REQUIRE_MODERATION,
} from '../../services/dataService';

const PAGE_SIZE = 6;
const COOLDOWN_MS = 10 * 60 * 1000; // 10 min entre deux avis depuis le même appareil
const COOLDOWN_KEY = 'namboy_review_last_submit';
const AVATAR_COLORS = [
  'from-blue-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-violet-500 to-purple-500',
  'from-sky-500 to-cyan-500',
];

/* ------------------------------------------------------------------ */
/* Textes FR / AR                                                      */
/* ------------------------------------------------------------------ */
const TEXTS = {
  fr: {
    tagline: 'Avis des patients',
    title: 'Ils nous ont fait confiance',
    subtitle:
      'Les retours de nos patients nous aident à améliorer chaque jour la qualité des soins.',
    based: (n: number) => `Basé sur ${n} avis`,
    noRating: 'Aucune note pour le moment',
    cta: 'Donner mon avis',
    close: 'Fermer',
    formTitle: 'Partagez votre expérience',
    formSub: 'Une note, un commentaire, ou les deux. Cela prend 30 secondes.',
    name: 'Votre nom ou prénom',
    namePh: 'Ex : Karim B.',
    rating: 'Votre note',
    ratingHint: 'Facultatif si vous écrivez un commentaire',
    comment: 'Votre commentaire',
    commentPh: 'Racontez-nous votre visite au cabinet…',
    optional: '(facultatif si vous mettez une note)',
    send: 'Publier mon avis',
    sending: 'Envoi…',
    privacy: 'N’indiquez aucune information médicale personnelle.',
    errName: 'Veuillez saisir votre nom (2 caractères minimum).',
    errEmpty: 'Ajoutez une note, ou un commentaire d’au moins 5 caractères.',
    errCooldown: 'Vous avez déjà envoyé un avis récemment. Merci !',
    errSend: 'Impossible d’envoyer votre avis. Vérifiez votre connexion et réessayez.',
    thanksTitle: 'Merci pour votre avis !',
    thanksLive: 'Votre avis est publié et visible ci-dessous.',
    thanksMod: 'Votre avis sera visible après validation par le cabinet.',
    more: 'Voir plus d’avis',
    empty: 'Aucun avis pour le moment. Soyez le premier à partager votre expérience !',
    loadErr: 'Impossible de charger les avis pour le moment.',
    stars: ['Mauvais', 'Moyen', 'Correct', 'Très bien', 'Excellent'],
    locale: 'fr-FR',
  },
  ar: {
    tagline: 'آراء المرضى',
    title: 'ثقتكم هي أكبر دافع لنا',
    subtitle: 'تساعدنا ملاحظات مرضانا على تحسين جودة الرعاية يوماً بعد يوم.',
    based: (n: number) => `بناءً على ${n} تقييم`,
    noRating: 'لا توجد تقييمات بعد',
    cta: 'أضف رأيك',
    close: 'إغلاق',
    formTitle: 'شاركنا تجربتك',
    formSub: 'تقييم بالنجوم أو تعليق أو كلاهما. لن يستغرق الأمر سوى 30 ثانية.',
    name: 'اسمك أو اسمك الأول',
    namePh: 'مثال : كريم ب.',
    rating: 'تقييمك',
    ratingHint: 'اختياري إذا كتبت تعليقاً',
    comment: 'تعليقك',
    commentPh: 'حدثنا عن زيارتك للعيادة…',
    optional: '(اختياري إذا وضعت تقييماً)',
    send: 'نشر رأيي',
    sending: 'جارٍ الإرسال…',
    privacy: 'يرجى عدم كتابة أي معلومات طبية شخصية.',
    errName: 'المرجو إدخال اسمك (حرفان على الأقل).',
    errEmpty: 'أضف تقييماً بالنجوم أو تعليقاً من 5 أحرف على الأقل.',
    errCooldown: 'لقد أرسلت رأيك للتو. شكراً لك !',
    errSend: 'تعذر إرسال رأيك. تحقق من اتصالك وأعد المحاولة.',
    thanksTitle: 'شكراً على رأيك !',
    thanksLive: 'تم نشر رأيك وهو ظاهر أدناه.',
    thanksMod: 'سيظهر رأيك بعد مراجعته من طرف العيادة.',
    more: 'عرض المزيد من الآراء',
    empty: 'لا توجد آراء بعد. كن أول من يشارك تجربته !',
    loadErr: 'تعذر تحميل الآراء حالياً.',
    stars: ['سيئ', 'متوسط', 'مقبول', 'جيد جداً', 'ممتاز'],
    locale: 'ar-MA',
  },
} as const;

/* ------------------------------------------------------------------ */
/* Petits composants                                                   */
/* ------------------------------------------------------------------ */
const StarsRow: React.FC<{ value: number; className?: string }> = ({
  value,
  className = 'h-4 w-4',
}) => (
  <div className="flex items-center gap-0.5" role="img" aria-label={`${value}/5`} dir="ltr">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`${className} ${
          i <= Math.round(value)
            ? 'fill-amber-400 text-amber-400'
            : 'fill-slate-200 text-slate-200'
        }`}
      />
    ))}
  </div>
);

const StarPicker: React.FC<{
  value: number;
  onChange: (v: number) => void;
  labels: readonly string[];
  groupLabel: string;
}> = ({ value, onChange, labels, groupLabel }) => {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onChange(Math.min(5, value + 1));
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onChange(Math.max(0, value - 1));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div
        role="radiogroup"
        aria-label={groupLabel}
        onKeyDown={onKey}
        onMouseLeave={() => setHover(0)}
        className="flex items-center gap-1"
        dir="ltr"
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={value === i}
            aria-label={`${i}/5 — ${labels[i - 1]}`}
            tabIndex={value === i || (value === 0 && i === 1) ? 0 : -1}
            onMouseEnter={() => setHover(i)}
            onClick={() => onChange(value === i ? 0 : i)}
            className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Star
              className={`h-8 w-8 transition-colors sm:h-9 sm:w-9 ${
                i <= shown
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-slate-100 text-slate-300'
              }`}
            />
          </button>
        ))}
      </div>
      <span className="min-w-[5rem] text-sm font-bold text-amber-600">
        {shown > 0 ? labels[shown - 1] : ''}
      </span>
    </div>
  );
};

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('') || '?';

const colorOf = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
};

/* ------------------------------------------------------------------ */
/* Section principale                                                  */
/* ------------------------------------------------------------------ */
export const ReviewsSection: React.FC = () => {
  const { language, isRtl } = useLanguage();
  const tx = TEXTS[language === 'ar' ? 'ar' : 'fr'];
  const reduced = useReducedMotion();

  const sectionRef = useRef<HTMLElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState('');

  /* Abonnement temps réel à Firestore */
  useEffect(() => {
    const unsub = subscribeToReviews(
      (items) => {
        setReviews(items);
        setLoading(false);
        setLoadError(false);
      },
      () => {
        setLoading(false);
        setLoadError(true);
      },
    );
    return unsub;
  }, []);

  /* Ouverture automatique via le QR code : /?avis=1#avis */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('avis') === '1' || window.location.hash === '#avis') {
      setShowForm(true);
      const id = window.setTimeout(() => {
        sectionRef.current?.scrollIntoView({
          behavior: reduced ? 'auto' : 'smooth',
          block: 'start',
        });
      }, 500);
      return () => window.clearTimeout(id);
    }
  }, [reduced]);

  /* Statistiques */
  const stats = useMemo(() => {
    const rated = reviews.filter((r) => r.rating > 0);
    const avg = rated.length
      ? rated.reduce((s, r) => s + r.rating, 0) / rated.length
      : 0;
    const dist = [5, 4, 3, 2, 1].map((n) => ({
      n,
      count: rated.filter((r) => r.rating === n).length,
    }));
    return { avg, ratedCount: rated.length, dist };
  }, [reviews]);

  const formatDate = (d: Date | null) =>
    new Intl.DateTimeFormat(tx.locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d ?? new Date());

  const resetForm = () => {
    setName('');
    setRating(0);
    setComment('');
    setError('');
    setStatus('idle');
  };

  const openForm = () => {
    setShowForm(true);
    setStatus('idle');
    window.setTimeout(
      () =>
        formRef.current?.scrollIntoView({
          behavior: reduced ? 'auto' : 'smooth',
          block: 'center',
        }),
      100,
    );
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Champ piège anti-robots : on fait semblant d'accepter
    if (honeypot) {
      setStatus('done');
      return;
    }

    const n = name.trim();
    const c = comment.trim();
    if (n.length < 2) return setError(tx.errName);
    if (rating === 0 && c.length < 5) return setError(tx.errEmpty);

    try {
      const last = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
      if (last && Date.now() - last < COOLDOWN_MS) return setError(tx.errCooldown);
    } catch {
      /* localStorage indisponible : on ignore */
    }

    setError('');
    setStatus('sending');
    try {
      await addReview({
        name: n,
        rating,
        comment: c,
        lang: language === 'ar' ? 'ar' : 'fr',
      });
      try {
        localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      } catch {
        /* ignore */
      }
      setStatus('done');
    } catch {
      setStatus('idle');
      setError(tx.errSend);
    }
  };

  const shown = reviews.slice(0, visible);

  return (
    <section
      id="avis"
      ref={sectionRef}
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative scroll-mt-20 overflow-hidden bg-slate-50 py-20 sm:py-24"
    >
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-amber-100/50 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-blue-100/50 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mx-auto mb-12 max-w-3xl space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 shadow-sm">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-amber-700">
              {tx.tagline}
            </span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {tx.title}
          </h2>
          <p className="text-base leading-relaxed text-slate-600 sm:text-lg">{tx.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* ===================== RÉSUMÉ ===================== */}
          <aside className="lg:col-span-4">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <div className="flex items-end gap-4">
                <span className="text-6xl font-black leading-none tracking-tight text-slate-900" dir="ltr">
                  {stats.ratedCount ? stats.avg.toFixed(1) : '–'}
                </span>
                <div className="space-y-1 pb-1">
                  <StarsRow value={stats.avg} className="h-5 w-5" />
                  <p className="text-xs font-semibold text-slate-500">
                    {stats.ratedCount ? tx.based(stats.ratedCount) : tx.noRating}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-2" dir="ltr">
                {stats.dist.map(({ n, count }) => {
                  const pct = stats.ratedCount ? (count / stats.ratedCount) * 100 : 0;
                  return (
                    <div key={n} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <span className="flex w-6 items-center gap-0.5">
                        {n}
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <motion.div
                          initial={reduced ? false : { width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                        />
                      </div>
                      <span className="w-6 text-end tabular-nums text-slate-400">{count}</span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={showForm ? closeForm : openForm}
                className="group relative mt-6 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-shadow hover:shadow-blue-600/40"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                {showForm ? <X className="h-4 w-4" /> : <MessageSquarePlus className="h-4 w-4" />}
                <span className="relative">{showForm ? tx.close : tx.cta}</span>
              </button>
            </div>
          </aside>

          {/* ===================== FORMULAIRE + LISTE ===================== */}
          <div className="space-y-6 lg:col-span-8">
            <AnimatePresence initial={false}>
              {showForm && (
                <motion.div
                  ref={formRef}
                  initial={reduced ? false : { opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden rounded-3xl border border-blue-200/70 bg-white shadow-lg shadow-blue-500/5"
                >
                  {status === 'done' ? (
                    <div className="flex flex-col items-center gap-3 p-8 text-center sm:p-12">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <CheckCircle2 className="h-8 w-8" />
                      </span>
                      <h3 className="text-xl font-black text-slate-900">{tx.thanksTitle}</h3>
                      <p className="max-w-md text-sm text-slate-600">
                        {REQUIRE_MODERATION ? tx.thanksMod : tx.thanksLive}
                      </p>
                      <button
                        onClick={closeForm}
                        className="mt-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        {tx.close}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={onSubmit} noValidate className="space-y-5 p-6 sm:p-8">
                      <div>
                        <h3 className="text-xl font-black tracking-tight text-slate-900">
                          {tx.formTitle}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">{tx.formSub}</p>
                      </div>

                      {/* Nom */}
                      <div className="space-y-1.5">
                        <label htmlFor="rv-name" className="text-sm font-bold text-slate-700">
                          {tx.name}
                        </label>
                        <input
                          id="rv-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          maxLength={60}
                          autoComplete="given-name"
                          placeholder={tx.namePh}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />
                      </div>

                      {/* Étoiles */}
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-sm font-bold text-slate-700">{tx.rating}</span>
                          <span className="text-xs text-slate-400">{tx.ratingHint}</span>
                        </div>
                        <StarPicker
                          value={rating}
                          onChange={setRating}
                          labels={tx.stars}
                          groupLabel={tx.rating}
                        />
                      </div>

                      {/* Commentaire */}
                      <div className="space-y-1.5">
                        <label htmlFor="rv-comment" className="flex flex-wrap items-baseline gap-2 text-sm font-bold text-slate-700">
                          {tx.comment}
                          <span className="text-xs font-normal text-slate-400">{tx.optional}</span>
                        </label>
                        <textarea
                          id="rv-comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          maxLength={600}
                          rows={4}
                          placeholder={tx.commentPh}
                          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            {tx.privacy}
                          </span>
                          <span dir="ltr" className="tabular-nums">
                            {comment.length}/600
                          </span>
                        </div>
                      </div>

                      {/* Honeypot (invisible pour les humains) */}
                      <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        className="absolute -left-[9999px] h-0 w-0 opacity-0"
                      />

                      {error && (
                        <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        {status === 'sending' ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {tx.sending}
                          </>
                        ) : (
                          <>
                            <Send className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
                            {tx.send}
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chargement */}
            {loading && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-full bg-slate-200" />
                      <div className="space-y-2">
                        <div className="h-3.5 w-28 rounded bg-slate-200" />
                        <div className="h-3 w-20 rounded bg-slate-200" />
                      </div>
                    </div>
                    <div className="h-3 w-full rounded bg-slate-200" />
                    <div className="h-3 w-4/5 rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            )}

            {loadError && !loading && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm font-semibold text-red-700">
                {tx.loadErr}
              </div>
            )}

            {!loading && !loadError && reviews.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <Quote className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                <p className="text-sm font-semibold text-slate-500">{tx.empty}</p>
              </div>
            )}

            {/* Liste des avis */}
            {shown.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {shown.map((r, idx) => (
                  <motion.article
                    key={r.id}
                    layout={!reduced}
                    initial={reduced ? false : { opacity: 0, y: 16 }}
                    whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.4, delay: Math.min((idx % PAGE_SIZE) * 0.05, 0.25) }}
                    className="relative flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg hover:shadow-slate-900/5"
                  >
                    <Quote className="absolute end-4 top-4 h-8 w-8 text-slate-100" />

                    <header className="flex items-center gap-3">
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-black text-white shadow-md ${colorOf(r.name)}`}
                      >
                        {initialsOf(r.name)}
                      </span>
                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-extrabold text-slate-900">{r.name}</h4>
                        <time className="text-xs text-slate-400">{formatDate(r.createdAt)}</time>
                      </div>
                    </header>

                    {r.rating > 0 && (
                      <div className="mt-3">
                        <StarsRow value={r.rating} />
                      </div>
                    )}

                    {r.comment && (
                      <p
                        dir={r.lang === 'ar' ? 'rtl' : 'ltr'}
                        className="mt-3 whitespace-pre-line break-words text-sm leading-relaxed text-slate-600"
                      >
                        {r.comment}
                      </p>
                    )}
                  </motion.article>
                ))}
              </div>
            )}

            {reviews.length > visible && (
              <div className="text-center">
                <button
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  {tx.more}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};