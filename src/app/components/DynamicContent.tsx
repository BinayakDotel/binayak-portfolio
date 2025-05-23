'use client';

import { useState } from "react";
import { getNavigation, getAboutInfo } from "@/utils/data";
import dynamic from 'next/dynamic';

// Dynamically import client components with no SSR
const ProjectsPage = dynamic(() => import('../projects/page'), { ssr: false });
const PDFViewer = dynamic(() => import('../resume/page'), { ssr: false });
const WorkHistoryPage = dynamic(() => import('../work-history/page'), { ssr: false });
const EducationPage = dynamic(() => import('../education/page'), { ssr: false });
const AboutPage = dynamic(() => import('../about/page'), { ssr: false });

export default function DynamicContent() {
  const aboutInfo = getAboutInfo();
  const [activeSection, setActiveSection] = useState("home");
  const navigation = getNavigation();

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to My Portfolio
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Explore my work, experience, and projects
            </p>
          </div>
        );
      case "projects":
        return <ProjectsPage />;
      case "resume":
        return <PDFViewer />;
      case "about":
        return <AboutPage />;
      case "work-history":
        return <WorkHistoryPage />;
      case "education":
        return <EducationPage />;
      default:
        return null;
    }
  };

  const getPathKey = (path: string) => {
    return path === '/' ? 'home' : path.replace('/', '');
  };

  return (
    <>
      {/* Main Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center space-x-8 py-4">
            {navigation.map((item) => (
              <button
                key={item.path}
                onClick={() => setActiveSection(getPathKey(item.path))}
                className={`text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium ${
                  activeSection === getPathKey(item.path) ? "text-blue-600 dark:text-blue-400" : ""
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </>
  );
} 