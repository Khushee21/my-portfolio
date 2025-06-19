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
  "framer-motion", "MongoDB", "Socket.IO", "Tailwind CSS",
  "JWT", "Render", "Redux Store", "Vercel", "Shadcn"
];

const typedProjectsData = projectsData as unknown as { projectsData: Project[] };
const projectList: Project[] = typedProjectsData.projectsData;

const Projects = () => {
  const [selected, setSelected] = useState<null | number>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  return (
    <>
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

        {/* Background blob */}
        <div className="absolute top-0 right-0 blob w-[60vw] h-[100vh] rounded-full opacity-30 blur-3xl z-0 pointer-events-none" />

        {/* Project cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {projectList.map((project, index) => (
            <motion.div
              key={index}
              onClick={() => setSelected(index)}
              whileHover={{ scale: 1.03 }}
              className="cursor-pointer bg-[#1a1a1a] rounded-xl overflow-hidden shadow-md hover:shadow-pink-400/30 transition-all"
            >
              <Image
                src={Array.isArray(project.image) ? project.image[0] : project.image}
                alt={project.title}
                width={500}
                height={300}
                className="object-cover w-full h-48 sm:h-56 md:h-64"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-orange-300 mb-2">{project.title}</h3>
                <p className="text-sm text-gray-300">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Expanded Modal */}
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000] p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-[#1a1a1a] rounded-2xl shadow-lg w-full max-w-2xl p-4 sm:p-6 relative"
              >
                <button
                  className="absolute top-4 right-4 text-white hover:text-orange-300"
                  onClick={() => setSelected(null)}
                >
                  <X size={28} />
                </button>

                <Image
                  src={
                    Array.isArray(projectList[selected].image)
                      ? projectList[selected].image[currentImageIndex]
                      : projectList[selected].image
                  }
                  alt={`${projectList[selected].title} image`}
                  width={600}
                  height={400}
                  className="rounded-xl mb-4 object-cover w-full max-h-[300px] sm:max-h-[400px]"
                />

                <h3 className="text-2xl font-bold text-orange-300 mb-2">
                  {projectList[selected].title}
                </h3>
                <p className="text-gray-300 mb-4">{projectList[selected].description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {projectList[selected].stack.map((tech: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-pink-500/20 text-pink-300 px-3 py-1 text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={projectList[selected].github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:underline"
                  >
                    GitHub Repo
                  </a>
                  <a
                    href={projectList[selected].live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-400 hover:underline"
                  >
                    Live Preview
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Footer />
      </motion.div>
    </>
  );
};

export default Projects;
