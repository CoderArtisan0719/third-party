import Document, { Head, Html, Main, NextScript } from 'next/document';

import ConvexClientProvider from '@/provider/ConvexClientProvider';
import { AppConfig } from '@/utils/AppConfig';

// Need to create a custom _document because i18n support is not compatible with `next export`.
class MyDocument extends Document {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <Html lang={AppConfig.locale} className="scroll-smooth">
        <Head />
        <body>
          <ConvexClientProvider>
            <Main />
            <NextScript />
          </ConvexClientProvider>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
