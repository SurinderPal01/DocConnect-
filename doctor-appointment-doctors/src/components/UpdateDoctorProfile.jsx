import { useState } from "react";
import api from "../utils/api";
import "../styles/updatedoctorprofile.css";

function UpdateDoctorProfile({doctor , onCancel , onUpdate}){
    const [form, setForm] = useState({
  firstName: doctor.firstName || "",
  lastName: doctor.lastName || "",
  specialization: doctor.specialization || "",
  experience: doctor.experience || "",
  phone: doctor.phone || "",
  consultationFee: doctor.consultationFee || ""
}); 
    const [saving , setSaving] = useState(false);
      const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async () =>{
    try{
        setSaving(true);
            const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      specialization: form.specialization,
      experience: Number(form.experience),
      phone: form.phone,
      consultationFee: Number(form.consultationFee)
    };


        await api.put("/api/doctor/profile",payload);
        alert("profile Updated Successfully");
        onUpdate();
    }catch(err){
        console.error(err);
    }finally{
        setSaving(false);
    }
  };
  return (
  <div className="update-doctor-profile">
    <h2>Update Profile</h2>

    <div className="update-profile-card">
      <form className="update-profile-form" onSubmit={(e) => e.preventDefault()}>
        
        <div className="form-row">
          <label>First Name</label>
          <input
            name="firstName"
            value={form.firstName || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Last Name</label>
          <input
            name="lastName"
            value={form.lastName || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Specialization</label>
          <select
            name="specialization"
            value={form.specialization || ""}
            onChange={handleChange}
          >
            <option value="">Select specialization</option>

            {/* General */}
            <option value="General Physician">General Physician</option>
            <option value="Family Medicine">Family Medicine</option>
            <option value="Internal Medicine">Internal Medicine</option>

            {/* Heart / Brain */}
            <option value="Cardiologist">Cardiologist</option>
            <option value="Neurologist">Neurologist</option>

            {/* Bones / Joints */}
            <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
            <option value="Rheumatologist">Rheumatologist</option>

            {/* Women / Children */}
            <option value="Gynecologist">Gynecologist</option>
            <option value="Pediatrician">Pediatrician</option>

            {/* Skin / ENT / Eye */}
            <option value="Dermatologist">Dermatologist</option>
            <option value="ENT Specialist">ENT Specialist</option>
            <option value="Ophthalmologist">Ophthalmologist</option>

            {/* Mental Health */}
            <option value="Psychiatrist">Psychiatrist</option>
            <option value="Psychologist">Psychologist</option>

            {/* Other Common */}
            <option value="Dentist">Dentist</option>
            <option value="General Surgeon">General Surgeon</option>
            <option value="Endocrinologist">Endocrinologist</option>
          </select>

        </div>

        <div className="form-row">
          <label>Experience (Years)</label>
          <input
            type="number"
            name="experience"
            min="0"
            value={form.experience || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Phone</label>
          <input
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
          />
        </div>

        <div className="profile-actions">
          <button type="button" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" className="cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>

      </form>
    </div>
  </div>
);

}
export default UpdateDoctorProfile;