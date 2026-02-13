import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import api from "../../utils/api";
import "../../styles/doctorDashboard.css";

function DoctorDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    totalEarnings: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsRes, appRes] = await Promise.all([
          api.get("/api/doctor/stats"),
          api.get("/api/doctor/today-appointments"),
        ]);

        setStats({
          totalPatients: statsRes.data?.totalPatients || 0,
          totalAppointments: statsRes.data?.totalAppointments || 0,
          totalEarnings: statsRes.data?.totalEarnings || 0,
        });
        setAppointments(Array.isArray(appRes.data) ? appRes.data : []);
      } catch (err) {
        console.error("Dashboard failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, Dr. {user?.firstName}</h1>
        <p>Monitor your clinic&apos;s performance and today&apos;s schedule at a glance.</p>
      </div>

      {/* Stats Cards */}
      <div className="doc-stats-grid">
        <div className="doc-stat-card">
          <div className="doc-stat-icon">
            <img src="/assets/users.png" alt="Patients" />
          </div>
          <div className="doc-stat-content">
            <h4>Total Patients</h4>
            <p>{stats.totalPatients}</p>
          </div>
        </div>
        <div className="doc-stat-card">
          <div className="doc-stat-icon">
             <img src="/assets/calander.png" alt="Appointments" />
          </div>
          <div className="doc-stat-content">
            <h4>Today&apos;s Appointments</h4>
            <p>{stats.totalAppointments}</p>
          </div>
        </div>
        <div className="doc-stat-card">
          <div className="doc-stat-icon">
             <img src="/assets/moneybag.png" alt="Earnings" />
          </div>
          <div className="doc-stat-content">
            <h4>Total Earnings</h4>
            <p>₹{stats.totalEarnings}</p>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="appointments-box">
        <div className="appointments-header">
          <div>
            <h2>Today&apos;s Appointments</h2>
            <p className="sub-text">
              Review your upcoming patients and stay prepared for your day.
            </p>
          </div>
          <span className="badge-count">{appointments.length} booked</span>
        </div>

        {isLoading ? (
          <div className="appointments-skeleton-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className="appt-skeleton" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <p className="empty-text">No appointments scheduled for today.</p>
        ) : (
          <div className="appointments-list">
            {appointments.map((a) => (
              <div key={a._id} className={`appointment-item ${a.status}`}>
                <div className="appt-main-info">
                  <h3>
                    {a.user?.firstName} {a.user?.lastName}
                  </h3>
                  <p className="appt-time">
                    {a.start && a.end
                      ? `${new Date(a.start).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })} – ${new Date(a.end).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`
                      : ""}
                  </p>
                </div>
                <div className="appt-side-info">
                  <span className={`status-pill ${a.status}`}>{a.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;
