'use client';

import { getPortfolioData } from '@/utils/portfolio';
import { FaCode, FaGamepad, FaRobot, FaMapMarkerAlt, FaEnvelope, FaLinkedin, FaGithub, FaBriefcase, FaBrain } from 'react-icons/fa';
import Image from 'next/image';
import { useEffect } from 'react';

export default function AboutPage() {
  const portfolioData = getPortfolioData();
  const personalInfo = portfolioData.personal;
  const aboutInfo = portfolioData.about;

  useEffect(() => {
    // some logic using aboutInfo, personalInfo, portfolioData
  }, [aboutInfo, personalInfo, portfolioData]);
  

  if (!personalInfo || !aboutInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Personal Info Section */}
      <section className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">About Me</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Photo Section */}
            <div className="md:col-span-1">
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/profile.jpeg`}
                  alt={personalInfo.name}
                  fill
                  sizes="(max-width: 768px) 192px, 256px"
                  quality={90}
                  className="object-cover"
                  priority
                />
              </div>
              <div className="mt-4 text-center">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {personalInfo.name}
                </h2>
                <p className="text-xl text-blue-600 dark:text-blue-400">
                  {personalInfo.title}
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="md:col-span-2">
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-blue-600 text-xl flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                      <p className="text-gray-700 dark:text-gray-300 break-words">{personalInfo.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-blue-600 text-xl flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <a 
                        href={`mailto:${personalInfo.email}`}
                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 break-words"
                      >
                        {personalInfo.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <a 
                    href={personalInfo.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <FaLinkedin className="text-blue-600 text-xl flex-shrink-0" />
                    <span>LinkedIn</span>
                  </a>
                  <a 
                    href={personalInfo.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <FaGithub className="text-blue-600 text-xl flex-shrink-0" />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Section */}
      <section className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {aboutInfo.summary}
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aboutInfo.skills.map((skillGroup) => (
            <div
              key={skillGroup.category}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                {skillGroup.category === 'Game Development' && <FaGamepad className="text-blue-600 flex-shrink-0" />}
                {skillGroup.category === 'Computer Vision & AI' && <FaRobot className="text-blue-600 flex-shrink-0" />}
                {skillGroup.category === 'Web Development' && <FaCode className="text-blue-600 flex-shrink-0" />}
                {skillGroup.category === 'Tools & Technologies' && <FaBriefcase className="text-blue-600 flex-shrink-0" />}
                {skillGroup.category === 'AI & Machine Learning' && <FaBrain className="text-blue-600 flex-shrink-0" />}
                {skillGroup.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillGroup.items.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 