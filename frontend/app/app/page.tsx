"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/app/Sidebar';
import ChatArea from '@/components/app/ChatArea';

export default function AppPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'channel' | 'dm'>('channel');
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-900 overflow-hidden">
      
      <div
        id="sidebar"
        className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 fixed md:relative z-40 h-full transition-transform duration-300 ease-in-out`}
      >
        <Sidebar
          activeChannel={activeChannel}
          setActiveChannel={setActiveChannel}
          activeType={activeType}
          setActiveType={setActiveType}
          onChannelSelect={() => setShowSidebar(false)}
        />
      </div>

      
      {showSidebar && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30" />
      )}

      
      <div className="flex-1 md:flex-1 overflow-hidden h-full">
        <ChatArea
          activeChannel={activeChannel}
          activeType={activeType}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />
      </div>
    </div>
  );
}