import React from 'react';
import { CaseSensitive as University, BookOpen, Award } from 'lucide-react';
import { UniversityData, ProgramData } from '../types';

interface StatsStripProps {
  universities: UniversityData[];
  programs: ProgramData[];
}

const StatsStrip: React.FC<StatsStripProps> = ({ universities, programs }) => {
  const ugPrograms = programs.filter((p) => p.ug_pg === 'UG').length;
  const pgPrograms = programs.filter((p) => p.ug_pg === 'PG').length;

  const stats = [
    {
      icon: University,
      label: 'Universities & Institutes',
      value: universities.length,
      color: 'text-ugc-goldSoft',
    },
    {
      icon: BookOpen,
      label: 'Undergraduate Programs',
      value: ugPrograms,
      color: 'text-emerald-300',
    },
    {
      icon: Award,
      label: 'Postgraduate Programs',
      value: pgPrograms,
      color: 'text-purple-300',
    },
  ];

  return (
    <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm sm:px-4"
        >
          <stat.icon className={`h-5 w-5 shrink-0 ${stat.color}`} aria-hidden="true" />
          <div className="min-w-0">
            <p className="font-display text-xl font-bold leading-none text-white sm:text-2xl">
              {stat.value}
            </p>
            <p className="mt-0.5 text-[10px] leading-tight text-slate-300 sm:text-xs">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsStrip;
