'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AboutSection from '@/components/AboutSection';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import Chatbot from '@/app/Chatbot/page';
import {
  SiReact,
  SiRedux,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiFirebase,
  SiJsonwebtokens,
  SiExpress,
  SiSocketdotio,
  SiMongodb,
  SiGithub,
  SiVercel,
  SiFigma,
  SiPostman,
  SiChakraui,
  SiFramer,
  SiShadcnui,
} from 'react-icons/si';

const techIcons: Record<string, React.ReactNode> = {
  'React.js': <SiReact />,
  'Redux Store': <SiRedux />,
  'Next.js': <SiNextdotjs />,
  'TypeScript': <SiTypescript />,
  'Tailwind CSS': <SiTailwindcss />,
  'Node.js': <SiNodedotjs />,
  'Firebase': <SiFirebase />,
  'JWT Token': <SiJsonwebtokens />,
  'Express.js': <SiExpress />,
  'Socket.IO': <SiSocketdotio />,
  'MongoDB': <SiMongodb />,
  'GitHub': <SiGithub />,
  'Vercel': <SiVercel />,
  'Figma': <SiFigma />,
  'Postman': <SiPostman />,
  'Framer Motion': <SiFramer />,
  'Chakra UI': <SiChakraui />,
  'Shadcn': <SiShadcnui />,
};


export default function AboutPage() {
  const [showFirstImage, setShowFirstImage] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setShowFirstImage((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='bg-[#0F0F0F] top-0 mt-0 min-h-screen '>
      <motion.div
        className="min-h-screen bg-[#0F0F0F] text-white px-4 sm:px-8 py-10 "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Navbar />
        <Chatbot />
        <div className="relative text-center mb-10 mt-10 px-4">
          <div className="absolute top-0 right-0 blob w-[50vw] h-[100vh] rounded-full opacity-30 blur-3xl z-0 pointer-events-none"></div>
          <p className="italic text-white z-10 relative text-base sm:text-lg md:text-xl max-w-xl mx-auto">
            "A quiet storm with wings, rising on her own terms."
          </p>
        </div>

        {/* Sectioned Content */}
        <div className="max-w-5xl mx-auto space-y-12 px-2 sm:px-4">
          <AboutSection
            title=" Who Am I?"
            content="From getting lost in while loops to confidently solving 600+ DSA problems, I have built myself piece by piece. My goal is to become a skilled Software Development Engineer (SDE) who can create technology that serves real-world needs I specilized in building dynamic, scalable, and seamless web applications.. I am currently pursuing MCA from Banasthali Vidyapith with a CGPA of 9.5. My passion lies in merging creativity with functionality. I’m deeply interested in building scalable web applications and solving complex problems using clean code and effective design systems."
          />
          <button
            onClick={() => router.push('/Projects')}
            className="px-6 py-2 bg-gradient-to-r from-orange-300 text-white rounded-full shadow-lg hover:scale-105 transition-all duration-300"
          >
            ➥ Click to see some glimpses of my work...
          </button>
          <h1> ➥ Want to know more about me?  <span> Connect with my assistent 🤖</span></h1>

          <AboutSection
            title="Languages Spoken"
            content={
              <ul className="flex flex-wrap gap-4 mt-2">
                <li className='bg-transparent border py-1.5 rounded-full border-zinc-50 px-6 w-fit'>English</li>
                <li className='bg-transparent border py-1.5 rounded-full border-zinc-50 px-6 w-fit'>Hindi</li>
              </ul>
            }
          />

          <AboutSection
            title="Tech Stack"
            content={
              <ul className="pl-0 space-y-6 list-none text-sm sm:text-base">
                {([
                  ['Frontend', ['React.js', 'Redux Store', 'Next.js', 'TypeScript', 'Tailwind CSS']],
                  ['Backend', ['Node.js', 'Firebase', 'JWT Token', 'Express.js', 'Socket.IO']],
                  ['Database', ['MongoDB']],
                  ['Tools & Cloud', ['GitHub', 'Vercel', 'Figma', 'Postman']],
                  ['UI Libraries', ['Shadcn', 'Framer Motion', 'Chakra UI']],
                ] as [string, string[]][]).map(([title, items], index) => (
                  <li key={index}>
                    <strong>{title}:</strong>
                    <div className="flex flex-wrap mt-2 gap-2">
                      {items.map((tech, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-2 bg-transparent border py-1.5 rounded-full border-zinc-50 px-4 w-fit"
                        >
                          <span className="text-lg">{techIcons[tech] ?? '🛠️'}</span>
                          <span>{tech}</span>
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            }
          />


          <AboutSection
            title=" Hackathons"
            content={
              <ul className="list-disc pl-6 space-y-1 text-sm sm:text-base">
                <li><strong>Hack Celestia 2025 — Top 10 Finalist</strong></li>
                <li>Built “Hostel Grievance System” using MERN Stack & Socket.IO</li>
                <li>Focused on real-time features, team-based dashboards, and a chatbot</li>
                <li>Learned to deliver functional apps under strict deadlines</li>
              </ul>
            }
          />
          {/* Image Swapper */}
          <div className="my-8 flex justify-center">
            {showFirstImage ? (
              <motion.img
                src="/h1.png"
                alt="Hackathon Image 1"
                className="w-full max-w-lg rounded-md shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              />
            ) : (
              <motion.img
                src="/h2.png"
                alt="Hackathon Image 2"
                className="w-full max-w-lg rounded-md shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              />
            )}
          </div>

          <AboutSection
            title=" Why Hire Me?"
            content={
              <ul className="list-disc pl-6 space-y-1 text-sm sm:text-base">
                <li>Strong foundation in MERN stack and real-time systems</li>
                <li>600+ DSA problems solved — disciplined and persistent</li>
                <li>Design-oriented with a clean, modern UI sense</li>
                <li>Team player, fast learner, and detail-oriented</li>
                <li>Committed to delivering value-driven, real-world software</li>
              </ul>
            }
          />
        </div>
        <section className="text-center py-20 px-4 sm:px-8 bg-gradient-to-b from-[#0F0F0F] to-[#1a1a1a] text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-orange-300">
            Ready to Work Together?
          </h1>
          <h3 className="text-base sm:text-lg md:text-xl font-light mb-8">
            Let’s connect and turn bold ideas into impactful digital realities.
          </h3>
          <button
            onClick={() => router.push('/contact')}
            className="px-6 py-2 bg-gradient-to-r from-orange-300 text-white rounded-full shadow-lg hover:scale-105 transition-all duration-300"
          >
            Here we go
          </button>
        </section>
        <Footer />
      </motion.div>
    </div>
  );
}
