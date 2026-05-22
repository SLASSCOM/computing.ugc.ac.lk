import React from 'react';
import { CaseSensitive as University, Users, BookOpen, Award } from 'lucide-react';
import { UniversityData, ProgramData } from '../types';

interface StatsSectionProps {
  universities: UniversityData[];
  programs: ProgramData[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ universities, programs }) => {
  const ugPrograms = programs.filter(p => p.ug_pg === 'UG').length;
  const pgPrograms = programs.filter(p => p.ug_pg === 'PG').length;
  const totalSpecializations = new Set(programs.map(p => p.specialization).filter(Boolean)).size;

  const stats = [
    {
      icon: University,
      label: 'Universities & Institutes',
      value: universities.length,
      color: 'bg-blue-500'
    },
    {
      icon: BookOpen,
      label: 'Undergraduate Programs',
      value: ugPrograms,
      color: 'bg-green-500'
    },
    {
      icon: Award,
      label: 'Postgraduate Programs', 
      value: pgPrograms,
      color: 'bg-purple-500'
    },
    {
      icon: Users,
      label: 'Specializations',
      value: totalSpecializations,
      color: 'bg-orange-500'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Computing Education at a Glance
          </h2>
          <p className="text-lg text-gray-600">
            Comprehensive overview of computing programs across Sri Lankan state universities
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`${stat.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </h3>
              <p className="text-gray-600 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;