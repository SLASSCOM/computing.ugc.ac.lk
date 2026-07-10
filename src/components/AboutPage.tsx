import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UniversityData, SlqfLevel, Discipline } from '../types';
import LoadingSpinner from './LoadingSpinner';
import UniversityLogo from './UniversityLogo';
import { BookOpen, Award, Users, ChevronRight, ExternalLink } from 'lucide-react';

const AboutPage = () => {
  const [universities, setUniversities] = useState<UniversityData[]>([]);
  const [slqfLevels, setSlqfLevels] = useState<SlqfLevel[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'About | Computing Programs Directory';
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [uniRes, keysRes] = await Promise.all([
          fetch(`${import.meta.env.BASE_URL}data/universities.json`),
          fetch(`${import.meta.env.BASE_URL}data/keys.json`),
        ]);
        const uniData = await uniRes.json();
        const keysData = await keysRes.json();
        setUniversities(uniData);
        setSlqfLevels(keysData.slqf || []);
        setDisciplines(keysData.disciplines || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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

  const getCategoryRows = (categoryUnis: UniversityData[]) => {
    const rows: { designation: string; university: UniversityData }[] = [];
    categoryUnis.forEach((uni) => {
      if (uni.members && uni.members.length > 0) {
        uni.members.forEach((memberDesignation) => {
          rows.push({
            designation: memberDesignation,
            university: uni,
          });
        });
      }
    });
    return rows;
  };

  const uniMembers = getCategoryRows(ugcUniversities);
  const campusMembers = getCategoryRows(ugcCampuses);
  const instituteMembers = getCategoryRows(ugcInstitutes);
  const otherGovMembers = getCategoryRows(otherGovUniversities);

  if (loading) {
    return <LoadingSpinner message="Loading committee details..." />;
  }

  const termsOfReference = [
    {
      text: "Initiate actions on policy directions issued by the UGC from time to time and take steps to implement prescribed initiatives, programmes and activities at university/campus/institute level."
    },
    {
      text: "Evaluate proposals submitted by universities/Institutes with respect to curricular reforms and curriculum for new study programmes and submit recommendations to the Commission."
    },
    {
      text: "Evaluate proposals submitted by Universities/Institutes for the establishment of new Departments/Faculties/lnstitutes and submit recommendations to the Commission."
    },
    {
      text: "Frame guidelines for planning of new undergraduate degree programmes, namely:",
      subPoints: [
        "ways and means of evaluating need and demand",
        "graduate profile",
        "structure of the study programme",
        "courses and intended learning outcomes and planning for course modules",
        "evaluation procedures",
        "credit qualification framework for Information Technology related study programmes"
      ]
    },
    {
      text: "Function as a catalytic unit to promote new initiatives and reforms to improve and advance quality and relevance of Information Technology related study programmes and convey to the Commission for consideration."
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Title section */}
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-bold text-ugc-navy sm:text-4xl">
          About Directory
        </h1>
        <div className="mx-auto mt-3 h-1 w-20 rounded bg-ugc-gold" />
      </div>

      {/* Brief Description Card */}
      <div className="mb-12 overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-slate-100 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-ugc-cream text-ugc-gold">
            <BookOpen className="h-8 w-8" />
          </div>
          <div>
            <h2 className="mb-3 font-display text-xl font-bold text-ugc-navy">
              Why this directory is needed
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Undergraduate computing programs in Sri Lanka have historically been scattered across the UGC handbook, while postgraduate programs were only available on individual university or Higher Educational Institution (HEI) websites. This made it difficult for students, educators, and industry professionals to identify all available programs in one centralized place. To address this gap, the Standing Committee on Computing curated this comprehensive directory to bring all approved computing programs into a single, easily accessible platform.
            </p>
          </div>
        </div>
      </div>

      {/* Standing Committee on Computing */}
      <div className="mb-12">
        <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="h-6 w-1 rounded-full bg-ugc-gold" />
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-ugc-navy">
            <span>Standing Committee on Computing</span>
            <a
              href="https://www.ugc.ac.lk/index.php?option=com_content&view=article&id=17%3Acomputing&catid=2%3Astanding-committees&Itemid=1&lang=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-ugc-gold transition-colors duration-150"
              aria-label="Standing Committee on Computing official page"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          </h2>
        </div>

        {/* Terms of Reference Sub-section */}
        <div className="mb-10 rounded-xl bg-white p-6 shadow-sm border border-slate-100 sm:p-8">
          <div className="mb-6 flex items-center gap-2 text-ugc-navy">
            <Award className="h-5 w-5 text-ugc-gold" />
            <h3 className="font-display text-lg font-bold">Terms of Reference</h3>
          </div>

          <ul className="space-y-4">
            {termsOfReference.map((tor, idx) => (
              <li key={idx} className="text-slate-600 text-sm leading-relaxed">
                <div className="flex gap-3">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-ugc-gold" />
                  <span>{tor.text}</span>
                </div>
                {tor.subPoints && (
                  <ul className="mt-2 pl-9 space-y-2">
                    {tor.subPoints.map((sub, subIdx) => {
                      const letter = String.fromCharCode(97 + subIdx);
                      return (
                        <li key={subIdx} className="flex gap-2 text-slate-500">
                          <span className="font-semibold text-ugc-gold shrink-0">({letter})</span>
                          <span>{sub}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Committee Sub-section */}
        <div>
          <div className="mb-6 flex items-center gap-2 text-ugc-navy">
            <Users className="h-5 w-5 text-ugc-gold" />
            <h3 className="font-display text-lg font-bold">Committee</h3>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-600">
                <thead>
                  <tr className="bg-ugc-navy text-xs font-semibold uppercase tracking-wider text-white">
                    <th scope="col" className="px-6 py-4 font-semibold">Membership</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Institution</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Designation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Office Bearers */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-semibold text-slate-900">Chairman</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`${import.meta.env.BASE_URL}images/ugc.jpg`}
                          alt="University Grants Commission Logo"
                          className="h-8 w-8 object-contain rounded-full border border-slate-200"
                        />
                        <span className="font-medium text-slate-900">University Grants Commission</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">Commission Member</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-semibold text-slate-900">Secretary</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`${import.meta.env.BASE_URL}images/ugc.jpg`}
                          alt="University Grants Commission Logo"
                          className="h-8 w-8 object-contain rounded-full border border-slate-200"
                        />
                        <span className="font-medium text-slate-900">University Grants Commission</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">Senior Assistant Secretary/ Academic Affairs</td>
                  </tr>

                  {/* Universities Group */}
                  {uniMembers.length > 0 && (
                    <>
                      <tr className="bg-slate-50 font-semibold text-ugc-navy">
                        <td colSpan={3} className="px-6 py-3 border-y border-slate-200 font-display text-xs uppercase tracking-wider">
                          Universities
                        </td>
                      </tr>
                      {uniMembers.map((member, idx) => (
                        <tr key={`uni-${idx}`} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 text-slate-500 italic">Member</td>
                          <td className="px-6 py-4">
                            <Link
                              to={`/programs?university=${encodeURIComponent(member.university.university_hei)}`}
                              className="flex items-center gap-3 hover:underline group"
                            >
                              <UniversityLogo
                                universityHei={member.university.university_hei}
                                image={member.university.image}
                                className="h-8 w-8 rounded-full border border-slate-200 bg-slate-50 transition-transform duration-200 group-hover:scale-105"
                                textClassName="text-[10px] font-bold text-slate-500"
                              />
                              <span className="font-medium text-ugc-navy group-hover:text-ugc-navyLight">
                                {member.university.university_hei}
                              </span>
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-slate-700">{member.designation}</td>
                        </tr>
                      ))}
                    </>
                  )}

                  {/* Campuses Group */}
                  {campusMembers.length > 0 && (
                    <>
                      <tr className="bg-slate-50 font-semibold text-ugc-navy">
                        <td colSpan={3} className="px-6 py-3 border-y border-slate-200 font-display text-xs uppercase tracking-wider">
                          Campuses
                        </td>
                      </tr>
                      {campusMembers.map((member, idx) => (
                        <tr key={`campus-${idx}`} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 text-slate-500 italic">Member</td>
                          <td className="px-6 py-4">
                            <Link
                              to={`/programs?university=${encodeURIComponent(member.university.university_hei)}`}
                              className="flex items-center gap-3 hover:underline group"
                            >
                              <UniversityLogo
                                universityHei={member.university.university_hei}
                                image={member.university.image}
                                className="h-8 w-8 rounded-full border border-slate-200 bg-slate-50 transition-transform duration-200 group-hover:scale-105"
                                textClassName="text-[10px] font-bold text-slate-500"
                              />
                              <span className="font-medium text-ugc-navy group-hover:text-ugc-navyLight">
                                {member.university.university_hei}
                              </span>
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-slate-700">{member.designation}</td>
                        </tr>
                      ))}
                    </>
                  )}

                  {/* Institutes Group */}
                  {instituteMembers.length > 0 && (
                    <>
                      <tr className="bg-slate-50 font-semibold text-ugc-navy">
                        <td colSpan={3} className="px-6 py-3 border-y border-slate-200 font-display text-xs uppercase tracking-wider">
                          Institutes
                        </td>
                      </tr>
                      {instituteMembers.map((member, idx) => (
                        <tr key={`institute-${idx}`} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 text-slate-500 italic">Member</td>
                          <td className="px-6 py-4">
                            <Link
                              to={`/programs?university=${encodeURIComponent(member.university.university_hei)}`}
                              className="flex items-center gap-3 hover:underline group"
                            >
                              <UniversityLogo
                                universityHei={member.university.university_hei}
                                image={member.university.image}
                                className="h-8 w-8 rounded-full border border-slate-200 bg-slate-50 transition-transform duration-200 group-hover:scale-105"
                                textClassName="text-[10px] font-bold text-slate-500"
                              />
                              <span className="font-medium text-ugc-navy group-hover:text-ugc-navyLight">
                                {member.university.university_hei}
                              </span>
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-slate-700">{member.designation}</td>
                        </tr>
                      ))}
                    </>
                  )}

                  {/* Other Govt Universities Group */}
                  {otherGovMembers.length > 0 && (
                    <>
                      <tr className="bg-slate-50 font-semibold text-ugc-navy">
                        <td colSpan={3} className="px-6 py-3 border-y border-slate-200 font-display text-xs uppercase tracking-wider">
                          Other Government Universities
                        </td>
                      </tr>
                      {otherGovMembers.map((member, idx) => (
                        <tr key={`other-${idx}`} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 text-slate-500 italic">Member</td>
                          <td className="px-6 py-4">
                            <Link
                              to={`/programs?university=${encodeURIComponent(member.university.university_hei)}`}
                              className="flex items-center gap-3 hover:underline group"
                            >
                              <UniversityLogo
                                universityHei={member.university.university_hei}
                                image={member.university.image}
                                className="h-8 w-8 rounded-full border border-slate-200 bg-slate-50 transition-transform duration-200 group-hover:scale-105"
                                textClassName="text-[10px] font-bold text-slate-500"
                              />
                              <span className="font-medium text-ugc-navy group-hover:text-ugc-navyLight">
                                {member.university.university_hei}
                              </span>
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-slate-700">{member.designation}</td>
                        </tr>
                      ))}
                    </>
                  )}

                  {/* Other Recognized Institutes */}
                  <tr className="bg-slate-50 font-semibold text-ugc-navy">
                    <td colSpan={3} className="px-6 py-3 border-y border-slate-200 font-display text-xs uppercase tracking-wider">
                      Other Recognized Institutes
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-slate-500 italic">Member</td>
                    <td className="px-6 py-4">
                      <a
                        href="https://moe.gov.lk/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 hover:underline group text-ugc-navy hover:text-ugc-navyLight"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-500 border border-slate-200 text-xs shrink-0 transition-transform duration-200 group-hover:scale-105">
                          M
                        </div>
                        <span className="font-medium">
                          Ministry of Education
                        </span>
                      </a>
                    </td>
                    <td className="px-6 py-4 text-slate-700">Director, Non State Higher Education Division</td>
                  </tr>

                  {/* Industry/Professional Bodies */}
                  <tr className="bg-slate-50 font-semibold text-ugc-navy">
                    <td colSpan={3} className="px-6 py-3 border-y border-slate-200 font-display text-xs uppercase tracking-wider">
                      Industry/Professional Bodies
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-slate-500 italic">Invited Member</td>
                    <td className="px-6 py-4">
                      <a
                        href="https://cssl.lk/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 hover:underline group text-ugc-navy hover:text-ugc-navyLight"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-500 border border-slate-200 text-xs shrink-0 transition-transform duration-200 group-hover:scale-105">
                          C
                        </div>
                        <span className="font-medium">CSSL (Computer Society of Sri Lanka)</span>
                      </a>
                    </td>
                    <td className="px-6 py-4 text-slate-700">Representative</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-slate-500 italic">Invited Member</td>
                    <td className="px-6 py-4">
                      <a
                        href="https://slasscom.lk/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 hover:underline group text-ugc-navy hover:text-ugc-navyLight"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-500 border border-slate-200 text-xs shrink-0 transition-transform duration-200 group-hover:scale-105">
                          S
                        </div>
                        <span className="font-medium">SLASSCOM (Sri Lanka Association for Software and Services Companies)</span>
                      </a>
                    </td>
                    <td className="px-6 py-4 text-slate-700">Representative</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-slate-500 italic">Invited Member</td>
                    <td className="px-6 py-4">
                      <a
                        href="https://www.fitis.lk/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 hover:underline group text-ugc-navy hover:text-ugc-navyLight"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-500 border border-slate-200 text-xs shrink-0 transition-transform duration-200 group-hover:scale-105">
                          F
                        </div>
                        <span className="font-medium">FITIS (Federation of Information Technology Industry Sri Lanka)</span>
                      </a>
                    </td>
                    <td className="px-6 py-4 text-slate-700">Representative</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-slate-500 italic">Invited Member</td>
                    <td className="px-6 py-4">
                      <a
                        href="https://ieee.lk/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 hover:underline group text-ugc-navy hover:text-ugc-navyLight"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-500 border border-slate-200 text-xs shrink-0 transition-transform duration-200 group-hover:scale-105">
                          I
                        </div>
                        <span className="font-medium">IEEE (Institute of Electrical and Electronics Engineers) Sri Lanka Section/ Computer Society</span>
                      </a>
                    </td>
                    <td className="px-6 py-4 text-slate-700">Representative</td>
                  </tr>

                  {/* Observers */}
                  <tr className="bg-slate-50 font-semibold text-ugc-navy">
                    <td colSpan={3} className="px-6 py-3 border-y border-slate-200 font-display text-xs uppercase tracking-wider">
                      Observers
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-slate-500 italic">Observer</td>
                    <td className="px-6 py-4">
                      <a
                        href="https://eugc.ugc.ac.lk/qac/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 hover:underline group text-ugc-navy hover:text-ugc-navyLight"
                      >
                        <img
                          src={`${import.meta.env.BASE_URL}images/ugc.jpg`}
                          alt="University Grants Commission Logo"
                          className="h-8 w-8 object-contain rounded-full border border-slate-200 transition-transform duration-200 group-hover:scale-105"
                        />
                        <span className="font-medium text-slate-900 group-hover:text-ugc-navyLight">
                          University Grants Commission
                        </span>
                      </a>
                    </td>
                    <td className="px-6 py-4 text-slate-700">Representative/ Quality Assurance Council (QAC)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-slate-500 italic">Observer</td>
                    <td className="px-6 py-4">
                      <a
                        href="https://eugc.ugc.ac.lk/qac/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 hover:underline group text-ugc-navy hover:text-ugc-navyLight"
                      >
                        <img
                          src={`${import.meta.env.BASE_URL}images/ugc.jpg`}
                          alt="University Grants Commission Logo"
                          className="h-8 w-8 object-contain rounded-full border border-slate-200 transition-transform duration-200 group-hover:scale-105"
                        />
                        <span className="font-medium text-slate-900 group-hover:text-ugc-navyLight">
                          University Grants Commission
                        </span>
                      </a>
                    </td>
                    <td className="px-6 py-4 text-slate-700">Representative/ Quality Assurance Council (QAC)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sri Lanka Qualifications Framework (SLQF) */}
        {slqfLevels.length > 0 && (
          <div className="mb-12 mt-12">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="h-6 w-1 rounded-full bg-ugc-gold" />
              <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-ugc-navy">
                <span>Sri Lanka Qualifications Framework (SLQF)</span>
                <a
                  href="https://www.ugc.ac.lk/index.php?option=com_content&view=article&id=1156%3Asri-lanka-qualifications-framework&catid=97%3Anotices-to-universities&Itemid=109&lang=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-ugc-gold transition-colors duration-150"
                  aria-label="Sri Lanka Qualifications Framework (SLQF) official page"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </h2>
            </div>
            <p className="mb-6 text-sm text-slate-600 leading-relaxed">
              The Sri Lanka Qualifications Framework (SLQF) is a nationally consistent framework for all higher education qualifications in Sri Lanka. It provides a clear pathway for student progression across 12 distinct qualification levels.
            </p>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm text-slate-600">
                  <thead>
                    <tr className="bg-ugc-navy text-xs font-semibold uppercase tracking-wider text-white">
                      <th scope="col" className="px-6 py-4 font-semibold w-20 text-center">Level</th>
                      <th scope="col" className="px-6 py-4 font-semibold w-40">Category</th>
                      <th scope="col" className="px-6 py-4 font-semibold">Qualification Awarded</th>
                      <th scope="col" className="px-6 py-4 font-semibold">Minimum Volume of Learning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {slqfLevels.map((lvl) => (
                      <tr key={lvl.level} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-bold text-slate-900 text-center">{lvl.level}</td>
                        <td className="px-6 py-4 text-slate-700">{lvl.qualification_category}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">{lvl.qualification_awarded}</td>
                        <td className="px-6 py-4 text-slate-600 text-xs leading-relaxed">{lvl.minimum_volume_of_learning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Computing Curricula Disciplines */}
        {disciplines.length > 0 && (
          <div className="mb-12">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="h-6 w-1 rounded-full bg-ugc-gold" />
              <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-ugc-navy">
                <span>Computing Curricula Disciplines</span>
                <a
                  href="https://www.acm.org/education/curricula-recommendations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-ugc-gold transition-colors duration-150"
                  aria-label="Computing Curricula Recommendations official page"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </h2>
            </div>
            <p className="mb-6 text-sm text-slate-600 leading-relaxed">
              Computing programs are classified using the core computing disciplines defined by the IEEE and ACM Joint Task Force on Computing Curricula. This taxonomy aligns local degrees with international standards.
            </p>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm text-slate-600">
                  <thead>
                    <tr className="bg-ugc-navy text-xs font-semibold uppercase tracking-wider text-white">
                      <th scope="col" className="px-6 py-4 font-semibold w-48">Discipline</th>
                      <th scope="col" className="px-6 py-4 font-semibold w-24">Code</th>
                      <th scope="col" className="px-6 py-4 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {disciplines.map((disc, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-semibold text-slate-900">{disc.name}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-ugc-navy/10 px-2.5 py-0.5 text-xs font-semibold text-ugc-navy">
                            {disc.code}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 leading-relaxed">{disc.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutPage;
