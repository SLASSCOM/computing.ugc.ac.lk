import { useState, useMemo, useEffect } from 'react';
import { useAnalysisData } from '../hooks/useAnalysisData';
import LoadingSpinner from './LoadingSpinner';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  TrendingUp,
  TrendingDown,
  Info,
  X,
  FlaskConical
} from 'lucide-react';
import MultiSelectFilter from './MultiSelectFilter';

type SortKey = 'code_of_study' | 'ugc_course_name' | 'course_name' | 'university' | 'intake_count' | 'zScore2024' | 'zScore2025' | 'zScoreDiff' | 'rank2024' | 'rank2025' | 'rankDiff';
type SortOrder = 'asc' | 'desc';

const AnalysisPage = () => {
  const {
    loading,
    selectedDistrict,
    setSelectedDistrict,
    districts,
    analysisData,
    uniqueUniversities,
    uniqueCoursesOfStudy,
    showAll,
    setShowAll
  } = useAnalysisData();


  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('zScore2025');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    document.title = 'Cut-off Marks Analysis | Computing Programs Directory';
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      if (key === 'rank2024' || key === 'rank2025' || key === 'course_name' || key === 'ugc_course_name' || key === 'university' || key === 'code_of_study') {
        setSortOrder('asc');
      } else {
        setSortOrder('desc');
      }
    }
  };

  const hasActiveFilters = selectedUniversities.length > 0 || selectedCourses.length > 0 || searchQuery !== '' || selectedDistrict !== 'SRI LANKA (MEDIAN)';

  const clearFilters = () => {
    setSelectedDistrict('SRI LANKA (MEDIAN)');
    setSelectedUniversities([]);
    setSelectedCourses([]);
    setSearchQuery('');
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...analysisData];

    // Filter by university dropdown
    if (selectedUniversities.length > 0) {
      result = result.filter(r => selectedUniversities.includes(r.university));
    }

    // Filter by course of study dropdown
    if (selectedCourses.length > 0) {
      result = result.filter(r => selectedCourses.includes(`${r.course_number} - ${r.ugc_course_name}`));
    }

    // Filter by text search term
    if (searchQuery.trim() !== '') {
      const term = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.course_name.toLowerCase().includes(term) ||
        r.ugc_course_name.toLowerCase().includes(term) ||
        r.university.toLowerCase().includes(term) ||
        r.faculty.toLowerCase().includes(term) ||
        r.code_of_study.toLowerCase().includes(term)
      );
    }



    // Sort
    result.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      const isEmptyA = valA === null || valA === 'NQC';
      const isEmptyB = valB === null || valB === 'NQC';

      // Always push nulls and NQCs to the bottom regardless of sort order
      if (isEmptyA && isEmptyB) return 0;
      if (isEmptyA) return 1;
      if (isEmptyB) return -1;

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc'
          ? valA - valB
          : valB - valA;
      }

      return 0;
    });

    return result;
  }, [analysisData, selectedUniversities, selectedCourses, searchQuery, sortBy, sortOrder]);

  const renderSortIcon = (key: SortKey) => {
    if (sortBy !== key) {
      return <ArrowUpDown className="ml-1 h-4 w-4 text-slate-400 shrink-0" />;
    }
    return sortOrder === 'asc'
      ? <ArrowUp className="ml-1 h-4 w-4 text-ugc-gold shrink-0" />
      : <ArrowDown className="ml-1 h-4 w-4 text-ugc-gold shrink-0" />;
  };

  const formatZScore = (val: number | 'NQC' | null) => {
    if (val === null) return <span className="text-slate-300">-</span>;
    if (val === 'NQC') return <span className="text-amber-600 font-semibold text-xs bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">NQC</span>;
    return val.toFixed(4);
  };

  const renderZScoreDiff = (diff: number | null) => {
    if (diff === null) return <span className="text-slate-300">-</span>;
    if (diff > 0) {
      return <span className="text-emerald-600 font-semibold font-mono">+{diff.toFixed(4)}</span>;
    }
    if (diff < 0) {
      return <span className="text-rose-600 font-semibold font-mono">{diff.toFixed(4)}</span>;
    }
    return <span className="text-slate-400 font-mono">0.0000</span>;
  };

  const renderRankDiff = (diff: number | null) => {
    if (diff === null) return <span className="text-slate-300">-</span>;
    if (diff > 0) {
      return (
        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <TrendingUp className="h-3 w-3" />
          +{diff}
        </span>
      );
    }
    if (diff < 0) {
      return (
        <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
          <TrendingDown className="h-3 w-3" />
          {diff}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 border border-slate-200">
        =
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold leading-7 text-ugc-navy sm:text-3xl sm:tracking-tight">
          Z-Score Cut-off & Rank Trend Analysis
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Compare minimum Z-Score cut-off marks and relative rankings of computing programs between academic years 2024/2025 and 2025/2026.
        </p>
      </div>

      {selectedDistrict === 'SRI LANKA (MEDIAN)' && (
        <div className="mb-6 rounded-lg bg-indigo-50 border border-indigo-100 p-4 shadow-sm flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100">
            <FlaskConical className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-indigo-900">Experimental National Normalization</h3>
            <p className="mt-1 text-xs text-indigo-700 leading-relaxed max-w-4xl">
              UGC cut-off marks are naturally district-based and highly varied due to regional quotas and educational disadvantages. This view calculates a <strong>National Normalized Z-Score Cut-off</strong> by taking the <strong>Median</strong> of all available district cut-offs for each program. This smooths out extreme outliers to provide a general indicator of the program's national competitiveness.
            </p>
            <div className="mt-2.5 text-[11px] font-mono text-indigo-850 bg-indigo-100/50 px-3 py-2 rounded-md border border-indigo-200/60 max-w-xl">
              <span className="font-semibold text-indigo-900 block mb-1">Median Formula & NQC Handling:</span>
              <ul className="list-disc pl-4 space-y-1">
                <li>If the number of numeric district cut-offs (n) is odd: <span className="font-bold">Median = sorted[floor(n / 2)]</span></li>
                <li>If the number of numeric district cut-offs (n) is even: <span className="font-bold">Median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2</span></li>
                <li>If there is a mix of numeric cut-offs and NQCs: the NQCs are ignored, and the median is calculated <span className="font-bold">only from the numeric cut-offs</span>.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Control Panel / Filters */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
          {/* District Selector */}
          <div>
            <label htmlFor="district-select" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              District
            </label>
            <select
              id="district-select"
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-ugc-gold focus:outline-none focus:ring-1 focus:ring-ugc-gold font-medium text-ugc-navy"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* University MultiSelect Filter */}
          <div className="relative z-20">
            <MultiSelectFilter
              label="University"
              placeholder="All Universities"
              options={uniqueUniversities.map(u => ({ value: u, label: u }))}
              selected={selectedUniversities}
              onChange={setSelectedUniversities}
              showLabel
            />
          </div>

          {/* Course of Study MultiSelect Filter */}
          <div className="relative z-10">
            <MultiSelectFilter
              label="Course of Study (UGC)"
              placeholder="All Courses"
              options={uniqueCoursesOfStudy.map(c => ({ value: c.label, label: c.label }))}
              selected={selectedCourses}
              onChange={setSelectedCourses}
              showLabel
            />
          </div>

          {/* Search Input */}
          <div className="relative">
            <label htmlFor="search-input" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Search Keyword
            </label>
            <div className="relative">
              <input
                type="text"
                id="search-input"
                className="block w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm placeholder-slate-400 focus:border-ugc-gold focus:outline-none focus:ring-1 focus:ring-ugc-gold"
                placeholder="Title, faculty, code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Second Row: Toggles and Reset */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-6">
            <label className="relative flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showAll}
                onChange={(e) => setShowAll(e.target.checked)}
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-ugc-gold"></div>
              <span className="ms-3 text-sm font-medium text-slate-700">Show all programs</span>
            </label>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-850 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Reset Filters
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="h-4 w-4 text-slate-400 shrink-0" />
            <span>Showing <strong>{filteredAndSortedData.length}</strong> programs for <strong>{selectedDistrict}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-lg bg-white shadow border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm font-sans">
            <thead className="bg-slate-50">
              <tr>
                <th
                  scope="col"
                  className="cursor-pointer py-3.5 pl-4 pr-3 font-semibold text-slate-900 border-r border-slate-200 hover:bg-slate-100 transition-colors w-24"
                  onClick={() => handleSort('code_of_study')}
                >
                  <div className="flex items-center">
                    Code {renderSortIcon('code_of_study')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="cursor-pointer px-4 py-3.5 font-semibold text-slate-900 border-r border-slate-200 hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('ugc_course_name')}
                >
                  <div className="flex items-center">
                    Course of Study (UGC) {renderSortIcon('ugc_course_name')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="cursor-pointer px-4 py-3.5 font-semibold text-slate-900 border-r border-slate-200 hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('course_name')}
                >
                  <div className="flex items-center">
                    Degree Program {renderSortIcon('course_name')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="cursor-pointer px-4 py-3.5 font-semibold text-slate-900 border-r border-slate-200 hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('university')}
                >
                  <div className="flex items-center">
                    University {renderSortIcon('university')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="cursor-pointer px-4 py-3.5 text-center font-semibold text-slate-900 border-r border-slate-200 hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('intake_count')}
                >
                  <div className="flex items-center justify-center">
                    Intake {renderSortIcon('intake_count')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="cursor-pointer px-4 py-3.5 text-center font-semibold text-slate-900 border-r border-slate-200 hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('zScore2024')}
                >
                  <div className="flex items-center justify-center">
                    Cut-off 24/25 {renderSortIcon('zScore2024')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="cursor-pointer px-4 py-3.5 text-center font-semibold text-slate-900 border-r border-slate-200 hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('zScore2025')}
                >
                  <div className="flex items-center justify-center">
                    Cut-off 25/26 {renderSortIcon('zScore2025')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="cursor-pointer px-4 py-3.5 text-center font-semibold text-slate-900 border-r border-slate-200 hover:bg-slate-100 transition-colors bg-slate-100/50"
                  onClick={() => handleSort('zScoreDiff')}
                >
                  <div className="flex items-center justify-center">
                    Z-Score Diff {renderSortIcon('zScoreDiff')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="cursor-pointer px-4 py-3.5 text-center font-semibold text-slate-900 border-r border-slate-200 hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('rank2025')}
                >
                  <div className="flex items-center justify-center">
                    Rank 25/26 {renderSortIcon('rank2025')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="cursor-pointer px-4 py-3.5 text-center font-semibold text-slate-900 hover:bg-slate-100 transition-colors bg-slate-100/50"
                  onClick={() => handleSort('rankDiff')}
                >
                  <div className="flex items-center justify-center">
                    Rank Change {renderSortIcon('rankDiff')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredAndSortedData.map((record, index) => {
                // Ensure a unique key since some programs share the same code_of_study
                const uniqueKey = `${record.code_of_study}-${record.course_name}-${index}`;
                return (
                  <tr key={uniqueKey} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 pl-4 pr-3 font-mono text-xs font-semibold text-slate-600 border-r border-slate-200">
                      <span className="inline-flex items-center rounded bg-slate-100 px-2 py-1 font-bold text-slate-700">
                        {record.code_of_study}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700 border-r border-slate-200">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span>{record.ugc_course_name}</span>
                        {record.merit_base && (
                          <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-600/20">
                            Merit Based
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold text-ugc-navy border-r border-slate-200">
                      {record.course_name}
                    </td>
                    <td className="px-4 py-4 text-slate-600 border-r border-slate-200 text-xs">
                      <div>
                        <p className="font-semibold text-slate-800">{record.university}</p>
                        <p className="text-slate-400 mt-0.5">{record.faculty}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center font-semibold text-slate-700 border-r border-slate-200">
                      {record.intake_count ?? <span className="text-slate-300">?</span>}
                    </td>
                    <td className="px-4 py-4 text-center font-mono border-r border-slate-200 text-slate-700">
                      {formatZScore(record.zScore2024)}
                    </td>
                    <td className="px-4 py-4 text-center font-mono border-r border-slate-200 text-slate-800 font-bold">
                      {formatZScore(record.zScore2025)}
                    </td>
                    <td className="px-4 py-4 text-center border-r border-slate-200 bg-slate-50/50">
                      {renderZScoreDiff(record.zScoreDiff)}
                    </td>
                    <td className="px-4 py-4 text-center border-r border-slate-200 text-ugc-navy font-bold">
                      {record.rank2025 ?? <span className="text-slate-300">-</span>}
                    </td>
                    <td className="px-4 py-4 text-center bg-slate-50/50">
                      {record.zScoreDiff !== null ? renderRankDiff(record.rankDiff) : '-'}
                    </td>
                  </tr>
                );
              })}
              {filteredAndSortedData.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    <div className="max-w-sm mx-auto">
                      <p className="font-semibold text-slate-700 text-base">No programs found</p>
                      <p className="text-xs text-slate-400 mt-1">Try clearing your filters or choosing a different district.</p>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-ugc-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
