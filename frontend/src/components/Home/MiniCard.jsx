
function MiniCard({title, icon, num, footnum, high}){
    return(
        <div className="bg-zinc-900 rounded-lg m-3 px-4 py-3 text-zinc-300 w-[50%]">
            
            <div className="flex flex-row justify-between">
                <h1 className="font-medium">{title}</h1>
                <button className={`${title === "Total Earnings" ? "bg-green-700" : "bg-amber-500"} 
                    p-2 rounded-md text-zinc-200 text-xl`}>{icon}</button>
            </div>

            <div className="pt-5">
                <h1 className="text-2xl font-bold mb-1">{num}</h1>
                <p className="text-[12px] font-normal">
                    <span className={`${high ==="true" ? "text-green-600" : "text-red-400"}`}>{footnum}%</span> than yesterday</p>
            </div>
        </div>
    )
}

export default MiniCard;