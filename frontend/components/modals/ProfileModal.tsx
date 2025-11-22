"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Crown, Shield, User, MessageCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usersAPI } from '@/lib/api';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  channelInfo?: {
    isOwner: boolean;
    isOnline: boolean;
    joinedAt?: string;
    roles?: string[];
  };
}

interface UserProfile {
  user_id: string;
  username: string;
  nickname?: string;
  avatar?: string;
  banner?: string;
  about?: string;
  created_at?: string;
}

export default function ProfileModal({ isOpen, onClose, userId, channelInfo }: ProfileModalProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserProfile();
    } else if (!isOpen) {
      setUser(null);
      setError(null);
    }
  }, [isOpen, userId]);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersAPI.getProfile(userId);
      setUser(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load profile');
      console.error('Failed to fetch user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp?: string) => {
    if (!timestamp) return 'Unknown';
    try {
      
      const numTimestamp = parseInt(timestamp);
      if (numTimestamp > 1000000000000) { 
        return new Date(numTimestamp).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } else { 
        
        const snowflakeTimestamp = Math.floor(numTimestamp / 4194304) + 1420070400000;
        return new Date(snowflakeTimestamp).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    } catch {
      return 'Unknown';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-lg w-full max-w-sm z-50 border border-gray-700 overflow-hidden"
          >
            
            {loading && (
              <div className="p-8 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                <p className="text-gray-300">Loading profile...</p>
              </div>
            )}

            
            {error && !loading && (
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Error</h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-red-400 mb-4">{error}</p>
                  <button
                    onClick={fetchUserProfile}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            
            {user && !loading && !error && (
              <>
                
                {user.banner && (
                  <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
                    <img
                      src={`http://localhost:8080/cdn/banner/${user.banner}`}
                      alt="Banner"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">User Profile</h2>
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 relative overflow-hidden">
                      {user.avatar ? (
                        <img
                          src={`http://localhost:8080/cdn/avatar/${user.avatar}`}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<span class="text-white text-2xl font-bold">${user.username?.[0]?.toUpperCase() || 'U'}</span>`;
                            }
                          }}
                        />
                      ) : (
                        <span className="text-white text-2xl font-bold">
                          {user.username?.[0]?.toUpperCase() || 'U'}
                        </span>
                      )}
                      {channelInfo?.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-gray-800 rounded-full" />
                      )}
                    </div>

                    <div className="text-center">
                      <h3 className="text-white text-lg font-semibold mb-1">
                        {user.nickname || user.username}
                      </h3>
                      {user.nickname && (
                        <p className="text-gray-400 text-sm">{user.username}</p>
                      )}
                    </div>
                  </div>

                  
                  <div className="space-y-4">
                    
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${channelInfo?.isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
                      <span className="text-gray-300 text-sm">
                        {channelInfo?.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>

                    
                    {channelInfo?.roles && channelInfo.roles.length > 0 && (
                      <div className="flex items-start space-x-3">
                        <Shield className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-300 text-sm font-medium mb-1">Roles</p>
                          <div className="flex flex-wrap gap-1">
                            {channelInfo.roles.map((role, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-md"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    
                    {channelInfo?.isOwner && (
                      <div className="flex items-center space-x-3">
                        <Crown className="w-4 h-4 text-yellow-500" />
                        <span className="text-yellow-500 text-sm font-medium">Channel Owner</span>
                      </div>
                    )}

                    
                    {channelInfo?.joinedAt && (
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-gray-300 text-sm">Joined {formatDate(channelInfo.joinedAt)}</p>
                        </div>
                      </div>
                    )}

                    
                    {user.about && (
                      <div className="flex items-start space-x-3">
                        <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-300 text-sm font-medium mb-1">About</p>
                          <p className="text-gray-300 text-sm leading-relaxed">{user.about}</p>
                        </div>
                      </div>
                    )}

                    
                    {user.created_at && (
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-gray-300 text-sm">Member since {formatDate(user.created_at)}</p>
                        </div>
                      </div>
                    )}

                    
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-400 text-xs">User ID: {user.user_id}</p>
                      </div>
                    </div>
                  </div>

                  
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <button
                      onClick={onClose}
                      className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}