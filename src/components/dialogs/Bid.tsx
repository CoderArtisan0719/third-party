/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import { useMutation } from 'convex/react';
import type { Dispatch, SetStateAction } from 'react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { UserTableType } from '@/utils/types';

import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

type BidModalProps = {
  amount: number;
  setAmount: Dispatch<SetStateAction<number>>;
  clientId: Id<'users'>;
  requestId: Id<'requests'>;
  setBidVisible: Dispatch<SetStateAction<boolean>>;
  setSuccessVisible: Dispatch<SetStateAction<boolean>>;
};

const BidModal = (props: BidModalProps) => {
  const [user, setUser] = useState<UserTableType>();
  const [loading, setLoading] = useState(false);

  const maxBidAmount = 15;

  const sendBid = useMutation(api.bids.create);
  const plusOne = useMutation(api.requests.plusOne);

  useEffect(() => {
    const userInfo = sessionStorage.getItem('userInfo');

    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      setUser(parsedUserInfo);
    }
  }, []);

  const handleBid = async () => {
    setLoading(true);

    const res = await sendBid({
      requestId: props.requestId,
      clientId: props.clientId,
      vendorId: user!._id,
      amount: props.amount,
      unit: 'USD',
    });

    await plusOne({
      _id: props.requestId,
      bidId: res,
      userId: user!._id,
    });

    props.setSuccessVisible(true);
    props.setBidVisible(false);
    setLoading(false);
  };

  return (
    <div className="fixed left-0 top-0 flex size-full items-center justify-center md:absolute">
      <div className="relative mx-4 h-min w-full rounded-xl border border-black p-8 opacity-100 sm:w-3/4 lg:w-1/2">
        <p className="text-2xl font-semibold">Place a Bid</p>

        <p className="mb-8 mt-2">
          Maximum bid amount is{' '}
          <span className="font-semibold">{maxBidAmount} USD</span>
        </p>

        <Input
          type="number"
          min={15}
          value={props.amount}
          onChange={(e) => props.setAmount(Number(e.target.value))}
          className="mb-8 w-full border-slate-500 p-2 text-black"
          name="bid-modal-amount"
        />

        <hr className="mb-4 border-gray-500" />

        <div className="flex justify-between py-2">
          <span>Your balance</span>
          <span>69,000 USD</span>
        </div>

        <div className="flex justify-between py-2">
          <span>Service fee</span>
          <span>0.02 USD</span>
        </div>

        <div className="flex justify-between py-2">
          <span>Total bid amount</span>
          <span>15.02 USD</span>
        </div>

        <Button
          className="mt-8 w-full rounded-full bg-primary-azureBlue py-6 text-lg text-white"
          onClick={handleBid}
          disabled={loading}
        >
          {loading ? 'Please wait...' : 'Place a Bid'}
        </Button>

        <svg
          height="12"
          width="12"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute right-4 top-4 cursor-pointer stroke-gray-500"
          strokeWidth="3"
          onClick={() => props.setBidVisible(false)}
        >
          <line x1="0" y1="0" x2="12" y2="12" />
          <line x1="12" y1="0" x2="0" y2="12" />
        </svg>
      </div>
    </div>
  );
};

export default BidModal;
