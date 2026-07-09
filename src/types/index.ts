export interface UniversityData {
  university_hei: string;
  image: string | null;
  type: string;
  associated_university: string | null;
  established_under: string;
  abbreviation: string | null;
  members?: string[];
  url?: string | null;
}

export interface ProgramData {
  ug_pg: 'UG' | 'PG';
  university_hei: string;
  faculty_name: string;
  department_name: string;
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