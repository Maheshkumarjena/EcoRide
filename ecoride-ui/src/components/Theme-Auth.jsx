import React from "react"
import DarkModeToggle from "./ui/theme-toggle";
import AuthComponent from "./ui/signin-signup-user";


const ThemeAuth = () => {
    return (
<div className="absolute top-0 right-0 p-4 flex flex-row  w-full justify-between">
        <DarkModeToggle />
        <AuthComponent />
    </div>
    )
}

export default ThemeAuth;