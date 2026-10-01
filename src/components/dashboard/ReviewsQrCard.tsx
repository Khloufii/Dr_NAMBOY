import React, { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Printer, Link as LinkIcon, Star } from 'lucide-react';

export const ReviewsQrCard: React.FC = () => {
  const [baseUrl, setBaseUrl] = useState(
    typeof window !== 'undefined' ? window.location.origin : '',
  );
  const canvasWrapRef = useRef<HTMLDivElement | null>(null);

  // Ouvre directement la section avis + le formulaire
  const reviewUrl = `${baseUrl.replace(/\/+$/, '')}/?avis=1#avis`;

  const downloadPng = () => {
    const canvas = canvasWrapRef.current?.querySelector('canvas');
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'qr-avis-cabinet-namboy.png';
    a.click();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-8">
      {/* Styles d'impression : seule l'affichette est imprimée */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #qr-poster, #qr-poster * { visibility: visible !important; }
          #qr-poster { position: absolute; inset: 0; margin: auto; box-shadow: none !important; border: 2px solid #0f172a !important; }
          @page { margin: 12mm; }
        }
      `}</style>

      {/* Réglages (non imprimés) */}
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 print:hidden">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <LinkIcon className="h-4 w-4 text-blue-600" />
          Adresse du site (domaine final)
        </label>
        <input
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="https://www.cabinet-namboy.ma"
          dir="ltr"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />
        <p className="break-all text-xs text-slate-500" dir="ltr">
          Lien encodé : <span className="font-semibold text-slate-700">{reviewUrl}</span>
        </p>
        <p className="text-xs text-amber-600">
          Utilisez votre vrai nom de domaine : un QR généré sur « localhost » ne fonctionnera pas pour les patients.
        </p>
      </div>

      {/* Affichette */}
      <div
        id="qr-poster"
        className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white text-center shadow-xl"
      >
        <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 px-6 py-6 text-white">
          <div className="mb-2 flex justify-center gap-1" dir="ltr">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h2 className="text-2xl font-black tracking-tight">Votre avis compte</h2>
          <p className="mt-1 text-lg font-bold text-sky-200" dir="rtl">رأيكم يهمنا</p>
        </div>

        <div className="space-y-4 px-6 py-6">
          <div ref={canvasWrapRef} className="mx-auto w-64 rounded-2xl border-4 border-slate-900 bg-white p-3 sm:w-72">
            <QRCodeCanvas
              value={reviewUrl}
              size={1024}
              level="H"
              marginSize={1}
              bgColor="#ffffff"
              fgColor="#0f172a"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900">
              Scannez ce code avec votre téléphone pour laisser un avis
            </p>
            <p className="text-sm font-bold text-slate-900" dir="rtl">
              امسح الرمز بهاتفك لإضافة رأيك
            </p>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <p className="text-sm font-extrabold text-slate-900">Cabinet Médical Dr. NAMBOY</p>
            <p className="text-xs text-slate-500">Salé Bettana • 24h/24 et 7j/7</p>
          </div>
        </div>
      </div>

      {/* Actions (non imprimées) */}
      <div className="flex flex-wrap justify-center gap-3 print:hidden">
        <button
          onClick={downloadPng}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          Télécharger le QR (PNG)
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          <Printer className="h-4 w-4" />
          Imprimer l’affichette
        </button>
      </div>
    </div>
  );
};