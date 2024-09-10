/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import { useAuthToken } from '@convex-dev/auth/react';
import { useMutation } from 'convex/react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import Meta from '@/components/common/Meta';
import TableLoading from '@/components/loading/TableLoading';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import TablePagination from '@/utils/TablePagination';
import type { BidType, UserTableType } from '@/utils/types';

import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

const RequestTable = () => {
  const [tableLoading, setTableLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState<string>(filter);
  const [bids, setBids] = useState<BidType[]>([]);
  const [page, setPage] = useState(1);
  const [perpage, setPerpage] = useState(10);
  const [total, setTotal] = useState(0);
  const [update, setUpdate] = useState(true);
  const [user, setUser] = useState<UserTableType>();

  const router = useRouter();
  const token = useAuthToken();
  const bidMutation = useMutation(api.bids.getPlacedByRequestId);
  const updateMutation = useMutation(api.bids.update);
  const userMutation = useMutation(api.users.getById);

  const handleUpdate = async (
    bidId: Id<'bids'>,
    amount: number,
    status: string,
  ) => {
    try {
      if (
        status === 'accepted' &&
        user &&
        user.balance &&
        JSON.parse(user.balance) >= amount
      ) {
        await updateMutation({ bidId, status });
        setUpdate(true);
        toast.success('Bid accepted successfully!');
      } else if (status === 'rejected') {
        await updateMutation({ bidId, status });
        setUpdate(true);
        toast.success('Bid rejected successfully!');
      } else {
        toast.error(
          'You cannot accept the bid. Your balance is lower than the bid amount.',
        );
      }
    } catch (err) {
      console.error('Error updating bid:', err);
      toast.error(`Error updating bid: ${err || 'Unknown error'}`);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        const userId = jwtDecode(String(token))?.sub?.split('|')[0];
        try {
          const res = await userMutation({ userId: userId as Id<'users'> });
          sessionStorage.setItem('userInfo', JSON.stringify(res));
        } catch (err) {
          console.error('Error fetching user:', err);
          toast.error(`Error fetching user: ${err || 'Unknown error'}`);
        }
      }
    };

    if (update) {
      fetchUser();
      setUpdate(false);
    }
  }, [update, token]);

  useEffect(() => {
    const userInfo = sessionStorage.getItem('userInfo');

    if (!userInfo) {
      router.push('/');
    } else {
      const parsedUserInfo = JSON.parse(userInfo);
      setUser(parsedUserInfo);
    }
  }, []);

  // Effect to handle debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 600);

    return () => {
      clearTimeout(handler);
    };
  }, [filter]);

  useEffect(() => {
    const fetchBids = async () => {
      if (router.query.id && update) {
        setTableLoading(true);
        try {
          const res = await bidMutation({
            requestId: router.query.id as Id<'requests'>,
            filter: debouncedFilter,
            page,
            perpage,
          });
          setBids(res.bids);
          setTotal(res.total);
        } catch (err) {
          console.error('Error fetching bids:', err);
          toast.error(`Error fetching bids: ${err || 'Unknown error'}`);
        } finally {
          setTableLoading(false);
          setUpdate(false);
        }
      }
    };

    fetchBids();
  }, [debouncedFilter, page, perpage, router.query.id, update]);

  useEffect(() => {
    setPage(1);
  }, [perpage, filter]);

  return (
    <div className="rounded-xl border-2">
      <Meta title="vendor" />
      <div className="flex justify-between border-b p-4">
        <div className="flex items-center text-xl">Incoming Bids</div>

        <div className="flex">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
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

            <input
              type="search"
              id="default-search"
              className="w-full rounded-lg border p-2 ps-10"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search"
              required
            />
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Vendor Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Placed</TableHead>
            <TableHead className="text-center">#</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableLoading loading={tableLoading} />
          <TableLoading loading={tableLoading} />
          <TableLoading loading={tableLoading} />

          {!tableLoading &&
            bids.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="pl-4">{row.vendor.fullname}</TableCell>
                <TableCell>{row.vendor.email}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>
                  {new Date(row.vendor.creationTime!).toLocaleString()}
                </TableCell>

                <TableCell className="text-center">
                  <Button
                    className="w-24 rounded-lg border border-primary-azureBlue bg-blue-50 py-2 text-primary-azureBlue hover:shadow-lg"
                    onClick={() =>
                      handleUpdate(row._id, row.amount, 'accepted')
                    }
                  >
                    Accept
                  </Button>

                  <Button
                    className="ml-2 w-24 rounded-lg border border-red-500 bg-red-50 py-2 text-red-500 hover:shadow-lg"
                    onClick={() =>
                      handleUpdate(row._id, row.amount, 'rejected')
                    }
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <TablePagination
        page={page}
        setPage={setPage}
        perpage={perpage}
        setPerpage={setPerpage}
        total={total}
      />

      <Toaster />
    </div>
  );
};

export default RequestTable;
