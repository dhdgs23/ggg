import { getDisabledRedeemUsers } from '@/app/actions';
import DisabledUserList from './_components/disabled-user-list';

export default async function DisabledRedeemUsersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search = typeof searchParams.search === 'string' ? searchParams.search : '';
  const users = await getDisabledRedeemUsers(search);

  return <DisabledUserList initialUsers={users} />;
}
