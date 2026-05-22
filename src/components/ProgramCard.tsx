import React from 'react';
import { BookOpen, Award, Clock, Users } from 'lucide-react';
import { ProgramData, UniversityData } from '../types';
import UniversityLogo from './UniversityLogo';

interface ProgramCardProps {
  program: ProgramData;
  university?: UniversityData;
  onClick: () => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, university, onClick }) => {
  const isUg = program.ug_pg === 'UG';
  const typeColor = isUg
    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
    : 'bg-ugc-navy/10 text-ugc-navy border-ugc-navy/20';

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
      className="group cursor-pointer rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-ugc-gold/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugc-gold"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-ugc-navy transition-colors duration-200 group-hover:text-ugc-navyLight">
            {program.name_of_the_course_s_}
          </h3>

          <p className="mb-3 line-clamp-1 text-slate-600">
            {program.university_hei} | {program.faculty_name} | {program.department_name}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            {program.discipline && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{program.discipline}</span>
              </div>
            )}
            {program.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{program.duration} years</span>
              </div>
            )}
            {program.medium_of_instruction && (
              <span>{program.medium_of_instruction}</span>
            )}
          </div>
        </div>

        <div className="ml-4 flex flex-col items-end gap-3">
          <UniversityLogo
            universityHei={program.university_hei}
            image={university?.image}
            className="h-12 w-12 rounded-full border border-slate-200 bg-slate-50"
            textClassName="text-lg font-bold text-ugc-navy"
          />

          <span
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${typeColor}`}
          >
            {isUg ? (
              <BookOpen className="h-3 w-3" aria-hidden="true" />
            ) : (
              <Award className="h-3 w-3" aria-hidden="true" />
            )}
            <span>{isUg ? 'Undergraduate' : 'Postgraduate'}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
