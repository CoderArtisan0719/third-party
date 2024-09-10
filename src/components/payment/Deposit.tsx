/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import { useAuthToken } from '@convex-dev/auth/react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useMutation } from 'convex/react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import type { UserTableType } from '@/utils/types';

import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

type DepositProps = {
  user: UserTableType | undefined;
  setUser: Dispatch<SetStateAction<UserTableType | undefined>>;
};

const Deposit = (props: DepositProps) => {
  const [amount, setAmount] = useState(15);
  const [update, setUpdate] = useState(true);

  const token = useAuthToken();
  const userMutation = useMutation(api.users.getById);
  const transactionMutation = useMutation(api.transactions.deposit);

  const CLIENT_ID =
    'AYdp2BSiaMAr57JNxGtTSYc6xYEup_zC8xGJf3F7HOWU4HnmobVgxClRNKJeIk6LHoSXccJ_hajQTDNi';

  const initialOptions = {
    clientId: CLIENT_ID,
    'enable-funding': 'card',
    'disable-funding': 'paylater,venmo',
    'data-sdk-integration-source': 'integrationbuilder_sc',
  };

  const router = useRouter();

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
  }, [update, token, props.user]);

  useEffect(() => {
    const userInfo = sessionStorage.getItem('userInfo');

    if (!userInfo) {
      router.push('/');
    } else {
      const parsedUserInfo = JSON.parse(userInfo);
      props.setUser?.(parsedUserInfo);
    }
  }, [router]);

  return (
    <div className="grid flex-1 gap-4 pt-6">
      <Input
        type="number"
        min={1}
        onChange={(e) => setAmount(Number(e.target.value))}
        value={amount}
        className="w-full border-slate-500 p-2 text-black"
        name="bid-modal-amount"
      />

      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          forceReRender={[initialOptions]}
          createOrder={async (_data, actions) => {
            return actions.order.create({
              intent: 'CAPTURE',
              purchase_units: [
                {
                  amount: {
                    value: String(amount),
                    currency_code: 'USD',
                  },
                },
              ],
            });
          }}
          onApprove={async () => {
            // Process the transaction
            try {
              const newUser = await transactionMutation({
                clientId: props.user!._id,
                amount,
              });
              if (newUser) {
                props.setUser?.({
                  ...newUser,
                  creationTime: newUser._creationTime,
                });
                setUpdate((prev) => !prev);
                toast.success('Deposit successful!'); // Success feedback
              }
            } catch (error) {
              toast.error(`Error processing transaction: ${error}`);
            }
          }}
          onError={(err) => {
            console.error('PayPal Checkout onError', err);
            toast.error(`Error: ${err.message}`); // Display error
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default Deposit;
