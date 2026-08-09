import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import {
    IoSearch,
    IoChevronDown,
} from "react-icons/io5";

import { FaUserCircle } from "react-icons/fa";

import Logout from "./Logout";


function Header() {

    const [isOpen, setIsOpen] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const location = useLocation();

    const pageTitles = {
        "/": "Dashboard",
        "/orders": "Orders",
        "/tables": "Tables",
        "/menu": "Menu",
        "/more": "More",
    };

    const pageTitle = pageTitles[location.pathname] || "TableFlow";

    return (
        <header className="
            h-14
            bg-zinc-900
            border-b
            border-zinc-800
            px-6
            flex
            items-center
            justify-between
        ">

            {/* Page title */}
            <div className="w-1/4">

                <h1 className="
                    text-xl
                    font-semibold
                    text-zinc-100
                ">
                    {pageTitle}
                </h1>

            </div>


            {/* Search */}
            <div className="
                flex
                items-center
                bg-zinc-800
                border
                border-zinc-700
                px-3
                py-1.5
                rounded-full
                w-1/3
            ">

                <IoSearch className="
                    text-lg
                    text-zinc-400
                " />

                <input
                    type="text"
                    placeholder="Search items here..."
                    className="
                        w-full
                        bg-transparent
                        text-zinc-300
                        placeholder:text-zinc-500
                        px-2
                        focus:outline-none
                        text-sm
                    "
                />

            </div>


            {/* User */}
            <div className="
                w-1/4
                flex
                justify-end
                relative
            ">

                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="
                        flex
                        items-center
                        gap-2
                        px-2
                        py-1.5
                        rounded-lg
                        hover:bg-zinc-800
                        transition
                    "
                >

                    <FaUserCircle className="
                        text-2xl
                        text-zinc-400
                    " />

                    <IoChevronDown className={`
                        text-sm
                        text-zinc-400
                        transition-transform
                        duration-200
                        ${isOpen ? "rotate-180" : ""}
                    `} />

                </button>


                {/* Dropdown */}
                {isOpen && (
                    <div className="
                        absolute
                        right-0
                        top-full
                        mt-2
                        w-64
                        bg-zinc-800
                        border
                        border-zinc-700
                        rounded-xl
                        shadow-2xl
                        overflow-hidden
                        z-50
                    ">

                        {/* User information */}
                        <div className="
                            px-4
                            py-3
                        ">

                            <div className="
                                flex
                                items-center
                                gap-3
                            ">

                                <FaUserCircle className="
                                    text-3xl
                                    text-zinc-400
                                " />

                                <div className="min-w-0">

                                    <p className="
                                        text-sm
                                        font-semibold
                                        text-zinc-100
                                    ">
                                        {user?.name}
                                    </p>

                                    <p className="
                                        text-xs
                                        text-zinc-400
                                    ">
                                        {user?.email}
                                    </p>

                                </div>

                            </div>


                            <span className="
                                inline-block
                                mt-3
                                px-2.5
                                py-1
                                rounded-md
                                bg-orange-500/10
                                text-orange-400
                                text-[11px]
                                font-medium
                                capitalize
                            ">
                                {user?.role}
                            </span>

                        </div>


                        <div className="
                            border-t
                            border-zinc-700
                        " />

                        <Logout />

                    </div>
                )}

            </div>

        </header>
    );
}


export default Header;