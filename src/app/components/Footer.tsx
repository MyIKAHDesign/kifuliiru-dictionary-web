import Link from "next/link";
import { FaGithub, FaTwitter, FaEnvelope } from "react-icons/fa";
import type { IconType } from "react-icons";

interface SocialLink {
  id: string;
  icon: IconType;
  href: string;
  label: string;
}

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks: SocialLink[] = [
    { id: "1", icon: FaGithub, href: "#", label: "GitHub" },
    { id: "2", icon: FaTwitter, href: "#", label: "Twitter" },
    {
      id: "3",
      icon: FaEnvelope,
      href: "mailto:contact@kifuliiru.org",
      label: "Email",
    },
  ];

  const quickLinks = [
    "Dictionary",
    "Numbers",
    "Categories",
    "Contribute",
    "Kifuliiru",
    "Ibufuliiru",
    "Abafuliiru",
  ];

  return (
    <footer className="w-full">
      <div className="h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600" />

      <div className="w-full bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                Kifuliiru Dictionary
              </h3>
              <p className="text-sm text-gray-400 max-w-md">
                Preserving and sharing the richness of the Kifuliiru language
                through digital innovation.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Quick Links</h4>
              <ul className="grid grid-cols-2 gap-2">
                {quickLinks.map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Connect</h4>
              <div className="flex space-x-4">
                {socialLinks.map((link) => {
                  const SocialIcon = link.icon;
                  return (
                    <a
                      key={link.id}
                      href={link.href}
                      aria-label={link.label}
                      className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-200"
                    >
                      <SocialIcon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} Kifuliiru Dictionary by Ayivugwe Kabemba
              Mukome and team. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
