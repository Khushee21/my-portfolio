'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GoogleGenAI } from '@google/genai';

interface Message {
  from: string;
  text: string;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: 'Hi! I am Khushi\'s assistant. Ask me anything about her projects, skills, or experience! 🔍' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const khushiContext = `
You are Khushi's virtual assistant. Keep responses SHORT, FRIENDLY, and CONCISE (2-3 sentences max). Use emojis occasionally.

**About Khushi:**
- MCA student at Banasthali University (9.5 CGPA)
- SDE Intern at Newral and Flexzistay
- 6 months of professional experience
- Passionate about software development 
- Hardworking, detail-oriented, great team player, coder
- DevOps Enthusiast and AI & Cloud Computing Explorer
- Focused on career growth and becoming an SDE

**SPECIFIC RESPONSES:**
- For personal questions (marriage, relationship, boyfriend, love, age, personal life): 
  "Khushi is focused on her career growth and becoming an awesome Software Development Engineer! 💻🚀"

- For projects: "Check out her amazing projects! 🚀" + redirect to /Projects
- For contact: "Let's connect! 📧" + redirect to /contact  
- For skills: "See her tech skills! 💻" + redirect to /about
- For education: "Pursuing MCA at Banasthali with 9.5 CGPA 🎓"
- For work: "SDE Intern at Newral with 6 months experience 👩💻"
- For qualities: "Hardworking, detail-oriented team player! ✨"

**Response Rules:**
- Be brief and to the point
- Use casual, friendly language
- Include relevant emojis
- For personal questions, use the career-focused response
- Redirect immediately for projects/contact/skills
- If unsure about professional topics: "I can help with Khushi's projects, skills, or experience! 😊"
`;

  const handleUserInput = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const prompt = `${khushiContext}

Current conversation: ${messages.slice(-3).map(m => `${m.from}: ${m.text}`).join('\n')}

User: ${input}

Assistant (SHORT response, 2-3 sentences max):`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: prompt,
      });

      const botReply = response.text?.trim() || 'Let me check that for you! ';

      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('project')) {
        setTimeout(() => router.push('/Projects'), 1500);
      } else if (lowerInput.includes('contact') || lowerInput.includes('connect') || lowerInput.includes('email')) {
        setTimeout(() => router.push('/contact'), 1500);
      } else if (lowerInput.includes('skill') || lowerInput.includes('tech') || lowerInput.includes('about') || lowerInput.includes('learn')) {
        setTimeout(() => router.push('/about'), 1500);
      }

      const botMessage: Message = { from: 'bot', text: botReply };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);

      const errorMessage: Message = {
        from: 'bot',
        text: 'Let me check that for you! '
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
                className={`${msg.from === 'user' ? 'text-right' : 'text-left text-gray-700'
                  }`}
              >
                <span
                  className={`inline-block px-3 py-2 rounded-lg max-w-[85%] ${msg.from === 'user'
                    ? 'bg-orange-100 text-black'
                    : 'bg-gray-200 text-gray-800'
                    }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="text-left">
                <span className="inline-block px-3 py-2 rounded-lg bg-gray-200 text-gray-800">
                  Thinking...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleUserInput()}
              placeholder="Ask about Khushi..."
              className="flex-1 px-3 py-2 rounded-full border border-gray-300 focus:outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleUserInput}
              disabled={isLoading}
              className="text-orange-500 hover:text-orange-700 transition disabled:opacity-50"
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