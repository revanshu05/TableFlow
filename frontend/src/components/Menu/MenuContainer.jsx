import { useState } from "react";
import menus from "../../constants";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";

function MenuContainer() {
    const menuList = Object.values(menus);

    let [count, setCount] = useState(0);

    const increment = () => {
        if(count >= 6) return;
        setCount((prev) => prev + 1);
    }

    const decrement = () => {
        if(count <= 0) return;
        setCount((prev) => prev - 1);
    }

    const [selectedMenu, setSelectedMenu] = useState(menuList[0]);

    return (
        <div className="h-[85%] flex flex-col m-4">
            {/* Menu Categories */}
            <div className="grid grid-cols-4 gap-3">
                {menuList.map((menu) => {
                    const active = selectedMenu.id === menu.id;

                    return (
                        <div
                            key={menu.id}
                            onClick={() => setSelectedMenu(menu)}
                            className={`relative h-22 overflow-hidden rounded-xl cursor-pointer transition-all duration-300 bg-zinc-900 border border-zinc-800
                            ${
                                active
                                    ? "border-orange-400 shadow-[0_0_15px_rgba(251,146,60,.8)]"
                                    : "hover:scale-[1.02] hover:border-zinc-700"
                            }`}
                        >
                            {/* Left Content */}
                            <div className="relative z-10 flex flex-col justify-between h-full p-4 w-[65%]">
                                <div>
                                    <h2 className="text-white text-lg font-semibold">
                                        {menu.name}
                                    </h2>

                                    <p className="text-sm text-zinc-400 mt-1">
                                        {menu.items.length} Items
                                    </p>
                                </div>

                            </div>

                            {/* Right Image */}
                            <div
                                className="absolute top-0 right-0 h-full w-[45%]"
                                style={{
                                    clipPath:
                                        "polygon(30% 0%,100% 0%,100% 100%,0% 100%)",
                                }}
                            >
                                <img
                                    src={menu.image}
                                    alt={menu.name}
                                    className="h-full w-full object-cover"
                                />
                                
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="border-b border-zinc-700 my-5"></div>

            {/* Menu Items */}
            <div className=" flex flex-col overflow-y-auto pr-2 w-200 mx-auto">
                {selectedMenu.items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between mb-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 hover:border-orange-400 transition-all duration-200"
                    >
                        {/* Left */}
                        <div className="flex items-center gap-4">
                            <div
                                className={`w-3 h-3 rounded-full ${
                                    item.isVeg ? "bg-green-500" : "bg-red-500"
                                }`}
                            ></div>

                            <div>
                                <h2 className="text-lg font-semibold text-zinc-100">
                                    {item.name}
                                </h2>

                                <p className="text-orange-400 font-semibold">
                                    ₹{item.price}
                                </p>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-4">

                            {/* Quantity */}
                            <div className="w-30">
                                <div className="flex items-center justify-between rounded-lg py-2 px-4 bg-zinc-800">
                                    <button className="text-amber-300 hover:text-amber-500 duration-200"
                                        onClick={decrement}>
                                        <FaMinus  size={18}/>
                                    </button>

                                    <span className="text-lg text-zinc-300 font-semibold px-3">{count}</span>

                                    <button className="text-amber-300 hover:text-amber-500 duration-200"
                                        onClick={increment}>
                                        <FaPlus  size={18}/>
                                    </button>
                                </div>
                            </div>

                            {/* Add to cart */}
                            <button className="ml-5 h-10 w-10 rounded-lg bg-green-600 hover:bg-green-500 transition">
                                <FaShoppingCart className="m-auto text-zinc-200" size={22}/>
                            </button>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MenuContainer;