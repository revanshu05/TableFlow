import { IoClose } from "react-icons/io5";

function Modal({title, onClose, isOpen, children}){
    if(!isOpen) return null;

    return(
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-zinc-800 shadow-xl w-full max-w-sm mx-4 rounded-lg p-2">
                <div className="flex justify-between items-center px-6 py-2 border-b border-zinc-600">
                    <h1 className="text-xl text-zinc-300 font-semibold">{title}</h1>
                    <button 
                        className="text-zinc-500 text-xl hover:text-amber-200 duration-200"
                        onClick={onClose}>
                        <IoClose size={26} />
                    </button>
                </div>
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal;