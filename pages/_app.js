import "@/styles/globals.css";
import { Poppins } from "next/font/google";
import { AppProvider } from '@/context/AppContext';
import AnalyticsProvider from '@/components/Analytics/AnalyticsProvider';

const poppins = Poppins({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

export default function App({ Component, pageProps }) {
  return (
    <AppProvider>
      <AnalyticsProvider>
        <style jsx global>{`
          :root {
            --poppins: ${poppins.style.fontFamily};
          }
        `}</style>
        <Component {...pageProps} />
      </AnalyticsProvider>
    </AppProvider>
  );
}