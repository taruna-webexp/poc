"use client"
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS
import { ToastContainer } from 'react-toastify'; // Import the ToastContainer
import { SessionProvider } from "next-auth/react"
import Navbar from "@/components/common/Navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const currentPath = usePathname()
  const isCurrentPath = currentPath.startsWith("/admin") || currentPath.startsWith("/auth")
  return (
    <html lang="en">
      <body

      >
        <SessionProvider >
          {
            isCurrentPath === false &&
            <>
              < Navbar />
            </>

          }
          <ToastContainer />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
