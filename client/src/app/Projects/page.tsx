'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Project } from '@/components/Types/Usertype';
import projectsData from '@/Content.json';
import Footer from '@/components/Footer';
import Chatbot from '@/app/Chatbot/page';

const techStacks = [
  "React", "Next.js", "Java", "C", "TypeScript", "Node.js",
  "framer-motion", "MongoDB", "Docker", "Git", "Nest js", "Prizma", "Socket.IO", "Tailwind CSS",
  "JWT", "Render", "Redux Store", "Vercel", "Shadcn"
];

const typedProjectsData = projectsData as unknown as { projectsData: Project[] };
const projectList: Project[] = typedProjectsData.projectsData;

const Projects = () => {
  const [selected, setSelected] = useState<null | number>(null);
  const [filterType, setFilterType] = useState<'website' | 'app'>('website');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (selectedProject) {
      setCurrentImageIndex(0);
      const interval = setInterval(() => {
        if (Array.isArray(selectedProject.image)) {
          setCurrentImageIndex((prev) => (prev + 1) % selectedProject.image.length);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedProject]);



  useEffect(() => {
    if (selected !== null) {
      setCurrentImageIndex(0);
      const interval = setInterval(() => {
        const images = projectList[selected].image;
        if (Array.isArray(images)) {
          setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selected]);

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

      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.15 },
          },
        }}
      >
        {filteredProjects.map((project, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 40 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
            }}
          >
            <div
              onClick={() => setSelectedProject(project)}
              className="cursor-pointer bg-[#1a1a1a] rounded-xl overflow-hidden shadow-md hover:shadow-pink-500/40 transition-all"
            >
              <Image
                src={Array.isArray(project.image) ? project.image[0] : project.image}
                alt={project.title}
                width={400}
                height={800}
                className="object-cover w-full h-72 transition-transform duration-300"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-orange-300 mb-2">{project.title}</h3>
                <p className="text-sm text-gray-300 line-clamp-3">{project.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[1000] p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#121212] rounded-2xl shadow-xl w-full max-w-3xl p-6 relative"
            >
              <button
                className="absolute top-4 right-4 text-white hover:text-orange-300"
                onClick={() => setSelectedProject(null)}
              >
                <X size={28} />
              </button>

              <Image
                src={
                  Array.isArray(selectedProject.image)
                    ? selectedProject.image[currentImageIndex]
                    : selectedProject.image
                }
                alt={`${selectedProject.title} image`}
                width={800}
                height={450}
                className="rounded-xl mb-6 object-cover w-full max-h-[400px]"
              />

              <h3 className="text-3xl font-bold text-orange-300 mb-4">
                {selectedProject.title}
              </h3>
              <p className="text-base text-gray-300 mb-6 leading-relaxed">
                {selectedProject.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.stack.map((tech: string, idx: number) => (
                  <span
                    key={idx}
                    className="bg-orange-500/10 text-orange-300 px-4 py-1 text-sm rounded-full font-medium border border-orange-400/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-full text-sm transition"
                >
                  GitHub Repo
                </a>
                <a
                  href={selectedProject.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm transition"
                >
                  Live Preview
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Filter Buttons – Only App and Website */}
      <div className="fixed top-1/2 left-4 z-50 flex flex-col gap-4 transform -translate-y-1/2">
        <button
          onClick={() => setFilterType('app')}
          className={`bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all hover:scale-105 ${filterType === 'app' ? 'bg-orange-500' : ''}`}
        >
          App
        </button>
        <button
          onClick={() => setFilterType('website')}
          className={`bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all hover:scale-105 ${filterType === 'website' ? 'bg-orange-500' : ''}`}
        >
          Website
        </button>
      </div>

      <Footer />
    </motion.div>
  );
};

export default Projects;
