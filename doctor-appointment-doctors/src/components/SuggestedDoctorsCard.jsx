import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "../styles/suggestdoctorcard.css"

export default function SuggestedDoctorCard() {
    const [symptoms, setSymptoms] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [specialization, setSpecialization] = useState("");
    const navigate = useNavigate();

    const fetchDoctors = async () => {
        if (!symptoms.trim()) return;
        setLoading(true);
        try {
            const res = await api.post("/api/ai/suggest-doctor", { symptoms });
            setDoctors(res.data.suggestedDoctors || []);
            setSpecialization(res.data.specialization);
        } catch (err) {
            console.error("Error fetching suggested doctors:", err);
            setDoctors([]);
            setSpecialization("");
        }
        setLoading(false);
    }

    return (
        <div className="ai-suggested-doctor">
            <div className="ai-header">
                <h3>✨ AI Health Assistant</h3>
                <p>Describe your symptoms to find the right specialist</p>
            </div>
            
            <div className="ai-search-box">
                <input
                    type="text"
                    placeholder="E.g., bad headache and fever..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchDoctors()}
                />
                <button onClick={fetchDoctors} disabled={loading} className="ai-search-btn">
                    {loading ? "Analyzing..." : "Find Doctors"}
                </button>
            </div>

            {specialization && (
                <div className="ai-result-badge">
                    Suggested Specialist: <strong>{specialization}</strong>
                </div>
            )}

            <div className="doctor-cards-grid">
                {doctors.map((doc) => (
                    <div key={doc._id} className="suggested-doc-card" onClick={() => navigate(`/doctors/${doc._id}`)}>
                        <div className="doc-avatar-wrapper">
                            <img 
                                src={doc.profilePhoto || "/assets/doctor.png"} 
                                alt={doc.firstName} 
                                className="doc-avatar"
                                onError={(e) => e.target.src = "/assets/doctor.png"}
                            />
                        </div>
                        <div className="doc-info">
                            <h4>Dr. {doc.firstName} {doc.lastName}</h4>
                            <span className="doc-spec-badge">{doc.specialization}</span>
                            <div className="doc-meta">
                                <span>💼 {doc.experience} Years</span>
                                <span>💰 ₹{doc.consultationFee}</span>
                            </div>
                        </div>
                        <button className="view-profile-btn">View Profile</button>
                    </div>
                ))}
                {doctors.length === 0 && !loading && specialization && (
                    <p className="no-docs-msg">No doctors found for this specialization.</p>
                )}
            </div>
        </div>
    );
}