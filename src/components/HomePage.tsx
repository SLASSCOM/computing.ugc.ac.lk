import React, { useState, useEffect } from 'react';
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
          <div className="mb-10 text-center">
            <h2 className="mb-3 font-display text-2xl font-bold text-ugc-navy sm:text-3xl">
              Universities &amp; Institutes
            </h2>
            <p className="mx-auto max-w-2xl text-slate-600">
              Browse computing programs by selecting your preferred university or institute
            </p>
          </div>

          <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {universities.map((university, index) => (
              <UniversityCard
                key={index}
                university={university}
                programs={programs}
                onClick={() => handleUniversityClick(university.university_hei)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
