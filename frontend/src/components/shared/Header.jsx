import logo from "../../images/Dark_Logo.png"
import { IoSearch } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";

import Logout from "./Logout";


function Header(){
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    
    const user = useSelector((state) => state.auth.user);

    return(
        <div className="flex justify-between items-center bg-zinc-950 text-xl text-zinc-300 px-5 py-2">
            
            <img src={logo} alt="Logo" className="h-8"
                onClick={() => navigate("/")}/>
            
            {/* Search bar */}
            <div className="flex items-center bg-zinc-800 px-3 py-1 rounded-full w-0 md:w-1/3">
                <IoSearch className="text-lg"/>
                <input 
                    type="text" 
                    placeholder="Search items here..." 
                    className="text-zinc-300 px-2 py-0.5 
                        rounded-md ml-2 focus:outline-none text-[13px]"/>
            </div>
            
            {/* User profile */}
            <div className="relative">

                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="
                        flex items-center gap-2
                        px-2 py-1.5
                        rounded-lg
                        hover:bg-zinc-800
                        transition
                    "
                >
                    <FaUserCircle className="text-2xl text-zinc-400" />

                    <IoChevronDown
                        className={`text-sm text-zinc-400 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                        }`}
                    />
                </button>


                {isOpen && (
                    <div
                        className="
                            absolute
                            right-0
                            top-full
                            mt-2
                            w-56
                            bg-zinc-800
                            border border-zinc-700
                            rounded-xl
                            shadow-2xl
                            overflow-hidden
                            z-50
                        "
                    >

                        {/* User Information */}
                        <div className="px-4 py-4">

                            <div className="flex items-center gap-3">

                                <FaUserCircle className="text-3xl text-zinc-400" />

                                <div className="min-w-0">

                                    <p className="text-sm font-semibold text-zinc-100">
                                        {user?.name}
                                    </p>

                                    <p className="text-xs text-zinc-400 truncate">
                                        {user?.email}
                                    </p>

                                </div>

                            </div>

                            <span
                                className="
                                    inline-block
                                    mt-3
                                    px-2.5 py-1
                                    rounded-md
                                    bg-orange-500/10
                                    text-orange-400
                                    text-[11px]
                                    font-medium
                                    capitalize
                                "
                            >
                                {user?.role}
                            </span>

                        </div>


                        {/* Divider */}
                        <div className="border-t border-zinc-700" />

                        {/* Logout */}
                        <Logout />

                    </div>
                )}

            </div>
        </div>
    )
}

export default Header;