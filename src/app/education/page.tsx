'use client';

import { getAboutInfo } from '@/utils/data';
import { FaGraduationCap, FaCalendarAlt, FaUniversity, FaStar, FaTrophy } from 'react-icons/fa';

export default function EducationPage() {
  const aboutInfo = getAboutInfo();
  const education = aboutInfo.education;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Education</h1>
      
      <div className="space-y-8">
        {education.map((edu, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaGraduationCap className="text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {edu.degree}
                </h2>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <FaUniversity className="text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  {edu.institution}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <FaCalendarAlt className="text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  {edu.period}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <FaStar className="text-yellow-500" />
                <span className="text-gray-700 dark:text-gray-300 font-semibold">
                  GPA: 3.9/4.0
                </span>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaTrophy className="text-yellow-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Achievements
                  </h3>
                </div>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">1st Runner Up</span> in NEXT Hackathon - Project: "AR for Education" (Augmented Reality)
                  </li>
                </ul>
              </div>

              <p className="text-gray-700 dark:text-gray-300">
                {edu.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
