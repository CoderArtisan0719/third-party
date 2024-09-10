import { useEffect, useState } from 'react';

import SingleCard from '@/components/cards/SingleCard';

type TurnaroundTimeProps = {
  turnaroundTime: string;
  specificDate: string;
  requestSetter: (item: string, value: any) => void;
};

const TurnaroundTime = (props: TurnaroundTimeProps) => {
  const [minDate, setMinDate] = useState<string>('');

  useEffect(() => {
    const today = new Date();

    // Set the date to two weeks later
    const twoWeeksLater = new Date(today);
    twoWeeksLater.setDate(today.getDate() + 14); // Add 14 days

    const formattedDate = twoWeeksLater.toISOString().split('T')[0]!; // Format YYYY-MM-DD
    setMinDate(formattedDate);
  }, []);

  return (
    <div>
      {['As soon as possible, or', 'By a specific date'].map((list) => (
        <SingleCard
          id="turnaroundTime"
          content={list}
          key={list}
          choice={props.turnaroundTime}
          setChoice={props.requestSetter}
        />
      ))}

      {props.turnaroundTime === 'By a specific date' && (
        <input
          type="date"
          className="rounded-lg border border-primary-deepBlue px-16 py-2"
          min={minDate}
          value={props.specificDate}
          onChange={(e) => props.requestSetter('specificDate', e.target.value)}
        />
      )}
    </div>
  );
};

export default TurnaroundTime;
