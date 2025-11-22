"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { accountAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import { LogOut, X, User, Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

export default function AccountPage() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'account' | 'profile'>('account');

  const [formData, setFormData] = useState({
    username: '',
    nickname: '',
    about: '',
    avatar: '',
    banner: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [originalData, setOriginalData] = useState({
    username: '',
    nickname: '',
    about: '',
    avatar: '',
    banner: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [message, setMessage] = useState('');
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user) {
      const initialData = {
        username: user.username,
        nickname: user.nickname || '',
        about: user.about || '',
        avatar: user.avatar || '',
        banner: user.banner || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      };
      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [user, isAuthenticated, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          setMessage('Current password is required to change password');
          setSaving(false);
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          setMessage('New passwords do not match');
          setSaving(false);
          return;
        }
        if (formData.newPassword.length < 8 || formData.newPassword.length > 16) {
          setMessage('Password must be 8-16 characters long');
          setSaving(false);
          return;
        }

        await accountAPI.resetPassword({
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword
        });
        setMessage('Password updated successfully!');

        
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        setOriginalData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        setSaving(false);
        return;
      }

      
      if (formData.email !== originalData.email && formData.email) {
        if (!formData.currentPassword) {
          setMessage('Current password is required to change email');
          setSaving(false);
          return;
        }

        await accountAPI.changeEmail({
          newEmail: formData.email,
          password: formData.currentPassword
        });
        setMessage('Email change verification sent! Please check your email.');

        
        setFormData(prev => ({
          ...prev,
          currentPassword: ''
        }));
        setOriginalData(prev => ({
          ...prev,
          currentPassword: ''
        }));
        setSaving(false);
        return;
      }

      
      const changedFields: Record<string, string> = {};

      Object.keys(formData).forEach(key => {
        
        if (['currentPassword', 'newPassword', 'confirmPassword', 'email'].includes(key)) return;

        if (formData[key as keyof typeof formData] !== originalData[key as keyof typeof originalData]) {
          changedFields[key] = formData[key as keyof typeof formData];
        }
      });

      if (Object.keys(changedFields).length === 0) {
        setMessage('No changes to save');
        setSaving(false);
        return;
      }

      await accountAPI.updateProfile(changedFields);

      
      setOriginalData({ ...formData });

      setMessage('Profile updated successfully!');
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.error || 'Failed to update profile');
      } else {
        setMessage('Failed to update profile');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    
    if (!file.type.startsWith('image/')) {
      setMessage('Please select a valid image file');
      return;
    }

    
    if (file.size > 6 * 1024 * 1024) {
      setMessage('File size must be less than 6MB');
      return;
    }

    setUploadingAvatar(true);
    setMessage('');

    try {
      
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setFormData(prev => ({ ...prev, avatar: base64 }));
      setMessage('Avatar selected successfully!');
    } catch {
      setMessage('Failed to process avatar file');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    
    if (!file.type.startsWith('image/')) {
      setMessage('Please select a valid image file');
      return;
    }

    
    if (file.size > 6 * 1024 * 1024) {
      setMessage('File size must be less than 6MB');
      return;
    }

    setUploadingBanner(true);
    setMessage('');

    try {
      
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setFormData(prev => ({ ...prev, banner: base64 }));
      setMessage('Banner selected successfully!');
    } catch {
      setMessage('Failed to process banner file');
    } finally {
      setUploadingBanner(false);
    }
  };

  const removeAvatar = () => {
    setFormData(prev => ({ ...prev, avatar: '' }));
  };

  const removeBanner = () => {
    setFormData(prev => ({ ...prev, banner: '' }));
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-discord-bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-discord-brand"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-discord-bg-primary flex overflow-hidden">
      
      <div className="w-60 bg-discord-bg-secondary flex flex-col border-r border-discord-bg-tertiary pt-10 px-2">
        <h2 className="text-xs font-bold text-discord-text-muted uppercase mb-2 px-2">User Settings</h2>
        <button
          onClick={() => setActiveTab('account')}
          className={`flex items-center px-2 py-1.5 rounded mb-1 text-left ${activeTab === 'account' ? 'bg-discord-bg-modifier-selected text-discord-text-header' : 'text-discord-text-muted hover:bg-discord-bg-modifier-hover hover:text-discord-text-normal'}`}
        >
          <Shield className="w-4 h-4 mr-2" />
          My Account
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center px-2 py-1.5 rounded mb-1 text-left ${activeTab === 'profile' ? 'bg-discord-bg-modifier-selected text-discord-text-header' : 'text-discord-text-muted hover:bg-discord-bg-modifier-hover hover:text-discord-text-normal'}`}
        >
          <User className="w-4 h-4 mr-2" />
          Profiles
        </button>

        <div className="my-2 border-b border-discord-bg-tertiary"></div>

        <button
          onClick={handleLogout}
          className="flex items-center px-2 py-1.5 rounded text-discord-text-danger hover:bg-discord-bg-modifier-hover text-left"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </button>
      </div>

      
      <div className="flex-1 flex flex-col min-w-0 bg-discord-bg-primary">
        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-discord-text-header">
                {activeTab === 'account' ? 'My Account' : 'Profiles'}
              </h1>
              <Link href="/app">
                <button className="w-8 h-8 rounded-full border border-discord-text-muted flex items-center justify-center text-discord-text-muted hover:text-discord-text-header transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === 'account' && (
                <div className="space-y-8">
                  
                  <div className="bg-discord-bg-secondary rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-20 h-20 rounded-full bg-discord-bg-tertiary mr-4 overflow-hidden">
                          {formData.avatar ? (
                            <Image src={formData.avatar.startsWith('data:') ? formData.avatar : `${process.env.NEXT_PUBLIC_API_BASE_URL}/cdn/avatar/${formData.avatar}`} alt="Avatar" className="w-full h-full object-cover" width={80} height={80} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                              {user?.username?.[0]?.toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="text-xl font-bold text-discord-text-header">
                          {formData.username}
                          <span className="text-discord-text-muted text-sm font-normal ml-1">#{user?.user_id?.substring(0, 4)}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('profile')}
                        className="bg-discord-brand hover:bg-discord-brand-hover text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                      >
                        Edit User Profile
                      </button>
                    </div>

                    <div className="bg-discord-bg-tertiary rounded p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <label className="text-xs font-bold text-discord-text-muted uppercase">Username</label>
                          <div className="text-discord-text-normal">{formData.username}</div>
                        </div>
                        <button type="button" className="text-discord-bg-tertiary cursor-default">Edit</button> 
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <label className="text-xs font-bold text-discord-text-muted uppercase">Email</label>
                          <div className="text-discord-text-normal">{formData.email}</div>
                        </div>
                        <div className="flex-1 ml-4">
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-discord-bg-primary border-none rounded px-2 py-1 text-discord-text-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  
                  <div>
                    <h2 className="text-lg font-bold text-discord-text-header mb-4">Password and Authentication</h2>
                    <div className="space-y-4">
                      <button
                        type="button"
                        className="bg-discord-brand hover:bg-discord-brand-hover text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                        onClick={() => document.getElementById('password-section')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        Change Password
                      </button>

                      <div id="password-section" className="bg-discord-bg-secondary rounded-lg p-4 space-y-4 mt-4">
                        <div>
                          <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">Current Password</label>
                          <input
                            type="password"
                            value={formData.currentPassword}
                            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                            className="w-full px-3 py-2 bg-discord-bg-tertiary border-none rounded text-discord-text-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">New Password</label>
                          <input
                            type="password"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            className="w-full px-3 py-2 bg-discord-bg-tertiary border-none rounded text-discord-text-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full px-3 py-2 bg-discord-bg-tertiary border-none rounded text-discord-text-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="flex space-x-8">
                    <div className="flex-1 space-y-6">
                      
                      <div>
                        <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">Display Name</label>
                        <input
                          type="text"
                          value={formData.nickname}
                          onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                          className="w-full px-3 py-2 bg-discord-bg-tertiary border-none rounded text-discord-text-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={formData.username}
                        />
                      </div>

                      
                      <div>
                        <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">About Me</label>
                        <textarea
                          value={formData.about}
                          onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                          className="w-full px-3 py-2 bg-discord-bg-tertiary border-none rounded text-discord-text-normal focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
                          placeholder="Tell us about yourself"
                        />
                      </div>

                      
                      <div>
                        <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">Avatar</label>
                        <div className="flex items-center space-x-4">
                          <button
                            type="button"
                            onClick={() => avatarInputRef.current?.click()}
                            disabled={uploadingAvatar}
                            className="bg-discord-brand hover:bg-discord-brand-hover disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                          >
                            {uploadingAvatar ? 'Uploading...' : 'Change Avatar'}
                          </button>
                          <button
                            type="button"
                            onClick={removeAvatar}
                            className="text-discord-text-normal hover:underline text-sm"
                          >
                            Remove Avatar
                          </button>
                          <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                        </div>
                      </div>

                      
                      <div>
                        <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">Banner</label>
                        <div className="flex items-center space-x-4">
                          <button
                            type="button"
                            onClick={() => bannerInputRef.current?.click()}
                            disabled={uploadingBanner}
                            className="bg-discord-brand hover:bg-discord-brand-hover disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                          >
                            {uploadingBanner ? 'Uploading...' : 'Change Banner'}
                          </button>
                          <button
                            type="button"
                            onClick={removeBanner}
                            className="text-discord-text-normal hover:underline text-sm"
                          >
                            Remove Banner
                          </button>
                          <input
                            ref={bannerInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleBannerUpload}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>

                    
                    <div className="w-80">
                      <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2">Preview</label>
                      <div className="bg-discord-bg-floating rounded-lg overflow-hidden shadow-lg w-full relative group">
                        
                        <div className="h-28 bg-discord-bg-tertiary relative">
                          {formData.banner && (
                            <Image src={formData.banner.startsWith('data:') ? formData.banner : `${process.env.NEXT_PUBLIC_API_BASE_URL}/cdn/banner/${formData.banner}`} alt="Banner" className="w-full h-full object-cover" width={320} height={112} />
                          )}
                        </div>

                        
                        <div className="absolute top-16 left-4">
                          <div className="w-20 h-20 rounded-full bg-discord-bg-primary p-1.5">
                            <div className="w-full h-full rounded-full bg-discord-bg-tertiary overflow-hidden flex items-center justify-center">
                              {formData.avatar ? (
                                <Image src={formData.avatar.startsWith('data:') ? formData.avatar : `${process.env.NEXT_PUBLIC_API_BASE_URL}/cdn/avatar/${formData.avatar}`} alt="Avatar preview" className="w-full h-full object-cover" width={80} height={80} />
                              ) : (
                                <span className="text-white text-2xl font-bold">{formData.username?.[0]?.toUpperCase()}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        
                        <div className="pt-12 pb-4 px-4 bg-discord-bg-floating">
                          <div className="text-lg font-bold text-discord-text-header">{formData.nickname || formData.username}</div>
                          <div className="text-discord-text-header text-sm font-medium">{formData.username}</div>

                          <div className="mt-3 border-t border-discord-bg-modifier-accent pt-3">
                            <div className="text-xs font-bold text-discord-text-header uppercase mb-1">About Me</div>
                            <div className="text-sm text-discord-text-normal whitespace-pre-wrap">{formData.about || '...'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {message && (
                <div className={`text-sm text-center p-3 rounded-lg ${message.includes('successfully') || message.includes('verification')
                  ? 'text-discord-text-positive bg-discord-text-positive/10 border border-discord-text-positive/20'
                  : 'text-discord-text-danger bg-discord-text-danger/10 border border-discord-text-danger/20'
                  }`}>
                  {message}
                </div>
              )}

              
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-discord-bg-tertiary px-4 py-3 rounded-lg shadow-2xl flex items-center space-x-4 z-50"
              >
                <span className="text-discord-text-header font-medium">Careful — you have unsaved changes!</span>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(originalData);
                    setMessage('');
                  }}
                  className="text-discord-text-normal hover:underline px-4 py-2 rounded"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-discord-text-positive hover:bg-green-600 text-white px-6 py-2 rounded font-medium transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </motion.div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}