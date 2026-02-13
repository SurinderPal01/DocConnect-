import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import Loader from "../components/Loader";
import DoctorCardSkeleton from "../components/DoctorCardSkeleton";
import "../styles/publicdoctors.css";

function PublicDoctors() {
  const [searchParams] = useSearchParams();
  const specialization = searchParams.get("specialization");
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpec, setSelectedSpec] = useState(specialization || "");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedSpec) params.append("specialization", selectedSpec);
        params.append("page", page);
        params.append("limit", "12");

        const [doctorsRes, specsRes] = await Promise.all([
          api.get(`/api/doctor/public/all?${params.toString()}`),
          api.get("/api/doctor/public/specializations")
        ]);

        setDoctors(doctorsRes.data.doctors);
        setTotalPages(doctorsRes.data.totalPages);
        setSpecializations(specsRes.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedSpec, page]);

  const handleSpecChange = (spec) => {
    setSelectedSpec(spec);
    setPage(1);
    navigate(`${location.pathname}${spec ? `?specialization=${encodeURIComponent(spec)}` : ""}`);
  };

  return (
    <div className="dc-public-doctors-page">
      <div className="dc-doctors-header">
        <h1>Find Your Doctor</h1>
        <p>Browse through our verified doctors</p>
      </div>

      <div className="dc-doctors-content">
        <div className="dc-filters-sidebar">
          <h3>Specializations</h3>
          <div className="dc-filter-list">
            <button
              className={`dc-filter-btn ${!selectedSpec ? "active" : ""}`}
              onClick={() => handleSpecChange("")}
            >
              All Specializations
            </button>
            {specializations.map((spec) => (
              <button
                key={spec}
                className={`dc-filter-btn ${selectedSpec === spec ? "active" : ""}`}
                onClick={() => handleSpecChange(spec)}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        <div className="dc-doctors-list-section">
          {loading ? (
            <div className="dc-doctors-grid">
              {[1, 2, 3].map((i) => (
                <DoctorCardSkeleton key={i} />
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <div className="dc-no-doctors">
              <p>No doctors found</p>
            </div>
          ) : (
            <>
              <div className="dc-doctors-list-wide">
                {doctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="dc-doctor-card-wide"
                  >
                    <div className="dc-doctor-card-image">
                       <div className="dc-avatar" onClick={() => navigate(`/doctor/public/${doctor._id}`)}>
                        <img 
                          src={doctor.profilePhoto || "/assets/doctor.png"} 
                          alt={`Dr. ${doctor.firstName}`}
                          onError={(e) => {e.target.onerror = null; e.target.src = "/assets/doctor.png"}}
                        />
                      </div>
                      <span className="dc-view-profile-link" onClick={() => navigate(`/doctor/public/${doctor._id}`)}>View Profile</span>
                    </div>

                    <div className="dc-doctor-card-details">
                      <div className="dc-doc-header">
                        <h3>Dr. {doctor.firstName} {doctor.lastName}</h3>
                        <p className="dc-doc-spec">{doctor.specialization}</p>
                         {doctor.approved && <span className="dc-verified-badge">✔ Verified</span>}
                      </div>

                      <div className="dc-doc-meta">
                        <div className="dc-meta-row">
                            <span className="dc-meta-label">Experience:</span>
                            <span className="dc-meta-value">{doctor.experience ? `${doctor.experience} Years` : '5+ Years'}</span>
                        </div>
                        <div className="dc-meta-row">
                             <span className="dc-meta-label">Fee:</span>
                             <span className="dc-meta-value">₹{doctor.consultationFee || '500'}</span>
                        </div>
                         <div className="dc-meta-row">
                            <span className="dc-meta-label">Languages:</span>
                            <span className="dc-meta-value">English, Hindi</span>
                        </div>
                      </div>
                    </div>

                     <div className="dc-doctor-card-actions">
                         <span className="dc-status-badge dc-approved">Available Today</span>
                        <button
                          className="dc-book-btn-large"
                          onClick={() => navigate(`/doctor/public/${doctor._id}`)}
                        >
                          Book Appointment
                        </button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="dc-pagination">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </button>
                  <span>Page {page} of {totalPages}</span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PublicDoctors;

