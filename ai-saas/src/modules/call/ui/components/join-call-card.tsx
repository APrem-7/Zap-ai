'use client';

import { useRouter } from 'next/navigation';
import { Mic, MicOff, Video, VideoOff, Users } from 'lucide-react';

interface JoinCallCardProps {
  meetingId: string;
  meetingTitle?: string;
  hostName?: string;
  participantCount?: number;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onJoin: () => void;
}

export const JoinCallCard = ({
  meetingId,
  meetingTitle = 'Team Meeting',
  hostName = 'John Doe',
  participantCount = 3,
  isAudioEnabled,
  isVideoEnabled,
  onToggleAudio,
  onToggleVideo,
  onJoin,
}: JoinCallCardProps) => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Call</h1>
        <p className="text-gray-600">
          Are you sure you want to join this call?
        </p>
      </div>

      {/* Meeting Info */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">{meetingTitle}</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Host</p>
              <p className="font-medium text-gray-900">{hostName}</p>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">
                {participantCount} participants
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Media Controls */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={onToggleAudio}
          className={`p-4 rounded-full transition-all ${
            isAudioEnabled
              ? 'bg-gray-900 text-white hover:bg-gray-800'
              : 'bg-red-100 text-red-600 hover:bg-red-200'
          }`}
        >
          {isAudioEnabled ? (
            <Mic className="w-6 h-6" />
          ) : (
            <MicOff className="w-6 h-6" />
          )}
        </button>

        <button
          onClick={onToggleVideo}
          className={`p-4 rounded-full transition-all ${
            isVideoEnabled
              ? 'bg-gray-900 text-white hover:bg-gray-800'
              : 'bg-red-100 text-red-600 hover:bg-red-200'
          }`}
        >
          {isVideoEnabled ? (
            <Video className="w-6 h-6" />
          ) : (
            <VideoOff className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onJoin}
          className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
        >
          Join Now
        </button>
        <button
          onClick={() => router.push(`/meetings/${meetingId}`)}
          className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
