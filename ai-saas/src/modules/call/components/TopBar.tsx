'use client';

import { useState, useEffect } from 'react';
import { useCallStateHooks } from '@stream-io/video-react-sdk';
import { cn } from '@/lib/utils';
import { Shield, Users, Clock, Copy, Check } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TopBarProps {
  meetingId: string;
  className?: string;
}

export const TopBar = ({ meetingId, className }: TopBarProps) => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [copied, setCopied] = useState(false);

  // TODO: Initialize elapsedTime from the actual call start time instead of 0.
  // Use call.state.startedAt or call.state.createdAt from the Stream SDK to calculate
  // the initial offset: Math.floor((Date.now() - startedAt.getTime()) / 1000).
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyMeetingId = async () => {
    try {
      await navigator.clipboard.writeText(meetingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Failed to copy meeting ID');
    }
  };

  return (
    <div
      className={cn(
        'flex h-14 items-center justify-between px-4 bg-[#202124] border-b border-[#3c4043]',
        className
      )}
    >
      {/* Left section - Meeting info */}
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-medium text-white truncate max-w-[200px] md:max-w-[300px]">
          {meetingId}
        </h1>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleCopyMeetingId}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#9aa0a6] hover:bg-[#3c4043] hover:text-white transition-colors"
              aria-label="Copy meeting ID"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {copied ? 'Copied!' : 'Copy meeting ID'}
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Center section - Timer */}
      <div className="flex items-center gap-2 text-[#9aa0a6]">
        <Clock className="h-3.5 w-3.5" />
        <span className="text-xs font-mono tabular-nums">
          {formatTime(elapsedTime)}
        </span>
      </div>

      {/* Right section - Participants count & security */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full bg-[#3c4043] px-3 py-1.5">
          <Users className="h-3.5 w-3.5 text-[#9aa0a6]" />
          <span className="text-xs font-medium text-[#e8eaed]">
            {participants.length}
          </span>
        </div>

        {/* TODO: Implement security info panel — show a popover/dialog with call encryption details,
            host controls (lock meeting, remove participants), and waiting room settings. */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#9aa0a6] hover:bg-[#3c4043] hover:text-white transition-colors"
              aria-label="Meeting security"
            >
              <Shield className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Encrypted call</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
