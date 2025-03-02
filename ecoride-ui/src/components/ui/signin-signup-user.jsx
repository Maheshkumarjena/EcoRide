"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt, faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";

const AuthComponent = ({ user, onSignIn, onSignUp, onSignOut }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleProfileClick = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <div className="relative inline-block">
            {user ? (
                <div
                    className="flex items-center cursor-pointer hover:bg-accent/10 dark:hover:bg-accent/20 rounded-md p-1 transition-colors duration-200"
                    onClick={handleProfileClick}
                >
                    <img
                        src={user.profilePic}
                        alt="Profile"
                        className="w-8 h-8 rounded-full mr-2"
                    />
                    <span className="text-sm dark:text-foreground text-foreground">
                        {user.name}
                    </span>
                </div>
            ) : (
                <div className="flex space-x-2">
                    <button
                        onClick={onSignIn}
                        className="sm:px-4 cursor-pointer sm:py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/80 hover:scale-105 transition-transform duration-200 flex items-center gap-2 text-sm dark:bg-primary dark:text-primary-foreground hover:brightness-110 px-2 py-[8px] text-xs"
                    >
                        <FontAwesomeIcon icon={faUser} />
                        Sign In
                    </button>
                    <button
                        onClick={onSignUp}
                        className="sm:px-4 cursor-pointer sm:py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 hover:scale-105 transition-transform duration-200 flex items-center gap-2 text-sm dark:bg-secondary dark:text-secondary-foreground hover:brightness-110 px-2 py-[8px] text-xs"
                    >
                        <FontAwesomeIcon icon={faArrowRightToBracket} />
                        Sign Up
                    </button>
                </div>
            )}

            {user && showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-card dark:bg-card rounded-md shadow-lg z-10 border border-border dark:border-border">
                    <div className="py-1">
                        <button
                            onClick={() => {
                                onSignOut();
                                setShowDropdown(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-accent dark:hover:bg-accent text-foreground dark:text-foreground hover:bg-accent/20 transition-colors duration-200"
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthComponent;