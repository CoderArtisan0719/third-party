/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import { useMutation } from 'convex/react';
import type { Dispatch, SetStateAction } from 'react';
import React, { useState } from 'react';

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from '@/components/ui/animated-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { BidWithFileType } from '@/utils/types';

import { api } from '../../../convex/_generated/api';

interface PaymentDialogProps extends BidWithFileType {
  setUpdate: Dispatch<SetStateAction<boolean>>;
}

const PaymentDialog = (props: PaymentDialogProps) => {
  const [paySuccess, setPaySuccess] = useState(false);
  const [closeSuccess, setCloseSuccess] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);

  const payMutation = useMutation(api.bids.update);

  const handlePay = () => {
    setPayLoading(true);

    payMutation({ status: 'paid', bidId: props._id }).then(() => {
      setPayLoading(false);
      setPaySuccess(true);
      props.setUpdate((prev) => !prev);
    });
  };

  const handlePayAndClose = () => {
    setCloseLoading(true);

    payMutation({ status: 'closed', bidId: props._id }).then(() => {
      setCloseLoading(false);
      setCloseSuccess(true);
      props.setUpdate((prev) => !prev);
    });
  };

  if (props.status !== 'submitted') {
    return (
      <Button
        className="group/modal-btn w-full border border-green-600 bg-green-100 text-green-600 hover:bg-green-200"
        disabled
      >
        Payment
      </Button>
    );
  }

  return (
    <Modal>
      <ModalTrigger className="group/modal-btn w-full border border-green-600 bg-green-100 text-green-600 hover:bg-green-200">
        Payment
      </ModalTrigger>
      <ModalBody>
        <ModalContent className="grid gap-4 bg-white">
          <div className="flex justify-between">
            <div>
              <div className="flex items-center pt-2">
                <div className="size-12 flex-none rounded-full">
                  <Avatar className="size-full">
                    <AvatarImage
                      className="border-none"
                      src={props.vendor?.photo}
                    />
                    <AvatarFallback className="bg-primary-azureBlue text-2xl font-semibold text-white">
                      {props.vendor?.fullname
                        .split(' ')[0]?.[0]
                        ?.toLocaleUpperCase()}
                      {props.vendor?.fullname
                        .split(' ')[1]?.[0]
                        ?.toLocaleUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="grid">
                  <span className="px-2 text-lg font-semibold">
                    {props.vendor?.fullname}
                  </span>
                  <span className="px-2">{props.vendor?.email}</span>
                </div>
              </div>

              <div className="mt-4">
                <span className="font-semibold">Member Since : </span>
                {new Date(props.vendor.creationTime!).toLocaleString()}
              </div>
            </div>

            <div className="pr-8 text-xl font-semibold text-primary-azureBlue">
              ${props.amount}
            </div>
          </div>

          <div>
            <div className="mt-4 text-lg font-semibold">About Request :</div>

            <Separator className="border" />

            <p className="mt-2">
              <span className="font-semibold">Contract Since : </span>
              {new Date(props._creationTime).toLocaleString()}
            </p>

            <p className="mt-2">
              <span className="font-semibold">{props.request.kind}</span>
              {' - '}
              {props.request.kind === 'Surveys' && props.request.survey}
              {(props.request.kind === 'Inspections' ||
                props.request.kind === 'Environmental Site Assessment') &&
                props.request.asset}{' '}
              {(props.request.kind === 'Inspections' ||
                props.request.kind === 'Environmental Site Assessment' ||
                props.request.assetOther === 'Other') &&
                props.request.assetOther}
            </p>

            <p className="mt-2">
              <span className="font-semibold">Property Address : </span>{' '}
              {props.request.propertyAddress}
            </p>

            {props.request.countyAccountInfo && (
              <p>
                <span className="pl-4 font-semibold">
                  County Account Information :{' '}
                </span>{' '}
                {props.request.countyAccountInfo}
              </p>
            )}

            <div className="mt-2">
              <p className="font-semibold">Site Contact Information</p>
              <p>
                <span className="pl-4 font-semibold">E-mail : </span>
                {props.request.siteContactInfoEmail}
              </p>
              <p>
                <span className="pl-4 font-semibold">Name : </span>
                {props.request.siteContactInfoName}
              </p>
              <p>
                <span className="pl-4 font-semibold">Phone : </span>
                {props.request.siteContactInfoPhone}
              </p>
            </div>

            <p className="mt-2">
              <span className="font-semibold">Turnaround Time : </span>{' '}
              {props.request.turnaroundTime}{' '}
              {props.request.turnaroundTime === 'By a specific date' &&
                props.request.specificDate}
            </p>

            <div className="mt-2">
              <p className="font-semibold">
                Uploads and Additional Information
              </p>
              <div>
                {props.request.additionalInfo.map((addi, index) => (
                  <p key={index}>
                    <span className="pl-4 font-semibold">{addi.key} : </span>
                    {addi.value}
                  </p>
                ))}
              </div>
              <p className="mt-2">
                <span className="pl-4 font-semibold">Commitments : </span>
                {props.request.uploadCommits}
              </p>
              <p>
                <span className="pl-4 font-semibold">Surveys : </span>
                {props.request.uploadSurveys}
              </p>
              <p>
                <span className="pl-4 font-semibold">Others : </span>
                {props.request.uploadOthers}
              </p>
            </div>
          </div>

          {paySuccess && (
            <span className="my-2 text-green-600">
              Successfully paid. You must close request for this bid and then
              vendor can get payment. You also can request refund now.
            </span>
          )}

          <div className="grid">
            <Button
              className="border border-green-600 bg-green-200 text-green-600 hover:shadow-lg"
              onClick={handlePay}
              disabled={paySuccess || closeSuccess}
            >
              {payLoading ? 'Please wait...' : `Pay $${props.amount}`}
            </Button>

            <Button
              className="mt-2 gap-2 border border-green-600 bg-green-200 text-green-600 hover:shadow-lg"
              onClick={handlePayAndClose}
              disabled={closeSuccess}
            >
              {closeLoading ? (
                'Please wait...'
              ) : (
                <p>
                  <span>Pay ${props.amount}</span>
                  <span className="text-black"> & </span>
                  <span>Close Request</span>
                </p>
              )}
            </Button>
          </div>
        </ModalContent>
      </ModalBody>
    </Modal>
  );
};

export default PaymentDialog;
