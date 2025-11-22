"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { channelsAPI, dmsAPI } from '@/lib/api';
import { Hash, Edit2, Trash2, Users, Menu, X, Smile, UserPlus } from 'lucide-react';
import Image from 'next/image';
import InviteModal from '@/components/modals/InviteModal';
import ProfileModal from '@/components/modals/ProfileModal';

interface Message {
  message_id: string;
  content: string;
  timestamp: string;
  author: string;
  user: {
    username: string;
    avatar?: string;
    nickname?: string;
    banner?: string;
    about?: string;
  };
}

interface Channel {
  channel_id: string;
  name: string;
  owner_id: string;
  members: any[];
  onlineMembers?: any[];
  messages: Message[];
}

interface DmChannel {
  channel_id: string;
  user1: { user_id: string; username: string };
  user2: { user_id: string; username: string };
  user1_id: string;
  user2_id: string;
  dmMessages: Message[];
  onlineMembers?: any[];
  otherUser?: any;
}

export default function ChatArea({ activeChannel, activeType, showSidebar, setShowSidebar }: {
  activeChannel: string | null;
  activeType: 'channel' | 'dm';
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
}) {
  const { user } = useAuth();
  const socket = useSocket();
  const [channel, setChannel] = useState<Channel | DmChannel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showMembersSidebar, setShowMembersSidebar] = useState(true); 
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserChannelInfo, setSelectedUserChannelInfo] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadChannel = useCallback(async () => {
    if (!activeChannel) return;
    setLoading(true);
    try {
      let response;
      if (activeType === 'channel') {
        response = await channelsAPI.getById(activeChannel);
        setChannel(response.data);
        setMessages(response.data.messages || []);
      } else {
        response = await dmsAPI.getById(activeChannel);
        setChannel(response.data.dm);
        setMessages(response.data.dm.dmMessages || []);
      }
    } catch (error) {
      console.error('Failed to load channel:', error);
    } finally {
      setLoading(false);
    }
  }, [activeChannel, activeType]);

  useEffect(() => {
    if (activeChannel) {
      loadChannel();
      socket?.joinRoom(activeChannel);
    }

    return () => {
      if (activeChannel) {
        socket?.leaveRoom(activeChannel);
      }
    };
  }, [activeChannel, activeType, socket, loadChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket || !activeChannel) return;

    const handleNewMessage = (data: any) => {
      if (data.channel === activeChannel) {
        setMessages(prev => {
          if (prev.some(msg => msg.message_id === data.message_id)) {
            return prev;
          }
          return [...prev, {
            message_id: data.message_id,
            content: data.content,
            timestamp: data.timestamp,
            author: data.author,
            user: {
              username: data.username,
              avatar: data.avatar,
              nickname: data.nickname,
              banner: data.banner,
              about: data.about,
            }
          }];
        });
      }
    };

    const handleMessageEdit = (data: any) => {
      if (data.message_id) {
        setMessages(prev => prev.map(msg =>
          msg.message_id === data.message_id
            ? { ...msg, content: data.content }
            : msg
        ));
      }
    };

    const handleMessageDelete = (data: any) => {
      if (data.message_id) {
        setMessages(prev => prev.filter(msg => msg.message_id !== data.message_id));
      }
    };

    const handleUserTyping = (data: any) => {
      if (data.user_id !== user?.user_id) {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          if (data.isTyping) {
            newSet.add(data.username);
          } else {
            newSet.delete(data.username);
          }
          return newSet;
        });

        if (data.isTyping) {
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          typingTimeoutRef.current = setTimeout(() => {
            setTypingUsers(prev => {
              const newSet = new Set(prev);
              newSet.delete(data.username);
              return newSet;
            });
          }, 3000);
        }
      }
    };

    socket.onMessage(handleNewMessage);
    socket.onMessageEdit(handleMessageEdit);
    socket.onMessageDelete(handleMessageDelete);
    socket.onUserTyping(handleUserTyping);

    return () => {
      socket.offMessage(handleNewMessage);
      socket.offMessageEdit(handleMessageEdit);
      socket.offMessageDelete(handleMessageDelete);
      socket.offUserTyping(handleUserTyping);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [socket, activeChannel, user?.user_id]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChannel) return;

    try {
      if (activeType === 'channel') {
        await channelsAPI.sendMessage(activeChannel, { content: newMessage });
      } else {
        await dmsAPI.sendMessage(activeChannel, { content: newMessage });
      }
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleTyping = useCallback((isTyping: boolean) => {
    if (activeChannel) {
      socket?.sendTyping(activeChannel, isTyping);
    }
  }, [socket, activeChannel]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    handleTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      handleTyping(false);
    }, 1000);
  };

  const editMessage = async (messageId: string, content: string) => {
    if (!activeChannel || !content.trim()) return;

    try {
      if (activeType === 'channel') {
        await channelsAPI.editMessage(activeChannel, messageId, { content });
      } else {
        await dmsAPI.editMessage(activeChannel, messageId, { content });
      }
      setEditingMessage(null);
      setEditContent('');
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!activeChannel) return;

    try {
      if (activeType === 'channel') {
        await channelsAPI.deleteMessage(activeChannel, messageId);
      } else {
        await dmsAPI.deleteMessage(activeChannel, messageId);
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const confirmDelete = (messageId: string) => {
    setShowDeleteConfirm(messageId);
  };

  const executeDelete = async () => {
    if (showDeleteConfirm) {
      await deleteMessage(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const startEditing = (message: Message) => {
    setEditingMessage(message.message_id);
    setEditContent(message.content);
  };

  const cancelEditing = () => {
    setEditingMessage(null);
    setEditContent('');
  };

  const handleEditSubmit = (messageId: string) => {
    editMessage(messageId, editContent);
  };

  const handleInviteCreated = (inviteCode: string) => {
    console.log('Invite created:', inviteCode);
  };

  const openProfileModal = (userData: any, channelInfo?: any) => {
    setSelectedUserId(userData.user_id || userData);
    setSelectedUserChannelInfo(channelInfo);
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setSelectedUserId(null);
    setSelectedUserChannelInfo(null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getChannelName = () => {
    if (!channel) return 'Select a channel';
    if (activeType === 'channel') {
      return (channel as Channel).name || 'Unnamed Channel';
    } else {
      const dm = channel as DmChannel;
      const otherUser = dm.user1_id === user?.user_id ? dm.user2 : dm.user1;
      return otherUser?.username || 'any User';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(parseInt(timestamp));
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  if (!activeChannel) {
    return (
      <div className="flex-1 flex flex-col bg-discord-bg-primary h-full">
        <div className="h-12 bg-discord-bg-primary border-b border-discord-bg-tertiary flex items-center px-4 shadow-sm">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="md:hidden text-discord-text-muted hover:text-discord-text-header p-1 rounded cursor-pointer"
          >
            {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center text-discord-text-muted">
            <div className="text-6xl mb-4 grayscale opacity-50">💬</div>
            <h2 className="text-xl font-bold mb-2 text-discord-text-header">Welcome to Tenord</h2>
            <p>Select a channel or DM to start chatting</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex bg-discord-bg-primary h-full overflow-hidden">
      
      <div className="flex-1 flex flex-col min-w-0">
        
        <div className="h-12 bg-discord-bg-primary border-b border-discord-bg-tertiary flex items-center justify-between px-4 shadow-sm z-10">
          <div className="flex items-center min-w-0">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden mr-3 text-discord-text-muted hover:text-discord-text-header p-1 rounded cursor-pointer"
            >
              {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            {activeType === 'channel' ? (
              <Hash className="w-5 h-5 text-discord-text-muted mr-2 flex-shrink-0" />
            ) : (
              <div className="flex items-center min-w-0">
                
                <div className="w-6 h-6 rounded-full mr-2 relative bg-discord-bg-tertiary flex items-center justify-center overflow-hidden flex-shrink-0">
                  {(channel as DmChannel)?.otherUser?.avatar ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/cdn/avatar/${(channel as DmChannel)?.otherUser?.avatar}`}
                      alt="Avatar"
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-xs font-medium">
                      {(channel as DmChannel)?.otherUser?.username?.[0]?.toUpperCase() || 'U'}
                    </span>
                  )}
                  {(channel as DmChannel)?.onlineMembers?.some(
                    (online: any) => online.user_id === (channel as DmChannel)?.otherUser?.user_id
                  ) && (
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-discord-text-positive border-[2px] border-discord-bg-primary rounded-full" />
                    )}
                </div>
                <span className="text-discord-text-header font-bold text-base truncate">
                  {(channel as DmChannel)?.otherUser?.nickname || (channel as DmChannel)?.otherUser?.username}
                </span>
              </div>
            )}
            {activeType === 'channel' && (
              <span className="text-discord-text-header font-bold text-base truncate">
                {getChannelName()}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4 text-discord-text-muted">
            {activeType === 'channel' && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="p-1 rounded hover:bg-discord-bg-modifier-hover hover:text-discord-text-header"
              >
                <UserPlus className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setShowMembersSidebar(!showMembersSidebar)}
              className="p-1 rounded hover:bg-discord-bg-modifier-hover hover:text-discord-text-header"
            >
              <Users className="w-5 h-5" />
            </button>
          </div>
        </div>

        
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col px-4 pt-4">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-discord-brand"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex flex-col justify-end mb-6">
              <div className="w-16 h-16 bg-discord-bg-accent rounded-full flex items-center justify-center mb-4">
                <Hash className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-discord-text-header mb-2">Welcome to #{getChannelName()}!</h1>
              <p className="text-discord-text-muted">This is the start of the #{getChannelName()} channel.</p>
            </div>
          ) : (
            <div className="flex flex-col justify-end min-h-0">
              
              <div className="flex-1" />

              {messages.map((message, index) => {
                const prevMessage = messages[index - 1];
                const isSameAuthor = prevMessage && prevMessage.author === message.author;
                
                const isCompact = isSameAuthor;

                return (
                  <div
                    key={message.message_id}
                    className={`group relative flex pr-4 hover:bg-discord-bg-modifier-hover -mx-4 px-4 py-0.5 ${!isCompact ? 'mt-4' : ''}`}
                  >
                    {!isCompact ? (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mr-4 cursor-pointer overflow-hidden bg-discord-bg-tertiary mt-0.5"
                        onClick={() => openProfileModal(message.user)}
                      >
                        {message.user?.avatar ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/cdn/avatar/${message.user.avatar}`}
                            alt="Avatar"
                            width={40}
                            height={40}
                            className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                          />
                        ) : (
                          <span className="text-white text-sm font-medium">
                            {message.user?.username?.[0]?.toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="w-10 mr-4 text-[10px] text-discord-text-muted opacity-0 group-hover:opacity-100 text-right self-start mt-1 select-none">
                        {new Date(parseInt(message.timestamp)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      {!isCompact && (
                        <div className="flex items-center mb-1">
                          <span
                            className="text-discord-text-header font-medium hover:underline cursor-pointer mr-2"
                            onClick={() => openProfileModal(message.user)}
                          >
                            {message.user?.nickname || message.user?.username || 'any User'}
                          </span>
                          <span className="text-discord-text-muted text-xs">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      )}

                      {editingMessage === message.message_id ? (
                        <div className="bg-discord-bg-tertiary p-2 rounded w-full">
                          <input
                            type="text"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleEditSubmit(message.message_id);
                              } else if (e.key === 'Escape') {
                                cancelEditing();
                              }
                            }}
                            className="w-full bg-discord-bg-primary text-discord-text-normal p-2 rounded focus:outline-none"
                            autoFocus
                          />
                          <div className="text-xs text-discord-text-muted mt-1">
                            escape to cancel • enter to save
                          </div>
                        </div>
                      ) : (
                        <p className={`text-discord-text-normal whitespace-pre-wrap break-words leading-[1.375rem] ${isCompact ? '' : ''}`}>
                          {message.content}
                        </p>
                      )}
                    </div>

                    
                    <div className="opacity-0 group-hover:opacity-100 absolute right-4 -mt-2 bg-discord-bg-primary border border-discord-bg-tertiary rounded shadow-sm flex items-center p-1 transition-opacity z-10">
                      <button className="p-1 hover:bg-discord-bg-modifier-hover rounded text-discord-text-muted hover:text-discord-text-normal cursor-pointer">
                        <Smile className="w-4 h-4" />
                      </button>
                      {message.author === user?.user_id && (
                        <>
                          <button
                            onClick={() => startEditing(message)}
                            className="p-1 hover:bg-discord-bg-modifier-hover rounded text-discord-text-muted hover:text-discord-text-normal cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(message.message_id)}
                            className="p-1 hover:bg-discord-bg-modifier-hover rounded text-discord-text-danger cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        
        <div className="px-4 pb-6 bg-discord-bg-primary">
          <div className="bg-discord-bg-tertiary rounded-lg px-4 py-2.5 flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={`Message #${getChannelName()}`}
              className="flex-1 bg-transparent text-discord-text-normal placeholder-discord-text-muted focus:outline-none"
            />
            <div className="flex items-center space-x-3 ml-3 text-discord-text-muted">
              <Smile className="w-6 h-6 hover:text-discord-text-header cursor-pointer" />
            </div>
          </div>

          
          <div className="h-6 mt-1 px-2 text-xs font-bold text-discord-text-muted animate-pulse">
            {typingUsers.size > 0 && (
              <span>
                {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
              </span>
            )}
          </div>
        </div>
      </div>

      
      {showMembersSidebar && (
        <div className="w-60 bg-discord-bg-secondary flex flex-col min-w-0 border-l border-discord-bg-tertiary hidden md:flex">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
            {activeType === 'channel' ? (
              <>
                
                {((channel as Channel)?.onlineMembers?.length || 0) > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xs font-bold text-discord-text-muted uppercase mb-2 px-2">
                      Online — {(channel as Channel)?.onlineMembers?.length || 0}
                    </h3>
                    {(channel as Channel)?.onlineMembers?.map((member: any) => (
                      <div
                        key={member.user_id}
                        className="flex items-center px-2 py-1.5 rounded hover:bg-discord-bg-modifier-hover cursor-pointer opacity-100"
                        onClick={() => openProfileModal(member, { isOnline: true })}
                      >
                        <div className="w-8 h-8 rounded-full mr-3 relative bg-discord-bg-tertiary flex items-center justify-center overflow-hidden">
                          {member.avatar ? (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/cdn/avatar/${member.avatar}`}
                              alt="Avatar"
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-xs font-medium">
                              {member.username?.[0]?.toUpperCase() || 'U'}
                            </span>
                          )}
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-discord-text-positive border-[3px] border-discord-bg-secondary rounded-full" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-discord-text-header font-medium truncate text-sm">
                            {member.nickname || member.username}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-discord-text-muted uppercase mb-2 px-2">
                    Offline — {((channel as Channel)?.members?.length || 0) - ((channel as Channel)?.onlineMembers?.length || 0)}
                  </h3>
                  {(channel as Channel)?.members
                    ?.filter(member => !(channel as Channel).onlineMembers?.some((online: any) => online.user_id === member.user_id))
                    .map((member: any) => (
                      <div
                        key={member.user_id}
                        className="flex items-center px-2 py-1.5 rounded hover:bg-discord-bg-modifier-hover cursor-pointer opacity-50 hover:opacity-100"
                        onClick={() => openProfileModal(member, { isOnline: false })}
                      >
                        <div className="w-8 h-8 rounded-full mr-3 bg-discord-bg-tertiary flex items-center justify-center overflow-hidden">
                          {member.avatar ? (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/cdn/avatar/${member.avatar}`}
                              alt="Avatar"
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-xs font-medium">
                              {member.username?.[0]?.toUpperCase() || 'U'}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-discord-text-header font-medium truncate text-sm">
                            {member.nickname || member.username}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              
              <div className="mb-6">
                <h3 className="text-xs font-bold text-discord-text-muted uppercase mb-2 px-2">
                  Members
                </h3>
                {channel && [
                  (channel as DmChannel).user1_id === user?.user_id ? (channel as DmChannel).user2 : (channel as DmChannel).user1,
                  (channel as DmChannel).user1_id === user?.user_id ? (channel as DmChannel).user1 : (channel as DmChannel).user2
                ].map((member: any) => {
                  const isOnline = (channel as DmChannel)?.onlineMembers?.some((online: any) => online.user_id === member.user_id);
                  return (
                    <div
                      key={member.user_id}
                      className={`flex items-center px-2 py-1.5 rounded hover:bg-discord-bg-modifier-hover cursor-pointer ${isOnline ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
                      onClick={() => openProfileModal(member, { isOnline })}
                    >
                      <div className="w-8 h-8 rounded-full mr-3 relative bg-discord-bg-tertiary flex items-center justify-center overflow-hidden">
                        {member.avatar ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/cdn/avatar/${member.avatar}`}
                            alt="Avatar"
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-xs font-medium">
                            {member.username?.[0]?.toUpperCase() || 'U'}
                          </span>
                        )}
                        {isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-discord-text-positive border-[3px] border-discord-bg-secondary rounded-full" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-discord-text-header font-medium truncate text-sm">
                          {member.nickname || member.username}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      
      {activeType === 'channel' && channel && (
        <InviteModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          channelId={activeChannel}
          channelName={(channel as Channel).name || 'Unnamed Channel'}
          onInviteCreated={handleInviteCreated}
        />
      )}

      
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-discord-bg-primary rounded-md p-4 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-discord-text-header text-lg font-bold mb-2">Delete Message</h3>
            <p className="text-discord-text-normal text-sm mb-6">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2 bg-discord-bg-secondary -mx-4 -mb-4 p-4 rounded-b-md">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded text-sm font-medium text-white hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="bg-discord-text-danger hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      
      <ProfileModal
        isOpen={showProfileModal}
        onClose={closeProfileModal}
        userId={selectedUserId || ''}
        channelInfo={selectedUserChannelInfo}
      />
    </div>
  );
}