import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/dashboardlayout.css";

function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      {/* mobile toggle button */}
      <button className="menu-btn" onClick={() => setOpen(!open)}>
        ☰
      </button>

      <Sidebar open={open} setOpen={setOpen} />

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
