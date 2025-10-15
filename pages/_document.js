import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
        {/* SEO basics */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        {/* Performance hints (adjust hosts to your env) */}
        {process.env.NEXT_PUBLIC_API_URL && (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL} crossOrigin="anonymous" />
        )}
        {process.env.NEXT_PUBLIC_API_ENGINE_URL && (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_ENGINE_URL} crossOrigin="anonymous" />
        )}
        {process.env.NEXT_PUBLIC_WEBSOCKET_URL && (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_WEBSOCKET_URL.replace(/^ws(s)?:/, 'https:')} crossOrigin="anonymous" />
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
