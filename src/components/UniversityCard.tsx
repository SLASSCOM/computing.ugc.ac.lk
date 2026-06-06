import React from 'react';
import { MapPin, BookOpen, Award } from 'lucide-react';
import { UniversityData, ProgramData } from '../types';
import UniversityLogo from './UniversityLogo';

interface UniversityCardProps {
  university: UniversityData;
  programs: ProgramData[];
  onClick: () => void;
}

const UniversityCard: React.FC<UniversityCardProps> = ({
  university,
  programs,
  onClick,
}) => {
  const universityPrograms = programs.filter(
    (p) => p.university_hei === university.university_hei
  );
  const ugCount = universityPrograms.filter((p) => p.ug_pg === 'UG').length;
  const pgCount = universityPrograms.filter((p) => p.ug_pg === 'PG').length;
  const hasPrograms = universityPrograms.length > 0;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group flex h-full min-h-[320px] cursor-pointer flex-col overflow-hidden rounded-xl border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 ${
        hasPrograms
          ? 'border-slate-200 bg-white shadow-md hover:-translate-y-1 hover:border-ugc-gold/40 hover:shadow-xl focus-visible:ring-ugc-gold'
          : 'border-slate-300 bg-slate-50/70 opacity-60 grayscale-[40%] shadow-sm hover:-translate-y-0.5 hover:border-slate-400 hover:opacity-90 hover:grayscale-0 hover:shadow-md focus-visible:ring-slate-400'
      }`}
    >
      <div className="flex flex-1 flex-col items-center p-6">
        <div className="mb-4 flex items-center justify-center">
          <UniversityLogo
            universityHei={university.university_hei}
            image={university.image}
          />
        </div>

        <h3 className="mb-2 line-clamp-2 min-h-[3rem] text-center text-lg font-bold leading-snug text-ugc-navy transition-colors duration-200 group-hover:text-ugc-navyLight">
          {university.university_hei}
        </h3>

        <div className="mb-3 flex justify-center">
          <span className="inline-flex items-center rounded-full bg-ugc-navy/10 px-3 py-1 text-xs font-medium text-ugc-navy">
            {university.type}
          </span>
        </div>

        {university.associated_university && (
          <div className="mb-2 flex items-center justify-center text-sm text-slate-500">
            <MapPin className="mr-1 h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="line-clamp-1 text-center">{university.associated_university}</span>
          </div>
        )}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3 border-t border-slate-100 px-6 py-4">
        <div>
          <div className="flex items-center gap-1 text-emerald-700">
            <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="text-sm font-bold">{ugCount}</span>
          </div>
          <p className="mt-0.5 text-xs leading-tight text-slate-600">
            Undergraduate
            <br />
            Programs
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 text-ugc-navy">
            <Award className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="text-sm font-bold">{pgCount}</span>
          </div>
          <p className="mt-0.5 text-xs leading-tight text-slate-600">
            Postgraduate
            <br />
            Programs
          </p>
        </div>
      </div>
    </div>
  );
};

export default UniversityCard;
