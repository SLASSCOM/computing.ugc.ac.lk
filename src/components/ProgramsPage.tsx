import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import ProgramCard from './ProgramCard';
import ProgramModal from './ProgramModal';
import { UniversityData, ProgramData } from '../types';

const ProgramsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [universities, setUniversities] = useState<UniversityData[]>([]);
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState(searchParams.get('university') || '');
  const [selectedType, setSelectedType] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<ProgramData | null>(null);
  const [showFilters, setShowFilters] = useState(false);

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

  const filteredPrograms = useMemo(() => {
    return programs.filter(program => {
      const matchesSearch = !searchTerm || 
        Object.values(program).some(value => 
          value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesUniversity = !selectedUniversity || program.university_hei === selectedUniversity;
      const matchesType = !selectedType || program.ug_pg === selectedType;
      const matchesSpecialization = !selectedSpecialization || program.specialization === selectedSpecialization;
      const matchesStream = !selectedStream || program.academic_stream === selectedStream;

      return matchesSearch && matchesUniversity && matchesType && matchesSpecialization && matchesStream;
    });
  }, [programs, searchTerm, selectedUniversity, selectedType, selectedSpecialization, selectedStream]);

  const specializations = useMemo(() => {
    return [...new Set(programs.map(p => p.specialization).filter(Boolean))].sort();
  }, [programs]);

  const streams = useMemo(() => {
    return [...new Set(programs.map(p => p.academic_stream).filter(Boolean))].sort();
  }, [programs]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedUniversity('');
    setSelectedType('');
    setSelectedSpecialization('');
    setSelectedStream('');
    setSearchParams({});
  };

  const hasActiveFilters = searchTerm || selectedUniversity || selectedType || selectedSpecialization || selectedStream;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading programs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Computing Programs</h1>
          <p className="text-gray-600">
            Showing {filteredPrograms.length} of {programs.length} programs
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search programs, universities, specializations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <Filter className="h-5 w-5" />
              <span>Advanced Filters</span>
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <select
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Universities</option>
                {universities.map(uni => (
                  <option key={uni.university_hei} value={uni.university_hei}>
                    {uni.university_hei}
                  </option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="UG">Undergraduate</option>
                <option value="PG">Postgraduate</option>
              </select>

              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>

              <select
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Streams</option>
                {streams.map(stream => (
                  <option key={stream} value={stream}>{stream}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Programs List */}
        <div className="space-y-4">
          {filteredPrograms.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No programs found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            filteredPrograms.map((program, index) => (
              <ProgramCard
                key={index}
                program={program}
                university={universities.find(u => u.university_hei === program.university_hei)}
                onClick={() => setSelectedProgram(program)}
              />
            ))
          )}
        </div>
      </div>

      {/* Program Modal */}
      {selectedProgram && (
        <ProgramModal
          program={selectedProgram}
          university={universities.find(u => u.university_hei === selectedProgram.university_hei)}
          onClose={() => setSelectedProgram(null)}
        />
      )}
    </div>
  );
};

export default ProgramsPage;