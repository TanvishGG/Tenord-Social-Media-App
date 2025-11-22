"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Hash } from 'lucide-react';
import { channelsAPI } from '@/lib/api';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChannelCreated: () => void;
}

export default function CreateChannelModal({ isOpen, onClose, onChannelCreated }: CreateChannelModalProps) {
  const [channelName, setChannelName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName.trim()) return;

    setLoading(true);
    setError('');

    try {
      await channelsAPI.create({ name: channelName.trim() });
      setChannelName('');
      onChannelCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create channel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50"
            onClick={onClose}
          />

          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-discord-bg-primary rounded-md p-6 w-full max-w-md z-50 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-discord-text-header">Create Channel</h2>
              <button
                onClick={onClose}
                className="text-discord-text-muted hover:text-discord-text-header transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">
                  Channel Name
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-discord-text-muted" />
                  <input
                    type="text"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-discord-bg-tertiary border-none rounded text-discord-text-normal placeholder-discord-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter channel name"
                    maxLength={100}
                    required
                  />
                </div>
                <p className="text-xs text-discord-text-muted mt-1">
                  Channels are where your team communicates. They're best organized around a topic.
                </p>
              </div>

              {error && (
                <div className="mb-4 text-discord-text-danger text-sm text-center bg-discord-text-danger/10 border border-discord-text-danger/20 rounded p-3">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-discord-text-normal hover:underline transition-colors cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !channelName.trim()}
                  className="px-4 py-2 bg-discord-brand hover:bg-discord-brand-hover disabled:bg-discord-brand/50 text-white rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 cursor-pointer font-medium text-sm"
                >
                  {loading ? 'Creating...' : 'Create Channel'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}