import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Appointment, PatientRecord } from '../../types';
import {
  Calendar,
  Users,
  ShieldAlert,
  TrendingUp,
  Clock,
  CheckCircle,
  PlusCircle,
  FileText,
  Activity,
  ArrowUpRight
} from 'lucide-react';

interface OverviewViewProps {
  appointments: Appointment[];
  patients: PatientRecord[];
  onNavigateTab: (tab: string) => void;
  onOpenNewAppointment: () => void;
  onOpenNewPatient: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  appointments,
  patients,
  onNavigateTab,
  onOpenNewAppointment,
  onOpenNewPatient,
}) => {
  const { t, language, isRtl } = useLanguage();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayApts = appointments.filter(a => a.date === todayStr);
  const emergenciesToday = appointments.filter(a => (a.serviceId === 'emergency' || a.serviceId === 'emergencies') && a.date === todayStr).length;
  const confirmedToday = todayApts.filter(a => a.status === 'confirmed').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t.dashboard.overview.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cabinet Médical Dr. Evrard Simplice NAMBOY • Salé Bettana
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenNewAppointment}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>{t.dashboard.overview.newAppointmentBtn}</span>
          </button>
          <button
            onClick={onOpenNewPatient}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>{t.dashboard.overview.newPatientBtn}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Today's Appointments */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.dashboard.overview.todayAppointments}
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {todayApts.length}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{confirmedToday} confirmés par le secrétariat</span>
          </div>
        </div>

        {/* KPI 2: Patients Directory */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.dashboard.overview.newPatients}
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {patients.length}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Dossiers actifs à Bettana</span>
          </div>
        </div>

        {/* KPI 3: 24/7 Emergencies */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.dashboard.overview.emergencies24}
            </span>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-red-600">
            {emergenciesToday}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Permanence active</span>
          </div>
        </div>

        {/* KPI 4: Occupancy Rate */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.dashboard.overview.occupancyRate}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            85%
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-1">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Today's Appointments & Emergency Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Next Consultations */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">
                {t.dashboard.overview.nextAppointments} ({todayStr})
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('appointments')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Voir tout</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {todayApts.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                {t.dashboard.overview.noAppointmentsToday}
              </p>
            ) : (
              todayApts.slice(0, 5).map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/40 border border-slate-200/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-mono text-xs font-bold text-blue-700">
                      {apt.time}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {apt.patientName}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {language === 'ar' ? apt.serviceNameAr : apt.serviceNameFr} • {apt.patientPhone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        apt.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : apt.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {apt.status === 'confirmed'
                        ? 'Confirmé'
                        : apt.status === 'pending'
                        ? 'En attente'
                        : apt.status === 'completed'
                        ? 'Terminé'
                        : 'Annulé'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Emergency & Protocol Notices */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-red-600 to-rose-700 text-white p-6 rounded-3xl shadow-lg space-y-3">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
              <h3 className="text-base font-bold">
                Permanence Urgence 24h/24
              </h3>
            </div>
            <p className="text-xs text-red-100 leading-relaxed">
              Dr. NAMBOY et l’équipe soignante d’astreinte sont prêts à recevoir toute détresse médicale aiguë à Bettana.
            </p>
            <div className="pt-2">
              <a
                href="tel:+212770558299"
                className="w-full py-2.5 px-4 rounded-xl bg-white text-red-700 font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Ligne directe : +212 7 70 55 82 99</span>
              </a>
            </div>
          </div>

          {/* Quick Doctor Note */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Rappel Pratique Dr. NAMBOY
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pour les bilans d’échographie abdominale, rappeler aux patients d’être à jeun depuis au moins 4 heures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
