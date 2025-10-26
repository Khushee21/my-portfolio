'use client';

import { motion } from 'framer-motion';
import { FaGithub, FaLaptopCode, FaMedium, FaTwitter } from 'react-icons/fa';
import { SiLeetcode, SiGeeksforgeeks } from 'react-icons/si';
import { EducationType } from '@/components/Types/Usertype';
import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from '@/app/Chatbot/page';
import AboutSection from '@/components/AboutSection';

interface EducationProps {
  education: EducationType[];
}

const Education = ({ education }: EducationProps) => {
  return (
    <>
      <div className="min-h-screen bg-[#0F0F0F] text-white py-12 px-4 sm:px-6 md:px-10 relative overflow-hidden">
        <Navbar />
        <Chatbot />

        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-center text-orange-300 mb-14 mt-10"
        >
          My Education & Profiles
        </motion.h2>

        {/* Education Timeline */}
        <div className="grid gap-10 mb-20 md:grid-cols-2">
          {education.map((edu, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="relative p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-xl overflow-hidden"
            >
              {/* Large blurred background logo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <img
                  src={edu.img}
                  alt={`${edu.institution} background`}
                  className="w-48 sm:w-64 h-auto opacity-50 blur-2xl object-contain"
                />
              </div>

              {/* Centered top logo */}
              <div className="flex flex-col items-center text-center mb-6 relative z-10">
                <img
                  src={edu.img}
                  alt={edu.institution}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-cover border border-gray-300/20 shadow-lg"
                />
                <h3 className="mt-3 text-base sm:text-lg font-semibold text-orange-300">{edu.degree}</h3>
                <p className="text-sm text-gray-300">{edu.institution}</p>
                <p className="text-sm text-gray-400 italic">{edu.year}</p>
                <p className="text-sm text-gray-400">CGPA - {edu.cgpa}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Background Blob */}
        <div className="absolute top-0 left-0 blob w-[60vw] h-[100vh] rounded-full opacity-20 blur-3xl z-0 pointer-events-none sm:opacity-30 md:opacity-20"></div>
        {/* Online Profiles */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-8 sm:gap-10 text-2xl sm:text-3xl mb-16 z-10 relative"
        >
          <a
            href="https://github.com/Khushee21"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition"
          >
            <FaGithub title="GitHub" />
          </a>
          <a
            href="https://leetcode.com/u/Khushi_rathore21/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition"
          >
            <SiLeetcode title="LeetCode" />
          </a>
          <a
            href="https://www.geeksforgeeks.org/user/khushiratgwix/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition"
          >
            <SiGeeksforgeeks title="GeeksforGeeks" />
          </a>
          <a
            href="https://medium.com/@khushirathore649"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition"
          >
            <FaMedium />
          </a>
          <a
            href="https://x.com/KhushieRathore"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition"
          >
            <FaTwitter />
          </a>
        </motion.div>

        {/* Work Experience Section */}
        <div className="space-y-12 mb-16">
          {/* Newral Experience */}
          <AboutSection
            title="Work Experience"
            content={
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative p-6 sm:p-8 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-lg shadow-xl overflow-hidden"
              >
                {/* Large blurred background image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src="/newralinc_logo.jpg"
                    alt="Newral Logo Background"
                    className="w-64 sm:w-96 h-auto opacity-30 blur-2xl object-contain"
                  />
                </div>

                {/* Centered top logo */}
                <div className="flex flex-col items-center text-center mb-6 relative z-10">
                  <img
                    src="/newralinc_logo.jpg"
                    alt="Newral Logo"
                    className="h-20 w-20 sm:h-28 sm:w-28 rounded-xl object-cover border border-gray-300/20 shadow-lg"
                  />
                  <h3 className="text-lg sm:text-xl font-semibold text-orange-300 mt-3">
                    SDE Intern at Newral
                  </h3>
                  <p className="text-gray-300 text-sm italic">May – September 2025</p>
                </div>

                {/* Description List */}
                <ul className="relative z-10 list-none space-y-3 text-gray-200">
                  {[
                    "Contributed to real-time projects using Next.js, TypeScript, Node.js, Express, and MongoDB",
                    "Worked on 9+ projects",
                    "Worked on both frontend and backend development",
                    "Collaborated with an amazing team in an Agile environment",
                    "Worked on core projects like AssumeChat (real-time chat app), LMS platform, Matka App, and the official website of Newral",
                    "Improved UI performance, enhanced component reusability, and implemented scalable layouts"
                  ].map((point, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <span className="flex-shrink-0 w-2 h-2 mt-2 bg-orange-300 rounded-full shadow-md"></span>
                      <span>{point}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Decorative bottom border */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-orange-400 via-pink-400 to-yellow-400 opacity-70"></div>
              </motion.div>
            }
          />

          {/* Flexzistay Experience - NEW */}
          <AboutSection
            title=""
            content={
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative p-6 sm:p-8 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-lg shadow-xl overflow-hidden"
              >
                {/* Large blurred background image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src="/flexzistay_logo.jpg"
                    alt="Flexzistay Logo Background"
                    className="w-64 sm:w-96 h-auto opacity-30 blur-2xl object-contain"
                  />
                </div>

                {/* Centered top logo */}
                <div className="flex flex-col items-center text-center mb-6 relative z-10">
                  <img
                    src="/flexzistay_logo.jpg"
                    alt="Flexzistay Logo"
                    className="h-20 w-20 sm:h-28 sm:w-28 rounded-xl object-cover border border-gray-300/20 shadow-lg"
                  />
                  <h3 className="text-lg sm:text-xl font-semibold text-orange-300 mt-3">
                    Software Developer Intern
                  </h3>
                  <p className="text-gray-300 text-sm italic">September 2025 – Present</p>
                </div>

                {/* Description List */}
                <ul className="relative z-10 list-none space-y-3 text-gray-200">
                  {[
                    "Developing and maintaining full-stack web applications using Next.js, and Node.js",
                    "Working on multiple portals client , manager , admin ",
                    "Building responsive user interfaces with modern CSS frameworks and component libraries",
                    "Implementing RESTful APIs and integrating third-party services including AI integration",
                    "Collaborating with cross-functional teams to deliver high-quality software solutions",
                    "Working on database design and management with Prisma and PostgreSQL"
                  ].map((point, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <span className="flex-shrink-0 w-2 h-2 mt-2 bg-orange-300 rounded-full shadow-md"></span>
                      <span>{point}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Decorative bottom border */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-70"></div>
              </motion.div>
            }
          />
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Education;