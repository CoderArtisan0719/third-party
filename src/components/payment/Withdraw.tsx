import { useAuthToken } from '@convex-dev/auth/react';
import { useMutation } from 'convex/react';
import { jwtDecode } from 'jwt-decode';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

type WithdrawPopoverProps = {
  label: string;
  disabled: boolean;
  variant?: string;
  amount: number;
  loading: boolean;
  onConfirm: () => Promise<void>;
  setAmount: Dispatch<SetStateAction<number>>;
};

const WithdrawPopover = (props: WithdrawPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [update, setUpdate] = useState(true);

  const token = useAuthToken();
  const userMutation = useMutation(api.users.getById);

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
  }, [update, token]);

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
          <Input
            type="number"
            max={props.amount}
            placeholder="amount"
            value={props.amount}
            onChange={(e) => props.setAmount(Number(e.target.value))}
          />

          <div className="space-y-2">
            <h4 className="font-medium leading-none">
              If you withdraw money, it will be deposited into your PayPal
              account connected to your email. Are you sure you want to withdraw
              to your PayPal account?
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              className="border border-primary-azureBlue bg-blue-50 text-blue-600 hover:bg-blue-200"
              onClick={props.onConfirm}
              disabled={props.loading || props.amount === 0}
            >
              {props.loading ? 'Please wait...' : 'OK'}
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

export default WithdrawPopover;
