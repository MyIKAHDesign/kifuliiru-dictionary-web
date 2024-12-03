"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Book,
  Users,
  Heart,
  Share2,
  Youtube,
  Facebook,
  Twitter,
  Instagram,
  ChevronRight,
  Library,
  Lightbulb,
  BarChart,
  MessageCircle,
  LucideIcon,
} from "lucide-react";

// Type definitions
interface SectionTitleProps {
  children: React.ReactNode;
}

interface CardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

interface ProjectCardProps {
  title: string;
  description: string;
  link: string;
  icon: LucideIcon;
}

interface SocialLinkProps {
  icon: LucideIcon;
  href: string;
  label: string;
}

interface Project extends Omit<ProjectCardProps, "icon"> {
  icon: LucideIcon;
}

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

// Helper components with proper types
const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => (
  <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
    {children}
  </h2>
);

const Card: React.FC<CardProps> = ({
  icon: Icon,
  title,
  description,
  className = "",
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}
  >
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">
        <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  </motion.div>
);

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  link,
  icon: Icon,
}) => (
  <motion.a
    href={link}
    whileHover={{ scale: 1.02 }}
    className="block p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 group"
  >
    <div className="flex items-center justify-between mb-4">
      <Icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
    </div>
    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </motion.a>
);

const SocialLink: React.FC<SocialLinkProps> = ({ icon: Icon, href, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 
             transition-colors duration-200 group"
    aria-label={label}
  >
    <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
  </a>
);

const AboutPage: React.FC = () => {
  const projects: Project[] = [
    {
      title: "Kifuliiru Dictionary",
      description:
        "Comprehensive digital dictionary with translations in multiple languages",
      link: "https://dictionary.kifuliiru.net",
      icon: Book,
    },
    {
      title: "Tusome i Kifuliiru",
      description: "Interactive platform for learning the Kifuliiru language",
      link: "https://tusome.kifuliiru.net",
      icon: Library,
    },
    {
      title: "Contribution Platform",
      description:
        "Join our community of contributors to preserve and document Kifuliiru",
      link: "/contribute",
      icon: Users,
    },
    {
      title: "Ibufuliiru",
      description:
        "Central hub for all Kifuliiru-related projects and resources",
      link: "https://ibufuliiru.net",
      icon: Globe,
    },
  ];

  const features: Feature[] = [
    {
      icon: Globe,
      title: "Language Preservation",
      description:
        "Documenting and preserving Kifuliiru for future generations",
    },
    {
      icon: Users,
      title: "Community Building",
      description: "Creating connections among Bafuliiru people worldwide",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "Using technology to promote and protect our cultural heritage",
    },
    {
      icon: BarChart,
      title: "Growth",
      description: "Continuously expanding our resources and reach",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold mb-6"
            >
              Preserving Our
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                {" "}
                Heritage{" "}
              </span>
              Through Technology
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-12"
            >
              We&apos;re dedicated to preserving and promoting the Kifuliiru
              language, its rich history, and the vibrant culture of the
              Bafuliiru people.
            </motion.p>
            <div className="flex justify-center space-x-4">
              <SocialLink
                icon={Facebook}
                href="https://facebook.com/ibufuliiru"
                label="Facebook"
              />
              <SocialLink
                icon={Twitter}
                href="https://twitter.com/ibufuliiru"
                label="Twitter"
              />
              <SocialLink
                icon={Instagram}
                href="https://instagram.com/ibufuliiru"
                label="Instagram"
              />
              <SocialLink
                icon={Youtube}
                href="https://youtube.com/@ibufuliiru"
                label="YouTube"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <SectionTitle>Our Mission</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card key={index} {...feature} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <SectionTitle>Our Projects</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="py-16 bg-indigo-600 dark:bg-indigo-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Get Involved</h2>
            <p className="text-xl mb-8 opacity-90">
              Join us in our mission to preserve and promote the Kifuliiru
              language and culture. There are many ways to contribute and be
              part of this important journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contribute"
                className="px-8 py-3 bg-white text-indigo-600 rounded-full font-medium 
                         hover:bg-gray-100 transition-colors duration-200"
              >
                Become a Contributor
              </a>
              <a
                href="/contact"
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full 
                         font-medium hover:bg-white/10 transition-colors duration-200"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Future Vision Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <SectionTitle>Our Vision</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card
                icon={Heart}
                title="Community Impact"
                description="Building a stronger, more connected Bafuliiru community through digital innovation"
                className="md:col-span-2"
              />
              <Card
                icon={Share2}
                title="Global Reach"
                description="Making Kifuliiru accessible to learners and speakers worldwide"
              />
              <Card
                icon={MessageCircle}
                title="Cultural Exchange"
                description="Facilitating dialogue and understanding across generations and regions"
              />
              <Card
                icon={Library}
                title="Digital Archive"
                description="Creating a comprehensive digital library of Kifuliiru language and cultural resources"
                className="md:col-span-2"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
