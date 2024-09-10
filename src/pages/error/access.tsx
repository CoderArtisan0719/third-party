import router from 'next/router';
import { useEffect, useState } from 'react';

import Meta from '@/components/common/Meta';
import { Button } from '@/components/ui/button';

const NotAccessable = () => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const userInfo = sessionStorage.getItem('userInfo');

    if (!userInfo) setUrl('/');
    else setUrl(`/${JSON.parse(userInfo).type}`);
  }, []);

  return (
    <div className="mt-24 text-center">
      <Meta title="error" />

      <div className="flex justify-center py-12">
        <img src="/logo.png" className="h-16" alt="logo" />
      </div>

      <p className="text-lg font-semibold">You have no accsess to this page</p>

      <Button
        className="mt-4 bg-primary-azureBlue text-white"
        onClick={() => router.push(url)}
      >
        Go back
      </Button>
    </div>
  );
};

export default NotAccessable;
