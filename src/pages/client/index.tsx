/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import { useMutation } from 'convex/react';
import { addDays, isSameDay } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import KPICard from '@/components/cards/KPICard';
import CurrentChart from '@/components/client/CurrentChart';
import FiveYearChart from '@/components/client/FiveYearChart';
import OneYearChart from '@/components/client/OneYearChart';
import Meta from '@/components/common/Meta';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import ChartCardLoading from '@/components/loading/ChartCardLoading';
import KPICardLoading from '@/components/loading/KPICardLoading';
import TableLoading from '@/components/loading/TableLoading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import TablePagination from '@/utils/TablePagination';
import type { ChartTotalType, KPIType, RequestTableType } from '@/utils/types';

import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

const ClientDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [incomings, setIncomings] = useState<KPIType[]>([]);
  const [clientKPI, setClientKPI] = useState<KPIType[]>([]);
  const [chartTotal, setChartTotal] = useState<ChartTotalType>([]);
  const [requests, setRequests] = useState<RequestTableType[]>([]);
  const [kind, setKind] = useState('current');
  const [filter, setFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState<string>(filter);
  const [page, setPage] = useState(1);
  const [perpage, setPerpage] = useState(10);
  const [bidTotal, setBidTotal] = useState(1);
  const [reqTotal, setReqTotal] = useState(1);
  const [totalIncrease, setTotalIncrease] = useState(1);
  const [newReqFlag, setNewReqFlag] = useState(false);

  const SITE_URL = 'https://rugged-trout-139.convex.site';

  const router = useRouter();

  const reqMutation = useMutation(api.requests.getByUserId);
  const bidMutation = useMutation(api.bids.getByClientId);

  useEffect(() => {
    const userInfo = sessionStorage.getItem('userInfo');

    if (!userInfo)
      router.push(
        `/auth/signin/${router.route.includes('client') ? 'client' : 'vendor'}`,
      );
    else {
      const parsedUserInfo = JSON.parse(userInfo);
      if (parsedUserInfo.type !== 'client') router.push('/error/access');
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
    const userInfo = sessionStorage.getItem('userInfo');

    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);

      setLoading(true);

      reqMutation({
        userId: parsedUserInfo._id as Id<'users'>,
        filter: '',
        page: 0,
        perpage: 0,
      }).then(
        (res: { resolvedRequests: RequestTableType[]; total: number }) => {
          bidMutation({
            clientId: parsedUserInfo._id as Id<'users'>,
            filter,
            page,
            perpage,
          }).then((bids) => {
            setLoading(false);
            setReqTotal(res.total);
            setBidTotal(bids.total);

            setIncomings(
              res.resolvedRequests.map((item) => ({
                title: `Request at ${new Date(item._creationTime).toLocaleString()}`,
                img: '/img/product.png',
                imgAlt: 'request',
                length: 'grid-cols-2',
                link: String(item._id),
                lists: [
                  {
                    label: `${
                      bids.bids.filter(
                        (bid) =>
                          bid.status === 'placed' && bid.requestId === item._id,
                      ).length
                    } Bids received`,
                  },
                  {
                    label: 'Go to this Request',
                  },
                ],
              })),
            );

            setClientKPI([
              {
                title: 'Request',
                img: '/img/product.png',
                imgAlt: 'request',
                length: 'grid-cols-3',
                lists: [
                  {
                    label: 'open',
                    value: res.resolvedRequests.filter(
                      (req) => req.status === 'open',
                    ).length,
                  },
                  {
                    label: 'closed',
                    value: res.resolvedRequests.filter(
                      (req) => req.status === 'start',
                    ).length,
                  },
                  {
                    label: 'completed',
                    value: res.resolvedRequests.filter(
                      (req) => req.status === 'closed',
                    ).length,
                  },
                ],
              },
              {
                title: 'Bid',
                img: '/img/product.png',
                imgAlt: 'request',
                length: 'grid-cols-2',
                lists: [
                  {
                    label: 'received',
                    value: bids.total,
                  },
                  {
                    label: 'revised',
                    value: bids.bids.filter((bid) => bid.status === 'rework')
                      .length,
                  },
                ],
              },
            ]);
          });
        },
      );
    }
  }, []);

  useEffect(() => {
    const userInfo = sessionStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);

      setChartLoading(true);

      bidMutation({
        clientId: parsedUserInfo._id as Id<'users'>,
        filter: debouncedFilter,
        page,
        perpage,
      }).then((bids) => {
        setChartLoading(false);

        const yesterday = addDays(new Date(), -1);

        const todayReceivedBids = bids.bids.filter((bid) =>
          isSameDay(new Date(), new Date(bid._creationTime)),
        ).length;

        const yesterdayReceivedBids = bids.bids.filter((bid) =>
          isSameDay(yesterday, new Date(bid._creationTime)),
        ).length;

        const vsReceived =
          yesterdayReceivedBids === 0
            ? todayReceivedBids * 100
            : Math.floor((todayReceivedBids / yesterdayReceivedBids) * 10000) /
                100 -
              100;

        const todayAcceptedBids = bids.bids.filter(
          (bid) =>
            isSameDay(new Date(), new Date(bid._creationTime)) &&
            bid.status === 'accepted',
        ).length;

        const yesterdayAcceptedBids = bids.bids.filter(
          (bid) =>
            isSameDay(yesterday, new Date(bid._creationTime)) &&
            bid.status === 'accepted',
        ).length;

        const vsAccepted =
          yesterdayAcceptedBids === 0
            ? todayAcceptedBids * 100
            : (todayAcceptedBids / yesterdayAcceptedBids) * 100 - 100;

        const todayRevisedBids = bids.bids.filter(
          (bid) =>
            isSameDay(new Date(), new Date(bid._creationTime)) &&
            bid.status === 'rework',
        ).length;

        const yesterdayRevisedBids = bids.bids.filter(
          (bid) =>
            isSameDay(yesterday, new Date(bid._creationTime)) &&
            bid.status === 'rework',
        ).length;

        const vsRevised =
          yesterdayRevisedBids === 0
            ? todayRevisedBids * 100
            : (todayRevisedBids / yesterdayRevisedBids) * 100 - 100;

        setTotalIncrease(vsReceived);

        setChartTotal([
          {
            title: 'Total Bids received',
            value: bids.total,
            vsYesterday: vsReceived,
          },
          {
            title: 'Total Bids accepted',
            value: bids.bids.filter((bid) => bid.status === 'accepted').length,
            vsYesterday: vsAccepted,
          },
          {
            title: 'Total Bids revised',
            value: bids.bids.filter((bid) => bid.status === 'rework').length,
            vsYesterday: vsRevised,
          },
        ]);
      });
    }
  }, [kind]);

  useEffect(() => {
    const userInfo = sessionStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);

      setTableLoading(true);

      reqMutation({
        userId: parsedUserInfo._id as Id<'users'>,
        filter: debouncedFilter,
        page,
        perpage,
      }).then(
        (res: { resolvedRequests: RequestTableType[]; total: number }) => {
          setTableLoading(false);
          setReqTotal(res.total);
          const temp = res.resolvedRequests.map((request) => {
            const getCommitUrl = new URL(`${SITE_URL}/getFile`);
            const getSurveyUrl = new URL(`${SITE_URL}/getFile`);
            const getOtherUrl = new URL(`${SITE_URL}/getFile`);

            getCommitUrl.searchParams.set(
              'storageId',
              request.uploadCommits[0] as string,
            );
            getSurveyUrl.searchParams.set(
              'storageId',
              request.uploadCommits[0] as string,
            );
            getOtherUrl.searchParams.set(
              'storageId',
              request.uploadCommits[0] as string,
            );

            return { ...request, getCommitUrl, getSurveyUrl, getOtherUrl };
          });
          setRequests(temp);
        },
      );
    }
  }, [debouncedFilter, page, perpage, newReqFlag]);

  useEffect(() => {
    setPage(1);
  }, [perpage, filter]);

  return (
    <div className="grid gap-8 lg:grid-cols-4 xl:grid-cols-6">
      <Meta title="client" />

      <DashboardSidebar className="bg-gray-100 px-4 pt-12" />

      <div className="overflow-auto px-8 pt-16 lg:col-span-3 lg:h-screen xl:col-span-5">
        <DashboardHeader
          title="Dashboard"
          newReqFlag={newReqFlag}
          setNewReqFlag={setNewReqFlag}
        />

        <div className="mt-4 grid gap-4">
          <KPICardLoading loading={loading} />
          <KPICardLoading loading={loading} />
          {incomings.map((incoming, index) => (
            <KPICard {...incoming} key={index} />
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <KPICardLoading loading={loading} />
          <KPICardLoading loading={loading} />

          {!loading &&
            clientKPI.map((KPI) => <KPICard {...KPI} key={KPI.title} />)}
        </div>

        <div className="mt-8 rounded-xl border-2 p-8">
          <div className="flex justify-between sm:w-1/3 lg:w-1/2">
            <div>
              <div className="text-xl">Bids</div>

              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{bidTotal}</span>{' '}
                {totalIncrease > 0 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                  >
                    <circle cx="12" cy="12" r="12" className="fill-green-500" />
                    <path
                      d="M12 6l-6 6h4v6h4v-6h4z"
                      className="fill-green-800"
                    />
                  </svg>
                )}
                {totalIncrease < 0 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                  >
                    <circle cx="12" cy="12" r="12" fill="red" />
                    <path d="M12 18l6-6h-4V6h-4v6H6z" fill="darkred" />
                  </svg>
                )}
                <span
                  className={
                    totalIncrease > 0
                      ? 'text-green-500'
                      : totalIncrease < 0
                        ? 'text-red-500'
                        : ''
                  }
                >
                  {totalIncrease > 0 && '+'} {totalIncrease}%
                </span>
              </div>

              <div className="text-gray-500">
                (
                {reqTotal === 0
                  ? 0
                  : Math.floor((bidTotal / reqTotal) * 100) / 100}{' '}
                avg.request)
              </div>
            </div>

            <div className="flex items-end">
              <Select value={kind} onValueChange={setKind}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {[
                    { label: 'Current', value: 'current' },
                    { label: '1 year', value: 'oneYear' },
                    { label: '5 years', value: 'fiveYears' },
                  ].map((item, index) => (
                    <SelectItem
                      className="cursor-pointer hover:bg-slate-100"
                      value={item.value}
                      key={index}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 lg:grid-cols-2">
            <div className="sm:col-span-2 lg:col-span-1">
              {chartLoading && (
                <div className="mt-4 size-full animate-pulse rounded-lg bg-gray-100"></div>
              )}

              {!chartLoading && kind === 'current' && <CurrentChart />}
              {!chartLoading && kind === 'oneYear' && <OneYearChart />}
              {!chartLoading && kind === 'fiveYears' && <FiveYearChart />}
            </div>

            <div className="flex flex-col justify-around p-8">
              <div className="grid items-center lg:grid-cols-2">
                {chartLoading && <ChartCardLoading />}
                {chartLoading && <ChartCardLoading />}
                {chartLoading && <ChartCardLoading />}

                {!chartLoading &&
                  chartTotal.map((item) => (
                    <div key={item.title} className="py-4">
                      <div className="flex items-center text-gray-500">
                        {item.title}
                      </div>

                      <p>{item.value}</p>

                      <p>
                        vs yesterday
                        <span
                          className={
                            item.vsYesterday > 0
                              ? 'text-green-500'
                              : item.vsYesterday === 0
                                ? 'text-slate-500'
                                : item.vsYesterday < 0
                                  ? 'text-red-500'
                                  : ''
                          }
                        >
                          {' '}
                          ({item.vsYesterday}%)
                        </span>
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-96 mt-8 rounded-xl border-2">
          <div className="flex justify-between border-b px-8 py-4">
            <div className="flex items-center text-xl">My Requests</div>

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
                  Type required
                </TableHead>
                <TableHead className="py-2 text-gray-400">
                  Property Address
                </TableHead>
                <TableHead className="py-2 text-gray-400">Contact</TableHead>
                <TableHead className="py-2 text-gray-400">Turnaround</TableHead>
                <TableHead className="py-2 text-gray-400">
                  Uploads and Additional Infos
                </TableHead>
                <TableHead className="py-2 text-gray-400">posted</TableHead>
                <TableHead className="py-2 text-gray-400">
                  received bids
                </TableHead>
                <TableHead className="py-2 text-gray-400">#</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableLoading loading={tableLoading} />
              <TableLoading loading={tableLoading} />
              <TableLoading loading={tableLoading} />

              {!tableLoading &&
                requests.map((row, index) => (
                  <TableRow className="border-y" key={index}>
                    <TableCell className="pl-4">
                      <p className="text-lg font-semibold">{row.kind}</p>
                      <p>{row.kind === 'Surveys' && row.survey}</p>
                      <ul>
                        {row.kind === 'Surveys' &&
                          row.survey === 'ALTA Survey' &&
                          row.ALTAoptions.map((ALTA, ALTAindex) => (
                            <li key={ALTAindex}>
                              {ALTAindex + 1}. {ALTA}
                            </li>
                          ))}
                      </ul>
                      <p>
                        {row.kind === 'Surveys' &&
                          row.survey === 'Other' &&
                          row.otherSurvey}
                      </p>
                      <p>{row.kind === 'Assets' && row.asset}</p>
                    </TableCell>

                    <TableCell>
                      <p className="font-semibold">{row.propertyAddress}</p>
                      <p>{row.countyAccountInfo}</p>
                    </TableCell>

                    <TableCell>
                      <p>
                        <span className="font-semibold">name:</span>{' '}
                        {row.siteContactInfoName}
                      </p>
                      <p>
                        <span className="font-semibold">phone:</span>{' '}
                        {row.siteContactInfoPhone}
                      </p>
                      <p>
                        <span className="font-semibold">E-mail:</span>{' '}
                        {row.siteContactInfoEmail}
                      </p>
                    </TableCell>

                    <TableCell>
                      <p className="font-semibold">{row.turnaroundTime}</p>

                      <p>
                        {row.turnaroundTime !== 'As soon as possible, or' &&
                          row.specificDate}
                      </p>
                    </TableCell>

                    <TableCell>
                      {row.additionalInfo.map((addi, ind) => (
                        <p key={ind}>
                          <span className="font-semibold">{addi.key}</span> :{' '}
                          {addi.value}
                        </p>
                      ))}

                      {row.uploadCommits.length > 0 && (
                        <div className="mt-2">
                          <p className="font-semibold">Commitment documents</p>
                          {row.uploadCommits.map((upload, uploadIndex) => (
                            <Link
                              href={
                                row.getCommitUrl ? row.getCommitUrl.href : '#'
                              }
                              className="pl-2"
                              key={uploadIndex}
                              download
                            >
                              {upload}
                            </Link>
                          ))}
                        </div>
                      )}

                      {row.uploadSurveys.length > 0 && (
                        <div className="mt-2">
                          <p className="font-semibold">Survey documents</p>
                          {row.uploadSurveys.map((upload, uploadIndex) => (
                            <Link
                              href={
                                row.getSurveyUrl ? row.getSurveyUrl.href : '#'
                              }
                              className="pl-2"
                              key={uploadIndex}
                              download
                            >
                              {upload}
                            </Link>
                          ))}
                        </div>
                      )}

                      {row.uploadOthers.length > 0 && (
                        <div className="mt-2">
                          <p className="font-semibold">Other documents</p>
                          {row.uploadOthers.map((upload, uploadIndex) => (
                            <Link
                              href={
                                row.getOtherUrl ? row.getOtherUrl.href : '#'
                              }
                              className="pl-2"
                              key={uploadIndex}
                              download
                            >
                              {upload}
                            </Link>
                          ))}
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      {new Date(row._creationTime).toLocaleString()}
                    </TableCell>

                    <TableCell>{row.receivedBids.length}</TableCell>
                    <TableCell>
                      <Button
                        className="w-24 rounded-lg bg-primary-azureBlue py-2 text-white hover:shadow-lg"
                        onClick={() =>
                          router.push(`/client/request/${row._id}`)
                        }
                      >
                        View
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
            total={reqTotal}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
