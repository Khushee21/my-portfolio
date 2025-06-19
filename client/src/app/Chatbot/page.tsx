'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I am Khushi’s assistant. Ask me anything 🔍' },
  ]);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleUserInput = () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    const lowerInput = input.toLowerCase();
    let botReply = '';

    if (lowerInput.includes('project')) {
      botReply = 'Khushi has built amazing projects! Redirecting you to Projects...';
      router.push('/Projects');
    } else if (lowerInput.includes('hey') || lowerInput.includes('hello')) {
      botReply = 'Yes! Ask me anything about Khushi ✨';
    } else if (
      lowerInput.includes('contact') ||
      lowerInput.includes('connect') ||
      lowerInput.includes('talk')
    ) {
      botReply = 'Taking you to the Contact page. Let’s connect!';
      router.push('/contact');
    } else if (lowerInput.includes('education')) {
      botReply = 'Khushi is pursuing MCA from Banasthali with 9.5 CGPA.';
    } else if (lowerInput.includes('service') || lowerInput.includes('work')) {
      botReply = 'She works as an SDE Intern at Newral.';
    } else if (
      lowerInput.includes('boyfriend') ||
      lowerInput.includes('relationship') ||
      lowerInput.includes('love')
    ) {
      botReply = 'Khushi has only one aim – to become an awesome SDE! 💻🚀';
    } else if (
      lowerInput.includes('quality') ||
      lowerInput.includes('qualities') ||
      lowerInput.includes('special') ||
      lowerInput.includes('hire') ||
      lowerInput.includes('she') ||
      lowerInput.includes('her')
    ) {
      botReply =
        'She is hardworking, consistent, detail-oriented, and a great team player. Collaborate with her — she’s amazing! ✨';
    } else if (
      lowerInput.includes('tech stack') ||
      lowerInput.includes('learning') ||
      lowerInput.includes('languages')
    ) {
      botReply = 'Redirecting you to learn more about her skills!';
      router.push('/about');
    } else if (lowerInput.includes('you') || lowerInput.includes('your')) {
      botReply = "I am Khushi's assistant. What is your name?";
    } else if (
      lowerInput.includes('kab btayega') ||
      lowerInput.includes('kab')
    ) {
      botReply = 'Kal bataunga 😅';
    } else if (
      lowerInput.includes('okay') ||
      lowerInput.includes('acha') ||
      lowerInput.includes('haan') ||
      lowerInput.includes('thik h')
    ) {
      botReply = 'Hmmmm...';
    } else {
      botReply = 'Maalik se puch kar batata hu 😅';
    }

    setMessages((prev) => [...prev, userMessage, { from: 'bot', text: botReply }]);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm w-[90vw]">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-orange-400 text-white font-medium rounded-full shadow-lg hover:scale-105 transition-all duration-300"
      >
        <Bot size={22} />
        {isOpen ? 'Close' : "I'm here!"}
      </button>

      {/* Chat Box */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 w-full bg-white text-black rounded-xl shadow-2xl p-4"
        >
          <div className="text-lg font-semibold mb-2 text-orange-500">🤖 Ask Me Anything</div>
          <div className="h-52 overflow-y-auto mb-3 space-y-2 text-sm scrollbar-thin pr-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.from === 'user' ? 'text-right' : 'text-left text-gray-700'
                }`}
              >
                <span
                  className={`inline-block px-3 py-2 rounded-lg max-w-[85%] ${
                    msg.from === 'user'
                      ? 'bg-orange-100 text-black'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUserInput()}
              placeholder="Type your question..."
              className="flex-1 px-3 py-2 rounded-full border border-gray-300 focus:outline-none"
            />
            <button
              onClick={handleUserInput}
              className="text-orange-500 hover:text-orange-700 transition"
            >
              <Send size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Chatbot;
