import {useState , useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import api from "../utils/api";
import Loader from "../components/Loader";
import HomeSkeleton from "../components/HomeSkeleton";
import "../styles/home.css";

function Home() {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, specsRes] = await Promise.all([
          api.get("/api/doctor/public/featured"),
          api.get("/api/doctor/public/specializations")
        ]);
        setFeaturedDoctors(doctorsRes.data);
        setSpecializations(specsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <HomeSkeleton />;

  return (
    <div className="home-container">
      <section className="hero">
        <h1>Book doctors appointments easily </h1>
        <p>A simple platform to connect doctors with patients</p>

        <div className="hero-buttons">
          <Link to="/signup" className="btn primary">Get Started</Link>
          <Link to="/login" className="btn secondary">Login</Link>
        </div>
      </section>

      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <img src="/assets/img11.jpg" alt="Verified Doctors" />
            <h3>Verified Doctors</h3>
            <p>All our doctors are verified and approved professionals</p>
          </div>
          <div className="feature-card">
            <img src="/assets/img12.jpg" alt="Easy Appointments" />
            <h3>Easy Appointments</h3>
            <p>Book appointments easily without hassle.</p>
          </div>
          <div className="feature-card">
            <img src="/assets/img13.jpg" alt="Secure Platform" />
            <h3>Secure Platform</h3>
            <p>Your personal data is fully secure and encrypted.</p>
          </div>
        </div>
      </section>

      {featuredDoctors.length > 0 && (
        <section className="featured-doctors">
          <h2>Featured Doctors</h2>
          <div className="doctors-grid">
            {featuredDoctors.slice(0, 6).map((doctor) => (
              <div key={doctor._id} className="doctor-card-mini" onClick={() => navigate(`/doctor/public/${doctor._id}`)}>
                {doctor.profilePhoto ? (
                  <img src={doctor.profilePhoto} alt={doctor.firstName} />
                ) : (
                  <div className="doctor-avatar">👨‍⚕️</div>
                )}
                <h3>Dr. {doctor.firstName} {doctor.lastName}</h3>
                <p className="spec">{doctor.specialization}</p>
                {doctor.consultationFee && (
                  <p className="fee">₹{doctor.consultationFee}</p>
                )}
              </div>
            ))}
          </div>
          <Link to="/doctors" className="btn primary">View All Doctors</Link>
        </section>
      )}

      {specializations.length > 0 && (
        <section className="specializations-section">
          <h2>Browse by Specialization</h2>
          <div className="specializations-grid">
            {specializations.slice(0, 12).map((spec) => (
              <div 
                key={spec} 
                className="spec-card"
                onClick={() => navigate(`/doctors?specialization=${encodeURIComponent(spec)}`)}
              >
                {spec}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="info-section">
        <h2>For Doctors</h2>
        <p>
          Manage your profile, specialization, and appointments from a single
          dashboard.
        </p>
        <Link to="/signup" className="btn secondary">Join as Doctor</Link>
      </section>

      <section className="info-section light">
        <h2>For Patients</h2>
        <p>Find Doctors by Specialization and Book Appointment System</p>
        <Link to="/signupuser" className="btn primary">Sign Up as Patient</Link>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Doctor Appointment System</p>
      </footer>
    </div>
  );
}

export default Home;
