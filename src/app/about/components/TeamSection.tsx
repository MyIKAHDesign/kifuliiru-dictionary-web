import React, { useState } from "react";
import {
  Facebook,
  Instagram,
  Github, // Corrected from GitHub to Github
  Youtube,
  Twitter,
  UserPlus,
  XCircle,
} from "lucide-react";

// Team Member Interface
interface TeamMember {
  name: string;
  bio: string;
  picture: string;
  details: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    github?: string;
    youtube?: string;
    twitter?: string;
    threads?: string; // Threads is included as part of the structure.
  };
}

// Sample Team Data
const team: TeamMember[] = [
  {
    name: "Ayivugwe Kabemba",
    bio: "Software Developer and Advocate for the Kifuliiru language.",
    picture: "/path/to/image.jpg", // Replace with the image path
    details:
      "Ayivugwe is passionate about technology and cultural preservation.",
    socialLinks: {
      facebook: "https://facebook.com/ayivugwe",
      instagram: "https://instagram.com/ayivugwe",
      github: "https://github.com/ayivugwe",
      youtube: "https://youtube.com/@ayivugwe",
      twitter: "https://twitter.com/ayivugwe",
      threads: "https://threads.net/@ayivugwe", // Placeholder for Threads
    },
  },
  // Add more team members here
];

const TeamSection: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Meet Our Team
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-12">
            Our dedicated team is passionate about preserving the Kifuliiru
            language and culture while embracing innovative technology.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <img
                    src={member.picture}
                    alt={member.name}
                    className="h-24 w-24 rounded-full object-cover mb-4 shadow-md"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {member.bio}
                  </p>
                  <div className="flex space-x-3">
                    {member.socialLinks.facebook && (
                      <a
                        href={member.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:opacity-75"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {member.socialLinks.instagram && (
                      <a
                        href={member.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:opacity-75"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {member.socialLinks.github && (
                      <a
                        href={member.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:opacity-75"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    {member.socialLinks.youtube && (
                      <a
                        href={member.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:opacity-75"
                      >
                        <Youtube className="h-5 w-5" />
                      </a>
                    )}
                    {member.socialLinks.twitter && (
                      <a
                        href={member.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:opacity-75"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {member.socialLinks.threads && (
                      <a
                        href={member.socialLinks.threads}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:opacity-75"
                      >
                        <span className="font-bold text-sm">T</span>
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedMember(member)}
                    className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-md w-full relative">
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XCircle className="h-6 w-6" />
            </button>
            <img
              src={selectedMember.picture}
              alt={selectedMember.name}
              className="h-20 w-20 rounded-full object-cover mb-4 mx-auto shadow-md"
            />
            <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-4">
              {selectedMember.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {selectedMember.details}
            </p>
            <div className="flex justify-center space-x-3">
              {selectedMember.socialLinks.facebook && (
                <a
                  href={selectedMember.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:opacity-75"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {/* Repeat for other social links */}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TeamSection;
