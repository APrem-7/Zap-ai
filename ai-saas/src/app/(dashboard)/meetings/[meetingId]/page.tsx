import { MeetingsIdView } from '@/modules/meetings/ui/views/meetingsId-view';

interface Props {
  params: Promise<{ meetingId: string }>;
}

const Page = async ({ params }: Props) => {
  const { meetingId } = await params;

  return <MeetingsIdView meetingId={meetingId} />;
};

export default Page;
