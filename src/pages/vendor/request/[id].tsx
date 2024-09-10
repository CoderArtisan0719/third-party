/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import { useMutation } from 'convex/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Meta from '@/components/common/Meta';
import BidDialog from '@/components/dialogs/Bid';
import SuccessDialog from '@/components/dialogs/BidSuccess';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { BidType, RequestType, UserTableType } from '@/utils/types';

import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';

const VendorRequest = () => {
  const [whichTab, setWhichTab] = useState('Details');
  const [bidVisible, setBidVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [request, setRequest] = useState<RequestType | null>(null);
  const [bids, setBids] = useState<BidType[]>([]);
  const [amount, setAmount] = useState<number>(15);
  const [user, setUser] = useState<UserTableType>();

  const router = useRouter();

  const reqMutation = useMutation(api.requests.getById);
  const bidMutation = useMutation(api.bids.getByRequestId);

  useEffect(() => {
    const userInfo = sessionStorage.getItem('userInfo');

    if (!userInfo) router.push('/auth/signin/vendor');
    else {
      const parsedUserInfo = JSON.parse(userInfo);
      setUser(parsedUserInfo);
    }
  }, []);

  const fetchRequest = async () => {
    if (router.query.id) {
      try {
        const res1 = await reqMutation({
          requestId: router.query.id as Id<'requests'>,
        });

        setRequest(res1);

        const res2 = await bidMutation({
          requestId: router.query.id as Id<'requests'>,
          filter: '',
          page: 0,
          perpage: 0,
        });

        setBids(res2.bids);
      } catch (error) {
        console.error('Error fetching request:', error);
      }
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:h-screen lg:grid-cols-2 xl:grid-cols-3">
      <Meta title="vendor" />

      <div className="relative flex items-center justify-center border-r-4 border-gray-300 lg:p-20 xl:col-span-2">
        {bidVisible && (
          <BidDialog
            amount={amount}
            setAmount={setAmount}
            requestId={router.query.id as Id<'requests'>}
            clientId={request!.userId}
            setBidVisible={setBidVisible}
            setSuccessVisible={setSuccessVisible}
          />
        )}

        {successVisible && (
          <SuccessDialog
            amount={amount}
            successVisible={successVisible}
            setSuccessVisible={setSuccessVisible}
          />
        )}
      </div>

      <div className="h-full overflow-auto">
        <div className="border-b-2 p-16">
          <div>
            <span className="mr-4 text-2xl font-semibold">
              {request?.kind}
              {request?.kind && request?.kind === 'Surveys' && ' - '}
              {request?.kind === 'Surveys' && request.survey}
              {(request?.kind === 'Inspections' ||
                request?.kind === 'Environmental Site Assessment') &&
                request.asset}
            </span>
          </div>

          <p className="mb-8 mt-2">
            Minimum bid: <span>15 USD</span>
          </p>

          <div className="mt-4 flex w-full border-b-2 border-b-gray-200">
            {['Details', 'Bids'].map((tab) => (
              <div
                className={
                  tab === whichTab
                    ? 'mb-[-2px] mr-4 cursor-pointer border-b-2 border-b-black py-2'
                    : 'mr-4 cursor-pointer py-2'
                }
                onClick={() => setWhichTab(tab)}
                key={tab}
              >
                {tab}
              </div>
            ))}
          </div>

          {whichTab === 'Details' && (
            <div>
              {request &&
                request.kind === 'Surveys' &&
                request.survey === 'ALTA Survey' && (
                  <div className="mt-4">
                    <p className="font-semibold">ALTA options:</p>
                    {request?.ALTAoptions.map((ALTA, index) => (
                      <p className="pl-8" key={index}>
                        {ALTA}
                      </p>
                    ))}
                  </div>
                )}

              {request &&
                request.kind === 'Surveys' &&
                request.survey === 'Other' && (
                  <div className="mt-4">
                    <p className="font-semibold">Other Surveys:</p>
                    <p className="pl-8">{request?.otherSurvey}</p>
                  </div>
                )}

              <div className="mt-4">
                <p className="font-semibold">Property Address:</p>
                <p className="pl-8">{request?.propertyAddress}</p>
              </div>

              <div className="mt-4">
                <p className="font-semibold">County Account Information:</p>
                <p className="pl-8">{request?.countyAccountInfo ?? ''}</p>
              </div>

              <div className="mt-4">
                <p className="font-semibold">Turnaround Time:</p>
                <p className="pl-8">
                  {request?.turnaroundTime}{' '}
                  {request &&
                    request.turnaroundTime === 'By a specific date' && (
                      <span className="text-white">
                        ( {request?.specificDate} )
                      </span>
                    )}
                </p>
              </div>

              <div className="mt-4">
                <p className="font-semibold">Additional Information:</p>
                {request?.additionalInfo.map((addi, addiIndex) => (
                  <p className="pl-8" key={addiIndex}>
                    {addi.key}: {addi.value}
                  </p>
                ))}
              </div>

              {request && request?.uploadCommits.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold">Commitment documents:</p>
                  {request?.uploadCommits.map((upload, uploadIndex) => (
                    <p className="pl-8" key={uploadIndex}>
                      {upload}
                    </p>
                  ))}
                </div>
              )}

              {request && request?.uploadSurveys.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold">Survey documents:</p>
                  {request?.uploadSurveys.map((upload, uploadIndex) => (
                    <p className="pl-8" key={uploadIndex}>
                      {upload}
                    </p>
                  ))}
                </div>
              )}

              {request && request?.uploadOthers.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold">Other documents:</p>
                  {request?.uploadOthers.map((upload, uploadIndex) => (
                    <p className="pl-8" key={uploadIndex}>
                      {upload}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {whichTab === 'Bids' && (
            <div>
              {bids.map((bid, index) => (
                <div className="mt-4 rounded-lg border px-4 py-2" key={index}>
                  <p>
                    <span className="w-10 font-bold">Name:</span>{' '}
                    {bid.vendor.fullname}
                  </p>

                  <p>
                    <span className="w-10 font-bold">E-mail:</span>{' '}
                    {bid.vendor.email}
                  </p>

                  <p>
                    <span className="w-10 font-bold">Bid amount:</span> $
                    {bid.amount}
                  </p>

                  <p>
                    <span className="w-10 font-bold">Status:</span> {bid.status}
                  </p>

                  <p>
                    <span className="w-10 font-bold">Bidded at:</span>{' '}
                    {new Date(bid._creationTime).toLocaleString()}{' '}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 grid grid-cols-2">
            <div>
              <div>Creator</div>

              <div className="flex items-center pt-2">
                <div className="size-12 flex-none rounded-full">
                  <Avatar className="size-full">
                    <AvatarImage className="border-none" src={user?.photo} />
                    <AvatarFallback className="bg-primary-azureBlue text-2xl font-semibold text-white">
                      {user?.fullname.split(' ')[0]?.[0]?.toLocaleUpperCase()}
                      {user?.fullname.split(' ')[1]?.[0]?.toLocaleUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <span className="p-4">{user?.fullname}</span>
              </div>
            </div>

            <div>
              <div>Minimum bid</div>

              <div className="flex items-center pt-2">
                <img
                  src="/img/card.png"
                  width="50"
                  alt="martyn_circles_250.png"
                />

                <span className="p-4">15 USD</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-16">
          <Button
            className="w-full rounded-full bg-primary-azureBlue py-6 text-lg text-white"
            onClick={() => setBidVisible(true)}
          >
            Place a Bid
          </Button>

          <Button
            className="mt-4 w-full rounded-full border border-primary-azureBlue bg-blue-50 py-6 text-lg text-primary-azureBlue"
            onClick={() => router.push('/vendor')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorRequest;
