'use client';

import React, { useState, useRef, useEffect } from 'react';
const uuidv4 = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
import { runtimeRagAPI } from '@/lib/api';
import { Send, UploadCloud, X, Loader2, Bot, User, FileText } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function BrochureChatPage() {
  const [sessionId, setSessionId] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session
  useEffect(() => {
    if (!sessionId) {
      setSessionId(uuidv4());
    }
    
    // Cleanup on unmount
    return () => {
      if (sessionId && isReady) {
        runtimeRagAPI.closeSession(sessionId).catch(console.error);
      }
    };
  }, [sessionId, isReady]);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    if (selectedFile.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }

    setFile(selectedFile);
    setIsUploading(true);

    try {
      await runtimeRagAPI.uploadBrochure(selectedFile, sessionId);
      setIsReady(true);
      setMessages([
        {
          id: uuidv4(),
          role: 'assistant',
          content: `I've read through the brochure "${selectedFile.name}". What would you like to know about it?`
        }
      ]);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to process document.');
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseSession = async () => {
    if (confirm('Are you sure you want to close this session? All context will be cleared.')) {
      try {
        await runtimeRagAPI.closeSession(sessionId);
      } catch (error) {
        console.error(error);
      }
      // Reset state
      setIsReady(false);
      setFile(null);
      setMessages([]);
      setSessionId(uuidv4()); // Generate new session ID
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMsg = inputValue.trim();
    setInputValue('');
    
    setMessages(prev => [...prev, { id: uuidv4(), role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const res = await runtimeRagAPI.askQuestion(userMsg, sessionId);
      setMessages(prev => [...prev, { id: uuidv4(), role: 'assistant', content: res.answer }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        id: uuidv4(), 
        role: 'assistant', 
        content: error.response?.data?.error || 'Sorry, I encountered an error answering that.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-20">
      <div className="max-w-4xl w-full mx-auto p-4 flex-1 flex flex-col h-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
          
          {/* Header */}
          <div className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">Brochure Q&A AI</h1>
                <p className="text-indigo-100 text-sm">Upload a college brochure to start asking questions</p>
              </div>
            </div>
            {isReady && (
              <button 
                onClick={handleCloseSession}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                title="End Session"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-hidden relative bg-gray-50 flex flex-col">
            
            {!isReady ? (
              // Upload State
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Brochure</h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Upload a PDF brochure or prospectus to start asking questions about it. The AI will strictly answer from the document.
                  </p>
                  
                  <label className="relative cursor-pointer">
                    <input 
                      type="file" 
                      accept=".pdf" 
                      className="hidden" 
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                    <div className={`w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all ${isUploading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'}`}>
                      {isUploading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Processing PDF...</>
                      ) : (
                        'Select PDF File'
                      )}
                    </div>
                  </label>
                </div>
              </div>
            ) : (
              // Chat State
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                        <Bot className="w-5 h-5 text-indigo-600" />
                      </div>
                    )}
                    
                    <div className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-none'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>

                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-4 justify-start">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          {isReady && (
            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={handleSendMessage} className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a question about the brochure..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-full pl-5 pr-14 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
