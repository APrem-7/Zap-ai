'use client';

import { useRouter } from 'next/navigation';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Users,
  Settings,
  Shield,
} from 'lucide-react';
import { useState } from 'react';
import {
  DeviceSettings,
  VideoPreview,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface JoinCallCardProps {
  meetingId: string;
  meetingTitle?: string;
  hostName?: string;
  participantCount?: number;
  onJoin: () => void;
  isJoining?: boolean;
}

export const JoinCallCard = ({
  meetingId,
  meetingTitle = 'Team Meeting',
  hostName = 'Unknown Host',
  participantCount = 1,
  onJoin,
  isJoining = false,
}: JoinCallCardProps) => {
  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { useCameraState, useMicrophoneState } = useCallStateHooks();
  const { camera, optimisticIsMute: optimisticVideoMuted } = useCameraState();
  const { microphone, optimisticIsMute: optimisticAudioMuted } =
    useMicrophoneState();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#202124] p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-normal text-white mb-2">
            Ready to join?
          </h1>
          <p className="text-sm text-[#9aa0a6]">{meetingTitle}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
          {/* Video Preview */}
          <div className="w-full max-w-lg">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-[#3c4043]">
              <VideoPreview
                className="w-full h-full"
                mirror={true}
                DisabledVideoPreview={() => (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#3c4043]">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#5f6368] text-white text-3xl font-medium">
                      <VideoOff className="h-8 w-8" />
                    </div>
                    <p className="mt-3 text-sm text-[#9aa0a6]">Camera is off</p>
                  </div>
                )}
              />

              {/* Floating controls over video */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                <button
                  onClick={() => microphone.toggle()}
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 shadow-lg',
                    optimisticAudioMuted
                      ? 'bg-[#ea4335] text-white hover:bg-[#d33426]'
                      : 'bg-[#3c4043]/90 text-white hover:bg-[#4a4d51]/90 backdrop-blur-sm'
                  )}
                  title={
                    optimisticAudioMuted
                      ? 'Unmute microphone'
                      : 'Mute microphone'
                  }
                >
                  {optimisticAudioMuted ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </button>

                <button
                  onClick={() => camera.toggle()}
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 shadow-lg',
                    optimisticVideoMuted
                      ? 'bg-[#ea4335] text-white hover:bg-[#d33426]'
                      : 'bg-[#3c4043]/90 text-white hover:bg-[#4a4d51]/90 backdrop-blur-sm'
                  )}
                  title={
                    optimisticVideoMuted ? 'Turn on camera' : 'Turn off camera'
                  }
                >
                  {optimisticVideoMuted ? (
                    <VideoOff className="h-5 w-5" />
                  ) : (
                    <Video className="h-5 w-5" />
                  )}
                </button>

                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3c4043]/90 text-white hover:bg-[#4a4d51]/90 backdrop-blur-sm transition-all duration-200 shadow-lg"
                  title="Device Settings"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Meeting Info & Join */}
          <div className="flex flex-col items-center md:items-start gap-6 w-full max-w-xs">
            {/* Meeting details */}
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-lg font-medium text-white">{meetingTitle}</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#9aa0a6]">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">
                    {participantCount}{' '}
                    {participantCount === 1 ? 'participant' : 'participants'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#9aa0a6]">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">Encrypted</span>
                </div>
              </div>
              {hostName && (
                <p className="text-xs text-[#9aa0a6]">Hosted by {hostName}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={onJoin}
                disabled={isJoining}
                className={cn(
                  'w-full rounded-full bg-[#1a73e8] px-6 py-3 text-sm font-medium text-white hover:bg-[#1765cc] transition-colors shadow-md hover:shadow-lg',
                  isJoining && 'opacity-70 cursor-not-allowed'
                )}
              >
                {isJoining ? 'Joining...' : 'Join now'}
              </button>
              <button
                onClick={() => router.push(`/meetings/${meetingId}`)}
                className="w-full rounded-full bg-transparent border border-[#5f6368] px-6 py-3 text-sm font-medium text-[#8ab4f8] hover:bg-[#3c4043] transition-colors"
              >
                Return to meeting page
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Device settings modal */}
      <AlertDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-[#2d2e31] border-[#3c4043] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center justify-center gap-2 text-center text-white">
              <Settings className="h-5 w-5" />
              Device Settings
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-[#9aa0a6]">
              Review and adjust your camera and microphone settings before
              joining.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <ScrollArea className="max-h-[50vh] w-full rounded-md border border-[#3c4043] bg-[#202124] p-4">
            <div className="space-y-6">
              <DeviceSettings />
            </div>
          </ScrollArea>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="mt-0 bg-[#3c4043] border-[#5f6368] text-white hover:bg-[#4a4d51] hover:text-white">
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
