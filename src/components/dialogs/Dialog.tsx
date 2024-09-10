import type {
  Dispatch,
  MouseEventHandler,
  ReactNode,
  SetStateAction,
} from 'react';
import React, { useEffect } from 'react';

import SurveyButton from '@/components/common/SurveyButton';

type DialogProps = {
  title: string;
  content?: string;
  onCancel?: MouseEventHandler<HTMLButtonElement>;
  onBack?: MouseEventHandler<HTMLButtonElement>;
  onNext?: MouseEventHandler<HTMLButtonElement>;
  onSubmit?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  step: string;
  setStep: Dispatch<SetStateAction<string>>;
  loading1?: boolean;
  loading2?: boolean;
  loading3?: boolean;
  submitting?: boolean;
};

const Dialog = (props: DialogProps) => {
  const childrenWithProps = React.Children.map(
    props.children,
    (child: ReactNode) =>
      React.isValidElement(child)
        ? React.cloneElement(child, { ...props })
        : child,
  );

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      props.setStep('');
    }
  };

  useEffect(() => {
    if (props.step === props.title) {
      // Add event listener for keydown when dialog is open
      window.addEventListener('keydown', handleKeyDown);

      // Clean up the event listener on unmount or when props.step changes
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }

    return () => {};
  }, [props.step]);

  if (props.step !== props.title) return null;

  return (
    <div className="fixed left-0 top-0 z-[999999] flex size-full justify-center bg-[#00000066]">
      <div className="max-h-3/4 relative mx-4 mb-12 mt-24 flex w-full flex-col items-center justify-around rounded-2xl border bg-white px-4 pb-4 pt-8 text-center opacity-100 lg:w-3/4">
        <div>
          <p className="mb-6 text-4xl">{props.title}</p>
          {props.content && <p className="mb-4 text-lg">{props.content}</p>}
        </div>

        <div className="flex w-full justify-center overflow-auto">
          {childrenWithProps}
        </div>

        <div className="flex justify-center">
          {props.onCancel && (
            <SurveyButton
              label="Cancel"
              bg="bg-gray-300"
              text="text-black"
              onClick={props.onCancel}
            />
          )}

          {props.onBack && (
            <SurveyButton
              label="Back"
              bg="bg-gray-300"
              text="text-black"
              onClick={props.onBack}
            />
          )}

          {props.onNext && (
            <SurveyButton
              label="Next"
              bg="bg-primary-azureBlue"
              text="text-white"
              onClick={props.onNext}
            />
          )}

          {props.onSubmit && (
            <SurveyButton
              disabled={
                props.loading1 ||
                props.loading2 ||
                props.loading3 ||
                props.submitting
              }
              label={!props.submitting ? 'Submit' : 'Please wait...'}
              bg="bg-primary-deepBlue"
              text="text-white"
              onClick={props.onSubmit}
            />
          )}
        </div>

        <svg
          height="12"
          width="12"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute right-4 top-4 cursor-pointer stroke-gray-500"
          strokeWidth="3"
          role="button" // Accessibility improvement
          tabIndex={0} // Accessibility improvement
          onClick={() => props.setStep('')}
        >
          <line x1="0" y1="0" x2="12" y2="12" />
          <line x1="12" y1="0" x2="0" y2="12" />
        </svg>
      </div>
    </div>
  );
};

export default Dialog;
