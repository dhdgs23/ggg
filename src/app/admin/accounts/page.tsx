
import AccountList from './_components/account-list';
import { getUsersForAdmin, isAdminAuthenticated } from '@/app/actions';
import { redirect } from 'next/navigation';

export default async function AdminAccountsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) redirect('/admin/login');

  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'asc';
  const search = typeof searchParams.search === 'string' ? searchParams.search : '';

  const { users, hasMore } = await getUsersForAdmin(page, sort, search);

  return (
    <AccountList
      initialUsers={users}
      initialHasMore={hasMore}
    />
  );
}
