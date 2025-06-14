'use client';

import { motion } from 'framer-motion';
import { FaGithub, FaLaptopCode } from 'react-icons/fa';
import { SiLeetcode, SiGeeksforgeeks } from 'react-icons/si';
import { EducationType } from '@/components/Types/Usertype';
import Navbar from './Navbar';
import { useEffect , useState } from 'react';
import Footer from './Footer';

interface EducationProps {
  education: EducationType[];
  project: {
    name: string;
    description: string;
    img: string[];
  };
}

const Education = ({ education, project }: EducationProps) => {

    
  return (
    <>
    <div className="min-h-screen bg-[#0F0F0F] text-white py-12 px-6">
      {/* Section Title */}
      <Navbar/>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center text-orange-300 mb-14 mt-10"
      >
        My Education & Profiles
      </motion.h2>

      {/* Education Timeline */}
      <div className="grid gap-10 mb-20 md:grid-cols-2">
        {education.map((edu, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.3 }}
            className="bg-[#1a1a1a] p-6 rounded-xl shadow-md border border-gray-700 flex items-center gap-5 "
          >
            <img
              src={edu.img}
              alt={edu.institution}
              className="w-16 h-16 rounded-md  object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-orange-300">{edu.degree}</h3>
              <p className="text-sm text-gray-300">{edu.institution}</p>
              <p className="text-sm text-gray-400 italic">{edu.year}</p>
              <p className='text-sm text-gray-400 '>CGPA-{edu.cgpa}</p>
            </div>
          </motion.div>
        ))}
      </div>
        <div className="absolute top-0 left-0 blob w-[50vw] h-[100vh] rounded-full opacity-25 blur-3xl z-0 pointer-events-none"></div>
      {/* Online Profiles */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center gap-10 text-3xl mb-20"
      >
        <a href="https://github.com/Khushee21" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
          <FaGithub title="GitHub" />
        </a>
        <a href="https://leetcode.com/u/Khushi_rathore21/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
          <SiLeetcode title="LeetCode" />
        </a>
        <a href="https://www.geeksforgeeks.org/user/khushiratgwix/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
          <SiGeeksforgeeks title="GeeksforGeeks" />
        </a>
        {/* Optional Stack Overflow */}
        {/* <a href="https://stackoverflow.com/users/your-id" target="_blank" rel="noopener noreferrer" className="hover:text-red-400">
          <SiStackoverflow title="Stack Overflow" />
        </a> */}
      </motion.div>

      {/* College Project Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-[#1a1a1a] p-6 rounded-xl shadow-md border border-gray-700"
      >
        <h3 className="text-2xl font-bold text-orange-300 mb-3">Major College Project</h3>
        <p className="text-xl font-semibold text-white mb-2">{project.name}</p>
        <p>Some of the Glimpse...</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
          {project.img.map((image, idx) => (
            <img
              key={idx}
              src={image}
              alt={`project-${idx}`}
              className="rounded-lg border border-gray-600 object-cover"
            />
          ))}
        </div>

        <p className="text-sm text-gray-400 mb-4">{project.description}</p>

        <div className="flex gap-6 mt-2">
          <a
            href="https://github.com/yourusername/femine-food-fix"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline text-sm flex items-center gap-1"
          >
            <FaGithub /> GitHub
          </a>
          <a
            href="https://femine-food-fix.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:underline text-sm flex items-center gap-1"
          >
            <FaLaptopCode /> Live Demo
          </a>
        </div>
      </motion.div>
    </div>
    <Footer/>
    </>
  );
};

export default Education;
