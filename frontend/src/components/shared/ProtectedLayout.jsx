import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";


function ProtectedLayout() {

    return (
        <div className="
            min-h-screen
            bg-zinc-900
            flex
        ">

            <Sidebar />


            <div className="
                flex-1
                min-w-0
                flex
                flex-col
            ">

                <Header />

                <main className="flex-1">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}


export default ProtectedLayout;