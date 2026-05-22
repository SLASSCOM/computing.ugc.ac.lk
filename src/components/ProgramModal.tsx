import React from 'react';
import { X, CaseSensitive as University, BookOpen, Award, Clock, Globe, FileText } from 'lucide-react';
import { ProgramData, UniversityData } from '../types';

interface ProgramModalProps {
  program: ProgramData;
  university?: UniversityData;
  onClose: () => void;
}

const ProgramModal: React.FC<ProgramModalProps> = ({ program, university, onClose }) => {
  const getImageSrc = () => {
    if (university?.image) {
      return `/images/${university.image}`;
    }
    return '/images/placeholder-university.jpg';
  };

  const getTypeColor = (type: string) => {
    return type === 'UG' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-purple-100 text-purple-800 border-purple-200';
  };

  const InfoRow: React.FC<{ label: string; value: string | null; icon?: React.ComponentType<any> }> = ({ 
    label, 
    value, 
    icon: Icon 
  }) => {
    if (!value) return null;
    
    return (
      <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-b-0">
        {Icon && (
          <div className="flex-shrink-0 mt-0.5">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <dt className="text-sm font-medium text-gray-600">{label}</dt>
          <dd className="text-sm text-gray-900 mt-1">{value}</dd>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
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
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold mb-2 leading-tight">
                  {program.name_of_the_course_s_}
                </h2>
                <p className="text-blue-100 opacity-90">
                  {program.university_hei}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(program.ug_pg)}`}>
                    {program.ug_pg === 'UG' ? <BookOpen className="h-3 w-3" /> : <Award className="h-3 w-3" />}
                    <span>{program.ug_pg === 'UG' ? 'Undergraduate' : 'Postgraduate'}</span>
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors duration-200 p-1"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Information</h3>
              <div className="space-y-0">
                <InfoRow label="Faculty" value={program.faculty_name} icon={University} />
                <InfoRow label="Department" value={program.department_name} icon={University} />
                <InfoRow label="Specialization" value={program.specialization} icon={BookOpen} />
                <InfoRow label="Academic Stream" value={program.academic_stream} icon={FileText} />
                <InfoRow label="Special Subject" value={program.special_subject} icon={BookOpen} />
                <InfoRow label="Qualification" value={program.abbreviated_qualification_if_relevant_} icon={Award} />
                <InfoRow label="SLQF Level" value={program.slqf} icon={Award} />
              </div>
            </div>

            {/* Right Column */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Details</h3>
              <div className="space-y-0">
                <InfoRow label="Honors/General" value={program.if_bachelor_general_special_honours_} icon={Award} />
                <InfoRow label="Mode" value={program.whether_part_time_full_time} icon={Clock} />
                <InfoRow label="Duration" value={program.duration ? `${program.duration} years` : null} icon={Clock} />
                <InfoRow label="Credits" value={program.credits} icon={FileText} />
                <InfoRow label="Medium of Instruction" value={program.medium_of_instruction} icon={Globe} />
                <InfoRow label="UGC Approval" value={program.obtained_ugc_approval_y_n_} icon={FileText} />
                <InfoRow label="Approved Year" value={program.approved_year} icon={FileText} />
                <InfoRow label="Commission No." value={program.approved_commission_no_} icon={FileText} />
              </div>
            </div>
          </div>

          {/* Remarks */}
          {program.remarks && (
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="text-sm font-semibold text-amber-800 mb-2">Remarks</h4>
              <p className="text-sm text-amber-700">{program.remarks}</p>
            </div>
          )}

          {/* Confirmation */}
          {program.confirmation_from_university && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="text-sm font-semibold text-green-800 mb-2">University Confirmation</h4>
              <p className="text-sm text-green-700">{program.confirmation_from_university}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramModal;