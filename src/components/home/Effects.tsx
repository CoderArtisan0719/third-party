import Section from '@/components/common/Section';

const Effects = () => (
  <div className="flex bg-primary-azureBlue p-4">
    <Section
      className="flex w-full flex-wrap justify-around text-xl text-white"
      yPadding="py-0"
    >
      <div className="hidden sm:block sm:text-center">
        Used by over 1 million movers in the UK
      </div>

      <div className="hidden lg:block lg:text-center">Excellent Trustpilot</div>

      <div className="text-center">Save up to 70% on the cost of moving</div>
    </Section>
  </div>
);

export default Effects;
