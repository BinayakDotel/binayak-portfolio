import { FaLinkedin, FaGithub, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { getPersonalInfo } from "@/utils/data";
import DynamicContent from "./components/DynamicContent";

export default function Home() {
  const personalInfo = getPersonalInfo();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Top Bar */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">{personalInfo.name}</h1>
              <p className="text-lg opacity-90">{personalInfo.title}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt />
                <span>{personalInfo.location}</span>
              </div>
              <div className="flex gap-4">
                <a href={personalInfo.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-200">
                  <FaLinkedin size={24} />
                </a>
                <a href={personalInfo.social.github} target="_blank" rel="noopener noreferrer" className="hover:text-blue-200">
                  <FaGithub size={24} />
                </a>
                <a href={`mailto:${personalInfo.email}`} className="hover:text-blue-200">
                  <FaEnvelope size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <DynamicContent />
    </div>
  );
}
