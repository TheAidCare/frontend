import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

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
        
        {/* Google Analytics */}
        {GA_TRACKING_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                    anonymize_ip: true,
                    allow_google_signals: false,
                    allow_ad_personalization_signals: false,
                  });
                `,
              }}
            />
          </>
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
