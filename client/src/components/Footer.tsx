import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] bg-opacity-30 text-white py-6 px-6 sm:px-8 mt-20 mx-4 rounded-2xl shadow-inner">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        
        <div className="text-sm sm:text-base text-gray-400">
          © 2025 Created by{' '}
          <span className="text-orange-300 font-semibold">Khushi Rathore</span>
        </div>

        <div className="flex gap-5 sm:gap-6 text-xl sm:text-2xl justify-center">
          <a
            href="https://github.com/Khushee21"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition"
          >
            <FaGithub />
          </a>
          <a
            href="https://x.com/KhushieRathore"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition"
          >
            <FaTwitter />
          </a>
          <a
            href="https://www.linkedin.com/in/khushi-rathore-5363a8257"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition"
          >
            <FaLinkedin />
          </a>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
