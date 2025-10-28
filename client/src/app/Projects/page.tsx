'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Project } from '@/components/Types/Usertype';
import projectsData from '@/Content.json';
import Footer from '@/components/Footer';
import Chatbot from '@/app/Chatbot/page';
import Tilt from 'react-parallax-tilt';

const techStacks = [
  "React", "Next.js", "Java", "C", "TypeScript", "Node.js",
  "framer-motion", "MongoDB", "Docker", "Git", "Nest js", "Prizma", "Socket.IO", "Tailwind CSS",
  "JWT", "Render", "Redux Store", "Vercel", "Shadcn"
];

const typedProjectsData = projectsData as unknown as { projectsData: Project[] };
const projectList: Project[] = typedProjectsData.projectsData;

// Helper to always return a valid src
const getValidImageSrc = (img: string | string[] | undefined, currentIndex: number) => {
  if (!img) return '/fallback.jpg';
  if (Array.isArray(img)) {
    const valid = img.filter((i) => i && i.trim() !== '');
    return valid.length > 0 ? valid[currentIndex % valid.length] : '/fallback.jpg';
  }
  return img.trim() !== '' ? img : '/fallback.jpg';
};

const Projects = () => {
  const [filterType, setFilterType] = useState<'website' | 'app'>('website');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Rotate images for all cards every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredProjects = projectList.filter((project) => project.type === filterType);

  return (
    <motion.div
      className="min-h-screen bg-[#0F0F0F] text-white px-4 sm:px-6 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Navbar />
      <Chatbot />

      <h2 className="text-3xl sm:text-4xl font-bold text-center mt-12 text-orange-300">My Showcase</h2>
      <h3 className="text-base sm:text-lg text-center mb-10 text-gray-300">Here is my creativity...</h3>

      {/* Tech stack ticker */}
      <div className="overflow-hidden whitespace-nowrap mb-10 border-y border-gray-700 py-3">
        <motion.div
          className="inline-flex"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
        >
          {[...techStacks, ...techStacks].map((tech, idx) => (
            <span
              key={idx}
              className="inline-block mx-6 text-orange-300 font-semibold text-xl sm:text-2xl"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="absolute top-0 right-0 blob w-[60vw] h-[100vh] rounded-full opacity-30 blur-3xl z-0 pointer-events-none" />

      {/* Filter buttons */}
      <div className="flex justify-center mb-10 relative z-10">
        <div className="bg-[#1a1a1a] rounded-full p-1 flex gap-2 shadow-lg border border-orange-500/30">
          <button
            onClick={() => setFilterType('app')}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${filterType === 'app'
              ? 'bg-gradient-to-r from-orange-300 text-white shadow-lg scale-105'
              : 'text-orange-300 hover:bg-orange-500/10'
              }`}
          >
            App
          </button>
          <button
            onClick={() => setFilterType('website')}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${filterType === 'website'
              ? 'bg-gradient-to-r to-orange-300 text-white shadow-lg scale-105'
              : 'text-orange-300 hover:bg-orange-500/10'
              }`}
          >
            Website
          </button>
        </div>
      </div>

      {/* Project grid */}
      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.15 } },
        }}
      >
        {filteredProjects.map((project, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 40 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
            }}
          >
            <Tilt glareEnable glareMaxOpacity={0.3} glarePosition="all" tiltMaxAngleX={10} tiltMaxAngleY={10}>
              <div
                className={`rounded-xl overflow-hidden shadow-md hover:shadow-orange-500/40 transition-all flex flex-col 
    ${filterType === 'app' ? 'w-[260px] mx-auto sm:h-auto' : 'w-full sm:h-auto'}`}
              >
                {/* Project image */}
                <Image
                  src={getValidImageSrc(project.image, currentImageIndex)}
                  alt={`${project.title} image`}
                  width={800}
                  height={450}
                  className={`mx-auto rounded-t-xl transition-transform duration-300 
      ${filterType === 'app'
                      ? 'w-[200px] h-[300px] sm:h-[400px] object-contain bg-black p-2 rounded-xl'
                      : 'w-full h-48 sm:h-72 object-cover'}`}
                />

                {/* Project content */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold text-orange-300 mb-4 line-clamp-1">{project.title}</h3>
                  <p className="text-sm text-gray-300 mb-4 leading-relaxed line-clamp-3">{project.description}</p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.stack.slice(0, 8).map((tech: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-orange-500/10 text-orange-300 px-4 py-1 text-sm rounded-full font-medium border border-orange-400/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="mt-auto flex flex-wrap gap-4">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-orange-300 hover:to-orange-500 text-white px-4 py-2 rounded-full text-sm transition"
                    >
                      GitHub Repo
                    </a>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-orange-300 hover:to-orange-500 text-white px-4 py-2 rounded-full text-sm transition"
                    >
                      Live Preview
                    </a>
                  </div>
                </div>
              </div>

            </Tilt>
          </motion.div>
        ))}
      </motion.div>

      <Footer />
    </motion.div>
  );
};

export default Projects;
