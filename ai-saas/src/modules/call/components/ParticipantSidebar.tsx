'use client';

import { useCallStateHooks } from '@stream-io/video-react-sdk';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Search, MicOff, VideoOff, UserPlus, Crown } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

/** Stream SDK track type numeric constants */
const TrackType = {
  AUDIO: 1,
  VIDEO: 2,
  SCREEN_SHARE: 3,
} as const;

interface ParticipantSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const ParticipantSidebar = ({
  isOpen,
  onClose,
  className,
}: ParticipantSidebarProps) => {
  const { useParticipants, useCallCreatedBy } = useCallStateHooks();
  const participants = useParticipants();
  const createdBy = useCallCreatedBy();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredParticipants = useMemo(() => {
    if (!searchQuery.trim()) return participants;
    const query = searchQuery.toLowerCase();
    return participants.filter(
      (p) =>
        p.name?.toLowerCase().includes(query) ||
        p.userId?.toLowerCase().includes(query)
    );
  }, [participants, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'flex w-80 flex-col border-l border-[#3c4043] bg-[#202124] h-full',
        className
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-[#3c4043] px-4">
        <h2 className="text-sm font-medium text-white">
          People ({participants.length})
        </h2>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#9aa0a6] hover:bg-[#3c4043] hover:text-white transition-colors"
          aria-label="Close participants panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa0a6]" />
          <input
            type="text"
            placeholder="Search people"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-[#3c4043] py-2 pl-10 pr-4 text-sm text-white placeholder-[#9aa0a6] outline-none focus:ring-1 focus:ring-[#8ab4f8] transition-all"
          />
        </div>
      </div>

      {/* Add people button */}
      {/* TODO: Implement "Add people" functionality — open a modal/popover to invite users
          by email or shareable link. Use Stream SDK's call.addMembers() or generate an invite link. */}
      <div className="px-4 pb-2">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[#8ab4f8] hover:bg-[#3c4043] transition-colors">
          <UserPlus className="h-4 w-4" />
          <span className="text-sm font-medium">Add people</span>
        </button>
      </div>

      {/* Participants list */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="px-4 pb-4 space-y-1">
          {filteredParticipants.map((participant) => {
            const displayName =
              participant.name || participant.userId || 'Unknown';
            const initials = displayName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            const hasAudio = participant.publishedTracks.includes(TrackType.AUDIO);
            const hasVideoTrack = participant.publishedTracks.includes(TrackType.VIDEO);
            const isHost = createdBy?.id === participant.userId;

            return (
              <div
                key={participant.sessionId}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-[#3c4043] transition-colors group"
              >
                {/* Avatar */}
                <Avatar className="h-8 w-8 shrink-0">
                  {participant.image ? (
                    <AvatarImage
                      src={participant.image}
                      alt={displayName}
                    />
                  ) : null}
                  <AvatarFallback className="bg-[#5f6368] text-white text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-[#e8eaed] truncate">
                      {displayName}
                    </span>
                    {participant.isLocalParticipant && (
                      <span className="text-xs text-[#9aa0a6]">(You)</span>
                    )}
                    {isHost && (
                      <Crown className="h-3 w-3 text-[#fbbc04] shrink-0" />
                    )}
                  </div>
                </div>

                {/* Status indicators */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {!hasAudio && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full">
                      <MicOff className="h-3.5 w-3.5 text-[#ea4335]" />
                    </div>
                  )}
                  {!hasVideoTrack && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full">
                      <VideoOff className="h-3.5 w-3.5 text-[#ea4335]" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredParticipants.length === 0 && searchQuery && (
            <div className="flex flex-col items-center justify-center py-8 text-[#9aa0a6]">
              <Search className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No participants found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
