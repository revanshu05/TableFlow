import { FaHome } from "react-icons/fa";
import { MdTableBar } from "react-icons/md";
import { BsBorderStyle } from "react-icons/bs";
import { IoIosMore } from "react-icons/io";
import { BiSolidDish } from "react-icons/bi";

function Footer(){
    return(
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-800 p-2 flex justify-around">
            <button className="text-zinc-400 items-center hover:text-zinc-100 duration-200"> <FaHome className="inline mr-2" size={25}/> Home</button>
            <button className="text-zinc-400 items-center hover:text-zinc-100 duration-200"> <BsBorderStyle className="inline mr-2" size={25}/> Orders</button>
            <button className="text-zinc-400 items-center hover:text-zinc-100 duration-200"> <MdTableBar className="inline mr-2" size={25}/> Tables</button>
            <button className="text-zinc-400 items-center hover:text-zinc-100 duration-200"> <IoIosMore className="inline mr-2" size={25}/>More</button>

            <button className="absolute bottom-4 rounded-full p-3 items-center text-white bg-amber-600 hover:bg-amber-700 duration-200"><BiSolidDish size={30}/></button>
        </div>
    )
}

export default Footer;