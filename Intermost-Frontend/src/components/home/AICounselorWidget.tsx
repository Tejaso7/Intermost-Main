'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, X, Phone, Check, User, Sparkles } from 'lucide-react';
import { studentService } from '@/lib/services';
import { generateUUID } from '@/lib/utils';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  isLeadCapture?: boolean;
}

export default function AICounselorWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session and greeting
  useEffect(() => {
    let savedSession = localStorage.getItem('intermost_chat_session');
    if (!savedSession) {
      savedSession = generateUUID();
      localStorage.setItem('intermost_chat_session', savedSession);
    }
    setSessionId(savedSession);

    const savedHistory = localStorage.getItem(`intermost_chat_history_${savedSession}`);
    if (savedHistory) {
      try {
        setMessages(JSON.parse(savedHistory));
      } catch (e) {
        loadDefaultGreeting();
      }
    } else {
      loadDefaultGreeting();
    }
  }, []);

  // Save history on message change
  useEffect(() => {
    if (sessionId && messages.length > 0) {
      localStorage.setItem(`intermost_chat_history_${sessionId}`, JSON.stringify(messages));
    }
  }, [messages, sessionId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadDefaultGreeting = () => {
    setMessages([
      {
        id: 'greet-1',
        sender: 'bot',
        text: "👋 Hi! I am Tejas, your Intermost AI counselor. I can help you find top medical universities, check fees, and list eligibility requirements for MBBS in Russia, Georgia, Kazakhstan, Uzbekistan, Nepal, and Vietnam!"
      },
      {
        id: 'greet-2',
        sender: 'bot',
        text: "Feel free to ask me anything, like: 'What is the budget for Uzbekistan?' or 'Do they serve Indian food in Samarkand hostels?'"
      }
    ]);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');

    // Add user message
    const userMsg: Message = {
      id: generateUUID(),
      sender: 'user',
      text: userText
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await studentService.chat(userText, sessionId);
      const botMsgText = response.response || response.message || "I'm having trouble retrieving details. Please call our counselor directly at +91 91583 74434.";
      
      const botMsg: Message = {
        id: generateUUID(),
        sender: 'bot',
        text: botMsgText
      };

      // Check if message prompts for phone number
      const lowerText = userText.toLowerCase();
      const needsLeadCapture = 
        lowerText.includes('call') || 
        lowerText.includes('contact') || 
        lowerText.includes('number') || 
        lowerText.includes('speak') || 
        lowerText.includes('talk') || 
        lowerText.includes('admission') ||
        lowerText.includes('apply');

      setMessages((prev) => {
        const next = [...prev, botMsg];
        if (needsLeadCapture && !phoneSubmitted) {
          next.push({
            id: 'lead-capture-form',
            sender: 'bot',
            text: "Would you like a senior counselor to call you back? Enter your phone number below:",
            isLeadCapture: true
          });
        }
        return next;
      });
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: generateUUID(),
          sender: 'bot',
          text: "I apologize, our counseling servers are busy right now. Please call us directly at +91 91583 74434 or WhatsApp us!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim() || phoneLoading) return;

    setPhoneLoading(true);
    try {
      await studentService.submitLead({
        phone: phoneInput,
        session_id: sessionId,
        name: 'Chat Bot Lead',
        email: 'chatbot@intermost.com',
        source: 'chatbot'
      });
      setPhoneSubmitted(true);
      
      // Update form message with confirmation
      setMessages((prev) => {
        return prev.map((m) => {
          if (m.id === 'lead-capture-form') {
            return {
              ...m,
              isLeadCapture: false,
              text: "✅ Phone number submitted! A senior advisor will contact you within 2 hours."
            };
          }
          return m;
        });
      });
    } catch (err) {
      // Fallback
      setPhoneSubmitted(true);
    } finally {
      setPhoneLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Do you want to reset your chat conversation?")) {
      const newSession = generateUUID();
      localStorage.setItem('intermost_chat_session', newSession);
      localStorage.removeItem(`intermost_chat_history_${sessionId}`);
      setSessionId(newSession);
      setPhoneSubmitted(false);
      setPhoneInput('');
      setMessages([
        {
          id: 'greet-1',
          sender: 'bot',
          text: "👋 Chat reset. How can I assist you with your MBBS abroad plans today?"
        }
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="mb-4 w-[380px] h-[550px] rounded-2xl shadow-2xl border border-white/20 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                  <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">Tejas | Intermost Advisor</h4>
                  <span className="text-[10px] text-blue-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                    Online | Powered by AI
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={clearChat}
                  title="Reset Conversation"
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 transition-colors text-xs"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/50 dark:bg-neutral-950/20">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 border border-neutral-100 dark:border-neutral-700/50 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    
                    {msg.isLeadCapture && (
                      <form onSubmit={handlePhoneSubmit} className="mt-3 flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-2.5 text-neutral-400">
                            <Phone className="w-4 h-4" />
                          </span>
                          <input
                            type="tel"
                            placeholder="Enter mobile number"
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={phoneLoading}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
                        >
                          {phoneLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-neutral-800 rounded-2xl rounded-bl-none px-4 py-3 border border-neutral-100 dark:border-neutral-700/50 shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex gap-2">
              <input
                type="text"
                placeholder="Ask about colleges, fees, hostels..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-2xl flex items-center justify-center cursor-pointer border border-white/20"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 animate-pulse" />}
      </motion.button>
    </div>
  );
}
