import '@/styles/global.css';

import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';

import ConvexClientProvider from '@/provider/ConvexClientProvider';
import store from '@/store';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Provider store={store}>
    <ConvexClientProvider>
      <Component {...pageProps} />
    </ConvexClientProvider>
  </Provider>
);

export default MyApp;
