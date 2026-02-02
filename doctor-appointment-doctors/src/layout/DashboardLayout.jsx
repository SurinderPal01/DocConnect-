import { useState , useRef , useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/dashboardlayout.css";

function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef();
  
  useEffect(()=>{
    if(!open) return;
    const handleClickOutside = (e)=>{
      if(sidebarRef.current && !sidebarRef.current.contains(e.target)){
        setOpen(false);
      }
    }
      if (open) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  },[open]);
  return (
    <div className="dashboard-layout">
      {/* mobile toggle button */}
      <button className="menu-btn" onClick={(e) =>{
        e.stopPropagation();
        setOpen((prev)=>!prev);
      }}>
        ☰
      </button>

        <div ref={sidebarRef}>
        <Sidebar open={open} setOpen={setOpen} />
      </div>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
