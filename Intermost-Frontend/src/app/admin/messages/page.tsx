'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Search,
  Send,
  User,
  Phone,
  MessageCircle,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  CheckSquare,
  Square,
  Settings,
  X
} from 'lucide-react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import { messagesApi, WhatsAppContact } from '@/lib/services';

export default function MessagesPage() {
  const [contacts, setContacts] = useState<WhatsAppContact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(new Set());
  const [selectAllGlobal, setSelectAllGlobal] = useState(false);
  
  const [message, setMessage] = useState('');

  // Config States
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [config, setConfig] = useState({
    gateway: 'simulation',
    meta_phone_number_id: '',
    meta_access_token: '',
    twilio_account_sid: '',
    twilio_auth_token: '',
    twilio_sender_phone: '',
    custom_endpoint: '',
    custom_token: '',
  });
  
  const highlightText = (text: string, query: string) => {
    if (!query || !text) return text;
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    
    return (
      <>
        {text.slice(0, index)}
        <span className="bg-yellow-200 text-gray-900">
          {text.slice(index, index + query.length)}
        </span>
        {text.slice(index + query.length)}
      </>
    );
  };
  
  const [isImporting, setIsImporting] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchContacts = async (searchParam?: string, pageParam: number = 1) => {
    setIsLoadingContacts(true);
    try {
      const data = await messagesApi.getContacts(pageParam, searchParam);
      setContacts(data.results);
      setTotalPages(data.total_pages);
      setPage(data.page);
      setTotalCount(data.count);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch contacts');
    } finally {
      setIsLoadingContacts(false);
    }
  };

  useEffect(() => {
    fetchContacts(searchQuery, page);
    
    const fetchConfig = async () => {
      try {
        const data = await messagesApi.getConfig();
        if (data) {
          setConfig({
            gateway: data.gateway || 'simulation',
            meta_phone_number_id: data.meta_phone_number_id || '',
            meta_access_token: data.meta_access_token || '',
            twilio_account_sid: data.twilio_account_sid || '',
            twilio_auth_token: data.twilio_auth_token || '',
            twilio_sender_phone: data.twilio_sender_phone || '',
            custom_endpoint: data.custom_endpoint || '',
            custom_token: data.custom_token || ''
          });
        }
      } catch (error) {
        console.debug('No saved config found');
      }
    };
    fetchConfig();
  }, []);

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSelectedContactIds(new Set());
      setSelectAllGlobal(false);
      fetchContacts(searchQuery, 1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    try {
      await messagesApi.saveConfig(config);
      toast.success('WhatsApp configuration saved successfully!');
      setIsConfigModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save configuration');
    } finally {
      setIsSavingConfig(false);
    }
  };

  const toggleContactSelection = (id: string) => {
    const newSet = new Set(selectedContactIds);
    if (newSet.has(id)) {
      newSet.delete(id);
      setSelectAllGlobal(false);
    } else {
      newSet.add(id);
    }
    setSelectedContactIds(newSet);
  };

  const toggleSelectAllOnPage = () => {
    const allIdsOnPage = contacts.map(c => c.id || c._id).filter(Boolean) as string[];
    const allSelected = allIdsOnPage.every(id => selectedContactIds.has(id));
    
    const newSet = new Set(selectedContactIds);
    if (allSelected) {
      allIdsOnPage.forEach(id => newSet.delete(id));
      setSelectAllGlobal(false);
    } else {
      allIdsOnPage.forEach(id => newSet.add(id));
    }
    setSelectedContactIds(newSet);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to JSON
      const json = XLSX.utils.sheet_to_json<any>(worksheet);
      
      const parsedContacts = json.map(row => {
        // Try to find Name and Phone regardless of exact case
        const nameKey = Object.keys(row).find(k => k.toLowerCase().includes('name'));
        const phoneKey = Object.keys(row).find(k => k.toLowerCase().includes('phone') || k.toLowerCase().includes('number') || k.toLowerCase().includes('contact'));
        
        return {
          name: nameKey ? String(row[nameKey]) : 'Unknown',
          phone: phoneKey ? String(row[phoneKey]) : ''
        };
      }).filter(c => c.phone !== '');

      if (parsedContacts.length === 0) {
        toast.error('No valid contacts found in the Excel file. Please ensure it has Name and Phone columns.');
        return;
      }

      // Send to backend
      const result = await messagesApi.importContacts(parsedContacts);
      toast.success(`Successfully imported ${result.imported} contacts!`);
      
      // Refresh contacts list
      fetchContacts(searchQuery);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to process Excel file');
      console.error(error);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if (selectedContactIds.size === 0 && !selectAllGlobal) {
      toast.error('Please select at least one contact');
      return;
    }
    if (!message.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    setIsSending(true);
    try {
      const contactIdsArray = Array.from(selectedContactIds);
      const result = await messagesApi.sendMessage(contactIdsArray, message, selectAllGlobal, searchQuery);
      toast.success(`Message sent successfully to ${result.sent_count} contacts`);
      setMessage('');
      setSelectedContactIds(new Set());
      setSelectAllGlobal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const selectionCount = selectAllGlobal ? totalCount : selectedContactIds.size;

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages & Contacts</h1>
          <p className="text-sm text-gray-500 mt-1">Import contacts from Excel and send WhatsApp messages.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Config Settings Trigger */}
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg transition-colors font-medium text-sm shadow-sm"
          >
            <Settings className="w-4 h-4 text-gray-500" />
            WhatsApp Config
          </button>

          {/* Import Action */}
          <div>
            <input 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-70 font-medium text-sm shadow-sm"
            >
              {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
              {isImporting ? 'Importing...' : 'Import Excel'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        
        {/* Left Column: Contacts List */}
        <div className="w-1/3 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
              />
            </div>
          </div>
          
          {contacts.length > 0 && (
            <div className="p-3 bg-gray-50 border-b border-gray-200 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <button 
                  onClick={toggleSelectAllOnPage}
                  className="text-sm flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  {contacts.every(c => selectedContactIds.has((c.id || c._id) as string)) ? 
                    <CheckSquare className="w-4 h-4 text-primary-600" /> : 
                    <Square className="w-4 h-4" />
                  }
                  Select All on Page
                </button>
                <span className="text-xs text-gray-500 font-medium bg-gray-200 px-2 py-0.5 rounded-full">{totalCount} total</span>
              </div>
              
              {selectedContactIds.size > 0 && !selectAllGlobal && totalCount > selectedContactIds.size && (
                <div className="bg-primary-50 text-primary-700 text-xs p-2 rounded flex items-center justify-between">
                  <span>Selected {selectedContactIds.size} contacts.</span>
                  <button 
                    onClick={() => setSelectAllGlobal(true)}
                    className="font-medium hover:underline text-primary-800"
                  >
                    Select all {totalCount} contacts
                  </button>
                </div>
              )}
              
              {selectAllGlobal && (
                <div className="bg-primary-100 text-primary-800 text-xs p-2 rounded flex items-center justify-between font-medium">
                  <span>All {totalCount} contacts are selected.</span>
                  <button 
                    onClick={() => { setSelectAllGlobal(false); setSelectedContactIds(new Set()); }}
                    className="hover:underline text-primary-900"
                  >
                    Clear selection
                  </button>
                </div>
              )}
            </div>
          )}
          
          <div className="flex-1 overflow-y-auto p-2">
            {isLoadingContacts ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p className="text-sm">Loading contacts...</p>
              </div>
            ) : contacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <UsersIcon className="w-12 h-12 mb-2 text-gray-300" />
                <p className="text-sm">No contacts found.</p>
                <p className="text-xs mt-1">Import an Excel file to get started.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {contacts.map((contact) => {
                  const contactId = (contact.id || contact._id) as string;
                  const isSelected = selectedContactIds.has(contactId) || selectAllGlobal;
                  return (
                    <motion.div
                      key={contactId}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full flex items-center p-3 rounded-lg transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-primary-50 border-primary-200 border' 
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                      onClick={() => toggleContactSelection(contactId)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex-shrink-0">
                          {isSelected ? <CheckSquare className="w-5 h-5 text-primary-600" /> : <Square className="w-5 h-5 text-gray-400" />}
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-primary-200 text-primary-700' : 'bg-gray-100 text-gray-600'}`}>
                          {contact.name ? contact.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`font-medium truncate ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                            {contact.name ? highlightText(contact.name, searchQuery) : 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" />
                            {contact.phone ? highlightText(contact.phone, searchQuery) : ''}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <button
                onClick={() => {
                  const newPage = page - 1;
                  setPage(newPage);
                  fetchContacts(searchQuery, newPage);
                }}
                disabled={page === 1}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                Prev
              </button>
              <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
              <button
                onClick={() => {
                  const newPage = page + 1;
                  setPage(newPage);
                  fetchContacts(searchQuery, newPage);
                }}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Message Composer */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {selectionCount > 0 ? (
            <>
              {/* Selected Contact Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center gap-4 flex-shrink-0">
                <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center flex-shrink-0 text-lg font-semibold">
                  <UsersIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 text-lg">
                    {selectAllGlobal ? 'All Contacts Selected' : `${selectionCount} Contact${selectionCount !== 1 ? 's' : ''} Selected`}
                  </h2>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                    {selectAllGlobal ? `Sending to all ${totalCount} matching contacts` : `Sending to ${selectionCount} selected contacts`}
                  </p>
                </div>
              </div>

              {/* Message Composer Area */}
              <div className="flex-1 p-6 flex flex-col">
                <div className="mb-4 bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 border border-blue-100">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Bulk WhatsApp API Integration</p>
                    <p>Type your message below to send it to <strong>{selectionCount} selected contact{selectionCount !== 1 ? 's' : ''}</strong>. Ensure their phone numbers include the correct country code.</p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <label htmlFor="message" className="font-medium text-gray-700 text-sm">
                    Message Content
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your WhatsApp message here..."
                    className="flex-1 w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none transition-shadow text-gray-700"
                  />
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleSendMessage}
                    disabled={isSending || !message.trim()}
                    className="flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-medium transition-colors shadow-sm disabled:opacity-70"
                  >
                    {isSending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    {isSending ? 'Sending...' : 'Send via WhatsApp'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6 text-center">
              <MessageCircle className="w-16 h-16 mb-4 text-gray-200" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Contact Selected</h3>
              <p className="text-sm max-w-sm mx-auto">Select a contact from the list on the left to start composing a WhatsApp message.</p>
            </div>
          )}
        </div>
        
      </div>

      {/* Config Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-gray-150 shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary-500" />
                  WhatsApp Gateway Setup
                </h2>
                <button
                  onClick={() => setIsConfigModalOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Gateway Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Select Gateway API
                  </label>
                  <select
                    value={config.gateway}
                    onChange={(e) => setConfig({ ...config, gateway: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 text-sm px-3.5 py-2 rounded-xl outline-none text-gray-900 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="simulation">Console Simulator (Demo Mode)</option>
                    <option value="meta">Meta Cloud API (Official)</option>
                    <option value="twilio">Twilio Programmable WhatsApp</option>
                    <option value="custom">Custom Webhook / API Gateway</option>
                  </select>
                </div>

                {config.gateway === 'simulation' && (
                  <div className="p-3 bg-blue-50 text-blue-800 rounded-xl border border-blue-100 text-xs">
                    <p className="font-semibold mb-1">Demo Mode Active</p>
                    <p>In Simulation mode, outbound messages are not dispatched to real APIs. Instead, they are printed to the Django terminal log for testing purposes.</p>
                  </div>
                )}

                {config.gateway === 'meta' && (
                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Phone Number ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 10984920392019"
                        value={config.meta_phone_number_id}
                        onChange={(e) => setConfig({ ...config, meta_phone_number_id: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none text-gray-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Access Token (Permanent)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="EAABw..."
                        value={config.meta_access_token}
                        onChange={(e) => setConfig({ ...config, meta_access_token: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 resize-none"
                      />
                    </div>
                  </div>
                )}

                {config.gateway === 'twilio' && (
                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Account SID
                      </label>
                      <input
                        type="text"
                        placeholder="AC..."
                        value={config.twilio_account_sid}
                        onChange={(e) => setConfig({ ...config, twilio_account_sid: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none text-gray-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Auth Token
                      </label>
                      <input
                        type="password"
                        placeholder="Twilio Auth Token"
                        value={config.twilio_auth_token}
                        onChange={(e) => setConfig({ ...config, twilio_auth_token: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none text-gray-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Twilio WhatsApp Sender Phone
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. +14155238886"
                        value={config.twilio_sender_phone}
                        onChange={(e) => setConfig({ ...config, twilio_sender_phone: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none text-gray-900"
                      />
                    </div>
                  </div>
                )}

                {config.gateway === 'custom' && (
                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Custom API Endpoint URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://api.example.com/whatsapp/send"
                        value={config.custom_endpoint}
                        onChange={(e) => setConfig({ ...config, custom_endpoint: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none text-gray-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Custom Auth Token / API Key
                      </label>
                      <input
                        type="password"
                        placeholder="Bearer token or API Key"
                        value={config.custom_token}
                        onChange={(e) => setConfig({ ...config, custom_token: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none text-gray-900"
                      />
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-800 rounded-xl border border-blue-100 text-xs">
                      <p className="font-semibold mb-1">Payload Format Info</p>
                      <p>The gateway will POST a JSON payload: <code>{"{\"to\": \"<phone_number>\", \"message\": \"<message_content>\"}"}</code>. If an Auth Token is provided, it will be included in the request headers as <code>{"Authorization: Bearer <token>"}</code>.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setIsConfigModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveConfig}
                  disabled={isSavingConfig}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors disabled:opacity-75"
                >
                  {isSavingConfig ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    'Save Configuration'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple fallback icon
function UsersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
