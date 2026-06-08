'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { chatAPI, ChatMessage } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, GraduationCap, User, Phone, Mail, MapPin, Check, Sparkles } from 'lucide-react';

type ChatStep = 'chat' | 'lead_capture' | 'lead_complete';

interface LeadFormState {
  name: string;
  phone: string;
  email: string;
  preferred_country: string;
  course_interest: string;
}

export default function StudentChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [step, setStep] = useState<ChatStep>('chat');
  const [leadForm, setLeadForm] = useState<LeadFormState>({
    name: '',
    phone: '',
    email: '',
    preferred_country: '',
    course_interest: 'MBBS',
  });
  const [showLeadPrompt, setShowLeadPrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate session ID on mount
  useEffect(() => {
    const storedSessionId = localStorage.getItem('student_chat_session');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = crypto.randomUUID();
      setSessionId(newSessionId);
      localStorage.setItem('student_chat_session', newSessionId);
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'greeting',
          role: 'assistant',
          content: `Hello! 👋 Welcome to Intermost Study Abroad!\n\nI'm here to help you with:\n• MBBS abroad programs\n• Country & college information\n• Fees and eligibility\n• Admission process\n\nHow can I assist you today?`,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  // Show lead capture prompt after 3 user messages
  useEffect(() => {
    const userMessages = messages.filter(m => m.role === 'user').length;
    if (userMessages >= 3 && !showLeadPrompt && step === 'chat') {
      setShowLeadPrompt(true);
    }
  }, [messages, showLeadPrompt, step]);

  const sendQuery = async (textToSend: string) => {
    const message = textToSend.trim();
    if (!message || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatAPI.sendStudentMessage(message, sessionId || undefined);
      
      if (response.session_id && response.session_id !== sessionId) {
        setSessionId(response.session_id);
        localStorage.setItem('student_chat_session', response.session_id);
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.message,
        timestamp: response.timestamp,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'I apologize for the inconvenience. Please try again or contact us directly at +91-9717717165.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = () => sendQuery(inputValue);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!leadForm.name || !leadForm.phone) {
      return;
    }

    setIsLoading(true);

    try {
      await chatAPI.captureStudentLead(sessionId!, leadForm);
      setStep('lead_complete');
      
      // Add thank you message
      const thankYouMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Thank you, ${leadForm.name}! 🎉\n\nOur expert counselor will contact you shortly at ${leadForm.phone}.\n\nIn the meantime, feel free to ask me any questions about studying abroad!`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, thankYouMessage]);
      
      // Reset to chat after lead capture
      setTimeout(() => {
        setStep('chat');
        setShowLeadPrompt(false);
      }, 1500);
    } catch (error) {
      console.error('Lead capture error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openLeadForm = () => {
    setStep('lead_capture');
  };

  const suggestionChips = [
    { label: 'Russia Fees 🇷🇺', query: 'What is the tuition and hostel fee structure for MBBS in Russia?' },
    { label: 'Georgia Eligibility 🇬🇪', query: 'What is the eligibility criteria for MBBS in Georgia?' },
    { label: 'Is NEET required? 🩺', query: 'Is qualifying NEET mandatory for studying MBBS abroad?' },
    { label: 'Uzbekistan Duration 🇺🇿', query: 'What is the duration and medium of instruction in Uzbekistan?' }
  ];

  const countries = [
    'Russia', 'Kazakhstan', 'Uzbekistan', 'Georgia', 'Nepal', 'Tajikistan'
  ];

  // Don't render on admin pages
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/django-admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="w-[360px] sm:w-[400px] h-[550px] bg-white/95 backdrop-blur-xl rounded-[28px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white p-5 flex items-center justify-between border-b border-white/10 relative">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 bg-white/15 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-md">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-primary-600 rounded-full animate-pulse shadow-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base leading-tight tracking-wide flex items-center gap-1.5">
                    Tejas AI Advisor
                    <Sparkles className="w-4 h-4 text-secondary-300 fill-secondary-300" />
                  </h3>
                  <p className="text-xs text-white/80 mt-0.5 flex items-center gap-1">
                    Online • Ask me anything!
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-white/10 p-2 rounded-xl transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            {step === 'chat' ? (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50/50 to-white scrollbar-modern">
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-[20px] px-4 py-3 ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-tr-sm shadow-md shadow-primary-600/10'
                              : 'bg-white text-gray-800 border border-gray-150 rounded-tl-sm shadow-sm'
                          }`}
                        >
                          <div className="text-[13px] sm:text-[14px] whitespace-pre-wrap break-words leading-relaxed">
                            {msg.content.split('\n').map((line, i) => (
                              <p key={i} className="mb-1.5 last:mb-0">
                                {line.startsWith('•') ? (
                                  <span className="flex items-start gap-2">
                                    <span className="text-primary-500 font-bold">•</span>
                                    <span>{line.slice(1).trim()}</span>
                                  </span>
                                ) : line.includes('**') ? (
                                  line.split('**').map((part, j) =>
                                    j % 2 === 1 ? <strong key={j} className="font-semibold text-primary-900">{part}</strong> : part
                                  )
                                ) : (
                                  line
                                )}
                              </p>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {/* Lead Capture Prompt */}
                  {showLeadPrompt && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-100 rounded-2xl p-5 text-center shadow-sm"
                    >
                      <p className="text-sm font-semibold text-gray-800 mb-1">
                        Need Expert Human Advice? 🤝
                      </p>
                      <p className="text-xs text-gray-600 mb-3.5">
                        Get direct, personalized assistance from our lead counselor.
                      </p>
                      <button
                        onClick={openLeadForm}
                        className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                      >
                        Get Free Counseling Call
                      </button>
                    </motion.div>
                  )}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-150 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                        <div className="flex gap-1 items-center py-1">
                          <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-xs text-gray-400 font-medium">Tejas is typing...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggestion Chips */}
                {messages.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto px-4 py-2.5 bg-gray-50 border-t border-gray-100 scrollbar-hide">
                    {suggestionChips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendQuery(chip.query)}
                        className="flex-shrink-0 px-3.5 py-1.5 bg-white border border-gray-200 hover:border-primary-400 hover:text-primary-600 rounded-full text-xs font-medium text-gray-600 shadow-sm transition-all duration-200 active:scale-95 whitespace-nowrap"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="p-4 bg-white border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about MBBS abroad..."
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 text-sm transition-all duration-200"
                      disabled={isLoading}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className="w-11 h-11 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl flex items-center justify-center hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 flex-shrink-0"
                    >
                      <Send className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              </>
            ) : step === 'lead_capture' ? (
              /* Lead Capture Form */
              <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50/50 to-white">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-3.5 shadow-sm">
                    <GraduationCap className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">Counseling Registration</h3>
                  <p className="text-xs text-gray-500 mt-1">Our certified counselor will call you within 24 hours</p>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 text-sm transition-all"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="WhatsApp Phone Number *"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 text-sm transition-all"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email Address (optional)"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 text-sm transition-all"
                    />
                  </div>

                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select
                      value={leadForm.preferred_country}
                      onChange={(e) => setLeadForm({ ...leadForm, preferred_country: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 text-sm transition-all appearance-none bg-white"
                    >
                      <option value="">Preferred Study Destination</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setStep('chat')}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition active:scale-95"
                    >
                      Back to Chat
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || !leadForm.name || !leadForm.phone}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl text-sm font-semibold hover:shadow-lg disabled:opacity-50 transition active:scale-95 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Register
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Lead Complete */
              <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-gray-50/50 to-white">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900">Registration Successful!</h3>
                  <p className="text-sm text-gray-500 mt-1.5 px-4">
                    Our lead MBBS advisor will contact you within 24 hours.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 transform active:scale-90 ${
            isOpen
              ? 'bg-gray-800 text-white rotate-90'
              : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:scale-105'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Notification Badge */}
        {!isOpen && (
          <span className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-[10px] text-white font-bold">1</span>
          </span>
        )}
      </div>
    </div>
  );
}
