import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { getQueryClient } from '@/utils/query-client';
import { CallIdView } from '@/modules/call/ui/views/callid-view';
import { getOneMeeting } from '@/app/api/agents/meetings';

interface Props {
  params: Promise<{
    meetingId: string;
  }>;
}
const Page = async ({ params }: Props) => {
  const { meetingId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect('/login');
  }

  const user = session.user;

  return (
    <>
      <CallIdView meetingId={meetingId} />
    </>
  );
};

export default Page;
