import type { MouseEventHandler } from 'react';

type SurveyCardProps = {
  title: string;
  content?: string;
  image: string;
  imageAlt: string;
  info?: string;
  active: boolean;
  onClick?: MouseEventHandler;
};

const SurveyCard = (props: SurveyCardProps) => (
  <div className="relative flex">
    <div
      className={`group relative w-full cursor-pointer rounded border bg-white py-8 transition-all duration-100 ease-linear hover:-translate-y-1 hover:border-primary-azureBlue hover:shadow-2xl hover:shadow-cyan-200 ${
        props.active
          ? '-translate-y-1 border-primary-azureBlue shadow-2xl shadow-cyan-200'
          : ''
      }`}
      onClick={props.onClick}
    >
      <span className="relative mx-auto mb-4 flex size-[130px] items-center justify-center rounded-full border-4 group-hover:border-primary-azureBlue">
        <img src={props.image} className="h-[70px]" alt={props.imageAlt} />
      </span>

      <p className="font-semibold">{props.title}</p>

      <p className="text-gray-500">{props.content}</p>
    </div>

    {props.info && (
      <span className="group absolute right-2 top-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          className="fill-gray-500 group-hover:fill-primary-azureBlue"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12" y2="8"></line>
        </svg>

        <div className="absolute -inset-x-14 bottom-full mb-2 whitespace-nowrap rounded bg-gray-800 px-3 py-2 text-center text-xs text-white opacity-0 transition-all duration-200 group-hover:opacity-100">
          {props.info}
          <div className="absolute inset-x-0 bottom-0 mx-auto -mb-1 size-3 rotate-45 bg-gray-800"></div>
        </div>
      </span>
    )}
  </div>
);

export default SurveyCard;
