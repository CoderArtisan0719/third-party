/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import { useMutation } from 'convex/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import RequestTable from '@/components/client/RequestTable';
import Meta from '@/components/common/Meta';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { RequestType, UserTableType } from '@/utils/types';

import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';

const ClientRequest = () => {
  const [request, setRequest] = useState<RequestType | null>(null);
  const [user, setUser] = useState<UserTableType>();

  const router = useRouter();

  const reqMutation = useMutation(api.requests.getById);

  const fetchRequest = async () => {
    if (router.query.id) {
      try {
        const res1 = await reqMutation({
          requestId: router.query.id as Id<'requests'>,
        });

        setRequest(res1);
      } catch (error) {
        console.error('Error fetching request:', error);
      }
    }
  };

  useEffect(() => {
    const userInfo = sessionStorage.getItem('userInfo');

    if (!userInfo) router.push('/auth/signin/vendor');
    else {
      const parsedUserInfo = JSON.parse(userInfo);
      const baseUrl =
        process.env.SITE_URL || 'https://rugged-trout-139.convex.site';
      const getPhotoUrl = new URL(`${baseUrl}/getFile`);
      getPhotoUrl.searchParams.set('storageId', parsedUserInfo.photo as string);

      const userWithPhoto = { ...parsedUserInfo, photo: getPhotoUrl.href };
      setUser(userWithPhoto);
    }
  }, []);

  useEffect(() => {
    fetchRequest();
  }, [router.query.id]);

  return (
    <div className="grid grid-cols-1 lg:h-screen lg:grid-cols-2 xl:grid-cols-3">
      <Meta title="client" />

      <div className="flex min-h-screen flex-col items-center justify-center gap-2 overflow-auto border-gray-300 xl:col-span-2 xl:border-r-4">
        <RequestTable />
        <p className="text-lg">
          You can accept an incoming bid if you have a balance{' '}
          <span className="text-red-500">greater than</span> the vendor&apos;s
          bid amount.
        </p>
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

          <hr className="border border-slate-300" />

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
                {request && request.turnaroundTime === 'By a specific date' && (
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
          </div>

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
            className="mt-4 w-full rounded-full border border-primary-azureBlue bg-blue-50 py-6 text-lg text-primary-azureBlue"
            onClick={() => router.push('/client')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientRequest;
