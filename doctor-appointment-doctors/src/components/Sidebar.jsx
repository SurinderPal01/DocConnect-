import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../styles/sidebar.css"

function Sidebar({ open,setOpen}){
    const { user ,logout} = useAuth();

    const handleClose = ()=>setOpen(false);

    return(
      <aside className={`dc-sidebar ${open ? "dc-open" : ""}`}>
        <h2 className="dc-logo dc-desktop-logo">DocConnect</h2>
        <div className="dc-mobile-sidebar-header">
            <button className="dc-mobile-close-btn" onClick={handleClose}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <h2 className="dc-logo">DocConnect</h2>
        </div>

        <nav onClick={handleClose}>
        
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            {user.role === "user" && (
              <>
                <Link to="/dashboard/profile">Profile</Link>
                <Link to="/dashboard/appointments">Appointments</Link>
                <Link to="/dashboard/find-doctors">Browse Doctors</Link>
                <Link to="/notifications" >Notifications</Link>
              </>
            )}

            {user.role === "doctor" && (
              <>
                <Link to="/dashboard/availability">Availability</Link>
                <Link to="/dashboard/appointments">Appointments</Link>
                <Link to="/dashboard/profile">Profile</Link>
                <Link to="/notifications" >Notifications</Link>
              </>
            )}
            <button className="dc-logout-btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/doctors">Find Doctors</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
        </nav>
      </aside>
    )
}
export default Sidebar;