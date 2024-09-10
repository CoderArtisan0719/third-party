import type { ReactNode } from 'react';

type SectionProps = {
  title?: string;
  description?: string;
  yPadding?: string;
  children: ReactNode;
  className?: string;
};

const Section = (props: SectionProps) => (
  <div
    className={`${props.className} mx-auto max-w-screen-xl text-primary-deepBlue ${
      props.yPadding ? props.yPadding : 'py-16'
    }`}
  >
    {(props.title || props.description) && (
      <div className="mb-12 text-center">
        {props.title && <h2 className="text-4xl font-bold">{props.title}</h2>}

        {props.description && (
          <div className="mt-4 text-xl md:px-20">{props.description}</div>
        )}
      </div>
    )}

    {props.children}
  </div>
);

export default Section;
