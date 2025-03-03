import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import Switch from "@/components/ui/theme-toggle";
import Navbar from "@/components/Navbar";
import ThemeAuth from "@/components/Theme-Auth";
import Typewriter from "@/components/TypeWriter";
import Search from "@/components/Search";

export default function Home() {
  return (
    <>
      {/* <Search/> */}
      <Typewriter/>
      <ThemeAuth/>
      <Navbar />

    </>
  );
}
