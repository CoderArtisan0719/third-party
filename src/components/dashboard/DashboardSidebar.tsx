/* eslint-disable no-underscore-dangle */
import { useAuthActions } from '@convex-dev/auth/react';
import {
  ExitIcon,
  GearIcon,
  LayersIcon,
  PlayIcon,
} from '@radix-ui/react-icons';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import DashboardSidebarList from '@/components/common/DashboardSidevarList';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { UserTableType } from '@/utils/types';

type DashboardSidebarProps = {
  success?: boolean;
  className?: string;
};

type MenuItemType = {
  title: string;
  icon: JSX.Element;
  link: string;
};

const DashboardSidebar = (props: DashboardSidebarProps) => {
  const [user, setUser] = useState<UserTableType>();
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);

  const router = useRouter();

  const { signOut } = useAuthActions();

  const handleLogout = () => {
    const userInfo = sessionStorage.getItem('userInfo');

    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);

      signOut().then(() => {
        Cookies.remove('auth-token');
        sessionStorage.removeItem('userInfo');
        router.push(`/auth/signin/${parsedUserInfo.type}`);
      });
    }
  };

  useEffect(() => {
    const userInfo = sessionStorage.getItem('userInfo');

    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);

      const baseUrl =
        process.env.SITE_URL || 'https://rugged-trout-139.convex.site';
      const getPhotoUrl = new URL(`${baseUrl}/getFile`);
      getPhotoUrl.searchParams.set('storageId', parsedUserInfo.photo as string);

      const userWithPhoto = { ...parsedUserInfo, photo: getPhotoUrl.href };
      setUser(userWithPhoto);

      if (parsedUserInfo.type === 'client') {
        setMenuItems([
          {
            title: 'Dashboard',
            icon: <LayersIcon />,
            link: '/client',
          },
          {
            title: 'Active Bids',
            icon: <PlayIcon />,
            link: '/client/active',
          },
        ]);
      } else if (parsedUserInfo.type === 'vendor') {
        setMenuItems([
          {
            title: 'Dashboard',
            icon: <LayersIcon />,
            link: '/vendor',
          },
          {
            title: 'Active Bids',
            icon: <PlayIcon />,
            link: '/vendor/active',
          },
          {
            title: 'Payments',
            icon: <span className="px-1">$</span>,
            link: '/vendor/transaction',
          },
        ]);
      }
    }
  }, [props.success]);

  return (
    <div className={`${props.className} flex flex-col justify-between`}>
      <div>
        <img src="/logo.png" className="ml-2 h-10" alt="logo.png" />

        <div className="mt-8 flex cursor-pointer items-center overflow-hidden rounded-lg py-4 pl-2 hover:bg-gray-300">
          <div className="size-12 flex-none rounded-full">
            <Avatar className="size-full">
              <AvatarImage className="border-none" src={user?.photo} />
              <AvatarFallback className="bg-primary-azureBlue text-2xl font-semibold text-white">
                {user?.fullname.split(' ')[0]?.[0]?.toLocaleUpperCase()}
                {user?.fullname.split(' ')[1]?.[0]?.toLocaleUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="px-4">
            <p className="text-lg">{user?.fullname}</p>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        <hr className="mt-4" />

        {menuItems.map((list, index) => (
          <DashboardSidebarList {...list} key={index} />
        ))}
      </div>

      <div className="mb-4">
        {[
          {
            title: 'Settings',
            icon: <GearIcon />,
            link: '/auth/settings',
          },
          {
            title: 'Log out',
            icon: <ExitIcon />,
            onClick: handleLogout,
          },
        ].map((list, index) => (
          <DashboardSidebarList {...list} key={index} />
        ))}
      </div>
    </div>
  );
};

export default DashboardSidebar;
