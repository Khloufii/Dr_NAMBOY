import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import {
  Download,
  FileText,
  Printer,
  Link as LinkIcon,
  Star,
  Loader2,
  AlertCircle,
  Phone,
  MapPin,
} from 'lucide-react';

/* A4 à 96 dpi : 210 mm x 297 mm = 794 x 1123 px */
const A4_W = 794;
const A4_H = 1123;
/* Export x3 : 2382 x 3369 px (≈ 300 dpi, qualité impression) */
const EXPORT_RATIO = 3;

const STEPS = [
  { fr: 'Scannez le code', ar: 'امسح الرمز' },
  { fr: 'Notez avec des étoiles', ar: 'قيّم بالنجوم' },
  { fr: 'Écrivez votre commentaire', ar: 'اكتب تعليقك' },
];

export const ReviewsQrCard: React.FC = () => {
  const [baseUrl, setBaseUrl] = useState(
    typeof window !== 'undefined' ? window.location.origin : '',
  );
  const [busy, setBusy] = useState<null | 'png' | 'pdf'>(null);
  const [error, setError] = useState('');
  const [scale, setScale] = useState(0.7);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const posterRef = useRef<HTMLDivElement | null>(null);

  /* URL propre : ajoute https:// si absent, retire le "/" final */
  const cleanBase = useMemo(() => {
    let u = baseUrl.trim().replace(/\/+$/, '');
    if (u && !/^https?:\/\//i.test(u)) u = `https://${u}`;
    return u;
  }, [baseUrl]);

  /* Ouvre directement la section avis + le formulaire */
  const reviewUrl = `${cleanBase}/?avis=1#avis`;
  const displayHost = cleanBase.replace(/^https?:\/\//i, '');
  const isLocal = /localhost|127\.0\.0\.1|192\.168\./i.test(cleanBase);

  /* Aperçu : réduit l'affiche A4 pour qu'elle tienne dans la page */
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / A4_W));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Capture l'affiche en taille réelle A4, sans le zoom de l'aperçu */
  const capture = async () => {
    const node = posterRef.current;
    if (!node) throw new Error('Affiche introuvable');
    const fonts = (document as any).fonts;
    if (fonts?.ready) await fonts.ready;

    return toPng(node, {
      pixelRatio: EXPORT_RATIO,
      cacheBust: true,
      backgroundColor: '#ffffff',
      width: A4_W,
      height: A4_H,
      style: { transform: 'none', transformOrigin: 'top left' },
    });
  };

  const downloadPng = async () => {
    setError('');
    setBusy('png');
    try {
      const dataUrl = await capture();
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'affiche-avis-cabinet-namboy-A4.png';
      a.click();
    } catch (e) {
      console.error(e);
      setError('Échec de l’export de l’image. Réessayez.');
    } finally {
      setBusy(null);
    }
  };

  const downloadPdf = async () => {
    setError('');
    setBusy('pdf');
    try {
      const dataUrl = await capture();
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
      pdf.setProperties({
        title: 'Affiche QR avis - Cabinet Dr. NAMBOY',
        subject: 'Scannez pour laisser un avis',
      });
      pdf.save('affiche-avis-cabinet-namboy-A4.pdf');
    } catch (e) {
      console.error(e);
      setError('Échec de l’export du PDF. Réessayez.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-8">
      {/* Impression : seule l'affiche est imprimée, en A4 plein format */}
      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          html, body { margin: 0 !important; padding: 0 !important; }
          body * { visibility: hidden !important; }
          #qr-poster, #qr-poster * { visibility: visible !important; }
          #qr-poster {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            transform: none !important;
            width: 210mm !important;
            height: 297mm !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* Réglages (non imprimés) */}
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 print:hidden">
        <label
          htmlFor="qr-base-url"
          className="flex items-center gap-2 text-sm font-bold text-slate-700"
        >
          <LinkIcon className="h-4 w-4 text-blue-600" />
          Adresse du site (domaine final)
        </label>
        <input
          id="qr-base-url"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="https://www.votre-domaine.com"
          dir="ltr"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />
        <p className="break-all text-xs text-slate-500" dir="ltr">
          Lien encodé dans le QR :{' '}
          <span className="font-semibold text-slate-700">{reviewUrl}</span>
        </p>
        {isLocal && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-medium text-amber-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            Cette adresse est locale : le QR ne fonctionnera pas pour les patients.
            Saisissez votre vrai nom de domaine avant d’imprimer.
          </div>
        )}
      </div>

      {/* Boutons (non imprimés) */}
      <div className="flex flex-wrap justify-center gap-3 print:hidden">
        <button
          onClick={downloadPdf}
          disabled={busy !== null}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy === 'pdf' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          Télécharger en PDF (A4)
        </button>

        <button
          onClick={downloadPng}
          disabled={busy !== null}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy === 'png' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Télécharger en image (PNG)
        </button>

        <button
          onClick={() => window.print()}
          disabled={busy !== null}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          <Printer className="h-4 w-4" />
          Imprimer
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center justify-center gap-2 text-sm font-semibold text-red-600 print:hidden"
        >
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* ============================================================ */}
      {/* AFFICHE A4 (794 x 1123 px) — aperçu réduit par `scale`        */}
      {/* ============================================================ */}
      <div ref={wrapRef} dir="ltr" className="mx-auto w-full max-w-[640px]">
        <div
          className="relative overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-slate-200 print:overflow-visible print:shadow-none print:ring-0"
          style={{ height: A4_H * scale }}
        >
          <div
            id="qr-poster"
            ref={posterRef}
            className="absolute left-0 top-0 flex flex-col bg-white"
            style={{
              width: A4_W,
              height: A4_H,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            {/* ----- En-tête ----- */}
            <div className="flex flex-col items-center bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 px-12 pb-10 pt-12 text-center text-white">
              <div className="flex gap-2" dir="ltr">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-11 w-11 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <h2 className="mt-5 text-[58px] font-black leading-none tracking-tight">
                Votre avis compte
              </h2>
              <p dir="rtl" className="mt-3 text-[42px] font-extrabold leading-tight text-sky-200">
                رأيكم يهمنا
              </p>
              <p className="mt-5 max-w-[580px] text-[19px] leading-snug text-blue-100">
                Aidez-nous à améliorer la qualité de nos soins en partageant votre expérience.
              </p>
              <p dir="rtl" className="mt-2 max-w-[580px] text-[19px] leading-snug text-blue-100">
                ساعدونا على تحسين جودة خدماتنا بمشاركة تجربتكم.
              </p>
            </div>

            {/* ----- Corps : QR + étapes ----- */}
            <div className="flex flex-1 flex-col items-center justify-center gap-7 px-12 py-8">
              <div className="rounded-[32px] border-[6px] border-slate-900 bg-white p-5 shadow-xl">
                <QRCodeSVG
                  value={reviewUrl}
                  size={370}
                  level="H"
                  marginSize={0}
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                />
              </div>

              <div className="text-center">
                <p className="text-[26px] font-extrabold leading-tight text-slate-900">
                  Scannez ce code avec votre téléphone
                </p>
                <p dir="rtl" className="mt-1 text-[26px] font-extrabold leading-tight text-slate-900">
                  امسح الرمز بهاتفك
                </p>
              </div>

              <div className="grid w-full grid-cols-3 gap-5">
                {STEPS.map((s, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-4 text-center"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-[20px] font-black text-white">
                      {i + 1}
                    </span>
                    <p className="mt-2 text-[16px] font-bold leading-tight text-slate-900">
                      {s.fr}
                    </p>
                    <p dir="rtl" className="mt-1 text-[16px] font-bold leading-tight text-slate-600">
                      {s.ar}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ----- Pied de page ----- */}
            <div className="bg-slate-900 px-12 py-7 text-center text-white">
              <p className="text-[26px] font-black tracking-tight">Cabinet Médical Dr. NAMBOY</p>
              <p className="mt-1 flex items-center justify-center gap-2 text-[16px] font-medium text-sky-200">
                <MapPin className="h-4 w-4" />
                Salé Bettana • Urgences 24h/24 et 7j/7
              </p>
              <div className="mt-3 flex items-center justify-center gap-6 text-[16px] font-bold">
                <span className="flex items-center gap-2" dir="ltr">
                  <Phone className="h-4 w-4 text-sky-300" />
                  +212 7 70 55 82 99
                </span>
                {displayHost && (
                  <span className="text-sky-200" dir="ltr">
                    {displayHost}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};