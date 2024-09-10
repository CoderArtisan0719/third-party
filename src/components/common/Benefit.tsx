import className from 'classnames';
import type { ReactNode } from 'react';

import Section from '@/components/common/Section';

type BenefitProps = {
  title: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
  children: ReactNode;
  className?: string;
};

const Benefit = (props: BenefitProps) => {
  const verticalFeatureClass = className('flex', 'flex-wrap', 'items-center', {
    'flex-row-reverse': props.reverse,
  });

  return (
    <Section className={props.className}>
      <div className={verticalFeatureClass}>
        <div className="w-full px-6 sm:w-1/2">
          <div className="text-4xl font-extrabold text-primary-deepBlue">
            {props.title}
          </div>

          <div className="mt-6 text-xl leading-9">{props.children}</div>
        </div>

        <div className="w-full p-6 sm:w-1/2">
          <img src={props.image} alt={props.imageAlt} />
        </div>
      </div>
    </Section>
  );
};

export default Benefit;
