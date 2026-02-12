'use client';
import { tokenProvider } from '@/actions/stream.actions';
import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk';
import { useState, ReactNode, useEffect } from 'react';
import { createAuthClient } from 'better-auth/react';
import { Loader2Icon } from 'lucide-react';

const { useSession } = createAuthClient();

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

if (!apiKey) {
  throw new Error(
    'NEXT_PUBLIC_STREAM_API_KEY is not configured. Please add it to your environment variables.'
  );
}

export const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();

  const { data: session, isPending, error } = useSession();

  useEffect(() => {
    if (!session?.user.id || !apiKey) return;
    if (!tokenProvider) return;
    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: session?.user.id,
        name: session?.user.name,
      },
      tokenProvider,
    });

    setVideoClient(client);
  }, [session]);

  if (!videoClient) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Connecting...</p>
        </div>
      </div>
    );
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};
