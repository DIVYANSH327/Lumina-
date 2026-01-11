
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Users, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userPic?: string;
  text: string;
  timestamp: number;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: 'm1', userId: 'system', userName: 'Aryan (Bhopal)', text: 'Upper Lake route looking fresh today! Who is in?', timestamp: Date.now() - 3600000 },
  { id: 'm2', userId: 'system', userName: 'Sara (Indore)', text: 'Super Corridor sprint was wild last Saturday. Cant wait for the rave!', timestamp: Date.now() - 1800000 },
  { id: 'm3', userId: 'system', userName: 'Coach Rohan', text: 'Remember to stay hydrated, collective! ⚡️', timestamp: Date.now() - 600000 },
];

interface AIChatProps {
  currentUser: User | null;
}

const AIChat: React.FC<AIChatProps> = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load messages from local storage or use initial ones
  useEffect(() => {
    const saved = localStorage.getItem('genrun_community_messages');
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages(INITIAL_MESSAGES);
    }
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('genrun_community_messages', JSON.stringify(messages));
    }
  }, [messages]);

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
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim() || !currentUser) return;

    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      userPic: currentUser.profilePic,
      text: input.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-6 w-[90vw] md:w-[400px] bg-zinc-900 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl shadow-black"
          >
            {/* Header */}
            <div className="bg-[#d9ff00] p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-black p-2 rounded-xl">
                  <Users className="w-5 h-5 text-[#d9ff00]" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-black text-xs tracking-widest uppercase">Collective Chat</h3>
                  <p className="text-[9px] text-black/60 font-black uppercase tracking-tighter">Live Bhopal & Indore Hub</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-black/50 hover:text-black transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={chatContainerRef}
              className="h-[400px] overflow-y-auto p-6 space-y-6 scroll-smooth bg-black/40 custom-scrollbar"
            >
              {messages.map((msg) => {
                const isMe = msg.userId === currentUser?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`flex items-center gap-2 mb-1.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                      {msg.userPic ? (
                        <img src={msg.userPic} className="w-5 h-5 rounded-full object-cover border border-white/10" alt="" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[8px] font-black uppercase text-gray-500">
                          {msg.userName.charAt(0)}
                        </div>
                      )}
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                        {isMe ? 'You' : msg.userName}
                      </span>
                    </div>
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? 'bg-[#d9ff00] text-black font-semibold rounded-tr-none shadow-lg shadow-[#d9ff00]/10'
                          : 'bg-zinc-800/50 text-gray-200 rounded-tl-none border border-white/5'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-zinc-900">
              {currentUser ? (
                <div className="flex gap-3 bg-black/50 p-2 rounded-2xl border border-white/5">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Message the collective..."
                    className="flex-1 bg-transparent text-white placeholder-gray-600 text-sm focus:outline-none px-3"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="bg-[#d9ff00] p-3 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                  >
                    <Send className="w-4 h-4 text-black" />
                  </button>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center justify-center gap-2">
                    <Lock size={12} /> Access Terminal Required to Chat
                  </p>
                </div>
              )}
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
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black animate-pulse" />
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default AIChat;
