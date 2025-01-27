import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import {Providers} from './providers';
const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "react-hot-toast";

export const metadata: Metadata={
  //seo
  title:'SafeReport - Anonymous Crime Reporting App',
  description: 'Securly and anonymously report crimes to law enforcement'
  
}
export default function RootLayout({
  children,

}: {children:React.ReactNode;}){
  return (
    <html lang ='en'>
      {/* font apply to everysingle page of this website */}
      <body className={inter.className}> 
    <div className="relative min-h-screen bg-black selection:bg-sky-500/20 ">
    {/* gradient bg */}
    <div className="fixed inset-0 -z-10 min-h-screen">
    <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03),transparent_50%)]" />
    <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.04),transparent_70%)]" />

    </div>
    {/* navbar */}
    <Navbar/>
    <main className="pt-16">
      <Providers>
      {children} {/* All pages/components will now have session access */}
      <Toaster />

      </Providers>

    </main>
    </div>

      </body>
    </html>
  )
}