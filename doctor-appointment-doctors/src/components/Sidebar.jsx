import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../styles/sidebar.css"

function Sidebar({ open,setOpen}){
    const { user ,logout} = useAuth();

    const handleClose = ()=>setOpen(false);

    return(
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <h2 className="logo">DocConnect</h2>

        <nav onClick={handleClose}>
            <Link to="/dashboard">Dashboard</Link>
             {user?.role === "user" && (
          <>
            <Link to="/dashboard/profile">Profile</Link>
            <Link to="/dashboard/appointments">Appointments</Link>
            <Link to="/notifications" >Notifications</Link>

          </>
        )}

        {user?.role === "doctor" && (
          <>
          
           <Link to="/dashboard/availability">Availability</Link>
            <Link to="/dashboard/appointments">Appointments</Link>
            <Link to="/dashboard/profile">Profile</Link>
            <Link to="/notifications" >Notifications</Link>

          </>
        )}
        <button className="logout-btn" onClick={logout}>Logout</button>
        </nav>
      </aside>
    )
}
export default Sidebar;