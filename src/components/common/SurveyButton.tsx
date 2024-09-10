import type { MouseEventHandler } from 'react';

type SurveyButtonProps = {
  label: string;
  bg: string;
  text: string;
  disabled?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

const SurveyButton = (props: SurveyButtonProps) => (
  <button
    onClick={props.onClick}
    className={`hover:text-opacity-/70 hover:bg-opacity-/70 mx-1 mt-4 flex cursor-pointer justify-between rounded px-4 py-2 ${
      props.bg
    } ${props.text}`}
    disabled={props.disabled}
  >
    {props.label === 'Back' && (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 18L9 12L15 6"></path>
      </svg>
    )}

    <span className="px-4">{props.label}</span>

    {props.label === 'Next' && (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 6l6 6-6 6"></path>
      </svg>
    )}
  </button>
);

export default SurveyButton;
