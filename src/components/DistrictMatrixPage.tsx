import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAnalysisData } from '../hooks/useAnalysisData';
import LoadingSpinner from './LoadingSpinner';
import { ArrowLeft, Search, ExternalLink, HelpCircle } from 'lucide-react';
import MultiSelectFilter from './MultiSelectFilter';

const DistrictMatrixPage = () => {
  const {
    loading,
    districts: allDistricts,
    cop2024,
    cop2025,
    universities,
    keyCourses
  } = useAnalysisData();

  const [selectedYear, setSelectedYear] = useState<'2024/2025' | '2025/2026'>('2025/2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  useEffect(() => {
    document.title = 'District-wise Z-Score Matrix | UGC Admissions Directory';
  }, []);

  // Map 3-digit course numbers to their generic Course of Study names (e.g., "Computer Science")
  const courseNameMap = useMemo(() => {
    const map = new Map<string, string>();
    keyCourses.forEach(c => {
      map.set(`${c.number}_${c.intake?.id || ''}`, c.name);
    });
    return map;
  }, [keyCourses]);

  // Map 1-letter/digit university codes to abbreviations/names
  const uniCodeToAbbrMap = useMemo(() => {
    const map = new Map<string, string>();
    universities.forEach(u => {
      if (u.uni_code) {
        map.set(u.uni_code, u.abbreviation || u.university_hei);
      }
    });
    return map;
  }, [universities]);

  // Clean list of districts (exclude median row if present for standard matrix layout)
  const matrixDistricts = useMemo(() => {
    return allDistricts.filter(d => d !== 'SRI LANKA (MEDIAN)');
  }, [allDistricts]);

  // Select the appropriate COP dataset based on the selected year
  const activeCOP = useMemo(() => {
    return selectedYear === '2024/2025' ? cop2024 : cop2025;
  }, [selectedYear, cop2024, cop2025]);

  // Build a fast lookup map for (district + '_' + course_code) => COPRecord
  const copLookupMap = useMemo(() => {
    const map = new Map<string, typeof activeCOP[0]>();
    activeCOP.forEach(record => {
      map.set(`${record.district}_${record.courses_of_study}_${record.intake ?? ''}`, record);
    });
    return map;
  }, [activeCOP]);

  // Generate matrix columns (programs) dynamically from all available records in the selected COP year
  const matrixPrograms = useMemo(() => {
    const codes = new Set<string>();
    activeCOP.forEach(r => {
      if (r.courses_of_study) {
          codes.add(r.courses_of_study+"."+(r.intake??''));
      }
    });
    
    return Array.from(codes).sort().map(code => {
      const courseNum = code.substring(0, 3);
      const uniCode = code.substring(3,4);
      const intake = code.substring(5) || '';
      // console.log(courseNameMap.keys());
      const courseName = courseNameMap.get(courseNum+"_"+intake) || `Course ${courseNum}`;
      const uniAbbr = uniCodeToAbbrMap.get(uniCode) || `Uni ${uniCode}`;
      const fullUniName = universities.find(u => u.uni_code === uniCode)?.university_hei || uniAbbr;
      
      const isMerit = activeCOP.some(r => r.courses_of_study === code && r.merit_base);
      const isAptitude = activeCOP.some(r => r.courses_of_study === code && r.tests_conducted);

      return {
        code,
        courseNum,
        uniCode,
        courseName,
        uniAbbr,
        fullUniName,
        isMerit,
        isAptitude
      };
    });
  }, [activeCOP, courseNameMap, uniCodeToAbbrMap, universities]);

  // Unique university options for filter dropdown based on all courses present in COP
  const uniqueUniversities = useMemo(() => {
    const unis = new Set<string>();
    matrixPrograms.forEach(p => {
      if (p.fullUniName) unis.add(p.fullUniName);
    });
    return Array.from(unis).sort();
  }, [matrixPrograms]);

  // Unique course options for filter dropdown
  const uniqueCourses = useMemo(() => {
    const coursesMap = new Map<string, string>(); // courseName -> courseNum
    matrixPrograms.forEach(p => {
      if (p.courseName && p.courseNum) {
        coursesMap.set(p.courseName, p.courseNum);
      }
    });
    
    return Array.from(coursesMap.entries())
      .map(([name, num]) => ({
        value: name,
        label: `${num} - ${name}`
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [matrixPrograms]);

  // Filter columns (programs) dynamically based on search query, university filter, and course filter
  const filteredPrograms = useMemo(() => {
    return matrixPrograms.filter(p => {
      const matchesSearch = 
        p.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.uniAbbr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesUni = selectedUniversities.length === 0 || selectedUniversities.includes(p.fullUniName);
      const matchesCourse = selectedCourses.length === 0 || selectedCourses.includes(p.courseName);

      return matchesSearch && matchesUni && matchesCourse;
    });
  }, [matrixPrograms, searchQuery, selectedUniversities, selectedCourses]);

  // UGC Data Source URL
  const ugcSourceUrl = selectedYear === '2024/2025' 
    ? 'https://www.ugc.ac.lk/downloads/admissions/cutoff_2025/COP_2024_2025-ENGLISH_Final.pdf'
    : 'https://www.ugc.ac.lk/downloads/admissions/cutoff_2026/COP_2025_2026-ENGLISH_Final.pdf';

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button & Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/analysis"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ugc-navy hover:text-ugc-gold transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Trend Analysis
          </Link>
          <h2 className="font-display text-2xl font-bold leading-7 text-ugc-navy sm:text-3xl sm:tracking-tight">
            District-wise Cut-off Marks Matrix
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Compare minimum Z-Scores and Qualification status (NQC) across all 25 districts side-by-side.
          </p>
        </div>
      </div>

      {/* Info Strip with Link */}
      <div className="mb-6 rounded-lg bg-indigo-50 border border-indigo-100 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <HelpCircle className="h-5 w-5 text-indigo-650 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-indigo-900">Official UGC Reference</h4>
            <p className="text-xs text-indigo-750">
              The data shown here is parsed directly from the official University Grants Commission cutoff PDF document.
            </p>
          </div>
        </div>
        <a
          href={ugcSourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md bg-white border border-indigo-200 px-3.5 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 transition-colors shadow-sm self-start sm:self-auto shrink-0"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Refer to UGC PDF Source ({selectedYear})
        </a>
      </div>

      {/* Control Panel / Filtering */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow border border-slate-200 relative z-50">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
          {/* Academic Year Filter */}
          <div>
            <label htmlFor="matrix-year" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Academic Year
            </label>
            <select
              id="matrix-year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value as '2024/2025' | '2025/2026')}
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-ugc-gold focus:outline-none focus:ring-1 focus:ring-ugc-gold text-ugc-navy font-medium"
            >
              <option value="2025/2026">2025/2026 (Default)</option>
              <option value="2024/2025">2024/2025</option>
            </select>
          </div>

          {/* University Filter */}
          <div className="relative z-20">
            <MultiSelectFilter
              label="Filter by University"
              placeholder="All Universities"
              options={uniqueUniversities.map(u => ({ value: u, label: u }))}
              selected={selectedUniversities}
              onChange={setSelectedUniversities}
              showLabel
            />
          </div>

          {/* UGC Course of Study Filter */}
          <div className="relative z-20">
            <MultiSelectFilter
              label="Filter by Course of Study"
              placeholder="All Courses"
              options={uniqueCourses}
              selected={selectedCourses}
              onChange={setSelectedCourses}
              showLabel
            />
          </div>

          {/* Search */}
          <div>
            <label htmlFor="matrix-search" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Search
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                id="matrix-search"
                type="text"
                placeholder="Search..."
                className="block w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm focus:border-ugc-gold focus:outline-none focus:ring-1 focus:ring-ugc-gold placeholder:text-slate-400 text-ugc-navy font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Clear and Count Bar */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-ugc-navy">{filteredPrograms.length}</span> of <span className="font-bold">{matrixPrograms.length}</span> courses
          </div>
          {(searchQuery || selectedUniversities.length > 0 || selectedCourses.length > 0) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedUniversities([]);
                setSelectedCourses([]);
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Table Container - Removed vertical max-height scroll limit to show all 25 districts natively */}
      <div className="relative rounded-lg border border-slate-200 bg-white shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            {/* Table Header */}
            <thead className="bg-slate-50 sticky top-0 z-30 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
              <tr>
                {/* Upper Left Corner */}
                <th className="bg-slate-100 p-2.5 border-b border-r border-slate-200 sticky left-0 z-40 text-center font-bold text-ugc-navy min-w-[140px] shadow-[1px_0_0_0_rgba(226,232,240,1)]">
                  District
                </th>

                 {/* Vertical Headers */}
                {filteredPrograms.map(prog => (
                  <th
                    key={prog.code}
                    className="p-0 border-b border-r border-slate-200 h-[180px] w-[46px] min-w-[46px] max-w-[65px] align-bottom hover:bg-slate-100 transition-colors group"
                    title={`${prog.code} - ${prog.courseName} (${prog.fullUniName})`}
                  >
                    <div className="flex justify-center items-end h-[180px] w-full pb-2 px-1">
                      <div 
                        className="select-none text-left h-[170px]"
                        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                      >
                        {/* Column 1 (Left Side after rotate) */}
                        <span className="font-mono text-[9px] font-bold text-ugc-gold bg-ugc-navy/5 px-1 py-0.5 rounded inline-block">
                          {prog.code}
                        </span>
                        <span className="text-slate-850 font-sans text-[8px] font-bold mt-1 inline-block">{prog.uniAbbr}</span>
                        {prog.isMerit && (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-0.5 py-[1px] rounded font-mono text-[9px] font-bold mt-1 inline-block" title="All Island Merit Basis">
                            *
                          </span>
                        )}
                        {prog.isAptitude && (
                          <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-1 py-[1px] rounded font-mono text-[9px] font-bold mt-1 inline-block" title="Requires Aptitude/Practical Test">
                            #
                          </span>
                        )}

                        {/* Forces the next text into the next column (Right Side after rotate) */}
                        <br />

                        {/* Column 2 (Right Side after rotate) */}
                        <span className="text-[9.5px] text-slate-650 font-bold group-hover:text-ugc-navy transition-colors leading-tight inline-block mt-1">
                          {prog.courseName}
                        </span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-200">
              {matrixDistricts.map(district => (
                <tr key={district} className="hover:bg-slate-50 transition-colors">
                  {/* Sticky District Label - Highly compact row padding */}
                  <td className="sticky left-0 z-20 bg-slate-50 font-bold text-slate-700 border-r border-slate-200 py-1.5 px-3.5 text-center shadow-[1px_0_0_0_rgba(226,232,240,1)] text-[11px] whitespace-nowrap">
                    {district}
                  </td>

                  {/* Cut-off Mark Data Cells - Highly compact row padding */}
                  {filteredPrograms.map(prog => {
                    const code = prog.code || '';
                    const ccode = code.substring(0,4);
                    const intake = code.substring(5) || '';
                    const record = copLookupMap.get(`${district}_${ccode}_${intake}`);

                    let displayVal: React.ReactNode = <span className="text-slate-300">-</span>;
                    let cellBg = '';

                    if (record) {
                      if (record.nqc) {
                        displayVal = (
                          <span className="font-bold text-[9px] text-amber-600 bg-amber-50 px-1 py-0.2 rounded border border-amber-200">
                            NQC
                          </span>
                        );
                        cellBg = 'bg-amber-50/10';
                      } else if (record.z_score !== undefined) {
                        displayVal = (
                          <span className="font-mono font-medium text-slate-800 text-[11px]">
                            {record.z_score.toFixed(4)}
                          </span>
                        );
                        if (record.merit_base) {
                          cellBg = 'bg-emerald-50/5';
                        } else if (record.tests_conducted) {
                          cellBg = 'bg-indigo-50/5';
                        }
                      }
                    }

                    return (
                      <td
                        key={`${district}_${code}`}
                        className={`py-1.5 px-2 text-center border-r border-slate-200 align-middle ${cellBg}`}
                      >
                        {displayVal}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend & Explanations */}
      <div className="mt-8 rounded-lg bg-slate-50 border border-slate-200 p-4">
        <h4 className="text-sm font-semibold text-ugc-navy mb-3">Symbol Reference & Legend</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs leading-relaxed text-slate-650">
          <div className="flex items-start gap-2">
            <span className="font-mono font-bold text-emerald-600 text-sm mt-[-2px]">*</span>
            <div>
              <p className="font-semibold text-slate-850">All Island Merit Basis (*)</p>
              <p className="text-[11px] text-slate-500">Selection is determined on an all-island merit list rather than the regional/district quota.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-mono font-bold text-indigo-650 text-sm mt-[-2px]">#</span>
            <div>
              <p className="font-semibold text-slate-850">Aptitude Test Required (#)</p>
              <p className="text-[11px] text-slate-500">Course of study requires passing a subject-oriented practical or university aptitude test.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-[9px] text-amber-600 bg-amber-50 px-1 py-0.5 rounded border border-amber-200 mt-[1px]">NQC</span>
            <div>
              <p className="font-semibold text-slate-850">No Qualified Candidates (NQC)</p>
              <p className="text-[11px] text-slate-500">No candidates from the specified district qualified or applied for the program during this cycle.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-mono text-slate-300 text-sm">-</span>
            <div>
              <p className="font-semibold text-slate-850">Not Applicable / No Record</p>
              <p className="text-[11px] text-slate-500">The program was either not offered or there was no cut-off information available for that district.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistrictMatrixPage;
