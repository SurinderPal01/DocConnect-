import {useState , useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import api from "../utils/api";
import Loader from "../components/Loader";
import HomeSkeleton from "../components/HomeSkeleton";
import SpecializationSkeleton from "../components/SpecializationSkeleton";
import "../styles/home.css";

function Home() {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  const [loadingFeatured , setLoadingFeatured] = useState(true);
  const [loadingSpecs , setLoadingSpecs] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  api.get("/api/doctor/public/featured")
    .then(res => setFeaturedDoctors(res.data))
    .catch(console.error)
    .finally(() => setLoadingFeatured(false));

  api.get("/api/doctor/public/specializations")
    .then(res => setSpecializations(res.data))
    .catch(console.error)
    .finally(() => setLoadingSpecs(false));
}, []);


  return (
    <div className="home-wrapper">
      <section className="hero-section">
        <div className="hero-content">
            <h1>Your Health, Our Priority</h1>
            <p>Connect with top-rated doctors and manage your appointments effortlessly.</p>
            <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary-lg">Get Started</Link>
            <Link to="/login" className="btn btn-outline-lg">Login</Link>
            </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
            <h2>Why Choose DocConnect?</h2>
            <p>We provide the best medical services for you and your family.</p>
        </div>
        <div className="feature-grid">
          <div className="feature-item">
            <div className="feature-icon">
                <img src="/assets/users.png" alt="Verified" />
            </div>
            <h3>Verified Doctors</h3>
            <p>All our doctors are verified and approved professionals.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
                <img src="/assets/calander.png" alt="Booking" />
            </div>
            <h3>Easy Booking</h3>
            <p>Book appointments in seconds without hassle.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
                <img src="/assets/securelock.png" alt="Secure" />
            </div>
            <h3>Secure Data</h3>
            <p>Your personal health data is fully encrypted and safe.</p>
          </div>
        </div>
      </section>

      {loadingFeatured ? (
        <HomeSkeleton />
      ):
      (featuredDoctors.length > 0 && (
        <section className="doctors-section">
          <div className="section-header">
             <h2>Top Rated Doctors</h2>
             <p>Book appointments with our most trusted specialists.</p>
          </div>
          
          <div className="doctors-grid-home">
            {featuredDoctors.slice(0, 4).map((doctor) => (
              <div key={doctor._id} className="doc-card-home" onClick={() => navigate(`/doctor/public/${doctor._id}`)}>
                <div className="doc-img-wrapper">
                    <img 
                        src={doctor.profilePhoto || "/assets/doctor.png"} 
                        alt={doctor.firstName} 
                        onError={(e) => e.target.src = "/assets/doctor.png"}
                    />
                </div>
                <div className="doc-card-body">
                    <div className="doc-badge">{doctor.specialization}</div>
                    <h3>Dr. {doctor.firstName} {doctor.lastName}</h3>
                    <div className="doc-meta-home">
                         <span>₹{doctor.consultationFee}</span>
                    </div>
                </div>
                <div className="doc-card-footer">
                    <button className="btn-book">Book Appointment</button>
                </div>
              </div>
            ))}
          </div>
          <div className="view-all-container">
               <Link to="/doctors" className="btn btn-secondary">View All Doctors</Link>
          </div>
        </section>
      ))
    }

    {loadingSpecs ? (
      <SpecializationSkeleton />
    ):(
      specializations.length > 0 && (
        <section className="specs-section">
          <div className="section-header">
            <h2>Browse by Specialization</h2>
            <p>Find the right doctor for your specific needs.</p>
          </div>
          <div className="specs-grid-home">
            {specializations.slice(0, 8).map((spec) => (
              <div 
                key={spec} 
                className="spec-card-home"
                onClick={() => navigate(`/doctors?specialization=${encodeURIComponent(spec)}`)}
              >
                {spec}
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="cta-section">
        <div className="cta-content">
            <h2>Are you a qualified Doctor?</h2>
            <p>Join our network and help thousands of patients.</p>
             <Link to="/signup" className="btn btn-white">Join as Doctor</Link>
        </div>
      </section>

      <footer className="main-footer">
        <p>© {new Date().getFullYear()} DocConnect. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
