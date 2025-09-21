import { getPromotedIdLogs } from './actions';
import PromotedIdList from './_components/promoted-id-list';

export default async function PromotedIdsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search = typeof searchParams.search === 'string' ? searchParams.search : '';
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'desc';
  const { logs, hasMore } = await getPromotedIdLogs(search, page, sort);

  return <PromotedIdList initialLogs={logs} initialHasMore={hasMore} />;
}
