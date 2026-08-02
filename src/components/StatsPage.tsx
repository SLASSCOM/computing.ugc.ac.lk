import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { UniversityData, ProgramData, SlqfLevel } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { Award, BookOpen, School, ExternalLink } from 'lucide-react';

interface KeyData {
  courses_of_study: { number: string; name: string; intake?: Record<string, number> }[];
  slqf: SlqfLevel[];
}

const StatsPage = () => {
  const [universities, setUniversities] = useState<UniversityData[]>([]);
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [coursesOfStudy, setCoursesOfStudy] = useState<{ number: string; name: string; intake?: Record<string, number> }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    document.title = 'UGC Admission Summary | Computing Programs Directory';
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [uniRes, progRes, keysRes] = await Promise.all([
          fetch(`${import.meta.env.BASE_URL}data/universities.json`),
          fetch(`${import.meta.env.BASE_URL}data/programs.json`),
          fetch(`${import.meta.env.BASE_URL}data/keys.json`),
        ]);
        const uniData = await uniRes.json();
        const progData = await progRes.json();
        const keysData: KeyData = await keysRes.json();

        setUniversities(uniData);
        setPrograms(progData.filter((p: ProgramData) => p.external !== 'External'));
        setCoursesOfStudy(keysData.courses_of_study || []);
      } catch (error) {
        console.error('Error loading stats data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter UGC universities that have a non-null uni_code and have at least one UG program
  const ugcUniversities = useMemo(() => {
    return universities
      .filter(
        (u) =>
          u.established_under === 'University Grants Commission' &&
          u.uni_code !== null &&
          u.uni_code !== undefined
      )
      .filter((uni) =>
        programs.some((p) => p.ug_pg === 'UG' && p.university_hei === uni.university_hei)
      )
      .sort((a, b) => {
        const codeA = a.uni_code || '';
        const codeB = b.uni_code || '';
        return codeA.localeCompare(codeB);
      });
  }, [universities, programs]);

  // Filter undergraduate programs offered by UGC universities
  const ugPrograms = useMemo(() => {
    const ugcUniNames = new Set(ugcUniversities.map((u) => u.university_hei));
    return programs.filter((p) => p.ug_pg === 'UG' && ugcUniNames.has(p.university_hei));
  }, [programs, ugcUniversities]);

  // Get intake stats for a single university and course of study
  const getIntakeStats = (courseCode: string, uniHei: string) => {
    const matchingProgs = ugPrograms.filter(
      (p) =>
        p.university_hei === uniHei &&
        p.code_of_study &&
        p.code_of_study.startsWith(courseCode)
    );

    if (matchingProgs.length === 0) {
      return { offered: false, sum: 0, allNull: true };
    }

    let sum = 0;
    let allNull = true;
    matchingProgs.forEach((p) => {
      if (p.intake_count !== null && p.intake_count !== undefined) {
        sum += p.intake_count;
        allNull = false;
      }
    });

    return { offered: true, sum, allNull };
  };

  // Get row total stats across all filtered universities
  const getRowTotalStats = (courseCode: string) => {
    let offeredCount = 0;
    let knownSum = 0;
    let hasUnknown = false;
    let hasAnyOffering = false;

    ugcUniversities.forEach((uni) => {
      const stats = getIntakeStats(courseCode, uni.university_hei);
      if (stats.offered) {
        hasAnyOffering = true;
        offeredCount++;
        if (stats.allNull) {
          hasUnknown = true;
        } else {
          knownSum += stats.sum;
        }
      }
    });

    if (!hasAnyOffering) {
      return { display: '-', isOffered: false };
    }

    if (hasUnknown) {
      if (knownSum === 0) {
        return { display: '?', isOffered: true };
      }
      return { display: `${knownSum}+`, isOffered: true };
    }

    return { display: String(knownSum), isOffered: true };
  };

  // Filtered courses of study based on search term and presence of programs
  const filteredCoursesOfStudy = useMemo(() => {
    const activeCourses = coursesOfStudy.filter((course) =>
      ugcUniversities.some((uni) => {
        const stats = getIntakeStats(course.number, uni.university_hei);
        return stats.offered;
      })
    );

    if (!searchTerm.trim()) return activeCourses;
    const lowerSearch = searchTerm.toLowerCase();
    return activeCourses.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerSearch) ||
        c.number.includes(lowerSearch)
    );
  }, [coursesOfStudy, searchTerm, ugcUniversities, ugPrograms]);

  // Calculate quick stats
  const totalUgProgramsCount = ugPrograms.length;
  const activeCoursesCount = useMemo(() => {
    return coursesOfStudy.filter((course) =>
      ugcUniversities.some((uni) => {
        const stats = getIntakeStats(course.number, uni.university_hei);
        return stats.offered;
      })
    ).length;
  }, [coursesOfStudy, ugcUniversities, ugPrograms]);

  // Calculate Column Totals for each University and Overall Totals
  const universityTotals = useMemo(() => {
    const totals: Record<string, { display: string; sum: number; hasUnknown: boolean }> = {};
    ugcUniversities.forEach((uni) => {
      let sum = 0;
      let hasUnknown = false;
      let offeredAny = false;
      filteredCoursesOfStudy.forEach((course) => {
        const stats = getIntakeStats(course.number, uni.university_hei);
        if (stats.offered) {
          offeredAny = true;
          if (stats.allNull) {
            hasUnknown = true;
          } else {
            sum += stats.sum;
          }
        }
      });
      totals[uni.university_hei] = {
        display: !offeredAny ? '-' : hasUnknown ? (sum === 0 ? '?' : `${sum}+`) : String(sum),
        sum,
        hasUnknown
      };
    });
    return totals;
  }, [ugcUniversities, filteredCoursesOfStudy, ugPrograms]);

  const overallIntakeTotal = useMemo(() => {
    let sum = 0;
    let hasUnknown = false;
    filteredCoursesOfStudy.forEach((c) => {
      const intakeVal = c.intake?.["2025/2026"];
      if (intakeVal !== undefined && intakeVal !== null) {
        sum += intakeVal;
      } else {
        hasUnknown = true;
      }
    });
    return hasUnknown ? `${sum}+` : String(sum);
  }, [filteredCoursesOfStudy]);

  const overallUniSum = useMemo(() => {
    let sum = 0;
    let hasUnknown = false;
    let anyOffered = false;
    Object.values(universityTotals).forEach((t) => {
      if (t.display !== '-') {
        anyOffered = true;
        sum += t.sum;
        if (t.hasUnknown) {
          hasUnknown = true;
        }
      }
    });
    if (!anyOffered) return '-';
    return hasUnknown ? `${sum}+` : String(sum);
  }, [universityTotals]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="mb-8 md:flex md:items-center md:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-2xl font-bold leading-7 text-ugc-navy sm:truncate sm:text-3xl sm:tracking-tight">
            UGC Admission Summary - State Universities of Sri Lanka
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            A comprehensive summary of UGC Admission to undergraduate computing degree programs across State Universities in Sri Lanka.
          </p>
        </div>
        <div className="mt-4 flex shrink-0 md:mt-0">
          <a
            href="https://www.ugc.ac.lk/downloads/admissions/Handbook_2025_26/student_handbook_english.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-ugc-gold px-4 py-2 text-sm font-semibold text-ugc-navy shadow-sm transition-colors duration-200 hover:bg-ugc-goldSoft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugc-gold focus-visible:ring-offset-2"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            <span>Student Handbook 2025/26 (PDF)</span>
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6 border border-slate-100">
          <dt>
            <div className="absolute rounded-md bg-ugc-navy/10 p-3 text-ugc-navy">
              <School className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-slate-500">UGC Universities</p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-0">
            <p className="text-2xl font-semibold text-ugc-navy">{ugcUniversities.length}</p>
          </dd>
        </div>

        <div className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6 border border-slate-100">
          <dt>
            <div className="absolute rounded-md bg-ugc-gold/10 p-3 text-ugc-gold">
              <BookOpen className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-slate-500">Undergraduate Programs</p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-0">
            <p className="text-2xl font-semibold text-ugc-navy">{totalUgProgramsCount}</p>
          </dd>
        </div>

        <div className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6 border border-slate-100">
          <dt>
            <div className="absolute rounded-md bg-emerald-50 p-3 text-emerald-600">
              <Award className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-slate-500">Active Courses of Study</p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-0">
            <p className="text-2xl font-semibold text-ugc-navy">{activeCoursesCount}</p>
          </dd>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="mb-8 rounded-lg bg-white shadow border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-5 sm:px-6 md:flex md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold leading-6 text-ugc-navy">
              UGC Admission Summary Table (Undergraduate)
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Official UGC reference intakes (2025/2026) alongside calculated undergraduate program intakes across State Universities.
            </p>
          </div>
          {/* Search Box */}
          <div className="mt-3 md:mt-0">
            <label htmlFor="search-courses" className="sr-only">
              Search courses
            </label>
            <input
              type="text"
              name="search-courses"
              id="search-courses"
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm placeholder-slate-400 focus:border-ugc-gold focus:outline-none focus:ring-1 focus:ring-ugc-gold sm:w-64"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Pivot Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm font-sans">
            <thead className="bg-slate-50">
              <tr className="h-32">
                <th
                  scope="col"
                  className="sticky left-0 z-10 bg-slate-50 py-3 pl-4 pr-3 text-left font-semibold text-slate-900 border-r border-slate-200 w-80 sm:w-96 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] align-bottom pb-3"
                >
                  Course of Study
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center font-bold text-slate-900 border-r border-slate-200 w-20 bg-slate-100 align-bottom pb-3"
                >
                  Intake 2025/ 2026 (Ref)
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center font-bold text-slate-900 border-r border-slate-200 w-20 bg-slate-100 align-bottom pb-3"
                >
                  Total Intake
                </th>
                {ugcUniversities.map((uni) => (
                  <th
                    key={uni.university_hei}
                    scope="col"
                    className="px-1 py-3 text-center border-r border-slate-100 last:border-r-0 min-w-[40px] align-bottom font-medium text-slate-900"
                    title={uni.university_hei}
                  >
                    <div className="flex h-full flex-col justify-end items-center pb-2">
                      <Link
                        to={`/programs?university=${encodeURIComponent(uni.university_hei)}&type=UG`}
                        className="cursor-help hover:text-ugc-gold font-semibold text-xs whitespace-nowrap tracking-wider transition-colors"
                        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                      >
                        {uni.abbreviation || uni.university_hei.substring(0, 4)} ({uni.uni_code})
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {/* Column Totals Row */}
              {filteredCoursesOfStudy.length > 0 && (
                <tr className="bg-slate-100/70 font-bold border-b border-slate-300">
                  <td className="sticky left-0 z-10 bg-slate-100 py-4 pl-4 pr-3 text-ugc-navy border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    <span>Total Intake</span>
                  </td>
                  <td className="px-4 py-4 text-center border-r border-slate-200 text-slate-800">
                    {overallIntakeTotal}
                  </td>
                  <td className="px-4 py-4 text-center border-r border-slate-200 text-ugc-navy bg-slate-100/50">
                    {overallUniSum}
                  </td>
                  {ugcUniversities.map((uni) => (
                    <td
                      key={`total-${uni.university_hei}`}
                      className="px-3 py-4 text-center border-r border-slate-100 last:border-r-0 text-slate-800 animate-fade-in"
                    >
                      {universityTotals[uni.university_hei]?.display || '-'}
                    </td>
                  ))}
                </tr>
              )}
              {filteredCoursesOfStudy.map((course) => {
                const totalStats = getRowTotalStats(course.number);

                return (
                  <tr
                    key={course.number}
                    className={`hover:bg-slate-50/80 transition-colors ${!totalStats.isOffered ? 'opacity-50 bg-slate-50/30' : ''
                      }`}
                  >
                    <td className="sticky left-0 z-10 bg-white py-4 pl-4 pr-3 font-medium text-ugc-navy border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      <div className="flex items-start gap-2">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-600">
                          {course.number}
                        </span>
                        <Link
                          to={`/programs?course=${course.number}&type=UG`}
                          className="hover:underline hover:text-ugc-gold transition-colors text-left"
                        >
                          {course.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center border-r border-slate-200 font-bold bg-slate-100 text-slate-700">
                      {course.intake?.["2025/2026"] !== undefined && course.intake?.["2025/2026"] !== null ? course.intake["2025/2026"] : '-'}
                    </td>
                    <td className="px-4 py-4 text-center border-r border-slate-200 font-bold bg-slate-50 text-ugc-navy">
                      {totalStats.display}
                    </td>
                    {ugcUniversities.map((uni) => {
                      const stats = getIntakeStats(course.number, uni.university_hei);
                      return (
                        <td
                          key={uni.university_hei}
                          className="p-0 text-center border-r border-slate-100 last:border-r-0"
                        >
                          {stats.offered ? (
                            <Link
                              to={`/programs?course=${course.number}&university=${encodeURIComponent(uni.university_hei)}&type=UG`}
                              className="flex items-center justify-center w-full h-full py-4 hover:bg-slate-100/80 hover:text-ugc-gold transition-colors"
                            >
                              {stats.allNull ? (
                                <span
                                  className="inline-flex items-center justify-center font-bold text-slate-500 cursor-help bg-slate-100 px-2 py-0.5 rounded"
                                  title="Data not available"
                                >
                                  ?
                                </span>
                              ) : (
                                <span className="font-semibold text-slate-800">
                                  {stats.sum}
                                </span>
                              )}
                            </Link>
                          ) : (
                            <span className="text-slate-300 block py-4">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {filteredCoursesOfStudy.length === 0 && (
                <tr>
                  <td
                    colSpan={ugcUniversities.length + 3}
                    className="py-10 text-center text-slate-500"
                  >
                    No courses of study found matching "{searchTerm}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* University Abbreviations Legend */}
      <div className="rounded-lg bg-white p-6 shadow border border-slate-200">
        <h3 className="mb-4 font-display text-base font-bold text-ugc-navy">
          University Legend
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ugcUniversities.map((uni) => (
            <div key={uni.university_hei} className="flex items-center gap-3">
              <span className="inline-flex h-8 w-14 items-center justify-center rounded-md bg-slate-100 font-bold text-slate-700 text-xs shrink-0">
                {uni.abbreviation}
              </span>
              <div className="text-xs">
                <p className="font-semibold text-slate-900">{uni.university_hei}</p>
                <p className="text-slate-400">Code: {uni.uni_code} • {uni.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
