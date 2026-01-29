import { MeetingView } from '@/modules/meetings/ui/meetings-view';
import { MeetingsListHeader } from '@/modules/meetings/components/meeting-list-header';

const Page = () => {
  return (
    <>
      <MeetingsListHeader />
      <div className="px-4 md:px-8 pb-4 flex flex-col gap-y-2">
        <MeetingView />
      </div>
    </>
  );
};

export default Page;
