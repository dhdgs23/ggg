import { getWithdrawalsForAdmin } from '@/app/actions';
import WithdrawalList from './_components/withdrawal-list';

const status = ['Pending'];

export default async function AdminWithdrawalsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'asc';

  const { withdrawals, hasMore } = await getWithdrawalsForAdmin(page, sort, status);

  return (
    <WithdrawalList
      initialWithdrawals={withdrawals}
      title="Pending Withdrawal Requests"
      status={status}
      showActions={true}
      initialHasMore={hasMore}
    />
  );
}
