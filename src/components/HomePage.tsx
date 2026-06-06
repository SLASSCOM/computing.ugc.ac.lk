import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversityCard from './UniversityCard';
import StatsStrip from './StatsStrip';
import LoadingSpinner from './LoadingSpinner';
import { UniversityData, ProgramData } from '../types';

const HomePage = () => {
  const [universities, setUniversities] = useState<UniversityData[]>([]);
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Computing Programs Directory | UGC Sri Lanka';
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [universitiesResponse, programsResponse] = await Promise.all([
          fetch(`${import.meta.env.BASE_URL}data/universities.json`),
          fetch(`${import.meta.env.BASE_URL}data/programs.json`),
        ]);

        const universitiesData = await universitiesResponse.json();
        const programsData = await programsResponse.json();

        setUniversities(universitiesData);
        setPrograms(programsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleUniversityClick = (universityName: string) => {
    navigate(`/programs?university=${encodeURIComponent(universityName)}`);
  };

  if (loading) {
    return <LoadingSpinner message="Loading universities..." />;
  }

  const ugcUniversities = universities.filter(
    (u) => u.established_under === 'University Grants Commission' && u.type === 'University'
  );
  const ugcCampuses = universities.filter(
    (u) => u.established_under === 'University Grants Commission' && u.type === 'Campus'
  );
  const ugcInstitutes = universities.filter(
    (u) => u.established_under === 'University Grants Commission' && u.type === 'Institute'
  );
  const otherGovUniversities = universities.filter(
    (u) => u.established_under !== 'University Grants Commission'
  );

  return (
    <div>
      {/* Compact hero + inline stats */}
      <section className="relative min-h-[55vh] bg-gradient-to-br from-ugc-navy via-ugc-navyLight to-ugc-navyDark">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(199,145,0,0.12)_0%,_transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ugc-gold">
              Standing Committee of Computing
            </p>
            <h1 className="mb-4 font-display text-3xl font-bold leading-snug text-white sm:text-4xl lg:text-5xl">
              <span className="block">Computing Programs in</span>
              <span className="mt-1 block text-ugc-goldSoft">Sri Lanka</span>
            </h1>
            <p className="mb-6 text-base leading-relaxed text-slate-300 sm:text-lg">
              Discover UGC-approved undergraduate and postgraduate computing degree programs
              across state universities and higher education institutes.
            </p>
            <button
              type="button"
              onClick={() => navigate('/programs')}
              className="rounded-lg bg-ugc-gold px-8 py-3 text-base font-semibold text-ugc-navy shadow-lg transition-all duration-200 hover:bg-ugc-goldSoft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugc-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ugc-navy"
            >
              Explore All Programs
            </button>
            <StatsStrip universities={universities} programs={programs} />
          </div>
        </div>
      </section>

      {/* Universities Section */}
      <section className="bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Universities */}
          {ugcUniversities.length > 0 && (
            <div className="mb-14">
              <div className="mb-6 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-6 w-1 rounded-full bg-ugc-gold" />
                  <h3 className="font-display text-xl font-bold text-ugc-navy">
                    Universities
                  </h3>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    {ugcUniversities.length}
                  </span>
                </div>
                <p className="pl-4 text-sm text-slate-500">
                  Universities and Higher Educational Institutions established under the purview of the University Grants Commission
                </p>
              </div>
              <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {ugcUniversities.map((university, index) => (
                  <UniversityCard
                    key={index}
                    university={university}
                    programs={programs}
                    onClick={() => handleUniversityClick(university.university_hei)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Campuses */}
          {ugcCampuses.length > 0 && (
            <div className="mb-14">
              <div className="mb-6 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-6 w-1 rounded-full bg-ugc-gold" />
                  <h3 className="font-display text-xl font-bold text-ugc-navy">
                    Campuses
                  </h3>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    {ugcCampuses.length}
                  </span>
                </div>
                <p className="pl-4 text-sm text-slate-500">
                  Universities and Higher Educational Institutions established under the purview of the University Grants Commission
                </p>
              </div>
              <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {ugcCampuses.map((university, index) => (
                  <UniversityCard
                    key={index}
                    university={university}
                    programs={programs}
                    onClick={() => handleUniversityClick(university.university_hei)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Institutes */}
          {ugcInstitutes.length > 0 && (
            <div className="mb-14">
              <div className="mb-6 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-6 w-1 rounded-full bg-ugc-gold" />
                  <h3 className="font-display text-xl font-bold text-ugc-navy">
                    Institutes
                  </h3>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    {ugcInstitutes.length}
                  </span>
                </div>
                <p className="pl-4 text-sm text-slate-500">
                  Universities and Higher Educational Institutions established under the purview of the University Grants Commission
                </p>
              </div>
              <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {ugcInstitutes.map((university, index) => (
                  <UniversityCard
                    key={index}
                    university={university}
                    programs={programs}
                    onClick={() => handleUniversityClick(university.university_hei)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other Government Universities */}
          {otherGovUniversities.length > 0 && (
            <div className="mb-14">
              <div className="mb-6 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-6 w-1 rounded-full bg-ugc-gold" />
                  <h3 className="font-display text-xl font-bold text-ugc-navy">
                    Other Government Universities
                  </h3>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    {otherGovUniversities.length}
                  </span>
                </div>
                <p className="pl-4 text-sm text-slate-500">
                  Other Government Universities/Institutes which are established by Acts of Parliament of Sri Lanka
                </p>
              </div>
              <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {otherGovUniversities.map((university, index) => (
                  <UniversityCard
                    key={index}
                    university={university}
                    programs={programs}
                    onClick={() => handleUniversityClick(university.university_hei)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other Recognized Degrees */}
          <div className="mb-14">
            <div className="mb-6 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-6 w-1 rounded-full bg-ugc-gold" />
                <h3 className="font-display text-xl font-bold text-ugc-navy">
                  Other Recognized Degrees
                </h3>
              </div>
              <p className="pl-4 text-sm text-slate-500">
                Degrees of Institutes Recognized under Section 25 A of the Universities Act No. 16 of 1978
              </p>
            </div>

            <div className="pl-4">
              <ul className="space-y-4 max-w-4xl">
                <li className="relative pl-6 before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-ugc-gold">
                  <a
                    href="https://www.ugc.ac.lk/index.php?option=com_content&view=article&id=2463%3Adegrees-of-institutes-recognized-under-section-25-a-of-the-universities-act-no-16-of-1978&catid=193%3Arecognized-degrees&Itemid=37&lang=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-700 hover:text-ugc-navyLight hover:underline font-medium leading-relaxed transition-colors duration-150 inline-block"
                  >
                    Degree awarding status granted by the UGC (Specified authority being the Chairman /UGC) with the Gazzette Notification 1086/11 dated 30.06.1999 until 22.02.2012
                  </a>
                </li>
                <li className="relative pl-6 before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-ugc-gold">
                  <a
                    href="https://www.ugc.ac.lk/index.php?option=com_content&view=article&id=2463%3Adegrees-of-institutes-recognized-under-section-25-a-of-the-universities-act-no-16-of-1978&catid=193%3Arecognized-degrees&Itemid=37&lang=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-700 hover:text-ugc-navyLight hover:underline font-medium leading-relaxed transition-colors duration-150 inline-block"
                  >
                    Degree awarding status granted by the Ministry of Education (Specified authority being the Secretary, Ministry of Education) with the Gazzette Notification 1746/11 dated 22.02.2012
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* External Degrees & Ext. Courses */}
          <div className="mb-14">
            <div className="mb-6 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-6 w-1 rounded-full bg-ugc-gold" />
                <h3 className="font-display text-xl font-bold text-ugc-navy">
                  External Degrees
                </h3>
              </div>
            </div>

            <div className="pl-4">
              <ul className="space-y-4 max-w-4xl">
                <li className="relative pl-6 before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-ugc-gold">
                  <a
                    href="https://www.ugc.ac.lk/index.php?option=com_content&view=article&id=1200&Itemid=131&lang=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-700 hover:text-ugc-navyLight hover:underline font-medium leading-relaxed transition-colors duration-150 inline-block"
                  >
                    Approved External Degrees
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Recognized Foreign Universities */}
          <div className="mb-14">
            <div className="mb-6 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-6 w-1 rounded-full bg-ugc-gold" />
                <h3 className="font-display text-xl font-bold text-ugc-navy">
                  Recognized Foreign Universities
                </h3>
              </div>
            </div>

            <div className="pl-4">
              <ul className="space-y-4 max-w-4xl">
                <li className="relative pl-6 before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-ugc-gold">
                  <a
                    href="https://www.ugc.ac.lk/index.php?option=com_content&view=article&id=105&Itemid=100&lang=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-700 hover:text-ugc-navyLight hover:underline font-medium leading-relaxed transition-colors duration-150 inline-block"
                  >
                    Recognition of Foreign Universities
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
