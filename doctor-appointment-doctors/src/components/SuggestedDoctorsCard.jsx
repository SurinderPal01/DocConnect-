import { useState } from "react";
import api from "../utils/api";
import "../styles/suggestdoctorcard.css"
export default function SuggestedDoctorCard(){
    const [symptoms ,setSymptoms] = useState("");
    const [doctors , setDoctors] = useState([]);
    const [loading , setLoading] = useState(false);
    const [specialization,setSpecialization] = useState("");

    const fetchDoctors= async ()=>{
        if(!symptoms.trim()) return;
        setLoading(true);
        try{
            const res = await api.post("/api/ai/suggest-doctor",{symptoms});
            setDoctors(res.data.suggestedDoctors ||[]);
            setSpecialization(res.data.specialization);
        }catch(err){
            console.error("Error fetching suggested doctors:", err);
      setDoctors([]);
      setSpecialization("");
        }
        setLoading(false);
    }

    return (
    <div className="ai-suggested-doctor">
      <h3>AI Suggested Doctors</h3>
      <input
        type="text"
        placeholder="Describe your symptoms..."
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />
      <button onClick={fetchDoctors} disabled={loading}>
        {loading ? "Finding..." : "Suggest Doctor"}
      </button>

      {specialization && <p>Suggested Specialization: {specialization}</p>}

      <div className="doctor-cards">
        {doctors.length === 0 && <p>No doctors found</p>}
        {doctors.map((doc) => (
          <div key={doc._id} className="doctor-card">
            <h4>{doc.firstName} {doc.lastName}</h4>
            <p>Specialization: {doc.specialization}</p>
            <p>Experience: {doc.experience} yrs</p>
            <p>Fee: ₹{doc.consultationFee}</p>
            <button>Book Appointment</button>
          </div>
        ))}
      </div>
    </div>
  );
}