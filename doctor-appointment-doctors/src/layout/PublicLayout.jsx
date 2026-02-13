import { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";

function PublicLayout (){
    const [open, setOpen] = useState(false);
    const sidebarRef = useRef();

    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [open]);

    return(
        <div className="dc-public-layout">
            <div ref={sidebarRef}>
                <Sidebar open={open} setOpen={setOpen} />
            </div>
            
            <div className="dc-public-content">
                <Topbar onMenuClick={() => setOpen(!open)} isOpen={open} />
                <Outlet />
            </div>
        </div>
    )
}

export default PublicLayout;