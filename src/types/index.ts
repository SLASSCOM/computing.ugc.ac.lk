export interface UniversityData {
  university_hei: string;
  image: string | null;
  type: string;
  associated_university: string | null;
  established_under: string;
  abbreviation: string | null;
  members?: string[];
  url?: string | null;
  uni_code?: string | null;
}

export interface ProgramData {
  ug_pg: 'UG' | 'PG';
  university_hei: string;
  faculty_name: string;
  department_name: string | null;
  name_of_the_course_s_: string;
  discipline: string | null;
  academic_stream: string | null;
  external: string | null;
  special_subject: string | null;
  abbreviated_qualification_if_relevant_: string | null;
  slqf: string | null;
  if_bachelor_general_special_honours_: string | null;
  whether_part_time_full_time: string | null;
  duration: string | null;
  credits: string | null;
  medium_of_instruction: string | null;
  obtained_ugc_approval_y_n_: string | null;
  approved_year: string | null;
  approved_commission_no_: string | null;
  remarks: string | null;
  confirmation_from_university: string | null;
  code_of_study?: string | null;
  intake_count?: number | null;
}

export interface SlqfLevel {
  level: number;
  qualification_category: string;
  qualification_awarded: string;
  minimum_volume_of_learning: string;
}

export interface Discipline {
  name: string;
  code: string;
  description: string;
}

export interface AnalysisRecord {
  code_of_study: string;
  course_number: string;
  ugc_course_name: string;
  course_name: string;
  university: string;
  faculty: string;
  intake_count: number | null;
  zScore2024: number | 'NQC' | null;
  zScore2025: number | 'NQC' | null;
  rank2024: number | null;
  rank2025: number | null;
  zScoreDiff: number | null;
  rankDiff: number | null;
  merit_base?: boolean;
}

export interface COPRecord {
  district: string;
  courses_of_study: string;
  z_score?: number;
  nqc?: boolean;
  merit_base?: boolean;
}

export interface KeyCourse {
  number: string;
  name: string;
}