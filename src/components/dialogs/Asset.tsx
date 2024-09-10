import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type AssetProps = {
  asset?: string;
  requestSetter: (item: string, value: any) => void;
};

const Asset = (props: AssetProps) => {
  const [choice, setChoice] = useState(props.asset);
  const [other, setOther] = useState('');

  useEffect(() => {
    props.requestSetter('asset', choice);
    props.requestSetter('assetOther', other);
  }, [choice, other]);

  return (
    <div>
      <Select value={choice} onValueChange={setChoice}>
        <SelectTrigger className="w-48 border-primary-deepBlue">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent className="w-48 bg-white">
          {[
            'Multifamily',
            'Industrial',
            'Land',
            'Retail',
            'Office',
            'Other',
          ].map((answer, index) => (
            <SelectItem
              className="cursor-pointer hover:bg-slate-100"
              value={answer}
              key={index}
            >
              {answer}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {choice === 'Other' && (
        <Input
          type="text"
          placeholder="Type here..."
          value={other}
          onChange={(e) => setOther(e.target.value)}
          className="mt-4 border-primary-deepBlue"
        />
      )}
    </div>
  );
};

export default Asset;
