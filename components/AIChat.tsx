
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Coach STRIDE here. Ready to hit the road in Bhopal or Indore? Ask me anything! 🏃‍♂️⚡️' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessageToGemini(input);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-6 w-[90vw] md:w-[400px] bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black"
          >
            {/* Header */}
            <div className="bg-[#d9ff00] p-5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-black p-2 rounded-full">
                  <Activity className="w-5 h-5 text-[#d9ff00]" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-black text-sm tracking-wider">STRIDE-AI</h3>
                  <p className="text-[10px] text-black/60 font-black uppercase">Lead Coach</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-black/50 hover:text-black">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={chatContainerRef}
              className="h-[400px] overflow-y-auto p-6 space-y-4 scroll-smooth bg-black/40"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#d9ff00] text-black font-medium rounded-tr-none shadow-lg shadow-[#d9ff00]/10'
                        : 'bg-white/5 text-gray-200 rounded-tl-none border border-white/10'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-xl rounded-tl-none flex gap-1.5 border border-white/10">
                    <span className="w-1.5 h-1.5 bg-[#d9ff00] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#d9ff00] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#d9ff00] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-zinc-900">
              <div className="flex gap-3 bg-black/50 p-2 rounded-xl border border-white/5">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about routes, hydration, training..."
                  className="flex-1 bg-transparent text-white placeholder-gray-600 text-sm focus:outline-none px-2"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-[#d9ff00] p-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-[#d9ff00] flex items-center justify-center shadow-xl shadow-black border-4 border-black z-50 group"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-black" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-8 h-8 text-black" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-black rounded-full border-2 border-[#d9ff00] animate-ping" />
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default AIChat;
