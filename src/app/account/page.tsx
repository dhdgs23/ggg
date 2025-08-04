import { getSession, getWalletData } from '@/app/actions';
import AccountDetails from './_components/account-details';
import AuthTabs from './_components/auth-tabs';

export default async function AccountPage() {
  const session = await getSession();
  
  if (session) {
    const { walletBalance, withdrawals } = await getWalletData();
    return <div className="container mx-auto px-6 py-16"><AccountDetails username={session.username} walletBalance={walletBalance} withdrawals={withdrawals} /></div>
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <AuthTabs />
    </div>
  );
}
