import { useRouter } from 'next/router';

import { Button } from '@/components/ui/button';
import type { KPIType } from '@/utils/types';

const KPICard = (props: KPIType) => {
  const router = useRouter();

  return (
    <div className="rounded-xl bg-gray-100">
      <div className="mt-4 flex items-center border-b pb-4 pl-4">
        <div className="rounded-xl bg-gray-200 p-2">
          <img src={props.img} className="size-[40px]" alt={props.imgAlt} />
        </div>

        <div className="pl-4 text-xl">{props.title}</div>
      </div>

      <div className={`${props.length} grid py-4 text-center`}>
        {props.lists.map((list, index) => (
          <div
            className={`py-4 ${props.lists.length - 1 !== index && 'border-r-2'}`}
            key={list.label}
          >
            {list.label === 'Go to this Request' && props.link ? (
              <Button
                variant="link"
                onClick={() => router.push(`/client/request/${props.link}`)}
                className="text-xl font-semibold"
              >
                {list.label}
              </Button>
            ) : (
              <p className="text-xl font-semibold">{list.label}</p>
            )}
            <p className="text-gray-500">{list.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KPICard;
