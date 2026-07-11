import logo from "../../images/Dark_Logo.png"
import { IoSearch } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

function Header(){
    return(
        <div className="flex justify-between items-center bg-zinc-900 text-xl text-zinc-300 px-5 py-3">
            
            <img src={logo} alt="Logo" className="h-8"/>
            
            {/* Search bar */}
            <div className="flex items-center bg-zinc-800 px-3 py-1 rounded-full w-0 md:w-1/3">
                <IoSearch className="text-lg"/>
                <input 
                    type="text" 
                    placeholder="Search items here..." 
                    className="text-zinc-300 px-2 py-1 
                        rounded-md ml-2 focus:outline-none text-[14px]"/>
            </div>
            
            {/* User profile */}
            <div className="flex items-center gap-4 px-2 rounded-md">
                <FaUserCircle className="text-2xl"/>
                <div>
                    <h1 className="text-[14px] font-bold">Username</h1>
                    <p className="text-[12px] text-zinc-300">role</p>
                </div>
            </div>
        </div>
    )
}

export default Header;