import MenuContainer from "../components/Menu/MenuContainer";
import BackButton from "../components/shared/BackButton";
import { FaLinesLeaning } from "react-icons/fa6";

function Menu(){
    return (
        <section className="bg-zinc-800 h-[calc(100vh-6.5rem)] overflow-hidden flex">
            
            {/* Left Container */}
            <div className="flex-3/4 bg-zinc-800 h-full ml-1">
                
                {/* TOP */}
                <div className="flex items-center justify-between m-4">
                    <div className="flex items-center gap-4">
                        <BackButton/>
                        <h1 className="text-2xl font-semibold text-zinc-200">Menu</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaLinesLeaning size={40}
                            className="text-orange-300 mt-2"/>
                        <div>
                            <h1 className="text-zinc-200 text-lg font-semibold">Customer Name</h1>
                            <p className="text-zinc-400 text-sm font-normal">Table No: 01</p>
                        </div>
                    </div>
                </div>
                
                <MenuContainer />
            </div>

            {/*Right Container*/}
            <div className="my-4 mr-4 ml-1 rounded-2xl flex-1/4 bg-zinc-900 h-149">

            </div>

        </section>
    )
}

export default Menu;