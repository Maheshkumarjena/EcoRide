import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import dotenv from 'dotenv';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import DarkModeToggle from "@/components/ui/theme-toggle";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
dotenv.config();

export default function RootLayout({ children }) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={` antialiased `}
      >

          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            >
            <SidebarProvider>
            <AppSidebar />

            <BackgroundBeamsWithCollision className="h-screen ">
              <div className="h-screen flex flex-col  w-screen ">
              {/* <SidebarTrigger /> */}

            {children}

              </div>
            <Navbar />

        </BackgroundBeamsWithCollision>

        </SidebarProvider>

          </ThemeProvider>
      </body>
    </html>
  );
}
