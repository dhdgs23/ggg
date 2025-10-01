
import { getNotifications } from './actions';
import NotificationList from './_components/notification-list';

export default async function UsersNotificationPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const search = typeof searchParams.search === 'string' ? searchParams.search : '';
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'desc';

  const { notifications, hasMore, total } = await getNotifications(page, search, sort);

  return (
    <NotificationList
      initialNotifications={notifications}
      initialHasMore={hasMore}
      totalNotifications={total}
    />
  );
}
