import { useState } from "react";
import { useSelector } from "react-redux";
import { IoRestaurantOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { MdOutlineReceiptLong, MdClose } from "react-icons/md";
import KotContainer from "../components/Menu/KotContainer";
import MenuContainer from "../components/Menu/MenuContainer";

function Menu() {
    const customerData = useSelector((state) => state.customer);
    const cartItems = useSelector((state) => state.cart.items);
    const isDineIn = customerData.orderType === "dine-in";
    const [mobileKotOpen, setMobileKotOpen] = useState(false);

    const totalKOTItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <section className="relative flex flex-col lg:flex-row h-[calc(100vh-3.5rem)] overflow-hidden bg-zinc-800">
            {/* Catalog Area */}
            <div className="flex h-full flex-1 min-w-0 flex-col bg-zinc-800 pb-16 lg:pb-0">
                <div className="flex shrink-0 items-center justify-between px-4 sm:px-6 py-2 sm:py-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                            <IoRestaurantOutline size={20} className="text-orange-400" />
                        </div>
                        <h1 className="text-lg sm:text-xl font-semibold text-white">Menu</h1>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-orange-500/10">
                            <FaUser size={13} className="text-orange-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                                <h2 className="font-semibold text-zinc-200">
                                    {customerData.customerName || "Guest"}
                                </h2>
                                <span className="text-zinc-600">•</span>
                                <span className="text-zinc-400">
                                    {customerData.members || 0} Members
                                </span>
                                <span className="text-zinc-600">•</span>
                                <span className="text-zinc-400 font-medium">
                                    {isDineIn ? `Table ${customerData.tableNo || "N/A"}` : "Take-away"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="min-h-0 flex-1">
                    <MenuContainer />
                </div>
            </div>

            {/* Desktop KOT Sidebar */}
            <div className="hidden lg:block my-2 sm:my-3 mx-2 sm:mx-4 h-[95%] w-[380px] xl:w-[420px] shrink-0 rounded-2xl bg-zinc-900 overflow-hidden">
                <KotContainer />
            </div>

            {/* Mobile / Tablet Floating KOT Button (< lg) */}
            <div className="lg:hidden fixed bottom-4 right-4 z-40">
                <button
                    onClick={() => setMobileKotOpen(true)}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg shadow-orange-950/50 active:scale-95 transition-all"
                >
                    <MdOutlineReceiptLong size={20} />
                    <span>View KOT</span>
                    {totalKOTItems > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-white text-orange-600 text-xs font-bold">
                            {totalKOTItems}
                        </span>
                    )}
                </button>
            </div>

            {/* Mobile / Tablet KOT Bottom Drawer Modal (< lg) */}
            {mobileKotOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
                    <div className="w-full max-h-[85vh] h-[600px] bg-zinc-900 rounded-t-2xl flex flex-col overflow-hidden border-t border-zinc-700 shadow-2xl">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 shrink-0">
                            <span className="font-semibold text-white text-sm">Current Order Ticket</span>
                            <button
                                onClick={() => setMobileKotOpen(false)}
                                className="h-8 w-8 flex items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
                            >
                                <MdClose size={18} />
                            </button>
                        </div>
                        <div className="flex-1 min-h-0 overflow-hidden">
                            <KotContainer />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default Menu;