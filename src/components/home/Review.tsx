import ReviewCard from '@/components/cards/ReviewCard';
import Section from '@/components/common/Section';

const Review = () => (
  <Section
    title="Customer Reviews"
    description="We regularly monitor our partners to ensure they are working to high standards. Take a look at some of our 5-star reviews from happy customers."
    className="px-4"
  >
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <ReviewCard
        comment="The main contact I had (James) was incredibly thorough, helpful, always willing to take my calls and answers any and all silly questions I had. Can't recommend them enough!"
        who="Alex Cheshire"
        when="17/07/24"
        from="Moving from Birmingham"
      />

      <ReviewCard
        comment="The main contact I had (James) was incredibly thorough, helpful, always willing to take my calls and answers any and all silly questions I had. Can't recommend them enough!"
        who="Alex Cheshire"
        when="17/07/24"
        from="Moving from Canterbury"
      />

      <ReviewCard
        comment="The main contact I had (James) was incredibly thorough, helpful, always willing to take my calls and answers any and all silly questions I had. Can't recommend them enough!"
        who="Alex Cheshire"
        when="17/07/24"
        from="Moving from Ipswich"
      />

      <ReviewCard
        comment="The main contact I had (James) was incredibly thorough, helpful, always willing to take my calls and answers any and all silly questions I had. Can't recommend them enough!"
        who="Alex Cheshire"
        when="17/07/24"
        from="Leeds"
      />
    </div>
  </Section>
);

export default Review;
