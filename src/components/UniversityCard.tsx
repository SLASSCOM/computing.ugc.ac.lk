import React from 'react';
import { MapPin, BookOpen, Award } from 'lucide-react';
import { UniversityData, ProgramData } from '../types';

interface UniversityCardProps {
  university: UniversityData;
  programs: ProgramData[];
  onClick: () => void;
}

const UniversityCard: React.FC<UniversityCardProps> = ({ university, programs, onClick }) => {
  const universityPrograms = programs.filter(p => p.university_hei === university.university_hei);
  const ugCount = universityPrograms.filter(p => p.ug_pg === 'UG').length;
  const pgCount = universityPrograms.filter(p => p.ug_pg === 'PG').length;

  const getImageSrc = () => {
    if (university.image) {
      return `/images/${university.image}`;
    }
    return '/images/placeholder-university.jpg';
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
    >
      <div className="p-6">
        {/* University Logo */}
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src={getImageSrc()}
              alt={`${university.university_hei} logo`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder-university.jpg';
              }}
            />
          </div>
        </div>

        {/* University Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 text-center line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {university.university_hei}
        </h3>

        {/* Type Badge */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {university.type}
          </span>
        </div>

        {/* Associated University */}
        {university.associated_university && (
          <div className="flex items-center text-sm text-gray-600 mb-4 justify-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-center line-clamp-1">{university.associated_university}</span>
          </div>
        )}

        {/* Program Counts */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-green-600">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm font-semibold">{ugCount} UG</span>
          </div>
          <div className="flex items-center space-x-1 text-purple-600">
            <Award className="h-4 w-4" />
            <span className="text-sm font-semibold">{pgCount} PG</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityCard;