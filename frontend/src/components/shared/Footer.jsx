import { FaHome } from "react-icons/fa";
import { MdTableBar } from "react-icons/md";
import { BsBorderStyle } from "react-icons/bs";
import { IoIosMore } from "react-icons/io";
import { BiSolidDish } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";
import { useState } from "react";
import { FaSquarePlus } from "react-icons/fa6";
import { FaSquareMinus } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { setCustomer } from "../../redux/slices/customerSlice";

function Footer() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    let [ModalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);
    let [members, setMembers] = useState(0);
    let [orderType, setOrderType] = useState("dine-in");
    let [name, setName] = useState("");
    let [phone, setPhone] = useState("");

    const increment = () => {
        if(members >= 6) return;
        setMembers((prev) => prev + 1);
    }

    const decrement = () => {
        if(members <= 0) return;
        setMembers((prev) => prev - 1);
    }

    const handleOrder = () => {
        dispatch(setCustomer({name, phone, members, orderType}))
        
        if(orderType === "take-away") navigate("/menu");
        else navigate("/tables");
    }

    return (
        <div className="bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-700 flex justify-around items-center py-3 fixed">

            <button 
                className={`flex items-center gap-2 hover:scale-110 transition-all duration-200 ${
                    location.pathname === "/"
                        ? "text-amber-400"
                        : "text-zinc-400 hover:text-zinc-100"
                }`}
                onClick={() => navigate("/")}>
                <FaHome size={24} />
                <span>Home</span>
            </button>

            <button 
                className={`flex items-center gap-2 hover:scale-110 transition-all duration-200 ${
                    location.pathname === "/orders"
                        ? "text-amber-400"
                        : "text-zinc-400 hover:text-zinc-100"
                }`}
                onClick={() => navigate("/orders")}>
                <BsBorderStyle size={24} />
                <span>Orders</span>
            </button>

            <button 
                className={`flex items-center gap-2 hover:scale-110 transition-all duration-200 ${
                    location.pathname === "/tables"
                        ? "text-amber-400"
                        : "text-zinc-400 hover:text-zinc-100"
                }`}
                onClick={() => navigate("/tables")}>
                <MdTableBar size={24} />
                <span>Tables</span>
            </button>

            <button className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 
                hover:scale-110 transition-all duration-200">
                <IoIosMore size={24} />
                <span>More</span>
            </button>

            {location.pathname === "/" ? 
                (<button className="absolute left-1/2 -translate-x-1/2 -top-8 p-4 rounded-full 
                bg-amber-500 text-white hover:bg-amber-600 hover:scale-110 transition-all duration-200"
                onClick={openModal}>
                <BiSolidDish size={35} />
            </button>) : null}
            
            <Modal
                title="Create Order"
                isOpen={ModalOpen}
                onClose={closeModal}
                children={
                    <div className="flex flex-col items-center w-full">
                        <div className="w-full mb-4">
                            <label className="block text-zinc-300 mx-1 mb-2 text-sm font-medium">Customer Name</label>
                            <div className="flex items-center rounded-lg py-2 px-4 bg-zinc-900">
                                <input 
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    name=""
                                    placeholder="Enter customer name"
                                    className="bg-transparent flex-1 text-zinc-300 focus:outline-none"/>
                            </div> 
                        </div>

                        <div className="w-full mb-4">
                            <label className="block text-zinc-300 mx-1 mb-2 text-sm font-medium">Customer Mobile No.</label>
                            <div className="flex items-center rounded-lg py-2 px-4 bg-zinc-900">
                                <input 
                                    type="text"
                                    name=""
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+91 ----- -----"
                                    className="bg-transparent flex-1 text-zinc-300 focus:outline-none"/>
                            </div> 
                        </div>

                        <div className="w-full mb-4">
                            <label className="block text-zinc-300 mx-1 mb-2 text-sm font-medium">
                                Order Type
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setOrderType("dine-in")}
                                    className={`py-1.5 rounded-lg font-medium transition-all duration-200
                                        ${
                                            orderType === "dine-in"
                                                ? "bg-olive-600 text-white"
                                                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-950"
                                        }`}
                                >
                                    🍽 Dine In
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setOrderType("take-away")}
                                    className={`py-1.5 rounded-lg font-medium transition-all duration-200
                                        ${
                                            orderType === "take-away"
                                                ? "bg-olive-600 text-white"
                                                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-950"
                                        }`}
                                >
                                    🛍 Take Away
                                </button>
                            </div>
                        </div>
                        
                        {/* Members */}
                        {orderType === "dine-in" && (
                            <div className="w-full mb-4">
                                <label className="block text-zinc-300 mx-1 mb-2 text-sm font-medium">Members</label>
                                <div className="flex items-center justify-between rounded-lg py-2 px-4 bg-zinc-900">
                                    <button className="text-zinc-500 hover:text-zinc-400 duration-200"
                                        onClick={decrement}>
                                        <FaSquareMinus  size={20}/>
                                    </button>

                                    <span className="text-lg text-zinc-300">{members}</span>

                                    <button className="text-zinc-500 hover:text-zinc-400 duration-200"
                                        onClick={increment}>
                                        <FaSquarePlus  size={20}/>
                                    </button>
                                </div>
                            </div>)
                        }  

                        <button 
                            className="px-10 text-lg text-zinc-800 font-semibold bg-yellow-500 
                                rounded-lg py-1 mt-3 hover:bg-yellow-400 duration-200"
                            onClick={() => {
                                handleOrder(); 
                                closeModal(); 
                            }}
                        >Create</button>
                    </div>}
                
                ></Modal>
        </div>
    );
}

export default Footer;