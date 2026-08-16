import { useState, useEffect, useMemo } from 'react';
import { ProgramData, UniversityData, AnalysisRecord, COPRecord, KeyCourse } from '../types';

export const useAnalysisData = () => {
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [cop2024, setCop2024] = useState<COPRecord[]>([]);
  const [cop2025, setCop2025] = useState<COPRecord[]>([]);
  const [keyCourses, setKeyCourses] = useState<KeyCourse[]>([]);
  const [streamsList, setStreamsList] = useState<{id: string, name: string}[]>([]);
  const [universities, setUniversities] = useState<UniversityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState('SRI LANKA (MEDIAN)');
  const [showAll, setShowAll] = useState(false);

  // Hardcoded standard districts + National
  const districts = useMemo(() => [
    "SRI LANKA (MEDIAN)",
    "COLOMBO", "GAMPAHA", "KALUTARA", "MATALE", "KANDY", "NUWARA ELIYA",
    "GALLE", "MATARA", "HAMBANTOTA", "JAFFNA", "KILINOCHCHI", "MANNAR",
    "MULLAITIVU", "VAVUNIYA", "TRINCOMALEE", "BATTICALOA", "AMPARA",
    "PUTTALAM", "KURUNEGALA", "ANURADHAPURA", "POLONNARUWA", "BADULLA",
    "MONARAGALA", "KEGALLE", "RATNAPURA"
  ], []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progRes, cop24Res, cop25Res, keysRes, uniRes] = await Promise.all([
          fetch(`${import.meta.env.BASE_URL}data/programs.json`),
          fetch(`${import.meta.env.BASE_URL}data/COP_2024_2025-ENGLISH_Final.pdf.json`),
          fetch(`${import.meta.env.BASE_URL}data/COP_2025_2026-ENGLISH_Final.pdf.json`),
          fetch(`${import.meta.env.BASE_URL}data/keys.json`),
          fetch(`${import.meta.env.BASE_URL}data/universities.json`),
        ]);

        const progData = await progRes.json();
        const cop24Data = await cop24Res.json();
        const cop25Data = await cop25Res.json();
        const keysData = await keysRes.json();
        const uniData = await uniRes.json();

        setPrograms(progData.filter((p: ProgramData) => p.ug_pg === 'UG' && p.code_of_study && p.external !== 'External'));
        setCop2024(cop24Data);
        setCop2025(cop25Data);
        setKeyCourses(keysData.courses_of_study || []);
        setStreamsList(keysData.streams || []);
        setUniversities(uniData);
      } catch (error) {
        console.error("Failed to load analysis data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const courseStreamsMap = useMemo(() => {
    const map = new Map<string, string[]>();
    keyCourses.forEach(c => {
      if (c.streams) {
        const active = Object.entries(c.streams)
          .filter(([_, enabled]) => enabled)
          .map(([id]) => id);
        map.set(c.number, active);
      }
    });
    return map;
  }, [keyCourses]);

  const courseMap = useMemo(() => {
    const map = new Map<string, string>();
    keyCourses.forEach(c => {
      map.set(c.number, c.name);
    });
    return map;
  }, [keyCourses]);

  const activePrograms = useMemo(() => {
    if (!showAll) return programs;

    // 1. Get all codes from COP data
    const copCodes = new Set<string>();
    cop2024.forEach(r => { if (r.courses_of_study) copCodes.add(r.courses_of_study); });
    cop2025.forEach(r => { if (r.courses_of_study) copCodes.add(r.courses_of_study); });

    // 2. Create university map
    const uniMap = new Map<string, string>();
    universities.forEach(u => {
      if (u.uni_code) uniMap.set(u.uni_code, u.university_hei);
    });

    // 3. Build uniform list
    const list: ProgramData[] = [];
    copCodes.forEach(code => {
      const courseNum = code.substring(0, 3);
      const uniCode = code.substring(3);
      const courseName = courseMap.get(courseNum) || `Course Code ${courseNum}`;
      const uniName = uniMap.get(uniCode) || `University Code ${uniCode}`;

      list.push({
        ug_pg: 'UG',
        university_hei: uniName,
        faculty_name: 'N/A',
        department_name: null,
        name_of_the_course_s_: courseName,
        discipline: 'Other',
        academic_stream: null,
        external: null,
        special_subject: null,
        abbreviated_qualification_if_relevant_: null,
        slqf: null,
        if_bachelor_general_special_honours_: null,
        whether_part_time_full_time: null,
        duration: null,
        credits: null,
        medium_of_instruction: null,
        obtained_ugc_approval_y_n_: null,
        approved_year: null,
        approved_commission_no_: null,
        remarks: null,
        confirmation_from_university: null,
        code_of_study: code,
        intake_count: null
      });
    });

    return list;
  }, [showAll, programs, cop2024, cop2025, universities, courseMap]);

  // Helper to calculate median
  const calculateMedian = (values: number[]): number | null => {
    if (values.length === 0) return null;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };

  const analysisData = useMemo(() => {
    if (loading || activePrograms.length === 0) return [];

    const map24 = new Map<string, number | 'NQC'>();
    const map25 = new Map<string, number | 'NQC'>();

    let sorted24List: { courses_of_study: string, z_score: number }[] = [];
    let sorted25List: { courses_of_study: string, z_score: number }[] = [];

    if (selectedDistrict === 'SRI LANKA (MEDIAN)') {
      // 1. National Normalization using Median
      const scores24 = new Map<string, number[]>();
      const scores25 = new Map<string, number[]>();
      const nqcCount24 = new Map<string, number>();
      const nqcCount25 = new Map<string, number>();

      cop2024.forEach(r => {
        if (r.z_score !== undefined) {
          if (!scores24.has(r.courses_of_study)) scores24.set(r.courses_of_study, []);
          scores24.get(r.courses_of_study)!.push(r.z_score);
        } else if (r.nqc) {
          nqcCount24.set(r.courses_of_study, (nqcCount24.get(r.courses_of_study) || 0) + 1);
        }
      });

      cop2025.forEach(r => {
        if (r.z_score !== undefined) {
          if (!scores25.has(r.courses_of_study)) scores25.set(r.courses_of_study, []);
          scores25.get(r.courses_of_study)!.push(r.z_score);
        } else if (r.nqc) {
          nqcCount25.set(r.courses_of_study, (nqcCount25.get(r.courses_of_study) || 0) + 1);
        }
      });

      activePrograms.forEach(p => {
        const code = p.code_of_study || '';

        // Process 2024
        const vals24 = scores24.get(code) || [];
        if (vals24.length > 0) {
          const median = calculateMedian(vals24);
          if (median !== null) {
            map24.set(code, median);
            sorted24List.push({ courses_of_study: code, z_score: median });
          }
        } else if (nqcCount24.get(code)) {
          map24.set(code, 'NQC');
        }

        // Process 2025
        const vals25 = scores25.get(code) || [];
        if (vals25.length > 0) {
          const median = calculateMedian(vals25);
          if (median !== null) {
            map25.set(code, median);
            sorted25List.push({ courses_of_study: code, z_score: median });
          }
        } else if (nqcCount25.get(code)) {
          map25.set(code, 'NQC');
        }
      });

    } else {
      // 1. Standard District filtering
      const cop24District = cop2024.filter(r => r.district === selectedDistrict);
      const cop25District = cop2025.filter(r => r.district === selectedDistrict);

      cop24District.forEach(r => {
        if (r.nqc) map24.set(r.courses_of_study, 'NQC');
        else if (r.z_score !== undefined) {
          map24.set(r.courses_of_study, r.z_score);
          sorted24List.push({ courses_of_study: r.courses_of_study, z_score: r.z_score });
        }
      });

      cop25District.forEach(r => {
        if (r.nqc) map25.set(r.courses_of_study, 'NQC');
        else if (r.z_score !== undefined) {
          map25.set(r.courses_of_study, r.z_score);
          sorted25List.push({ courses_of_study: r.courses_of_study, z_score: r.z_score });
        }
      });
    }

    // 2. Compute rankings
    const rankingCodes = new Set(activePrograms.map(p => p.code_of_study));

    const sorted24 = [...sorted24List]
      .filter(r => rankingCodes.has(r.courses_of_study))
      .sort((a, b) => b.z_score - a.z_score);

    const sorted25 = [...sorted25List]
      .filter(r => rankingCodes.has(r.courses_of_study))
      .sort((a, b) => b.z_score - a.z_score);

    const rank24Map = new Map<string, number>();
    sorted24.forEach((r, idx) => {
      rank24Map.set(r.courses_of_study, idx + 1);
    });

    const rank25Map = new Map<string, number>();
    sorted25.forEach((r, idx) => {
      rank25Map.set(r.courses_of_study, idx + 1);
    });

    // 3. Assemble merged records
    return activePrograms.map(p => {
      const code = p.code_of_study || '';
      const courseNum = code.substring(0, 3);
      const ugcCourseName = courseMap.get(courseNum) || p.name_of_the_course_s_;

      const z24 = map24.get(code) ?? null;
      const z25 = map25.get(code) ?? null;

      const r24 = rank24Map.get(code) ?? null;
      const r25 = rank25Map.get(code) ?? null;

      let zScoreDiff: number | null = null;
      if (typeof z24 === 'number' && typeof z25 === 'number') {
        zScoreDiff = parseFloat((z25 - z24).toFixed(4));
      }

      let rankDiff: number | null = null;
      if (r24 !== null && r25 !== null) {
        rankDiff = r24 - r25;
      }

      const isMeritBase = cop2025.some(r => r.courses_of_study === code && r.merit_base) ||
        cop2024.some(r => r.courses_of_study === code && r.merit_base);
      const streams = courseStreamsMap.get(courseNum) || [];

      return {
        code_of_study: code,
        course_number: courseNum,
        ugc_course_name: ugcCourseName,
        course_name: p.name_of_the_course_s_,
        university: p.university_hei,
        faculty: p.faculty_name,
        intake_count: p.intake_count ?? null,
        zScore2024: z24,
        zScore2025: z25,
        rank2024: r24,
        rank2025: r25,
        zScoreDiff,
        rankDiff,
        merit_base: isMeritBase,
        streams
      };
    });
  }, [loading, activePrograms, cop2024, cop2025, selectedDistrict, courseMap]);

  const uniqueUniversities = useMemo(() => {
    const unis = new Set<string>();
    activePrograms.forEach(p => {
      if (p.university_hei) unis.add(p.university_hei);
    });
    return Array.from(unis).sort();
  }, [activePrograms]);

  const uniqueCoursesOfStudy = useMemo(() => {
    const courses = new Map<string, string>();
    activePrograms.forEach(p => {
      if (p.code_of_study) {
        const num = p.code_of_study.substring(0, 3);
        const name = courseMap.get(num) || p.name_of_the_course_s_;
        courses.set(num, `${num} - ${name}`);
      }
    });
    return Array.from(courses.entries())
      .map(([number, label]) => ({ number, label }))
      .sort((a, b) => a.number.localeCompare(b.number));
  }, [activePrograms, courseMap]);

  return {
    loading,
    selectedDistrict,
    setSelectedDistrict,
    districts,
    analysisData,
    uniqueUniversities,
    uniqueCoursesOfStudy,
    showAll,
    setShowAll,
    cop2024,
    cop2025,
    activePrograms,
    universities,
    keyCourses,
    streamsList
  };
};

