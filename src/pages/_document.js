import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { pathOr } from 'ramda';
import tt from 'counterpart';
// import sprite from 'svg-sprite-loader/runtime/sprite.build';
import GlobalStyles from 'styles/global';
// const spriteContent = sprite.stringify();

import { GCE_KEY } from 'constants/config';
import { initGCEScript } from 'utils/googleSearchEngine';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: [...initialProps.styles, ...sheet.getStyleElement()],
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <html lang="ru">
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />

          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#2879FF" />
          <meta name="msapplication-TileColor" content="#2879FF" />
          <meta name="theme-color" content="#ffffff" />

          <meta name="yandex-verification" content="708637161f765106" />
          <GlobalStyles />
          {this.props.styles}
        </Head>
        <body>
          <Main />
          <NextScript />
          <script async src={`https://cse.google.com/cse.js?cx=${GCE_KEY}`} />
          <script dangerouslySetInnerHTML={{ __html: initGCEScript }} />
        </body>
      </html>
    );
  }
}
