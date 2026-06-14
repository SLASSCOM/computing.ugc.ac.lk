import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, X, ChevronLeft, ExternalLink } from 'lucide-react';
import ProgramCard from './ProgramCard';
import ProgramModal from './ProgramModal';
import MultiSelectFilter from './MultiSelectFilter';
import LoadingSpinner from './LoadingSpinner';
import UniversityLogo from './UniversityLogo';
import { UniversityData, ProgramData } from '../types';

const TYPE_OPTIONS = [
  { value: 'UG', label: 'Undergraduate' },
  { value: 'PG', label: 'Postgraduate' },
];

const ProgramsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [universities, setUniversities] = useState<UniversityData[]>([]);
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>(() => {
    const universityParam = searchParams.get('university');
    return universityParam ? [universityParam] : [];
  });
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [selectedCoursesOfStudy, setSelectedCoursesOfStudy] = useState<string[]>([]);
  const [selectedSlqfLevels, setSelectedSlqfLevels] = useState<string[]>([]);
  const [coursesOfStudy, setCoursesOfStudy] = useState<{ number: string; name: string }[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<ProgramData | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const skipUniversityUrlSync = useRef(false);

  const singleUniversityFromUrl =
    selectedUniversities.length === 1 ? selectedUniversities[0] : '';

  useEffect(() => {
    document.title = singleUniversityFromUrl
      ? `${singleUniversityFromUrl} | Computing Programs | UGC Sri Lanka`
      : 'Computing Programs | UGC Sri Lanka';
  }, [singleUniversityFromUrl]);

  useEffect(() => {
    if (skipUniversityUrlSync.current) {
      skipUniversityUrlSync.current = false;
      return;
    }
    const universityParam = searchParams.get('university') || '';
    setSelectedUniversities(universityParam ? [universityParam] : []);
  }, [searchParams]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [universitiesResponse, programsResponse, keysResponse] = await Promise.all([
          fetch(`${import.meta.env.BASE_URL}data/universities.json`),
          fetch(`${import.meta.env.BASE_URL}data/programs.json`),
          fetch(`${import.meta.env.BASE_URL}data/keys.json`),
        ]);

        const universitiesData = await universitiesResponse.json();
        const programsData = await programsResponse.json();
        const keysData = await keysResponse.json();

        setUniversities(universitiesData);
        setPrograms(programsData);
        setCoursesOfStudy(keysData.courses_of_study || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const matchesSearch =
        !searchTerm ||
        Object.values(program).some(
          (value) =>
            value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesUniversity =
        selectedUniversities.length === 0 ||
        selectedUniversities.includes(program.university_hei);
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(program.ug_pg);
      const matchesDiscipline =
        selectedDisciplines.length === 0 ||
        (program.discipline !== null && selectedDisciplines.includes(program.discipline));
      const matchesCourseOfStudy =
        selectedCoursesOfStudy.length === 0 ||
        (program.code_of_study && selectedCoursesOfStudy.includes(program.code_of_study.substring(0, 3))) ||
        (!program.code_of_study && selectedCoursesOfStudy.includes('Other'));
      const matchesSlqfLevel =
        selectedSlqfLevels.length === 0 ||
        (program.slqf !== null && selectedSlqfLevels.includes(program.slqf)) ||
        (program.slqf === null && selectedSlqfLevels.includes('N/A'));

      return (
        matchesSearch &&
        matchesUniversity &&
        matchesType &&
        matchesDiscipline &&
        matchesCourseOfStudy &&
        matchesSlqfLevel
      );
    });
  }, [
    programs,
    searchTerm,
    selectedUniversities,
    selectedTypes,
    selectedDisciplines,
    selectedCoursesOfStudy,
    selectedSlqfLevels,
  ]);

  const ugList = useMemo(
    () => filteredPrograms.filter((p) => p.ug_pg === 'UG'),
    [filteredPrograms]
  );
  const pgList = useMemo(
    () => filteredPrograms.filter((p) => p.ug_pg === 'PG'),
    [filteredPrograms]
  );

  const disciplines = useMemo(() => {
    return [...new Set(programs.map((p) => p.discipline).filter(Boolean))].sort();
  }, [programs]);

  const universityOptions = useMemo(
    () =>
      universities.map((uni) => ({
        value: uni.university_hei,
        label: uni.university_hei,
      })),
    [universities]
  );

  const disciplineOptions = useMemo(
    () =>
      disciplines.map((discipline) => ({
        value: discipline as string,
        label: discipline as string,
      })),
    [disciplines]
  );

  const courseOfStudyOptions = useMemo(() => {
    const activeNumbers = new Set(
      programs
        .map((p) => p.code_of_study?.substring(0, 3))
        .filter(Boolean)
    );
    const options = coursesOfStudy
      .filter((c) => activeNumbers.has(c.number))
      .map((c) => ({
        value: c.number,
        label: `${c.number} - ${c.name}`,
      }))
      .sort((a, b) => a.value.localeCompare(b.value));

    const hasProgramsWithoutCode = programs.some((p) => !p.code_of_study);
    if (hasProgramsWithoutCode) {
      options.push({ value: 'Other', label: 'Other' });
    }

    return options;
  }, [programs, coursesOfStudy]);

  const slqfOptions = useMemo(() => {
    const activeLevels = new Set(
      programs
        .map((p) => p.slqf)
        .filter((level): level is string => !!level)
    );
    const sortedLevels = Array.from(activeLevels).sort((a, b) => {
      const aNum = parseFloat(a.split('/')[0]);
      const bNum = parseFloat(b.split('/')[0]);
      return aNum - bNum;
    });

    const options = sortedLevels.map((lvl) => ({
      value: lvl,
      label: `Level ${lvl}`,
    }));

    const hasProgramsWithoutSlqf = programs.some((p) => !p.slqf);
    if (hasProgramsWithoutSlqf) {
      options.push({ value: 'N/A', label: 'Not Specified (N/A)' });
    }

    return options;
  }, [programs]);

  const selectedUniversityData = universities.find(
    (u) => u.university_hei === singleUniversityFromUrl
  );

  const syncUniversityParams = (values: string[]) => {
    if (values.length === 1) {
      setSearchParams({ university: values[0] });
    } else if (values.length === 0) {
      setSearchParams({});
    } else {
      skipUniversityUrlSync.current = true;
      setSearchParams({});
    }
  };

  const handleUniversitiesChange = (values: string[]) => {
    setSelectedUniversities(values);
    syncUniversityParams(values);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedUniversities([]);
    setSelectedTypes([]);
    setSelectedDisciplines([]);
    setSelectedCoursesOfStudy([]);
    setSelectedSlqfLevels([]);
    setSearchParams({});
  };

  const hasActiveFilters =
    searchTerm ||
    selectedUniversities.length > 0 ||
    selectedTypes.length > 0 ||
    selectedDisciplines.length > 0 ||
    selectedCoursesOfStudy.length > 0 ||
    selectedSlqfLevels.length > 0;

  const showUgSection = selectedTypes.length === 0 || selectedTypes.includes('UG');
  const showPgSection = selectedTypes.length === 0 || selectedTypes.includes('PG');

  const renderProgramSection = (
    id: string,
    title: string,
    list: ProgramData[],
    emptyMessage: string
  ) => (
    <section aria-labelledby={id} className="mb-12">
      <div className="mb-4 flex items-baseline justify-between border-b border-slate-200 pb-3">
        <h2 id={id} className="font-display text-2xl font-semibold text-ugc-navy">
          {title}
        </h2>
        <span className="text-sm text-slate-500">
          {list.length} {list.length === 1 ? 'program' : 'programs'}
        </span>
      </div>
      {list.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          {emptyMessage}
        </p>
      ) : (
        <div className="space-y-4">
          {list.map((program, index) => (
            <ProgramCard
              key={`${id}-${index}`}
              program={program}
              university={universities.find(
                (u) => u.university_hei === program.university_hei
              )}
              onClick={() => setSelectedProgram(program)}
            />
          ))}
        </div>
      )}
    </section>
  );

  if (loading) {
    return <LoadingSpinner message="Loading programs..." />;
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link to="/" className="hover:text-ugc-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugc-gold rounded">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                to="/programs"
                className={`hover:text-ugc-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugc-gold rounded ${!singleUniversityFromUrl ? 'font-medium text-ugc-navy' : ''
                  }`}
                onClick={() => {
                  setSelectedUniversities([]);
                  setSearchParams({});
                }}
              >
                Programs
              </Link>
            </li>
            {singleUniversityFromUrl && (
              <>
                <li aria-hidden="true">/</li>
                <li className="font-medium text-ugc-navy line-clamp-1">{singleUniversityFromUrl}</li>
              </>
            )}
          </ol>
        </nav>

        {singleUniversityFromUrl && (
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-ugc-navy hover:text-ugc-navyLight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugc-gold rounded"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Back to Universities
          </Link>
        )}

        {/* Page Header */}
        <div className="mb-8">
          {selectedUniversityData ? (
            <div className="flex items-start gap-4">
              <UniversityLogo
                universityHei={selectedUniversityData.university_hei}
                image={selectedUniversityData.image}
                className="h-16 w-16 shrink-0 rounded-full border border-slate-200 bg-white"
                textClassName="text-xl font-bold text-ugc-navy"
              />
              <div>
                <h1 className="font-display text-2xl font-bold text-ugc-navy sm:text-3xl">
                  {singleUniversityFromUrl}
                  {selectedUniversityData.abbreviation && ` (${selectedUniversityData.abbreviation})`}
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-600">
                  <span>
                    {filteredPrograms.length} computing program
                    {filteredPrograms.length !== 1 ? 's' : ''} found
                  </span>
                  {selectedUniversityData.associated_university && (
                    <>
                      <span className="hidden text-slate-300 sm:inline">•</span>
                      <span>Associated with {selectedUniversityData.associated_university}</span>
                    </>
                  )}
                  {selectedUniversityData.established_under && (
                    <>
                      <span className="hidden text-slate-300 sm:inline">•</span>
                      <span>Established under {selectedUniversityData.established_under}</span>
                    </>
                  )}
                  {selectedUniversityData.url && (
                    <>
                      <span className="hidden text-slate-300 sm:inline">•</span>
                      <a
                        href={selectedUniversityData.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-ugc-navyLight hover:text-ugc-gold hover:underline transition-colors duration-150"
                      >
                        <span>Visit Website</span>
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              <h1 className="font-display text-3xl font-bold text-ugc-navy">
                Computing Programs
              </h1>
              <p className="mt-1 text-slate-600">
                Showing {filteredPrograms.length} of {programs.length} programs
                {selectedUniversities.length > 1 &&
                  ` across ${selectedUniversities.length} universities`}
              </p>
            </>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="relative mb-6">
            <Search
              className="absolute left-3 top-3 h-5 w-5 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search programs, universities, disciplines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ugc-gold"
              aria-label="Search programs"
            />
          </div>

          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-slate-600 transition-colors hover:text-ugc-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugc-gold rounded"
              aria-expanded={showFilters}
            >
              <Filter className="h-5 w-5" aria-hidden="true" />
              <span>Advanced Filters</span>
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-2 text-red-600 transition-colors hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugc-gold rounded"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 gap-4 border-t border-slate-200 pt-4 sm:grid-cols-2 lg:grid-cols-5">
              <MultiSelectFilter
                label="Filter by university"
                placeholder="All Universities"
                options={universityOptions}
                selected={selectedUniversities}
                onChange={handleUniversitiesChange}
              />

              <MultiSelectFilter
                label="Filter by program type"
                placeholder="All Types"
                options={TYPE_OPTIONS}
                selected={selectedTypes}
                onChange={setSelectedTypes}
              />

              <MultiSelectFilter
                label="Filter by discipline"
                placeholder="All Disciplines"
                options={disciplineOptions}
                selected={selectedDisciplines}
                onChange={setSelectedDisciplines}
              />

              <MultiSelectFilter
                label="Filter by Course of Study"
                placeholder="All UGC Courses"
                options={courseOfStudyOptions}
                selected={selectedCoursesOfStudy}
                onChange={setSelectedCoursesOfStudy}
              />

              <MultiSelectFilter
                label="Filter by SLQF Level"
                placeholder="All SLQF Levels"
                options={slqfOptions}
                selected={selectedSlqfLevels}
                onChange={setSelectedSlqfLevels}
              />
            </div>
          )}
        </div>

        {/* Programs Sections */}
        {filteredPrograms.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Search className="h-8 w-8 text-slate-400" aria-hidden="true" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-ugc-navy">No programs found</h3>
            <p className="text-slate-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            {showUgSection &&
              renderProgramSection(
                'ug-heading',
                'Undergraduate Programs',
                ugList,
                'No undergraduate programs match the current filters.'
              )}
            {showPgSection &&
              renderProgramSection(
                'pg-heading',
                'Postgraduate Programs',
                pgList,
                'No postgraduate programs match the current filters.'
              )}
          </>
        )}
      </div>

      {selectedProgram && (
        <ProgramModal
          program={selectedProgram}
          university={universities.find(
            (u) => u.university_hei === selectedProgram.university_hei
          )}
          onClose={() => setSelectedProgram(null)}
        />
      )}
    </div>
  );
};

export default ProgramsPage;
