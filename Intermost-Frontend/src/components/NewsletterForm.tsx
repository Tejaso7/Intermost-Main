'use client';

import React, { useState } from 'react';
import SubscriptionModal from '@/components/ui/SubscriptionModal';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg focus:ring-2 focus:ring-white/50 border-0 outline-none text-gray-900 placeholder-gray-500"
          required
        />
        <button
          type="submit"
          className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
        >
          Subscribe
        </button>
      </form>
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialEmail={email}
      />
    </>
  );
}
