/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import { useMutation } from 'convex/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import ConfirmPopover from '@/components/common/ConfirmPopover';
import Meta from '@/components/common/Meta';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import TableLoading from '@/components/loading/TableLoading';
import PaymentDialog from '@/components/payment/PaymentDialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import TablePagination from '@/utils/TablePagination';
import type { BidType, BidWithFileType, UserTableType } from '@/utils/types';

import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

const ClientActive = () => {
  const [tableLoading, setTableLoading] = useState(false);
  const [bids, setBids] = useState<BidWithFileType[]>([]);
  const [filter, setFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState<string>(filter);
  const [page, setPage] = useState(1);
  const [perpage, setPerpage] = useState(10);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState<UserTableType>();
  const [update, setUpdate] = useState(false);

  const router = useRouter();

  const bidMutation = useMutation(api.bids.getActiveByClientId);
  const updateMutation = useMutation(api.bids.update);

  const handleUpdate = async (bidId: Id<'bids'>, status: string) => {
    await updateMutation({
      status,
      bidId,
    });
    setUpdate((prev) => !prev);
  };

  useEffect(() => {
    const userInfo = sessionStorage.getItem('userInfo');

    if (!userInfo) router.push('/auth/signin/vendor');
    else {
      const parsedUserInfo = JSON.parse(userInfo);
      if (parsedUserInfo.type !== 'client') router.push('/error/access');
      setUser(parsedUserInfo);
    }
  }, []);

  useEffect(() => {
    setPage(1);
  }, [perpage, filter]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 600);

    return () => {
      clearTimeout(handler);
    };
  }, [filter]);

  useEffect(() => {
    setTableLoading(true);

    if (user)
      bidMutation({
        clientId: user._id,
        filter: debouncedFilter,
        page,
        perpage,
      }).then((res: { bids: BidType[]; total: number }) => {
        const temp = res.bids.map((bid) => {
          const baseUrl =
            process.env.SITE_URL || 'https://rugged-trout-139.convex.site';
          const getWorkUrl = new URL(`${baseUrl}/getFile`);
          getWorkUrl.searchParams.set('storageId', bid.workId as string);

          return { ...bid, getWorkUrl };
        });

        setTableLoading(false);

        setTotal(res.total);

        setBids(temp);
      });
  }, [debouncedFilter, page, perpage, user, update]);

  return (
    <div className="grid gap-8 lg:grid-cols-4 xl:grid-cols-6">
      <Meta title="client" />

      <DashboardSidebar className="bg-gray-100 px-4 pt-12" />

      <div className="overflow-auto px-8 pt-16 lg:col-span-3 lg:h-screen xl:col-span-5">
        <DashboardHeader title="Active Bids" />

        <div className="mb-96 mt-8 rounded-xl border-2">
          <div className="flex justify-between border-b px-8 py-4">
            <div className="flex items-center text-xl">Active Bids</div>

            <div className="flex">
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
            </div>
          </div>

          <Table className="w-full table-auto">
            <TableHeader>
              <TableRow className="text-left">
                <TableHead className="py-2 pl-4 text-gray-400">
                  About Request
                </TableHead>
                <TableHead className="py-2 text-gray-400">
                  About Bidder
                </TableHead>
                <TableHead className="py-2 text-gray-400">amount</TableHead>
                <TableHead className="py-2 text-gray-400">submitted</TableHead>
                <TableHead className="py-2 text-gray-400">status</TableHead>
                <TableHead className="py-2 text-gray-400">#</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableLoading loading={tableLoading} />
              <TableLoading loading={tableLoading} />
              <TableLoading loading={tableLoading} />

              {!tableLoading &&
                bids.map((row, index) => (
                  <TableRow className="border-y" key={index}>
                    <TableCell className="pl-4">
                      <p className="text-lg font-semibold">
                        {row.request.kind}
                        {' - '}
                        {row.request.kind === 'Surveys' && row.request.survey}
                      </p>

                      <p>({new Date(row._creationTime).toLocaleString()})</p>

                      <p>
                        {row.request.kind !== 'Surveys' && row.request.asset}
                        {row.request.kind !== 'Surveys' &&
                          row.request.asset === 'Other' &&
                          row.request.assetOther}
                      </p>

                      {row.request.survey === 'ALTA Survey' && (
                        <div className="mt-1">
                          <p className="font-medium">ALTA options:</p>
                          {row.request.ALTAoptions.map((ALTA) => (
                            <p className="pl-2" key={ALTA}>
                              {ALTA}
                            </p>
                          ))}
                        </div>
                      )}

                      {row.request.survey === 'Other' && (
                        <div className="mt-1">
                          <p className="font-medium">Other:</p>
                          <p className="pl-2">{row.request.otherSurvey}</p>
                        </div>
                      )}

                      <div className="mt-1">
                        <p className="font-medium">Property Address:</p>
                        <p className="pl-2">{row.request.propertyAddress}</p>
                      </div>

                      <div className="mt-1">
                        <p className="font-medium">Site Contact Information:</p>
                        <p className="pl-2">
                          Email: {row.request.siteContactInfoEmail}
                        </p>
                        <p className="pl-2">
                          Name: {row.request.siteContactInfoName}
                        </p>
                        <p className="pl-2">
                          Phone: {row.request.siteContactInfoPhone}
                        </p>
                      </div>

                      <div className="mt-1">
                        <p className="font-medium">Turnaround Time:</p>
                        <p className="pl-2">
                          {row.request.turnaroundTime}{' '}
                          {row.request.turnaroundTime ===
                            'By a specific date' &&
                            `-> ${row.request.specificDate}`}
                        </p>
                      </div>

                      <div className="mt-1">
                        <p className="font-medium">Addtional Information:</p>
                        {row.request.additionalInfo.map((addi, addiIndex) => (
                          <p className="pl-2" key={addiIndex}>
                            {addi.key}: {addi.value}
                          </p>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell>
                      <p className="text-lg font-semibold">
                        {row.vendor.fullname}
                      </p>
                      <p>{row.vendor.email}</p>
                      <p>
                        member since{' '}
                        {new Date(row.vendor.creationTime!).toLocaleString()}
                      </p>
                    </TableCell>

                    <TableCell>{row.amount}</TableCell>

                    <TableCell>
                      {new Date(row._creationTime).toLocaleString()}
                    </TableCell>

                    <TableCell>
                      <Badge
                        className={
                          row.status === 'accepted'
                            ? 'border border-yellow-600 bg-yellow-50 text-yellow-600'
                            : row.status === 'submitted'
                              ? 'border border-green-600 bg-green-50 text-green-600'
                              : 'border border-slate-600 bg-slate-50 text-slate-600'
                        }
                      >
                        {row.status === 'accepted'
                          ? 'Pending'
                          : row.status === 'submitted'
                            ? 'Submitted'
                            : row.status === 'rework'
                              ? 'Reworking'
                              : row.status === 'refunding'
                                ? 'Requested Refund'
                                : row.status}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="grid h-full items-center gap-2">
                        <ConfirmPopover
                          label="Rework"
                          onConfirm={() => handleUpdate(row._id, 'rework')}
                          disabled={[
                            'accepted',
                            'rework',
                            'paid',
                            'closed',
                          ].includes(row.status)}
                        />

                        <ConfirmPopover
                          label="Request refund"
                          onConfirm={() => handleUpdate(row._id, 'refunding')}
                          disabled={row.status !== 'paid'}
                        />

                        <Link
                          className={`${
                            row.status === 'accepted' || row.status === 'rework'
                              ? 'cursor-default border-slate-300 text-slate-400'
                              : 'border-slate-500 hover:bg-slate-200'
                          }  rounded-md border bg-slate-50 p-2 text-center font-medium shadow`}
                          href={
                            row.status === 'accepted' || row.status === 'rework'
                              ? '/client/active/#'
                              : row.getWorkUrl.href
                          }
                          download
                        >
                          Download File
                        </Link>

                        <PaymentDialog {...row} setUpdate={setUpdate} />

                        <ConfirmPopover
                          label="Close Request"
                          onConfirm={() => handleUpdate(row._id, 'closed')}
                          disabled={row.status !== 'paid'}
                        />
                      </div>
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
        </div>
      </div>
    </div>
  );
};

export default ClientActive;
