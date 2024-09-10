/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import router from 'next/router';

import Logo from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';

const Header = () => (
  <div className="fixed top-0 z-20 w-full bg-white shadow">
    <div className="mx-auto flex max-w-screen-xl flex-wrap justify-center py-4 lg:justify-between">
      <Logo xl />

      <div className="flex flex-wrap justify-center">
        <div className="flex items-center">
          <Button
            variant="link"
            onClick={() => router.push('/auth/signin/client')}
            className="text-primary-deepBlue"
          >
            login as a client
          </Button>

          <Button
            variant="link"
            onClick={() => router.push('/auth/signin/vendor')}
            className="text-primary-deepBlue"
          >
            login as a vendor
          </Button>
        </div>

        <div className="flex gap-2">
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            onClick={() => router.push('/auth/signup/vendor')}
            className="flex items-center space-x-2 bg-white text-black dark:bg-black dark:text-white"
          >
            Create an acount
          </HoverBorderGradient>

          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            onClick={() => router.push('#getstarted')}
            className="flex items-center space-x-2 bg-white text-black dark:bg-black dark:text-white"
          >
            Get started
          </HoverBorderGradient>
        </div>
      </div>
    </div>
  </div>
);

export default Header;
