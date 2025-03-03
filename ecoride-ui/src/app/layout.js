import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import DarkModeToggle from "@/components/ui/theme-toggle";
import Navbar from "@/components/Navbar";

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
                  
            <BackgroundBeamsWithCollision className="h-screen ">
              <div className="h-screen flex flex-col  w-screen ">
            {children}

              </div>
            <Navbar />

        </BackgroundBeamsWithCollision>


          </ThemeProvider>
      </body>
    </html>
  );
}
