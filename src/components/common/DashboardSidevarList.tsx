import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

type DashboardSidebarListProps = {
  link?: string;
  title: string;
  icon: ReactNode;
  onClick?: () => void;
};

const DashboardSidebarList = (props: DashboardSidebarListProps) => {
  const router = useRouter();

  return (
    <div
      className={`mt-4 flex cursor-pointer items-center rounded-lg hover:bg-gray-400 ${
        props.link && props.link === router.route ? 'bg-gray-300' : ''
      }`}
      onClick={() =>
        props.link ? router.push(props.link!) : props.onClick?.()
      }
      key={props.title}
    >
      <div className="p-2">{props.icon}</div>

      <div className="w-full p-2">{props.title}</div>
    </div>
  );
};

export default DashboardSidebarList;
