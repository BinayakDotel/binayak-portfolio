'use client';

import { getAboutInfo } from '@/utils/data';
import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt, FaProjectDiagram, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useState } from 'react';

export default function WorkHistoryPage() {
  const aboutInfo = getAboutInfo();
  const workExperience = aboutInfo.experience;
  const [expandedProjects, setExpandedProjects] = useState<{ [key: string]: boolean }>({});

  const toggleProject = (jobIndex: number, projectIndex: number) => {
    const key = `${jobIndex}-${projectIndex}`;
    setExpandedProjects(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Work History</h1>
      
      <div className="space-y-4">
        {workExperience.map((job, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-2">
                <FaBriefcase className="text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {job.title}
                </h2>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <FaMapMarkerAlt className="text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  {job.company}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <FaCalendarAlt className="text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  {job.period}
                </span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mt-4">
                {job.description}
              </p>

              {/* Render projects if they exist */}
              {job.projects && (
                <div className="space-y-4 mt-6">
                  {job.projects.map((project, pIndex) => (
                    <div key={pIndex} className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div 
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleProject(index, pIndex)}
                      >
                        <div className="flex items-center gap-2">
                          <FaProjectDiagram className="text-blue-600 dark:text-blue-400" />
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {project.name}
                          </h3>
                        </div>
                        {expandedProjects[`${index}-${pIndex}`] ? <FaChevronUp /> : <FaChevronDown />}
                      </div>

                      {expandedProjects[`${index}-${pIndex}`] && (
                        <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
                          {project.achievements.map((achievement, aIndex) => (
                            <li key={aIndex} className="text-gray-700 dark:text-gray-300">
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Render achievements if they exist */}
              {job.achievements && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                  <ul className="list-disc list-inside space-y-2">
                    {job.achievements.map((achievement, aIndex) => (
                      <li key={aIndex} className="text-gray-700 dark:text-gray-300">
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
