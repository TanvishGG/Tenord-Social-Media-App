"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { invitesAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Hash, Users, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function InvitePage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, user, loading: authLoading } = useAuth();
    const inviteCode = params.code as string;

    const [invite, setInvite] = useState<any>(null);
    const [inviteLoading, setInviteLoading] = useState(true);
    const [error, setError] = useState('');
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        if (inviteCode) {
            fetchInvite();
        }
    }, [inviteCode]);

    const fetchInvite = async () => {
        try {
            const response = await invitesAPI.getInvite(inviteCode);
            setInvite(response.data.invite);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Invalid or expired invite');
        } finally {
            setInviteLoading(false);
        }
    };

    const handleJoin = async () => {
        if (!isAuthenticated) {
            
            router.push(`/login?redirect=/invite/${inviteCode}`);
            return;
        }

        setJoining(true);
        try {
            await invitesAPI.accept(inviteCode);
            router.push('/app');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to join channel');
            setJoining(false);
        }
    };

    if (inviteLoading || authLoading) {
        return (
            <div className="min-h-screen bg-discord-bg-primary flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-discord-brand"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-discord-bg-primary flex items-center justify-center p-4">
                <div className="bg-discord-bg-secondary p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-discord-text-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-discord-text-danger" />
                    </div>
                    <h2 className="text-2xl font-bold text-discord-text-header mb-2">Invite Invalid</h2>
                    <p className="text-discord-text-muted mb-6">{error}</p>
                    <Link
                        href="/app"
                        className="inline-block bg-discord-bg-tertiary hover:bg-discord-bg-modifier-hover text-discord-text-normal px-6 py-2 rounded transition-colors"
                    >
                        Go to App
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[url('https://cdn.discordapp.com/attachments/887533801589985300/1162796802541371422/discord_background.png')] bg-cover bg-center flex items-center justify-center p-4">
            <div className="bg-discord-bg-secondary p-8 rounded-lg shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-6">
                    {invite?.channel?.icon ? (
                        <img
                            src={invite.channel.icon}
                            alt={invite.channel.name}
                            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-md"
                        />
                    ) : (
                        <div className="w-24 h-24 bg-discord-bg-tertiary rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
                            <Hash className="w-12 h-12 text-discord-text-muted" />
                        </div>
                    )}

                    <p className="text-discord-text-muted text-sm uppercase font-bold mb-2">You've been invited to join</p>
                    <h1 className="text-2xl font-bold text-discord-text-header mb-2 flex items-center justify-center">
                        {invite?.channel?.name || 'Unknown Channel'}
                    </h1>

                    <div className="flex items-center justify-center space-x-4 text-discord-text-muted text-sm">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-discord-text-positive rounded-full mr-2"></div>
                            <span>{invite?.online_count || 0} Online</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-discord-text-muted rounded-full mr-2"></div>
                            <span>{invite?.member_count || 0} Members</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleJoin}
                    disabled={joining}
                    className="w-full bg-discord-brand hover:bg-discord-brand-hover disabled:bg-discord-brand/50 text-white font-medium py-3 px-4 rounded transition-colors duration-200 mb-4 flex items-center justify-center"
                >
                    {joining ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                        isAuthenticated ? 'Join Channel' : 'Login to Join'
                    )}
                </button>

                {!isAuthenticated && (
                    <p className="text-center text-xs text-discord-text-muted">
                        Already have an account? <Link href={`/login?redirect=/invite/${inviteCode}`} className="text-discord-brand hover:underline">Login</Link>
                    </p>
                )}
            </div>
        </div>
    );
}
