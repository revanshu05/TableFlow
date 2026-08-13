import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";


function ProtectedLayout() {
    return (
        <div className="h-screen overflow-hidden bg-zinc-900 flex">

            <Sidebar />

            <div className="
                flex-1
                min-w-0
                flex
                flex-col
                overflow-hidden"
            >

                <Header />

                <main className="
                    flex-1
                    min-h-0
                    overflow-hidden"
                >
                    <Outlet />
                </main>

            </div>

        </div>
    );
}


export default ProtectedLayout;