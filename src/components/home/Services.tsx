/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable no-alert */
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import CompareCard from '@/components/cards/CompareCard';
import Section from '@/components/common/Section';
import Asset from '@/components/dialogs/Asset';
import Dialog from '@/components/dialogs/Dialog';
import Property from '@/components/dialogs/Property';
import SiteContactInfo from '@/components/dialogs/SiteContactInfo';
import Survey from '@/components/dialogs/Survey';
import TurnaroundTime from '@/components/dialogs/TurnaroundTime';
import Upload from '@/components/dialogs/Upload';
import { Toaster } from '@/components/ui/sonner';
import { setReq } from '@/store/slices/requestSlice';
import { setIntendedDo } from '@/store/slices/routerSlice';
import { defaultRequest } from '@/utils/initials';
import type { RequestType } from '@/utils/types';

const Services = () => {
  const [confirm, setConfirm] = useState(false);
  const [step, setStep] = useState('');
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [request, setRequest] = useState<RequestType>(defaultRequest);

  const requestSetter = (item: string, value: any) => {
    setRequest((prev) => ({ ...prev, [item]: value }));
  };

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

  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = () => {
    setSubmitting(true);

    const userInfo = sessionStorage.getItem('userInfo');

    if (!userInfo) {
      setSubmitting(false);
      dispatch(setReq(request));
      dispatch(setIntendedDo('client-request'));
      setRequest(defaultRequest);

      router.push('/auth/signin/client');
    } else router.back();
  };

  useEffect(() => {
    const userInfo = sessionStorage.getItem('userInfo');

    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);

      router.push(`/${parsedUserInfo.type}`);
    }
  }, []);

  return (
    <div className="relative pt-16" id="getstarted">
      <Section
        title="Compare Homebuyer Survey Quotes From Regulated Surveyors"
        description="Get started by selecting your property type"
        className="flex flex-col items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 z-0 w-full"
          viewBox="0 0 1280 200"
        >
          <path
            fill="#F4ECF5"
            d="M0 0s329.577 83.971 640 83.971S1280 0 1280 0v200H0z"
          />
        </svg>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:w-3/4">
          <CompareCard
            title="Surveys"
            onClick={() => {
              setStep('What type of survey is required?');
              requestSetter('kind', 'Surveys');
            }}
          >
            <img src="/icons/flat.svg" alt="flat.svg" />
          </CompareCard>

          <CompareCard
            title="Inspections"
            onClick={() => {
              setStep('What type of asset will this be for?');
              requestSetter('kind', 'Inspections');
            }}
          >
            <img src="/icons/house.svg" alt="house.svg" />
          </CompareCard>

          <CompareCard
            title="Environmental Site Assessments"
            onClick={() => {
              setStep('What type of asset will this be for?');
              requestSetter('kind', 'Environmental Site Assessments');
            }}
          >
            <img src="/icons/bungalow.svg" alt="bungalow.svg" />
          </CompareCard>
        </div>

        <div className="my-8 flex flex-wrap justify-center gap-8 text-xl font-semibold">
          <div className="z-10">Regulated Property Surveyors</div>
          <div className="z-10">Used by over 1 million movers in the UK</div>
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
              className="relative mx-4 mt-28 w-full rounded-2xl border bg-[#f9f9f9] bg-[url('/img/pattern.svg')] px-4 pb-4 pt-8 text-center opacity-100 sm:w-1/3 lg:w-1/4"
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
      </Section>
    </div>
  );
};

export default Services;
