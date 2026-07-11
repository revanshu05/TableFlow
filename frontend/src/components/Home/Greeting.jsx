import { useState, useEffect } from "react";

function Greeting(){
    let [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return(
        <div className="flex justify-between px-2 py-1 bg-zinc-800 m-2 rounded-2xl">
            <div className="pl-5 text-zinc-300">
                <h1 className="text-lg font-bold">Good Morning, user</h1>
                <p className="text-sm">Give your best</p>
            </div>

            <div className="pr-5 text-zinc-300">
                <div className="text-lg font-bold">{now.toLocaleTimeString()}</div>
                <div className="text-md">{now.toLocaleDateString()}</div>
            </div>
        </div>
    )
}

export default Greeting;