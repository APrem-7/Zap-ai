'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GeneratedAvatar } from '@/components/generated-avatar';
import { PlayIcon, UserIcon, CalendarIcon } from 'lucide-react';

interface MeetingDetailsCardProps {
  meetingAgentName: string;
  meetingId: string;
  meetingName: string;
}

export const MeetingDetailsCard = ({
  meetingAgentName,
  meetingId,
  meetingName,
}: MeetingDetailsCardProps) => {
  return (
    <Card className="flex-col">
      <CardContent className="p-6 ">
        <div className="flex items-start gap-4">
          <GeneratedAvatar
            seed={meetingName}
            variant="adventurer"
            className="border size-20"
          />

          <div className="flex-1">
            <h2 className="text-xl font-semibold">{meetingName || 'qeqwee'}</h2>
            <p className="text-sm text-muted-foreground">
              Agent:{meetingAgentName}
            </p>

            <div className="flex items-center gap-2 mt-3">
              <Badge
                variant="default"
                className="bg-green-100 text-green-800 border-green-200"
              >
                Upcoming
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <UserIcon className="h-3 w-3" />
                TODO : Insert USer Name
              </Badge>
            </div>
          </div>
        </div>

        <Card className="flex-col mt-6 bg-muted/50 justify-center items-center border-muted">
          <CardContent className="flex flex-col items-center p-4">
            <h4 className="font-semibold text-lg mb-2">Ready to Start?</h4>

            <p className="text-sm text-muted-foreground mb-2">
              Click the button below to begin your meeting
            </p>
            <div className="flex justify-center py-5">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md mr-2"
                onClick={() => {}}
              >
                <PlayIcon className="h-3 w-3 mr-1" />
                Start Meeting
              </Button>
              <Button
                className="bg-[#fab81e] hover:bg-[#fab81e] text-white px-4 py-2 rounded-lg font-semibold shadow-md"
                onClick={() => {}}
              >
                <CalendarIcon className="h-3 w-3 mr-1" />
                Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
