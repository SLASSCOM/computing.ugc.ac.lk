import React from 'react';
import {
  X,
  CaseSensitive as University,
  BookOpen,
  Award,
  Clock,
  Globe,
  FileText,
  Hash,
  Users,
} from 'lucide-react';
import { ProgramData, UniversityData, SlqfLevel } from '../types';
import UniversityLogo from './UniversityLogo';

interface ProgramModalProps {
  program: ProgramData;
  university?: UniversityData;
  coursesOfStudy?: { number: string; name: string }[];
  slqfLevels?: SlqfLevel[];
  onClose: () => void;
}

const ProgramModal: React.FC<ProgramModalProps> = ({
  program,
  university,
  coursesOfStudy = [],
  slqfLevels = [],
  onClose,
}) => {
  const isUg = program.ug_pg === 'UG';
  const typeColor = isUg
    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
    : 'bg-ugc-gold/20 text-ugc-goldSoft border-ugc-gold/40';

  // Find SLQF value
  const slqfLevel = program.slqf && slqfLevels
    ? slqfLevels.find((s) => String(s.level) === program.slqf)
    : null;
  const slqfValue = program.slqf
    ? slqfLevel
      ? `Level ${program.slqf} - ${slqfLevel.qualification_awarded}`
      : `Level ${program.slqf}`
    : null;

  // Find Course of Study value
  const courseStudyNumber = program.code_of_study ? program.code_of_study.substring(0, 3) : null;
  const courseStudyName = courseStudyNumber && coursesOfStudy
    ? coursesOfStudy.find((c) => c.number === courseStudyNumber)?.name
    : null;
  const codeOfStudyValue = program.code_of_study
    ? courseStudyName
      ? `${program.code_of_study} - ${courseStudyName}`
      : program.code_of_study
    : null;

  const InfoRow: React.FC<{
    label: string;
    value: string | null;
    icon?: React.ComponentType<{ className?: string }>;
  }> = ({ label, value, icon: Icon }) => {
    if (!value) return null;

    return (
      <div className="flex items-start gap-3 border-b border-slate-100 py-3 last:border-b-0">
        {Icon && (
          <div className="mt-0.5 shrink-0">
            <Icon className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <dt className="text-sm font-medium text-slate-600">{label}</dt>
          <dd className="mt-1 text-sm text-slate-900">{value}</dd>
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="program-modal-title"
    >
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-ugc-navy to-ugc-navyDark px-6 py-4 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <UniversityLogo
                universityHei={program.university_hei}
                image={university?.image}
                className="h-16 w-16 rounded-lg border border-white/20 bg-white/10"
                textClassName="text-xl font-bold text-white"
              />
              <div className="min-w-0 flex-1">
                <h2
                  id="program-modal-title"
                  className="mb-2 text-xl font-bold leading-tight text-white"
                >
                  {program.name_of_the_course_s_}
                </h2>
                <p className="text-white/90">{program.university_hei}</p>
                <div className="mt-2 flex items-center gap-2">
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
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-white transition-colors hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugc-gold"
              aria-label="Close program details"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-6">
          <h3 className="mb-4 text-lg font-semibold text-ugc-navy border-b border-slate-100 pb-2">
            Program Details
          </h3>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <div>
                <InfoRow label="Faculty" value={program.faculty_name} icon={University} />
                <InfoRow
                  label="Department"
                  value={program.department_name}
                  icon={University}
                />
                <InfoRow
                  label="Course of Study"
                  value={codeOfStudyValue}
                  icon={Hash}
                />
                <InfoRow
                  label="Discipline"
                  value={program.discipline}
                  icon={BookOpen}
                />
                <InfoRow
                  label="Academic Stream"
                  value={program.academic_stream}
                  icon={FileText}
                />
                <InfoRow
                  label="Special Subject"
                  value={program.special_subject}
                  icon={BookOpen}
                />
                <InfoRow
                  label="Qualification"
                  value={program.abbreviated_qualification_if_relevant_}
                  icon={Award}
                />
                <InfoRow label="SLQF Level" value={slqfValue} icon={Award} />
              </div>
            </div>

            <div>
              <div>
                <InfoRow
                  label="UGC Intake Count"
                  value={program.intake_count ? String(program.intake_count) : null}
                  icon={Users}
                />
                <InfoRow
                  label="Honors/General"
                  value={program.if_bachelor_general_special_honours_}
                  icon={Award}
                />
                <InfoRow
                  label="Mode"
                  value={program.whether_part_time_full_time}
                  icon={Clock}
                />
                <InfoRow
                  label="Duration"
                  value={program.duration ? `${program.duration} years` : null}
                  icon={Clock}
                />
                <InfoRow label="Credits" value={program.credits} icon={FileText} />
                <InfoRow
                  label="Medium of Instruction"
                  value={program.medium_of_instruction}
                  icon={Globe}
                />
                <InfoRow
                  label="UGC Approval"
                  value={program.obtained_ugc_approval_y_n_}
                  icon={FileText}
                />
                <InfoRow label="Approved Year" value={program.approved_year} icon={FileText} />
                <InfoRow
                  label="Commission No."
                  value={program.approved_commission_no_}
                  icon={FileText}
                />
              </div>
            </div>
          </div>

          {program.remarks && (
            <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h4 className="mb-2 text-sm font-semibold text-amber-800">Remarks</h4>
              <p className="text-sm text-amber-700">{program.remarks}</p>
            </div>
          )}

          {program.confirmation_from_university && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <h4 className="mb-2 text-sm font-semibold text-emerald-800">
                University Confirmation
              </h4>
              <p className="text-sm text-emerald-700">
                {program.confirmation_from_university}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramModal;
