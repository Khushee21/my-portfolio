import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] bg-opacity-30 text-white py-6 px-4 mt-20 mx-5 rounded-full">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left text-1xl text-gray-400">
          © 2025 Created by <span className="text-orange-300 font-semibold">Khushi Rathore</span>
        </div>

        <div className="flex gap-6 text-2xl">
          <a
            href="https://github.com/Khushee21"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition"
          >
            <FaGithub />
          </a>
          <a
            href="https://twitter.com/your_twitter_handle"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition"
          >
            <FaTwitter />
          </a>
          <a
            href="https://www.linkedin.com/in/khushi-rathore/"
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
