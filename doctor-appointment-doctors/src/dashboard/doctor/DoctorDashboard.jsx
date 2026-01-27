import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import api from "../../utils/api";
import "../../styles/doctorDashboard.css";

function DoctorDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({});
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const statsRes = await api.get("/api/doctor/stats");
        const appRes = await api.get("/api/doctor/today-appointments");

        setStats(statsRes.data);
        setAppointments(appRes.data);
      } catch (err) {
        console.error("Dashboard load failed", err);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="doctor-dashboard">

      {/* Header */}
      <div className="dashboard-header">
        <h1>Doctor Dashboard</h1>
        <p>Welcome Dr. {user.firstName}</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Today's Appointments</h3>
          <p>{appointments.length}</p>
        </div>

        <div className="stat-card">
          <h3>Total Patients</h3>
          <p>{stats.totalPatients || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Total Earnings</h3>
          <p>₹{stats.totalEarnings || 0}</p>
        </div>
      </div>

      {/* Appointments List */}
      <div className="appointments-box">
        <h2>Today's Appointments</h2>

        {appointments.length === 0 && (
          <p className="empty-text">No appointments today</p>
        )}

        {appointments.map((a) => (
          <div key={a._id} className="appointment-item">
            <div>
              <p><b>Patient:</b> {a.user.firstName} {a.user.lastName}</p>
              <p><b>Time:</b> {a.slot?.start} - {a.slot?.end}</p>
            </div>

            <span className={`status ${a.status}`}>
              {a.status}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default DoctorDashboard;
