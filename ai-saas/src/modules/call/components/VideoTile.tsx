'use client';

import { memo } from 'react';
import { StreamVideoParticipant, Video } from '@stream-io/video-react-sdk';
import { cn } from '@/lib/utils';
import { Mic, MicOff, Pin } from 'lucide-react';

/** Stream SDK track type numeric constants */
const TrackType = {
  AUDIO: 1,
  VIDEO: 2,
  SCREEN_SHARE: 3,
} as const;

interface VideoTileProps {
  participant: StreamVideoParticipant;
  isSpeaking?: boolean;
  isPinned?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const VideoTile = memo(
  ({ participant, isSpeaking, isPinned, className, style }: VideoTileProps) => {
    const hasVideo = participant.publishedTracks.includes(TrackType.VIDEO);
    const hasAudio = participant.publishedTracks.includes(TrackType.AUDIO);
    const hasScreenShare = participant.publishedTracks.includes(
      TrackType.SCREEN_SHARE
    );

    const displayName = participant.name || participant.userId || 'Unknown';
    const initials = displayName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-lg bg-[#3c4043] transition-all duration-200',
          isSpeaking && 'ring-2 ring-[#8ab4f8]',
          isPinned && 'ring-2 ring-[#1a73e8]',
          className
        )}
        style={style}
      >
        {/* Video or Avatar */}
        {hasScreenShare ? (
          <Video
            participant={participant}
            trackType="screenShareTrack"
            className="absolute inset-0 h-full w-full object-cover"
            mirror={false} // Never mirror screen shares
            VideoPlaceholder={null}
          />
        ) : hasVideo ? (
          <Video
            participant={participant}
            trackType="videoTrack"
            className="absolute inset-0 h-full w-full object-cover"
            mirror={participant.isLocalParticipant}
            VideoPlaceholder={null}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#3c4043]">
            <div
              className={cn(
                'flex items-center justify-center rounded-full bg-[#5f6368] text-white font-medium',
                'h-16 w-16 text-2xl md:h-20 md:w-20 md:text-3xl'
              )}
            >
              {participant.image ? (
                <img
                  src={participant.image}
                  alt={displayName}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
          </div>
        )}

        {/* Bottom overlay - Name + mic status */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
          <div className="flex items-center gap-2">
            {!hasAudio && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/90">
                <MicOff className="h-3 w-3 text-white" />
              </div>
            )}
            <span className="truncate text-xs font-medium text-white drop-shadow-sm">
              {displayName}
              {participant.isLocalParticipant && ' (You)'}
            </span>
          </div>
        </div>

        {/* Pin indicator */}
        {isPinned && (
          <div className="absolute top-2 right-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1a73e8]">
              <Pin className="h-3 w-3 text-white" />
            </div>
          </div>
        )}

        {/* Speaking indicator pulse */}
        {isSpeaking && (
          <div className="absolute top-2 left-2">
            <div className="flex h-3 w-3 items-center justify-center">
              <div className="absolute h-3 w-3 animate-ping rounded-full bg-[#8ab4f8] opacity-75" />
              <div className="h-2 w-2 rounded-full bg-[#8ab4f8]" />
            </div>
          </div>
        )}
      </div>
    );
  }
);

VideoTile.displayName = 'VideoTile';
