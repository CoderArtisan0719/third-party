/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';

import Benefit from '@/components/common/Benefit';

const Benefits = () => (
  <div>
    <Benefit
      title="What is thirdparties?"
      image="/img/surveying_hand.png"
      imageAlt="surveying_hand"
    >
      <p className="mt-4">
        As the home of moving home, Compare My Move helps over 1 million UK
        movers get connected with the best professionals in the business every
        year. We will only connect you with verified RICS or RPSA regulated
        property surveyors, depending on the service required. This ensures you
        receive high-quality reports to help you through the moving process.
      </p>
    </Benefit>

    <Benefit
      title="What is Surveys?"
      image="/img/surveying_illustrations_1_V_1_01.png"
      imageAlt="surveying_illustrations_1_V_1_01"
      reverse
    >
      <p className="mt-4">
        An accurate property survey will give you advice on the property, its
        construction and any potential environmental issues. This can be crucial
        information when buying or selling a property as it highlights whether
        the purchase is a worthy investment.
      </p>
    </Benefit>

    <Benefit
      title="What is Inspections?"
      image="/img/surveying_illustrations_3_V_1_01.png"
      imageAlt="surveying_illustrations_3_V_1_01"
      reverse
    >
      <p className="mt-4">
        Now known as a RICS Home Survey Level 2 Report, the{' '}
        <Link className="font-semibold text-primary-deepBlue" href="#">
          HomeBuyers Survey
        </Link>{' '}
        is recommended for most buyers and modern property types. Our home buyer
        survey quotes will help you find a reliable surveyor to inspect the
        property and produce an accurate report. The average cost of a Level 2
        Survey is £500 - this was calculated for a property valued at the
        average UK house price of £267,000.
      </p>
    </Benefit>

    <Benefit
      title="What is Environmemtal Site Assessment?"
      image="/img/surveying_illustrations_2_V_1_01.png"
      imageAlt="surveying_illustrations_2_V_1_01"
    >
      <p className="mt-4">
        A RICS{' '}
        <Link className="font-semibold text-primary-deepBlue" href="#">
          Building Survey
        </Link>
        , or Level 3 Home Survey, offers an in-depth and detailed report on the
        construction and condition of the building. The inspection will be very
        thorough with surveyors reviewing internal and external factors of the
        property, as well as hard to access areas. This type of home survey will
        cost an average of <span className="font-bold">£800</span> in the UK,
        though it could be as cheap as £630 and as expensive as £1,200.
      </p>
    </Benefit>
  </div>
);

export default Benefits;
