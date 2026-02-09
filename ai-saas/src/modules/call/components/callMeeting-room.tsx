'use client';
import { useRouter, useParams } from 'next/navigation';
import {
  StreamCall,
  StreamTheme,
  PaginatedGridLayout,
  CallControls,
} from '@stream-io/video-react-sdk';

export const MeetingRoom = () => {
  const router = useRouter();
  const { meetingId } = useParams<{ meetingId: string }>();
  const handleLeave = () => {
    confirm('Are you sure you want to leave the call?') &&
      router.push(`/meetings/${meetingId}`);
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden pt-4">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <PaginatedGridLayout />
        </div>
        <div className="fixed bottom-0 flex w-full items-center justify-center gap-5">
          <CallControls onLeave={handleLeave} />
        </div>
      </div>
    </section>
  );
};
