import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { getQueryClient } from '@/utils/query-client';
import { CallIdView } from '@/modules/call/ui/views/callid-view';

interface Props {
  params: Promise<{
    meetingId: string;
  }>;
}
const Page = async ({ params }: Props) => {
  const queryClient = getQueryClient();
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
