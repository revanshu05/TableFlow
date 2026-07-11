import { FaHome } from "react-icons/fa";
import { MdTableBar } from "react-icons/md";
import { BsBorderStyle } from "react-icons/bs";
import { IoIosMore } from "react-icons/io";
import { BiSolidDish } from "react-icons/bi";

function Footer() {
    return (
        <div className="bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-700 flex justify-around items-center py-3 fixed">

            <button className="flex items-center gap-2 text-amber-400 hover:scale-110 
                transition-all duration-200">
                <FaHome size={24} />
                <span>Home</span>
            </button>

            <button className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 
                hover:scale-110 transition-all duration-200">
                <BsBorderStyle size={24} />
                <span>Orders</span>
            </button>

            <button className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 
                hover:scale-110 transition-all duration-200">
                <MdTableBar size={24} />
                <span>Tables</span>
            </button>

            <button className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 
                hover:scale-110 transition-all duration-200">
                <IoIosMore size={24} />
                <span>More</span>
            </button>

            <button className="absolute left-1/2 -translate-x-1/2 -top-8 p-4 rounded-full 
                bg-amber-500 text-white hover:bg-amber-600 hover:scale-110 transition-all duration-200">
                <BiSolidDish size={35} />
            </button>

        </div>
    );
}

export default Footer;