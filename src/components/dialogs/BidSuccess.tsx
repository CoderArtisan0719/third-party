import { useRouter } from 'next/router';
import type { Dispatch, SetStateAction } from 'react';
import React from 'react';

import { Button } from '@/components/ui/button';

type SuccessModalProps = {
  amount: number;
  successVisible: boolean;
  setSuccessVisible: Dispatch<SetStateAction<boolean>>;
};

const SuccessModal = (props: SuccessModalProps) => {
  const router = useRouter();

  return (
    <div className="fixed left-0 top-0 flex size-full items-center justify-center md:absolute">
      <div className="relative h-min rounded-xl border border-black p-8 text-center opacity-100 lg:w-1/2">
        <div className="flex items-center justify-center">
          <img
            src="/img/dollarSent.png"
            className="bg-white"
            alt="dollarSent.png"
          />
        </div>

        <p className="mt-8 text-2xl font-semibold">
          Your Bidding <br /> Successfully Added
        </p>

        <p className="mt-8">
          Yooyy! your bid (<span>{props.amount} USD</span>) has <br /> been
          listing to our database.
        </p>

        <Button
          className="mt-8 w-full rounded-full bg-primary-azureBlue py-6 text-lg text-white"
          onClick={() => router.push('/vendor')}
        >
          Okay
        </Button>

        <svg
          height="12"
          width="12"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute right-4 top-4 cursor-pointer stroke-gray-500"
          strokeWidth="3"
          onClick={() => props.setSuccessVisible(false)}
        >
          <line x1="0" y1="0" x2="12" y2="12" />
          <line x1="12" y1="0" x2="0" y2="12" />
        </svg>
      </div>
    </div>
  );
};

export default SuccessModal;
