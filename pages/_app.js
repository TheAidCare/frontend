import "@/styles/globals.css";
import { Poppins } from "next/font/google"

const poppins = Poppins({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
})

export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        :root {
          --poppins: ${poppins.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
