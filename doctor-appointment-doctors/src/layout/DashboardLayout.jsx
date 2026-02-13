import { useState , useRef , useEffect } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar"; // RESTORED
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
        <div ref={sidebarRef}>
        <Sidebar open={open} setOpen={setOpen} />
      </div>

      <main className="dashboard-content">
        <Topbar onMenuClick={() => setOpen(!open)} isOpen={open} />
        <div className="dashboard-page-container">
           <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
