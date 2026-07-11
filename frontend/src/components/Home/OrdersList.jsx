import { FaRegCheckCircle } from "react-icons/fa";

function OrdersList() {
    return (
        <div className="w-[95%] mx-auto mt-1 bg-zinc-900 px-4">
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-6">

                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-olive-700 text-olive-300 
                        flex items-center justify-center font-semibold text-xl">RS</div>

                    <div>
                        <h1 className="text-zinc-100 font-semibold text-md">Revanshu Suthar</h1>
                        <p className="text-zinc-400 text-sm">8 items</p>
                    </div>
                </div>

                <div className="border border-olive-500 text-olive-400 rounded-lg px-4 py-2 font-medium whitespace-nowrap">
                    Table No: 3
                </div>

                <button className="flex items-center gap-2 text-green-500 whitespace-nowrap">
                    <FaRegCheckCircle size={22} />
                    <span className="font-medium">Ready</span>
                </button>

            </div>
        </div>
    );
}

export default OrdersList;