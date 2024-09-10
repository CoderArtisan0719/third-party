import type { Key, MouseEventHandler } from 'react';
import { useEffect, useState } from 'react';

import MultipleCard from '@/components/cards/MultipleCard';
import SurveyCard from '@/components/cards/SurveyCard';

type Option = {
  title: string;
  image: string;
  imageAlt: string;
  onClick: MouseEventHandler<HTMLDivElement>;
};

type SurveyProps = {
  onBack?: MouseEventHandler<HTMLButtonElement>;
  options: Option[];
  survey?: string;
  ALTAoptions: string[];
  otherSurvey: string;
  requestSetter: (item: string, value: any) => void;
};

const Survey = (props: SurveyProps) => {
  const [choices, setChoices] = useState<string[]>(props.ALTAoptions);

  useEffect(() => {
    props.requestSetter('ALTAoptions', choices);
  }, [choices]);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="grid w-full gap-8 p-4 sm:w-3/4 lg:grid-cols-3">
        {props.options.map((option, index) => (
          <SurveyCard
            key={index}
            title={option.title}
            image={option.image}
            imageAlt={option.imageAlt}
            active={props.survey === option.title}
            onClick={option.onClick}
          />
        ))}
      </div>

      <div>
        {props.survey === 'ALTA Survey' &&
          [
            'Standard ALTA Endorsement',
            'Ultimate ALTA Endorsement',
            'Advanced ALTA Endorsement',
          ].map((list: string, index: Key | null | undefined) => (
            <MultipleCard
              content={list}
              key={index}
              choices={choices}
              setChoices={setChoices}
            />
          ))}
      </div>

      {props.survey === 'Other' && (
        <input
          type="text"
          placeholder="name"
          className="mt-4 w-full rounded border border-gray-500 p-2 lg:w-3/4"
          value={props.otherSurvey}
          onChange={(e) => props.requestSetter('otherSurvey', e.target.value)}
        />
      )}
    </div>
  );
};

export default Survey;
