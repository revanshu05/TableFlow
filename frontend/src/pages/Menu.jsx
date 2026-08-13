import { useSelector } from "react-redux";
import { IoRestaurantOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

import KotContainer from "../components/Menu/KotContainer";
import MenuContainer from "../components/Menu/MenuContainer";


function Menu() {

    const customerData = useSelector((state) => state.customer);

    const isDineIn = customerData.orderType === "dine-in";


    return (

        <section
            className="
                flex
                h-[calc(100vh-3.5rem)]
                overflow-hidden
                bg-zinc-800
            "
        >

            {/* =================================================
                LEFT CONTAINER
            ================================================= */}

            <div
                className="
                    ml-1
                    flex
                    h-full
                    flex-3/4
                    flex-col
                    bg-zinc-800
                "
            >

                {/* ================= PAGE HEADER ================= */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        px-5
                        py-4
                    "
                >

                    {/* LEFT - PAGE TITLE */}

                    <div className="flex items-center gap-3">

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-lg
                                bg-orange-500/10
                            "
                        >

                            <IoRestaurantOutline
                                size={20}
                                className="text-orange-400"
                            />

                        </div>


                        <h1
                            className="
                                text-xl
                                font-semibold
                                text-white
                            "
                        >
                            Menu
                        </h1>

                    </div>


                    {/* RIGHT - CUSTOMER DETAILS */}

                    <div className="flex items-center gap-3">

                        {/* Customer Icon */}

                        <div
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                bg-orange-500/10
                            "
                        >

                            <FaUser
                                size={14}
                                className="text-orange-400"
                            />

                        </div>


                        {/* Customer Information */}

                        <div>

                            <div className="flex items-center gap-2">

                                <h2
                                    className="
                                        text-sm
                                        font-semibold
                                        text-zinc-200
                                    "
                                >
                                    {customerData.customerName || "Customer Name"}
                                </h2>


                                <span className="text-zinc-600">
                                    •
                                </span>


                                <span
                                    className="
                                        text-xs
                                        text-zinc-400
                                    "
                                >
                                    {customerData.members || 0} Members
                                </span>


                                <span className="text-zinc-600">
                                    •
                                </span>


                                {isDineIn ? (

                                    <span
                                        className="
                                            text-xs
                                            text-zinc-400
                                        "
                                    >
                                        Table {customerData.tableNo || "N/A"}
                                    </span>

                                ) : (

                                    <span
                                        className="
                                            text-xs
                                            text-zinc-400
                                        "
                                    >
                                        Take-away
                                    </span>

                                )}

                            </div>

                        </div>

                    </div>

                </div>


                {/* MENU */}

                <div
                    className="
                        min-h-0
                        flex-1
                    "
                >

                    <MenuContainer />

                </div>

            </div>


            {/* RIGHT CONTAINER - KOT */}

            <div
                className="
                    my-4
                    mr-4
                    ml-1
                    h-[95%]
                    flex-1/4
                    rounded-2xl
                    bg-zinc-900
                "
            >

                <KotContainer />

            </div>

        </section>

    );

}


export default Menu;