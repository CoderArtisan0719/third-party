/* eslint-disable no-underscore-dangle */
import { useMutation } from 'convex/react';
import { useRouter } from 'next/router';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import Asset from '@/components/dialogs/Asset';
import Dialog from '@/components/dialogs/Dialog';
import Property from '@/components/dialogs/Property';
import SiteContactInfo from '@/components/dialogs/SiteContactInfo';
import Survey from '@/components/dialogs/Survey';
import TurnaroundTime from '@/components/dialogs/TurnaroundTime';
import Upload from '@/components/dialogs/Upload';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Toaster } from '@/components/ui/sonner';
import type { RootState } from '@/store';
import { setReq } from '@/store/slices/requestSlice';
import { setIntendedDo } from '@/store/slices/routerSlice';
import { defaultRequest } from '@/utils/initials';
import type { BidType, RequestType, UserTableType } from '@/utils/types';

import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

type DashboardHeaderProps = {
  title: string;
  newReqFlag?: boolean;
  setNewReqFlag?: Dispatch<SetStateAction<boolean>>;
};

const DashboardHeader = (props: DashboardHeaderProps) => {
  const [user, setUser] = useState<UserTableType>();
  const [total, setTotal] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [step, setStep] = useState('');
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [request, setRequest] = useState<RequestType>(defaultRequest);

  const router = useRouter();

  const dispatch = useDispatch();
  const req = useSelector((state: RootState) => state.request);
  const intendedDo = useSelector((state: RootState) => state.router.intendedDo);
  const clientMutation = useMutation(api.bids.getActiveByClientId);
  const vendorMutation = useMutation(api.bids.getActiveByVendorId);
  const insertRequest = useMutation(api.requests.create);

  const requestSetter = (item: string, value: any) =>
    setRequest((prev) => ({ ...prev, [item]: value }));

  const SurveyOptions = [
    {
      title: 'Boundary Survey',
      image: '/icons/survey.svg',
      imageAlt: 'survey.svg',
      onClick: () => requestSetter('survey', 'Boundary Survey'),
    },

    {
      title: 'ALTA Survey',
      image: '/icons/survey.svg',
      imageAlt: 'survey.svg',
      onClick: () => requestSetter('survey', 'ALTA Survey'),
    },

    {
      title: 'Other',
      image: '/icons/survey.svg',
      imageAlt: 'survey.svg',
      onClick: () => requestSetter('survey', 'Other'),
    },
  ];

  const handleSubmit = async () => {
    setSubmitting(true);

    const userInfo = sessionStorage.getItem('userInfo');

    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);

      if (intendedDo === 'client-request')
        await insertRequest({
          ...req,
          userId: parsedUserInfo._id as Id<'users'>,
        });
      else
        await insertRequest({
          ...request,
          userId: parsedUserInfo._id as Id<'users'>,
        });

      if (props.setNewReqFlag) props.setNewReqFlag((prev) => !prev);
      setConfirm(true);
      setSubmitting(false);
      dispatch(setIntendedDo(''));
      setRequest(defaultRequest);
    }
  };

  useEffect(() => {
    const userInfo = sessionStorage.getItem('userInfo');

    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      setUser(parsedUserInfo);

      if (parsedUserInfo.type === 'client')
        clientMutation({
          clientId: parsedUserInfo._id as Id<'users'>,
          filter: '',
          page: 0,
          perpage: 0,
        }).then((res: { bids: BidType[]; total: number }) => {
          setTotal(res.total);

          if (intendedDo === 'client-request') {
            setStep('Uploads and Additional Information');

            setRequest({
              ...req,
              requestUser: {
                email: parsedUserInfo.email,
                creationTime: parsedUserInfo._creationTime,
                fullname: parsedUserInfo.fullname,
              },
            });

            dispatch(setIntendedDo(''));
            dispatch(
              setReq({
                userId: '' as Id<'users'>,
                kind: 'Surveys',
                survey: 'Boundary Survey',
                asset: 'Multifamily',
                ALTAoptions: ['Standard ALTA Endorsement'],
                propertyAddress: '1600 Amphitheatre Parkway, Mountain View, CA',
                countyAccountInfo: '',
                siteContactInfoName: '',
                siteContactInfoPhone: '',
                siteContactInfoEmail: '',
                turnaroundTime: 'As soon as possible, or',
                specificDate: '',
                additionalInfo: [],
                otherSurvey: '',
                uploadCommits: [],
                uploadSurveys: [],
                uploadOthers: [],
                receivedBids: [],
                receivedUsers: [],
                status: 'open',
                requestUser: {
                  fullname: '',
                  email: '',
                  creationTime: 0,
                },
              }),
            );
          } else
            setRequest({
              ...request,
              requestUser: {
                email: parsedUserInfo.email,
                creationTime: parsedUserInfo._creationTime,
                fullname: parsedUserInfo.fullname,
              },
            });
        });
      else
        vendorMutation({
          vendorId: parsedUserInfo._id as Id<'users'>,
          filter: '',
          page: 0,
          perpage: 0,
        }).then((res: { bids: BidType[]; total: number }) => {
          setTotal(res.total);

          if (intendedDo === 'client-request') {
            setStep('Uploads and Additional Information');

            setRequest({
              ...req,
              requestUser: {
                email: parsedUserInfo.email,
                creationTime: parsedUserInfo._creationTime,
                fullname: parsedUserInfo.fullname,
              },
            });

            dispatch(setIntendedDo(''));
            dispatch(
              setReq({
                userId: '' as Id<'users'>,
                kind: 'Surveys',
                survey: 'Boundary Survey',
                asset: 'Multifamily',
                ALTAoptions: ['Standard ALTA Endorsement'],
                propertyAddress: '1600 Amphitheatre Parkway, Mountain View, CA',
                countyAccountInfo: '',
                siteContactInfoName: '',
                siteContactInfoPhone: '',
                siteContactInfoEmail: '',
                turnaroundTime: 'As soon as possible, or',
                specificDate: '',
                additionalInfo: [],
                otherSurvey: '',
                uploadCommits: [],
                uploadSurveys: [],
                uploadOthers: [],
                receivedBids: [],
                receivedUsers: [],
                status: 'open',
                requestUser: {
                  fullname: '',
                  email: '',
                  creationTime: 0,
                },
              }),
            );
          } else
            setRequest({
              ...request,
              requestUser: {
                email: parsedUserInfo.email,
                creationTime: parsedUserInfo._creationTime,
                fullname: parsedUserInfo.fullname,
              },
            });
        });
    }
  }, []);

  return (
    <div className="flex items-center justify-between">
      <div className="text-4xl font-bold">
        {props.title}
        {router.route.includes('active') ? ` (${total})` : ''}
      </div>

      <div className="flex items-center">
        <div className="mr-8 cursor-pointer rounded-lg border border-slate-500 p-2 hover:bg-slate-50">
          <img src="/img/alarm.png" className="size-5" alt="alarm.png" />
        </div>

        {user?.type === 'client' && (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button className="border border-primary-azureBlue bg-blue-100 text-primary-azureBlue">
                New Request
              </Button>
            </PopoverTrigger>
            <PopoverContent className="mr-8 rounded-lg border border-slate-600 bg-white lg:mr-12">
              <div className="grid gap-1.5">
                <Button
                  className="border border-slate-600 bg-slate-50 text-slate-600 hover:bg-slate-200"
                  onClick={() => {
                    setStep('What type of survey is required?');
                    requestSetter('kind', 'Surveys');
                  }}
                >
                  Surveys
                </Button>
                <Button
                  className="border border-slate-600 bg-slate-50 text-slate-600 hover:bg-slate-200"
                  onClick={() => {
                    setStep('What type of asset will this be for?');
                    requestSetter('kind', 'Inspections');
                  }}
                >
                  Inspections
                </Button>
                <Button
                  className="border border-slate-600 bg-slate-50 text-slate-600 hover:bg-slate-200"
                  onClick={() => {
                    setStep('What type of asset will this be for?');
                    requestSetter('kind', 'Environmental Site Assessment');
                  }}
                >
                  Environmental Site Assessment
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* ------------------------------- Dialog - What type of survey is required? ------------------------------- */}

      <Dialog
        title="What type of survey is required?"
        step={step}
        setStep={setStep}
        onCancel={() => setStep('')}
        onNext={() => {
          if (request.survey === 'Other' && request.otherSurvey === '')
            toast('Alert!', {
              description: 'Please fill required field.',
            });
          else if (
            request.survey === 'ALTA Survey' &&
            !request.ALTAoptions.length
          )
            toast('Alert!', {
              description: 'Please select one endorsement at least.',
            });
          else setStep('Property Address');
        }}
      >
        <Survey
          options={SurveyOptions}
          survey={request.survey}
          ALTAoptions={request.ALTAoptions}
          otherSurvey={request.otherSurvey}
          requestSetter={requestSetter}
        />
      </Dialog>

      {/* ------------------------------- Dialog - What type of asset will this be for? ------------------------------- */}

      <Dialog
        title="What type of asset will this be for?"
        content="Please indicate a asset type required:"
        step={step}
        setStep={setStep}
        onCancel={() => setStep('')}
        onNext={() => {
          if (request.asset === '')
            toast('Alert!', {
              description: 'Please select required field.',
            });
          else setStep('Property Address');
        }}
      >
        <Asset asset={request.asset} requestSetter={requestSetter} />
      </Dialog>

      {/* ------------------------------- Dialog - Property Address ------------------------------- */}

      <Dialog
        title="Property Address"
        step={step}
        setStep={setStep}
        onBack={() =>
          request.kind === 'Surveys'
            ? setStep('What type of survey is required?')
            : setStep('What type of asset will this be for?')
        }
        onNext={() => {
          if (request.propertyAddress === '')
            toast('Alert!', {
              description: 'Please select required field.',
            });
          else setStep('Site Contact Information');
        }}
      >
        <Property
          propertyAddress={request.propertyAddress}
          countyAccountInfo={request.countyAccountInfo}
          requestSetter={requestSetter}
        />
      </Dialog>

      {/* ------------------------------- Dialog - Site Contact Information ------------------------------- */}

      <Dialog
        title="Site Contact Information"
        content="Please enter the contact information for the persons on-site that will be available to conduct the survey"
        step={step}
        setStep={setStep}
        onBack={() => setStep('Property Address')}
        onNext={() => {
          if (
            request.siteContactInfoEmail === '' ||
            request.siteContactInfoPhone === '' ||
            request.siteContactInfoName === ''
          )
            toast('Alert!', {
              description: 'Please fill all required field.',
            });
          else setStep('Turnaround Time');
        }}
      >
        <SiteContactInfo
          name={request.siteContactInfoName}
          phone={request.siteContactInfoPhone}
          email={request.siteContactInfoEmail}
          requestSetter={requestSetter}
        />
      </Dialog>

      {/* ------------------------------- Dialog - Turnaround Time ------------------------------- */}

      <Dialog
        title="Turnaround Time"
        content="Please indicate a Turnaround time required:"
        step={step}
        setStep={setStep}
        onBack={() => setStep('Site Contact Information')}
        onNext={() => {
          if (
            request.turnaroundTime === 'By a specific date' &&
            request.specificDate === ''
          )
            toast('Alert!', {
              description: 'Please select specific date.',
            });
          else setStep('Uploads and Additional Information');
        }}
      >
        <TurnaroundTime
          turnaroundTime={request.turnaroundTime}
          specificDate={request.specificDate}
          requestSetter={requestSetter}
        />
      </Dialog>

      {/* ------------------------------- Dialog - Uploads and Additional Information ------------------------------- */}

      <Dialog
        title="Uploads and Additional Information"
        step={step}
        setStep={setStep}
        onBack={() => setStep('Turnaround Time')}
        onSubmit={handleSubmit}
        loading1={loading1}
        loading2={loading2}
        loading3={loading3}
        submitting={submitting}
      >
        <Upload
          additionalInfo={request.additionalInfo}
          uploadCommits={request.uploadCommits}
          uploadSurveys={request.uploadSurveys}
          uploadOthers={request.uploadOthers}
          requestSetter={requestSetter}
          loading1={loading1}
          loading2={loading2}
          loading3={loading3}
          setLoading1={setLoading1}
          setLoading2={setLoading2}
          setLoading3={setLoading3}
        />
      </Dialog>

      {/* ------------------------------- Confirm Success ------------------------------- */}

      {confirm && (
        <div
          className="fixed left-0 top-0 z-20 flex size-full items-start justify-center bg-[#00000066]"
          onClick={() => {
            setConfirm(false);
            setStep('');
            dispatch(setIntendedDo(''));
          }}
        >
          <div
            className="relative mx-4 mt-36 w-full rounded-2xl border bg-[#f9f9f9] bg-[url('/img/pattern.svg')] px-4 pb-4 pt-8 text-center opacity-100 sm:w-1/3 lg:w-1/4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-6 text-2xl">Successfully sent</p>

            <button
              className="rounded bg-primary-azureBlue px-4 py-2 text-white"
              onClick={() => {
                setConfirm(false);
                setStep('');
                dispatch(setIntendedDo(''));
              }}
            >
              confirm
            </button>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default DashboardHeader;
