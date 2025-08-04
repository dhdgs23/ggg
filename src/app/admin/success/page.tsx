
import { OrderList } from '../_components/order-list';
import { isAdminAuthenticated, getOrdersForAdmin } from '@/app/actions';
import { redirect } from 'next/navigation';

const status = ['Completed'];

export default async function AdminSuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) redirect('/admin/login');

  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'asc';
  const search = typeof searchParams.search === 'string' ? searchParams.search : '';

  const { orders, hasMore } = await getOrdersForAdmin(page, sort, search, status);

  return (
    <OrderList
      initialOrders={orders}
      title="Successful Orders"
      status={status}
      initialHasMore={hasMore}
    />
  );
}
