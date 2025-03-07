import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import Switch from "@/components/ui/theme-toggle";
import Navbar from "@/components/Navbar";
import ThemeAuth from "@/components/Theme-Auth";
import Typewriter from "@/components/TypeWriter";
import Search from "@/components/Search";

export default function Home() {
  const API_URL = process.env.SERVER_URL || "https://ecoride-m6zs.onrender.com";
  console.log("server url", API_URL)
  return (
    <>
      {/* <Search/> */}
      <Typewriter/>
      <ThemeAuth/>

    </>
  );
}
