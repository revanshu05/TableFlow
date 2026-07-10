import logo from "../../images/Dark_Logo.png"
import { IoSearch } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

function Header(){
    return(
        <div className="flex justify-between items-center bg-zinc-800 text-xl text-zinc-300 px-5 py-3">
            
            <img src={logo} alt="Logo" className="h-12"/>
            
            {/* Search bar */}
            <div className="flex items-center border border-zinc-700 px-3 py-1 rounded-full w-0 md:w-1/3">
                <IoSearch className="text-xl"/>
                <input 
                    type="text" 
                    placeholder="Search item here..." 
                    className="bg-zinc-800 text-zinc-300 px-2 py-1 
                        rounded-md ml-2 focus:outline-none text-lg"/>
            </div>
            
            {/* User profile */}
            <div className="flex items-center gap-4 px-2 py-1 rounded-md">
                <div>
                    <h1 className="text-sm font-bold">Username</h1>
                    <p className="text-xs text-zinc-300">role</p>
                </div>
                <FaUserCircle className="text-3xl"/>

            </div>
        </div>
    )
}

export default Header;