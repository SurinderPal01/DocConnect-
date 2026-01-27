import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../styles/topbar.css";

function Topbar(){
    const { user } = useAuth();

    return(
        <nav className="topbar">
            <div className="topbar-container">
                <Link to="/" className="logo-link">
                    <h2 className="logo-text">DocConnect</h2>
                </Link>
                
                <div className="topbar-links">
                    <Link to="/doctors" className="nav-link">Find Doctors</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            <Link to="/dashboard/profile" className="nav-link user-name">
                                {user.firstName}
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/signup" className="nav-link btn-primary">Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
export default Topbar;