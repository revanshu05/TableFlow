import { IoSearch } from "react-icons/io5";
import OrdersList from "./OrdersList";

function RecentOrders(){
    return(
        <div className="px-3 mt-3 flex flex-1">
            <div className="bg-zinc-900 rounded-lg flex flex-col w-full h-full p-2 items-center gap-3">
                <div className="flex flex-row justify-between w-full mx-2 my-1 px-3">
                    <h1 className="text-zinc-200 text-xl font-semibold">Recent Orders</h1>
                    <p className="text-blue-600 text-sm">View All</p>
                </div>

                <div className="flex items-center px-3 py-1 rounded-lg w-0 md:w-[95%] bg-zinc-800">
                    <IoSearch className="text-lg text-zinc-300"/>
                    <input 
                        type="text" 
                        placeholder="Search recent orders..." 
                        className="text-zinc-300 px-2 py-1 
                            rounded-md ml-2 focus:outline-none text-[14px]"/>
                </div>

                <div className="mt-2 w-full flex flex-col gap-3 overflow-y-scroll h-53">
                    <OrdersList/>
                    <OrdersList/>
                    <OrdersList/>
                    <OrdersList/>
                    <OrdersList/>
                    <OrdersList/>
                    <OrdersList/>
                </div>
            </div>
        </div>
    )
}

export default RecentOrders;