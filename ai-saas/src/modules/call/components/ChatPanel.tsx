'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Send, Smile } from 'lucide-react';
import { useCallStateHooks } from '@stream-io/video-react-sdk';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderImage?: string;
  text: string;
  timestamp: Date;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const ChatPanel = ({ isOpen, onClose, className }: ChatPanelProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      // Focus input when chat opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // TODO: Replace local-only chat with real-time messaging.
  // Use Stream SDK's custom events (call.sendCustomEvent) to broadcast messages to all participants,
  // and listen for incoming messages via call.on('custom') to update the messages state.
  // Alternatively, integrate Stream Chat SDK for a full-featured chat experience.
  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim() || !localParticipant) return;

    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      senderId: localParticipant.userId,
      senderName: localParticipant.name || 'You',
      senderImage: localParticipant.image,
      text: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
  }, [inputValue, localParticipant]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Group consecutive messages from the same sender
  const groupedMessages = useMemo(() => {
    const groups: { senderId: string; messages: ChatMessage[] }[] = [];
    messages.forEach((msg) => {
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.senderId === msg.senderId) {
        lastGroup.messages.push(msg);
      } else {
        groups.push({ senderId: msg.senderId, messages: [msg] });
      }
    });
    return groups;
  }, [messages]);

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
        <h2 className="text-sm font-medium text-white">In-call messages</h2>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#9aa0a6] hover:bg-[#3c4043] hover:text-white transition-colors"
          aria-label="Close chat panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="px-4 py-3 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#9aa0a6]">
              <p className="text-sm text-center">
                Messages can only be seen by people in the call and are deleted
                when the call ends.
              </p>
            </div>
          ) : (
            groupedMessages.map((group) => {
              const firstMsg = group.messages[0];
              const isLocal = firstMsg.senderId === localParticipant?.userId;
              const initials = firstMsg.senderName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              return (
                <div key={firstMsg.id} className="flex gap-3">
                  {/* Avatar */}
                  <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                    {firstMsg.senderImage ? (
                      <AvatarImage
                        src={firstMsg.senderImage}
                        alt={firstMsg.senderName}
                      />
                    ) : null}
                    <AvatarFallback className="bg-[#5f6368] text-white text-[10px]">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  {/* Messages */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-medium text-[#e8eaed]">
                        {isLocal ? 'You' : firstMsg.senderName}
                      </span>
                      <span className="text-[10px] text-[#9aa0a6]">
                        {formatTime(firstMsg.timestamp)}
                      </span>
                    </div>
                    {group.messages.map((msg) => (
                      <p
                        key={msg.id}
                        className="text-sm text-[#bdc1c6] break-words"
                      >
                        {msg.text}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message input */}
      <div className="border-t border-[#3c4043] p-3">
        <div className="flex items-center gap-2 rounded-full bg-[#3c4043] px-4 py-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Send a message to everyone"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-white placeholder-[#9aa0a6] outline-none"
          />
          {/* TODO: Implement emoji picker — use a library like @emoji-mart/react
              to show an emoji selection popover on click, and append the selected emoji to inputValue. */}
          <button
            className="text-[#9aa0a6] hover:text-white transition-colors"
            aria-label="Emoji"
          >
            <Smile className="h-5 w-5" />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200',
              inputValue.trim()
                ? 'bg-[#8ab4f8] text-[#202124] hover:bg-[#aecbfa]'
                : 'text-[#5f6368] cursor-not-allowed'
            )}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
