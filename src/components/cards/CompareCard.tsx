import type { MouseEventHandler, ReactNode } from 'react';

import { Button } from '@/components/ui/button';

type CompareCardProps = {
  title: string;
  children: ReactNode;
  onClick?: MouseEventHandler;
};

const CompareCard = (props: CompareCardProps) => (
  // <div className=" relative w-full max-w-xs">
  //   <div className="absolute inset-0 size-full scale-[0.80] rounded-full bg-red-500 bg-gradient-to-r from-blue-500 to-teal-500 blur-3xl" />
  <div className="border-opacity-/15 relative z-10 flex flex-col items-center overflow-hidden rounded-xl border bg-white p-4 shadow-lg">
    <div className="font-semibold">{props.title}</div>
    <div className="p-8">{props.children}</div>

    <Button
      className="z-30 w-full bg-primary-azureBlue px-12 py-3 font-semibold tracking-wider text-white"
      onClick={props.onClick}
    >
      Request
    </Button>
  </div>
  // </div>
);

export default CompareCard;
