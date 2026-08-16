import { NavLink } from "react-router-dom";

import {
    IoHomeOutline,
    IoGridOutline,
    IoRestaurantOutline,
    IoReceiptOutline,
    IoSettingsOutline,
    IoBarChartOutline,
    IoPeopleOutline,
    IoLogOutOutline,
} from "react-icons/io5";

import { BiSolidDish } from "react-icons/bi";

import { GiCook } from "react-icons/gi";
import { TbReportMoney } from "react-icons/tb";

import { useSelector } from "react-redux";

import logo from "../../images/Dark_Logo.png";


function Sidebar() {

    const user = useSelector((state) => state.auth.user);
    const role = user?.role;

    const navigation = [
        {
            section: "Overview",
            items: [
                {
                    name: "Home",
                    path: "/",
                    icon: IoHomeOutline,
                    roles: ["admin"],
                },
            ],
        },

        {
            section: "Operations",
            items: [
                {
                    name: "Tables",
                    path: "/tables",
                    icon: IoGridOutline,
                    roles: ["admin", "waiter"],
                },
                {
                    name: "Menu",
                    path: "/menu",
                    icon: IoRestaurantOutline,
                    roles: ["admin", "waiter"],
                },
                {
                    name: "Orders",
                    path: "/orders",
                    icon: IoReceiptOutline,
                    roles: ["admin", "waiter"],
                },
                {
                    name: "Kitchen",
                    path: "/kitchen",
                    icon: BiSolidDish,
                    roles: ["admin", "kitchen"],
                },
                {
                    name: "Billing",
                    path: "/billing",
                    icon: TbReportMoney,
                    roles: ["admin", "cashier"],
                },
            ],
        },

        {
            section: "Admin",
            items: [
                {
                    name: "Team",
                    path: "/team",
                    icon: IoPeopleOutline,
                    roles: ["admin"],
                },
                {
                    name: "Settings",
                    path: "/settings",
                    icon: IoSettingsOutline,
                    roles: ["admin"],
                },
            ],
        },
    ];


    return (
        <aside className="
            w-56
            min-h-screen
            bg-zinc-950
            border-r
            border-zinc-800
            flex
            flex-col
        ">

            {/* Logo */}
            <div className="
                h-20
                px-6
                flex
                items-center
                border-b
                border-zinc-800
            ">
                <img
                    src={logo}
                    alt="TableFlow"
                    className="h-9"
                />
            </div>


            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto">

                {navigation.map((section) => {

                    const visibleItems = section.items.filter((item) =>
                        item.roles.includes(role)
                    );

                    if (visibleItems.length === 0) {
                        return null;
                    }

                    return <div
                        key={section.section}
                        className="mb-3"
                    >

                        <p className="
                            px-3
                            mb-2
                            text-[11px]
                            uppercase
                            tracking-widest
                            text-zinc-500
                            font-semibold
                        ">
                            {section.section}
                        </p>


                        <div className="space-y-1">

                            {visibleItems.map((item) => {

                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={({ isActive }) => `
                                            flex
                                            items-center
                                            gap-3
                                            px-3
                                            py-2.5
                                            rounded-lg
                                            text-sm
                                            font-medium
                                            transition
                                            duration-200

                                            ${
                                                isActive
                                                    ? "bg-amber-500/10 text-orange-400"
                                                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                                            }
                                        `}
                                    >

                                        <Icon className="text-xl" />

                                        <span>
                                            {item.name}
                                        </span>

                                    </NavLink>
                                );
                            })}

                        </div>

                    </div>

                })}

            </nav>


            {/* User */}
            <div className="
                p-4
                border-t
                border-zinc-800
            ">

                <div className="
                    flex
                    items-center
                    gap-3
                    px-2
                    py-2
                ">

                    <div className="
                        w-9
                        h-9
                        rounded-full
                        bg-orange-500/10
                        text-orange-400
                        flex
                        items-center
                        justify-center
                        font-semibold
                        text-sm
                    ">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>


                    <div className="min-w-0">

                        <p className="
                            text-sm
                            font-semibold
                            text-zinc-100
                            truncate
                        ">
                            {user?.name || "User"}
                        </p>

                        <p className="
                            text-xs
                            text-zinc-500
                            capitalize
                        ">
                            {role || ""}
                        </p>

                    </div>

                </div>

            </div>

        </aside>
    );
}


export default Sidebar;