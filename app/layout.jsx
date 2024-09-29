import localFont from "next/font/local";
import "@styles/globals.css";
import { ClerkProvider} from "@clerk/nextjs"
import ModalProvider from "@components/modal-provider";
import ToasterProvider from "@components/Toaster-provider";
import CrispProvider from "@components/Crisp-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Genius",
  description: "AI platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <CrispProvider/>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
          <ModalProvider/>
          <ToasterProvider/>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
