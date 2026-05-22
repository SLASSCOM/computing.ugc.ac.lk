import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaseSensitive as University, Users, BookOpen, Award } from 'lucide-react';
import UniversityCard from './UniversityCard';
import StatsSection from './StatsSection';
import { UniversityData, ProgramData } from '../types';

const HomePage = () => {
  const [universities, setUniversities] = useState<UniversityData[]>([]);
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [universitiesResponse, programsResponse] = await Promise.all([
          fetch('/data/universities.json'),
          fetch('/data/programs.json')
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading universities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Computing Programs in 
              <span className="text-blue-600 block">Sri Lanka</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Discover undergraduate and postgraduate computing degree programs offered by 
              UGC-approved state universities and higher education institutes across Sri Lanka.
            </p>
            <button 
              onClick={() => navigate('/programs')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Explore All Programs
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <StatsSection universities={universities} programs={programs} />

      {/* Universities Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Universities & Institutes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse computing programs by selecting your preferred university or institute
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      {/* Call to Action */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Find Your Perfect Computing Program
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Compare programs, explore specializations, and make informed decisions about your computing education journey
          </p>
          <button 
            onClick={() => navigate('/programs')}
            className="bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Start Exploring
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;