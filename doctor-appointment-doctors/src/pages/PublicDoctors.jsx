import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
    navigate(`/doctors${spec ? `?specialization=${encodeURIComponent(spec)}` : ""}`);
  };

  return (
    <div className="public-doctors-page">
      <div className="doctors-header">
        <h1>Find Your Doctor</h1>
        <p>Browse through our verified doctors</p>
      </div>

      <div className="doctors-content">
        <div className="filters-sidebar">
          <h3>Specializations</h3>
          <div className="filter-list">
            <button
              className={`filter-btn ${!selectedSpec ? "active" : ""}`}
              onClick={() => handleSpecChange("")}
            >
              All Specializations
            </button>
            {specializations.map((spec) => (
              <button
                key={spec}
                className={`filter-btn ${selectedSpec === spec ? "active" : ""}`}
                onClick={() => handleSpecChange(spec)}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        <div className="doctors-list-section">
          {loading ? (
            <div className="doctors-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <DoctorCardSkeleton key={i} />
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <div className="no-doctors">
              <p>No doctors found</p>
            </div>
          ) : (
            <>
              <div className="doctors-grid">
                {doctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="doctor-card-public"
                    onClick={() => navigate(`/doctor/public/${doctor._id}`)}
                  >
                    <div className="doctor-image">
                      {doctor.profilePhoto ? (
                        <img src={doctor.profilePhoto} alt={doctor.firstName} />
                      ) : (
                        <div className="doctor-avatar-large">👨‍⚕️</div>
                      )}
                    </div>
                    <div className="doctor-info-public">
                      <h3>Dr. {doctor.firstName} {doctor.lastName}</h3>
                      <p className="specialization">{doctor.specialization}</p>
                      {doctor.experience && (
                        <p className="experience">Experience: {doctor.experience} years</p>
                      )}
                      {doctor.consultationFee && (
                        <p className="fee">Consultation Fee: ₹{doctor.consultationFee}</p>
                      )}
                      {doctor.approved && (
                        <span className="verified-badge">✓ Verified</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
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

