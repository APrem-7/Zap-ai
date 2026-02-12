'use client';
import { tokenProvider } from '@/actions/stream.actions';
import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk';
import { useState, ReactNode, useEffect } from 'react';
import { createAuthClient } from 'better-auth/react';
const { useSession } = createAuthClient();

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

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

  if (!videoClient) return null;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};
