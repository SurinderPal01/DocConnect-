import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../styles/topbar.css";

function Topbar({ onMenuClick, isOpen }){
    const { user } = useAuth();

    return(
        <nav className={`dc-topbar ${isOpen ? "dc-menu-open" : ""}`}>
            <div className="dc-topbar-container">
                <div className="dc-topbar-left">
                    {onMenuClick && (
                        <button className={`dc-mobile-menu-toggle ${isOpen ? "active" : ""}`} onClick={(e) => {
                            e.stopPropagation();
                            onMenuClick();
                        }}>
                            {isOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>
                    )}
                    <Link to="/" className="dc-logo-link">
                        <h2 className="dc-logo-text">DocConnect</h2>
                    </Link>
                </div>
                
                <div className="dc-topbar-links">
                    <Link to="/doctors" className="dc-nav-link">Find Doctors</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="dc-nav-link">Dashboard</Link>
                            <Link to="/dashboard/profile" className="dc-nav-link dc-user-name">
                                {user.firstName}
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="dc-nav-link">Login</Link>
                            <Link to="/signup" className="dc-nav-link dc-btn-primary">Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
export default Topbar;