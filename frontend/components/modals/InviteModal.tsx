"use client";

import { useState, useEffect, useCallback } from 'react';
import { invitesAPI } from '../../lib/api';
import { X, Copy, Check, Crown, Trash2 } from 'lucide-react';
import axios from 'axios';

interface InviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    channelId: string;
    channelName: string;
    onInviteCreated: (inviteCode: string) => void;
}

export default function InviteModal({
    isOpen,
    onClose,
    channelId,
    channelName,
    onInviteCreated
}: InviteModalProps) {
    const [loading, setLoading] = useState(false);
    const [inviteCode, setInviteCode] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [existingInvites, setExistingInvites] = useState<any[]>([]);
    const [loadingInvites, setLoadingInvites] = useState(false);

    const fetchExistingInvites = useCallback(async () => {
        setLoadingInvites(true);
        try {
            const response = await invitesAPI.getChannelInvites(channelId);
            setExistingInvites(response.data.invites || []);
        } catch (error) {
            console.error('Failed to fetch existing invites:', error);
        } finally {
            setLoadingInvites(false);
        }
    }, [channelId]);

    useEffect(() => {
        if (isOpen) {
            fetchExistingInvites();
        }
    }, [isOpen, channelId, fetchExistingInvites]);

    const deleteInvite = async (inviteId: string) => {
        try {
            await invitesAPI.delete(inviteId);
            setExistingInvites(prev => prev.filter(invite => invite.invite_id !== inviteId));
        } catch (error) {
            console.error('Failed to delete invite:', error);
        }
    };

    const createInvite = async () => {
        setLoading(true);
        try {
            const response = await invitesAPI.create(channelId);
            if (response && response.data) {
                const code = response.data.invite_code;
                setInviteCode(code);
                onInviteCreated(code);
                
                fetchExistingInvites();
            } else {
                console.error('Failed to create invite: invalid response');
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.error('Error creating invite:', error.response?.data ?? error.message);
            } else {
                console.error('Error creating invite:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async () => {
        if (inviteCode) {
            try {
                await navigator.clipboard.writeText(`${window.location.origin}/invite/${inviteCode}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch {
                console.error('Failed to copy to clipboard');
            }
        }
    };

    const handleClose = () => {
        setInviteCode(null);
        setCopied(false);
        setExistingInvites([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-discord-bg-primary rounded-md w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <Crown className="w-5 h-5 text-discord-text-positive mr-2" />
                        <h2 className="text-discord-text-header font-bold text-lg">Create Invite</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-discord-text-muted hover:text-discord-text-header cursor-pointer transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                
                <div className="mb-6">
                    <p className="text-discord-text-normal mb-4 text-sm">
                        Create an invite link for <span className="font-bold text-discord-text-header">#{channelName}</span>
                    </p>

                    
                    {loadingInvites ? (
                        <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-discord-brand"></div>
                        </div>
                    ) : existingInvites.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-discord-text-header font-bold text-xs uppercase mb-2">Existing Invites</h3>
                            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                                {existingInvites.map((invite) => (
                                    <div key={invite.invite_id} className="bg-discord-bg-secondary rounded p-2 flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={`${window.location.origin}/invite/${invite.invite_id}`}
                                                    readOnly
                                                    className="flex-1 bg-discord-bg-tertiary border-none rounded px-2 py-1 text-discord-text-normal text-xs font-mono focus:outline-none"
                                                />
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(`${window.location.origin}/invite/${invite.invite_id}`);
                                                        setCopied(true);
                                                        setTimeout(() => setCopied(false), 2000);
                                                    }}
                                                    className={`p-1.5 rounded transition-colors duration-200 cursor-pointer ${copied ? 'bg-discord-text-positive text-white' : 'bg-discord-brand hover:bg-discord-brand-hover text-white'}`}
                                                    title="Copy to clipboard"
                                                >
                                                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteInvite(invite.invite_id)}
                                            className="text-discord-text-danger hover:text-red-400 p-1.5 rounded ml-2 cursor-pointer hover:bg-discord-bg-tertiary transition-colors"
                                            title="Delete invite"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!inviteCode ? (
                        <button
                            onClick={createInvite}
                            disabled={loading}
                            className="w-full bg-discord-brand hover:bg-discord-brand-hover disabled:bg-discord-brand/50 text-white py-2.5 px-4 rounded transition-colors duration-200 flex items-center justify-center cursor-pointer font-medium text-sm"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                'Generate Invite Link'
                            )}
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-discord-bg-secondary rounded p-4">
                                <p className="text-discord-text-muted text-xs font-bold uppercase mb-2">New Invite Link</p>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={`${window.location.origin}/invite/${inviteCode}`}
                                        readOnly
                                        className="flex-1 bg-discord-bg-tertiary border-none rounded px-3 py-2 text-discord-text-normal text-sm font-mono focus:outline-none"
                                    />
                                    <button
                                        onClick={copyToClipboard}
                                        className={`p-2 rounded transition-colors duration-200 cursor-pointer ${copied ? 'bg-discord-text-positive text-white' : 'bg-discord-brand hover:bg-discord-brand-hover text-white'}`}
                                        title="Copy to clipboard"
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="text-center">
                                <button
                                    onClick={handleClose}
                                    className="text-discord-text-muted hover:underline text-sm cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                
                <div className="text-xs text-discord-text-muted">
                    Anyone with this link can join the channel. Keep it secure!
                </div>
            </div>
        </div>
    );
}
