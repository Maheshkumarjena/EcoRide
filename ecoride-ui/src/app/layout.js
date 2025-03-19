import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import ReduxProvider from "./ReduxProvider";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner"


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` antialiased  `} >
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <AppSidebar />
              <BackgroundBeamsWithCollision className="h-screen     ">
                <div className="h-screen flex flex-col w-screen hide-scrollbar ">
                  {children}
                  <Toaster/>
                </div>
                <Navbar />

              </BackgroundBeamsWithCollision>
            </SidebarProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}