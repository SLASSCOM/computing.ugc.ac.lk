import React from 'react';
import { BookOpen, Award, Clock, Users } from 'lucide-react';
import { ProgramData, UniversityData } from '../types';

interface ProgramCardProps {
  program: ProgramData;
  university?: UniversityData;
  onClick: () => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, university, onClick }) => {
  const getImageSrc = () => {
    if (university?.image) {
      return `/images/${university.image}`;
    }
    return '/images/placeholder-university.jpg';
  };

  const getTypeColor = (type: string) => {
    return type === 'UG' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-purple-100 text-purple-800';
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group hover:border-blue-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Program Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {program.name_of_the_course_s_}
          </h3>
          
          {/* University | Faculty | Department */}
          <p className="text-gray-600 mb-3 line-clamp-1">
            {program.university_hei} | {program.faculty_name} | {program.department_name}
          </p>

          {/* Program Details */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {program.specialization && (
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{program.specialization}</span>
              </div>
            )}
            {program.duration && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{program.duration} years</span>
              </div>
            )}
            {program.medium_of_instruction && (
              <div className="text-gray-500">
                <span>{program.medium_of_instruction}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-end space-y-3 ml-4">
          {/* University Logo */}
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
            <img 
              src={getImageSrc()}
              alt={`${program.university_hei} logo`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder-university.jpg';
              }}
            />
          </div>

          {/* Program Type Badge */}
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(program.ug_pg)}`}>
              {program.ug_pg === 'UG' ? <BookOpen className="h-3 w-3" /> : <Award className="h-3 w-3" />}
              <span>{program.ug_pg === 'UG' ? 'Undergraduate' : 'Postgraduate'}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;