import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import SuggestedDoctorCard from "../../components/SuggestedDoctorsCard";
import api from "../../utils/api";
import "../../styles/userdashboard.css";
import Loader from "../../components/Loader";

function UserDashboard({ user }) {
    const navigate = useNavigate();
    const { user: authUser } = useAuth();
    const [category, setCategory] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [specializations, setSpecializations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [apptsRes, specsRes] = await Promise.all([
                    api.get("/api/appointment/user"),
                    api.get("/api/doctor/public/specializations")
                ]);
                setAppointments(apptsRes.data);
                setSpecializations(specsRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const searchDoctor = () => {
        if (!category) {
            alert("Please Select a category");
            return;
        }
        navigate(`/dashboard/search?category=${category}`);
    };

    const currentUser = user || authUser;
    const upcomingAppointments = appointments.filter(
        apt => apt.status === "accepted" || apt.status === "pending"
    );
    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(
        apt => apt.status === "completed"
    ).length;

    if(loading){
        return <Loader />
    }
   return (
  <div className="user-dashboard">
    <div className="dashboard-header">
      <h1>Welcome back, {currentUser?.firstName}!</h1>
      <p className="welcome-subtitle">Manage your appointments and find doctors easily</p>
    </div>

    <div className="user-stats-grid">
      <div className="user-stat-card">
        <div className="user-stat-icon">📅</div>
        <div className="user-stat-info">
          <h3>{totalAppointments}</h3>
          <p>Total Appointments</p>
        </div>
      </div>

      <div className="user-stat-card">
        <div className="user-stat-icon">⏰</div>
        <div className="user-stat-info">
          <h3>{upcomingAppointments.length}</h3>
          <p>Upcoming</p>
        </div>
      </div>

      <div className="user-stat-card">
        <div className="user-stat-icon">✅</div>
        <div className="user-stat-info">
          <h3>{completedAppointments}</h3>
          <p>Completed</p>
        </div>
      </div>
    </div>

    <div className="user-dashboard-content">
      <div className="search-card">
        <h3>🔍 Find Doctors</h3>
        <p>Search doctors by specialization</p>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="search-select"
        >
          <option value="">Select Specialization</option>
          {specializations.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
        <button onClick={searchDoctor} className="search-btn">
          Search Doctors
        </button>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-cards">
          <Link to="/dashboard/appointments" className="action-card">
            <div className="action-icon">📅</div>
            <div className="action-content">
              <h4>My Appointments</h4>
              <p>View all your appointments</p>
            </div>
            <span className="action-arrow">→</span>
          </Link>

          <Link to="/dashboard/profile" className="action-card">
            <div className="action-icon">👤</div>
            <div className="action-content">
              <h4>Profile</h4>
              <p>Update your information</p>
            </div>
            <span className="action-arrow">→</span>
          </Link>

          <Link to="/doctors" className="action-card">
            <div className="action-icon">🔍</div>
            <div className="action-content">
              <h4>Browse Doctors</h4>
              <p>Find and book doctors</p>
            </div>
            <span className="action-arrow">→</span>
          </Link>
        </div>
      </div>

      {upcomingAppointments.length > 0 && (
        <div className="upcoming-appointments">
          <h3>Upcoming Appointments</h3>
          <div className="appointments-preview">
            {upcomingAppointments.slice(0, 3).map((apt) => (
              <div key={apt._id} className="appointment-preview-card" onClick={() => navigate(`/dashboard/appointment/${apt._id}`)}>
                <div className="preview-doctor-info">
                  <h4>Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}</h4>
                  <p className="preview-spec">{apt.doctor?.specialization}</p>
                </div>
                <div className="preview-date-info">
                  <p className="preview-date">
                    {new Date(apt.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="preview-time">{apt.start} - {apt.end}</p>
                </div>
                <span className={`preview-status ${apt.status}`}>
                  {apt.status}
                </span>
              </div>
            ))}
            {upcomingAppointments.length > 3 && (
              <Link to="/dashboard/appointments" className="view-all-link">
                View All Appointments →
              </Link>
            )}
          </div>
        </div>
      )}

      <SuggestedDoctorCard />
    </div>
  </div>
);
}

export default UserDashboard;