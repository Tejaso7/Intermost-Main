'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MessagesPageRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/leads');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
    </div>
  );
}
