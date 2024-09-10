'use client';

import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { ConvexReactClient } from 'convex/react';
import type { ReactNode } from 'react';

const convex = new ConvexReactClient(
  process.env.CLOUD_URL || 'https://rugged-trout-139.convex.cloud',
  { verbose: true },
);

const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
};

export default ConvexClientProvider;
