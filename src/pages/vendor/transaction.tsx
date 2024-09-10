/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import { useAuthToken } from '@convex-dev/auth/react';
import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons';
import { useMutation } from 'convex/react';
import { isSameDay } from 'date-fns';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import Meta from '@/components/common/Meta';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import WithdrawPopover from '@/components/payment/Withdraw';
import { Input } from '@/components/ui/input';
import TablePagination from '@/utils/TablePagination';
import type { TransactionTableType, UserTableType } from '@/utils/types';

import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

const ClientTransaction = () => {
  const [user, setUser] = useState<UserTableType | null>(null);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [perpage, setPerpage] = useState(10);
  const [total, setTotal] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [rows, setRows] = useState<TransactionTableType[]>([]);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(true);

  const token = useAuthToken();
  const userMutation = useMutation(api.users.getById);

  const CLIENT_ID =
    'AYdp2BSiaMAr57JNxGtTSYc6xYEup_zC8xGJf3F7HOWU4HnmobVgxClRNKJeIk6LHoSXccJ_hajQTDNi';
  const CLIENT_SECRET =
    'EA5SlQBzZdAt-c8yLflCwFo26BagGAFHY7x90JsOybJmeK5gT07jhyS5qKEMMLvDPNGL1uCeb8vS-_wN';

  const transactionMutation = useMutation(api.transactions.getByUserId);
  const withdrawMutation = useMutation(api.transactions.withdraw);

  const getAccessToken = async () => {
    const response = await fetch(
      'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`, // Encode in Base64
        },
        body: 'grant_type=client_credentials',
      },
    );

    if (!response.ok) {
      throw new Error('Failed to obtain access token');
    }

    const data = await response.json();
    return data.access_token;
  };

  const handleWithdraw = async () => {
    try {
      setLoading(true);

      // Get the access token
      const accessToken = await getAccessToken();
      const response = await fetch(
        'https://api-m.sandbox.paypal.com/v1/payments/payouts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            sender_batch_header: {
              sender_batch_id: window.crypto.randomUUID(),
              email_subject: 'You have a payout!',
              email_message:
                'You have received a payout! Thanks for using our service!',
            },
            items: [
              {
                recipient_type: 'EMAIL',
                amount: { value: withdrawAmount, currency: 'USD' },
                note: 'Thanks for your patronage!',
                sender_item_id: window.crypto.randomUUID(),
                receiver: user?.email,
                notification_language: 'en-US',
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Payout request failed: ${response.statusText}`);
      }
      const payoutData = await response.json();
      console.log('Payout successful:', payoutData);

      const newUser = await withdrawMutation({
        userId: user!._id,
        amount: Number(withdrawAmount),
      });

      if (newUser)
        setUser({ ...newUser, creationTime: newUser?._creationTime });
      setUpdate((prev) => !prev);
      setLoading(false);
    } catch (error) {
      console.error('Error during payout:', error);
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    if (token) {
      const userId = jwtDecode(String(token))?.sub?.split('|')[0];
      try {
        const res = await userMutation({ userId: userId as Id<'users'> });
        sessionStorage.setItem('userInfo', JSON.stringify(res));
      } catch (err) {
        toast.error(`Error fetching user: ${err || 'Unknown error'}`);
      }
    }
  };

  useEffect(() => {
    if (update) {
      fetchUser();
      setUpdate(false);
    }
  }, [update, token, user]);

  useEffect(() => {
    const userInfo = sessionStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      setUser(parsedUserInfo);
      setWithdrawAmount(parsedUserInfo.balance);
      transactionMutation({
        userId: parsedUserInfo._id,
        page,
        perpage,
        filter,
      }).then((res) => {
        setTotal(res.total);
        setRows(
          res.results.map((row) => ({
            ...row,
            sender: row.sender && {
              ...row.sender,
              creationTime: row.sender?._creationTime,
            },
            receiver: row.sender && {
              ...row.sender,
              creationTime: row.sender?._creationTime,
            },
          })),
        );
      });
    }
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-4 xl:grid-cols-6">
      <Meta title="client" />

      <DashboardSidebar className="bg-gray-100 px-4 pt-12" />

      <div className="overflow-auto px-8 pt-16 lg:col-span-3 lg:h-screen xl:col-span-5">
        <div className="mt-4 grid gap-4 pr-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-lg text-gray-500">Total balances</h1>
              <p className="text-4xl font-bold">{user?.balance} USD</p>
            </div>
            <WithdrawPopover
              label="Withdraw"
              onConfirm={handleWithdraw}
              disabled={!user || Number(user.balance) <= 0}
              amount={withdrawAmount}
              setAmount={setWithdrawAmount}
              loading={loading}
            />
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center p-4">
              <svg
                className="size-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>

            <Input
              type="text"
              className="w-full rounded-lg border p-2 ps-10"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search"
              id="default-search"
              required
            />
          </div>

          <p className="text-xl font-semibold">Transactions</p>

          <div className="space-y-4">
            {rows.map((transaction, index) => (
              <div key={transaction._id}>
                {(index === 0 ||
                  (index !== 0 &&
                    !isSameDay(
                      new Date(transaction._creationTime),
                      new Date(rows[index - 1]!._creationTime),
                    ))) && (
                  <div className="py-2 text-gray-500">
                    {(isSameDay(new Date(transaction._creationTime), new Date())
                      ? 'Today, '
                      : '') +
                      new Date(transaction._creationTime).toDateString()}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {transaction.type === 'withdraw' ? (
                      <div className="flex items-center rounded-full bg-pink-200 p-1 text-sm font-semibold text-pink-800">
                        <ArrowUpIcon />
                      </div>
                    ) : (
                      <div className="flex items-center rounded-full bg-green-200 p-1 text-sm font-semibold text-green-800">
                        <ArrowDownIcon />
                      </div>
                    )}
                    <div className="ml-2">
                      <span>
                        {transaction.type === 'withdraw' &&
                          'Withdraw to PayPal'}
                        {transaction.type === 'deposit' &&
                          'Deposited to My Account'}
                        {transaction.type === 'closed' &&
                          'Received money from '}
                      </span>
                      <span className="font-bold">
                        {transaction.type === 'closed' &&
                          transaction.receiver?.fullname}
                      </span>
                    </div>
                  </div>
                  <span className="text-xl font-semibold">
                    {transaction.type === 'withdraw' ? '-' : '+'}{' '}
                    {transaction.amount} {'USD'}
                  </span>
                </div>
              </div>
            ))}

            <TablePagination
              page={page}
              setPage={setPage}
              perpage={perpage}
              setPerpage={setPerpage}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientTransaction;
