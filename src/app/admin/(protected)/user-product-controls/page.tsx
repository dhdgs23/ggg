import { getActiveControlRules } from '@/app/actions';
import UserProductControlManager from './_components/user-product-control-manager';

export default async function UserProductControlsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const search = typeof searchParams.search === 'string' ? searchParams.search : '';

  const { rules, hasMore, totalRules } = await getActiveControlRules(page, search);

  return (
    <UserProductControlManager 
      initialRules={rules} 
      initialHasMore={hasMore} 
      totalRules={totalRules} 
    />
  );
}
