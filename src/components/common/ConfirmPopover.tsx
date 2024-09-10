import { useState } from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Button } from '../ui/button';

type ConfirmPopoverProps = {
  label: string;
  disabled: boolean;
  variant?: string;
  onConfirm: () => Promise<void>;
};

const ConfirmPopover = (props: ConfirmPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          className={
            props.variant === 'green'
              ? 'border border-green-600 bg-green-100 text-green-600 hover:bg-green-200'
              : 'border border-slate-400 bg-slate-50 hover:bg-slate-200'
          }
          disabled={props.disabled}
        >
          {props.label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 border border-slate-600 bg-white">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">
              Are you sure you want to {props.label}?
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              className="border border-primary-azureBlue bg-blue-50 text-blue-600 hover:bg-blue-200"
              onClick={props.onConfirm}
            >
              OK
            </Button>
            <Button
              className="border border-slate-600 bg-slate-50 text-slate-600 hover:bg-slate-200"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ConfirmPopover;
