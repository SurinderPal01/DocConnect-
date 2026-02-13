import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import SuggestedDoctorCard from "../../components/SuggestedDoctorsCard";
import api from "../../utils/api";
import "../../styles/userdashboard.css";
import Loader from "../../components/Loader";
import { formatTime } from "../../utils/time";

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
  <div className="dc-user-dashboard">
    <div className="dc-dashboard-header">
      <h1>Welcome back, {currentUser?.firstName}!</h1>
      <p className="dc-welcome-subtitle">Manage your appointments and find doctors easily</p>
    </div>

    <div className="dc-user-stats-grid">
      <div className="dc-user-stat-card">
        <div className="dc-user-stat-icon">
          <img src="/assets/calander.png" alt="Total Appointments" className="dc-dashboard-icon" />
        </div>
        <div className="dc-user-stat-info">
          <h3>{totalAppointments}</h3>
          <p>Total Appointments</p>
        </div>
      </div>

      <div className="dc-user-stat-card">
        <div className="dc-user-stat-icon">
          <img src="/assets/alarm-clock.png" alt="Upcoming" className="dc-dashboard-icon" />
        </div>
        <div className="dc-user-stat-info">
          <h3>{upcomingAppointments.length}</h3>
          <p>Upcoming</p>
        </div>
      </div>

      <div className="dc-user-stat-card">
        <div className="dc-user-stat-icon">
          <img src="/assets/check-double.png" alt="Completed" className="dc-dashboard-icon" />
        </div>
        <div className="dc-user-stat-info">
          <h3>{completedAppointments}</h3>
          <p>Completed</p>
        </div>
      </div>
    </div>

    <div className="dc-user-dashboard-content">
      <div className="dc-search-card">
        <h3>
          <img src="/assets/search.png" alt="Search" className="dc-dashboard-icon-inline" /> Find Doctors
        </h3>
        <p>Search doctors by specialization</p>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="dc-search-select"
        >
          <option value="">Select Specialization</option>
          {specializations.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
        <button onClick={searchDoctor} className="dc-search-btn">
          Search Doctors
        </button>
      </div>

      <div className="dc-quick-actions">
        <h3>Quick Actions</h3>
        <div className="dc-action-cards">
          <Link to="/dashboard/appointments" className="dc-action-card">
            <div className="dc-action-icon">
              <img src="/assets/calander.png" alt="Appointments" className="dc-dashboard-icon" />
            </div>
            <div className="dc-action-content">
              <h4>My Appointments</h4>
              <p>View all your appointments</p>
            </div>
            <span className="dc-action-arrow">→</span>
          </Link>

          <Link to="/dashboard/profile" className="dc-action-card">
            <div className="dc-action-icon">
              <img src="/assets/user.png" alt="Profile" className="dc-dashboard-icon" />
            </div>
            <div className="dc-action-content">
              <h4>Profile</h4>
              <p>Update your information</p>
            </div>
            <span className="dc-action-arrow">→</span>
          </Link>

          <Link to="/doctors" className="dc-action-card">
            <div className="dc-action-icon">
              <img src="/assets/search.png" alt="Browse" className="dc-dashboard-icon" />
            </div>
            <div className="dc-action-content">
              <h4>Browse Doctors</h4>
              <p>Find and book doctors</p>
            </div>
            <span className="dc-action-arrow">→</span>
          </Link>
        </div>
      </div>

      {upcomingAppointments.length > 0 && (
        <div className="dc-upcoming-appointments">
          <h3>Upcoming Appointments</h3>
          <div className="dc-appointments-preview">
            {upcomingAppointments.slice(0, 3).map((apt) => (
              <div key={apt._id} className="dc-appointment-preview-card" onClick={() => navigate(`/dashboard/appointment/${apt._id}`)}>
                <div className="dc-card-left-content">
                  <div className="dc-preview-doctor-info">
                    <h4>Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}</h4>
                    <p className="dc-preview-spec">{apt.doctor?.specialization}</p>
                  </div>
                  <span className={`dc-preview-status ${apt.status}`}>
                    {apt.status}
                  </span>
                </div>
                <div className="dc-card-right-content">
                  <p className="dc-preview-date">
                    {new Date(apt.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="dc-preview-time">
                    {formatTime(apt.start)} - {formatTime(apt.end)}
                  </p>
                </div>
              </div>
            ))}
            {upcomingAppointments.length > 3 && (
              <Link to="/dashboard/appointments" className="dc-view-all-link">
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