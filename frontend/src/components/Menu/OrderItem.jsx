import { FaTrashAlt } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";

function OrderItem({ item }) {
    return (
        <div className="bg-zinc-800 rounded-md py-2 px-3 flex justify-between items-start">
            <div className="flex gap-3 mt-1 text-zinc-400">
                <button className="hover:text-red-400 transition">
                    <FaTrashAlt size={18} />
                </button>
            </div>
            
            <div className="text-left w-45">
                <h2 className="text-zinc-200 font-semibold">
                    {item.name}
                </h2>
            </div>

            <div className="flex gap-2 w-18">
                <p className="text-zinc-400 font-semibold text-sm mt-0.5 border-r pr-2">×{item.quantity}</p>
                <p className="text-zinc-100 font-bold text-md">₹{item.price * item.quantity}</p>
            </div>
        </div>
    );
}

export default OrderItem;