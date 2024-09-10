import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Meta from '@/components/common/Meta';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const [url, setUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    const userInfo = sessionStorage.getItem('userInfo');

    if (!userInfo) setUrl('/');
    else setUrl(`/${JSON.parse(userInfo).type}`);
  }, []);

  return (
    <div className="mt-24 text-center">
      <Meta title="404" />

      <div className="flex justify-center py-12">
        <img src="/logo.png" className="h-16" alt="logo" />
      </div>

      <p className="text-lg font-semibold">404 - Page Not Found</p>

      <p>Sorry, the page you are looking for does not exist.</p>

      <Button
        className="mt-4 bg-primary-azureBlue text-white"
        onClick={() => router.push(url)}
      >
        Go back
      </Button>
    </div>
  );
};

export default NotFound;
