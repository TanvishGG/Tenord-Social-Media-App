"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { channelsAPI, dmsAPI } from '@/lib/api';
import { Hash, Plus, Settings, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import CreateChannelModal from '@/components/modals/CreateChannelModal';
import CreateDMModal from '@/components/modals/CreateDMModal';

interface Channel {
  channel_id: string;
  name: string;
  owner_id: string;
  onlineMembers?: any[];
}

interface DmChannel {
  channel_id: string;
  user1_id: string;
  user2_id: string;
  user1: { user_id: string; username: string; avatar?: string; nickname?: string };
  user2: { user_id: string; username: string; avatar?: string; nickname?: string };
  onlineMembers?: any[];
}

export default function Sidebar({ activeChannel, setActiveChannel, activeType, setActiveType, onChannelSelect }: {
  activeChannel: string | null;
  setActiveChannel: (id: string) => void;
  activeType: 'channel' | 'dm';
  setActiveType: (type: 'channel' | 'dm') => void;
  onChannelSelect?: () => void;
}) {
  const { user } = useAuth();
  const socket = useSocket();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [dms, setDms] = useState<DmChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showCreateDMModal, setShowCreateDMModal] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  
  useEffect(() => {
    if (!socket) return;

    const handleUserOnline = (data: any) => {
      setOnlineUsers(prev => new Set(prev).add(data.user_id));
    };

    const handleUserOffline = (data: any) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.user_id);
        return newSet;
      });
    };

    socket.onUserOnline(handleUserOnline);
    socket.onUserOffline(handleUserOffline);

    return () => {
      socket.offUserOnline(handleUserOnline);
      socket.offUserOffline(handleUserOffline);
    };
  }, [socket]);

  const loadData = async () => {
    try {
      const [channelsRes, dmsRes] = await Promise.all([
        channelsAPI.getAll(),
        dmsAPI.getUserDms()
      ]);

      const channelsData = Array.isArray(channelsRes.data) ? channelsRes.data : [];
      const dmsData = Array.isArray(dmsRes.data?.dms) ? dmsRes.data.dms : [];

      const processedChannels = channelsData
        .filter((channel: any) => channel && typeof channel === 'object' && channel.channel_id)
        .map((channel: Channel) => ({
          ...channel,
          onlineMembers: channel.onlineMembers || []
        }));

      const processedDms = dmsData
        .filter((dm: any) => dm && typeof dm === 'object' && dm.channel_id)
        .map((dm: DmChannel) => ({
          ...dm,
          onlineMembers: dm.onlineMembers || []
        }));

      setChannels(processedChannels);
      setDms(processedDms);
    } catch (error) {
      console.error('Failed to load sidebar data:', error);
      setChannels([]);
      setDms([]);
    } finally {
      setLoading(false);
    }
  };

  const getDmDisplayName = (dm: DmChannel) => {
    const otherUser = dm.user1_id === user?.user_id ? dm.user2 : dm.user1;
    return otherUser?.nickname || otherUser?.username || 'any User';
  };

  const getDmAvatar = (dm: DmChannel) => {
    const otherUser = dm.user1_id === user?.user_id ? dm.user2 : dm.user1;
    return otherUser?.avatar;
  };

  const isDmOnline = (dm: DmChannel) => {
    const otherUser = dm.user1_id === user?.user_id ? dm.user2 : dm.user1;
    return otherUser && onlineUsers.has(otherUser.user_id);
  };

  return (
    <div className="w-full md:w-60 bg-discord-bg-secondary h-full flex flex-col">
      
      <div className="h-12 px-4 flex items-center justify-between shadow-sm hover:bg-discord-bg-accent/40 transition-colors cursor-pointer border-b border-discord-bg-tertiary">
        <h2 className="text-discord-text-header font-bold truncate">Tenord Community</h2>
        <ChevronDown className="w-4 h-4 text-discord-text-header" />
      </div>

      
      <div className="flex-1 overflow-y-auto custom-scrollbar pt-3">
        
        <div className="px-2 mb-4">
          <div className="flex items-center justify-between px-2 mb-1 group">
            <h3 className="text-xs font-bold text-discord-text-muted uppercase hover:text-discord-text-header cursor-pointer transition-colors">
              Text Channels
            </h3>
            <Plus
              className="w-4 h-4 text-discord-text-muted hover:text-discord-text-header cursor-pointer"
              onClick={() => setShowCreateChannelModal(true)}
            />
          </div>

          <div className="space-y-[2px]">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-8 bg-discord-bg-tertiary/50 rounded animate-pulse mx-2" />
              ))
            ) : (
              channels.map((channel) => (
                <div
                  key={channel.channel_id}
                  onClick={() => {
                    setActiveChannel(channel.channel_id);
                    setActiveType('channel');
                    onChannelSelect?.();
                  }}
                  className={`flex items-center px-2 py-[6px] rounded-[4px] cursor-pointer group transition-colors ${activeChannel === channel.channel_id && activeType === 'channel'
                      ? 'bg-discord-bg-modifier-selected text-discord-text-header'
                      : 'text-discord-text-muted hover:bg-discord-bg-modifier-hover hover:text-discord-text-header'
                    }`}
                >
                  <Hash className="w-5 h-5 mr-1.5 text-gray-400" />
                  <span className="font-medium truncate flex-1">{typeof channel.name === 'string' ? channel.name : 'unnamed-channel'}</span>
                </div>
              ))
            )}
          </div>
        </div>

        
        <div className="px-2">
          <div className="flex items-center justify-between px-2 mb-1 group">
            <h3 className="text-xs font-bold text-discord-text-muted uppercase hover:text-discord-text-header cursor-pointer transition-colors">
              Direct Messages
            </h3>
            <Plus
              className="w-4 h-4 text-discord-text-muted hover:text-discord-text-header cursor-pointer"
              onClick={() => setShowCreateDMModal(true)}
            />
          </div>

          <div className="space-y-[2px]">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-discord-bg-tertiary/50 rounded animate-pulse mx-2" />
              ))
            ) : (
              dms.map((dm) => {
                const avatar = getDmAvatar(dm);
                const isOnline = isDmOnline(dm);

                return (
                  <div
                    key={dm.channel_id}
                    onClick={() => {
                      setActiveChannel(dm.channel_id);
                      setActiveType('dm');
                      onChannelSelect?.();
                    }}
                    className={`flex items-center px-2 py-[6px] rounded-[4px] cursor-pointer group transition-colors ${activeChannel === dm.channel_id && activeType === 'dm'
                        ? 'bg-discord-bg-modifier-selected text-discord-text-header'
                        : 'text-discord-text-muted hover:bg-discord-bg-modifier-hover hover:text-discord-text-header'
                      }`}
                  >
                    <div className="w-8 h-8 rounded-full mr-3 relative flex-shrink-0 bg-discord-bg-tertiary flex items-center justify-center overflow-hidden">
                      {avatar ? (
                        <Image
                          src={`http://localhost:8080/cdn/avatar/${avatar}`}
                          alt="Avatar"
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-medium">{getDmDisplayName(dm)[0].toUpperCase()}</span>
                      )}
                      {isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-discord-text-positive border-[3px] border-discord-bg-secondary rounded-full" />
                      )}
                    </div>
                    <span className="font-medium truncate flex-1">{getDmDisplayName(dm)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      
      <div className="bg-discord-bg-tertiary px-2 py-1.5 flex items-center">
        <Link href="/account" className="flex items-center hover:bg-discord-bg-modifier-hover rounded pl-0.5 pr-2 py-1 mr-auto group cursor-pointer min-w-0">
          <div className="w-8 h-8 rounded-full bg-discord-brand flex items-center justify-center mr-2 relative flex-shrink-0 overflow-hidden">
            {user?.avatar ? (
              <Image
                src={`http://localhost:8080/cdn/avatar/${user.avatar}`}
                alt="Me"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-xs font-medium">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </span>
            )}
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-discord-text-positive border-[2px] border-discord-bg-tertiary rounded-full" />
          </div>
          <div className="min-w-0">
            <div className="text-discord-text-header text-sm font-semibold truncate leading-tight">
              {user?.nickname || user?.username}
            </div>
          </div>
        </Link>

        <div className="flex items-center">
          <Link href="/account">
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-discord-bg-modifier-hover text-discord-text-normal cursor-pointer">
              <Settings className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>

      <CreateChannelModal
        isOpen={showCreateChannelModal}
        onClose={() => setShowCreateChannelModal(false)}
        onChannelCreated={loadData}
      />

      <CreateDMModal
        isOpen={showCreateDMModal}
        onClose={() => setShowCreateDMModal(false)}
        onDmCreated={loadData}
      />
    </div>
  );
}