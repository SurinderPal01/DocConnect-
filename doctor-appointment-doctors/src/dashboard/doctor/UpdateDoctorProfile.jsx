import { useState } from "react";
import api from "../../utils/api";
import "../../styles/doctorprofile.css";

function UpdateDoctorProfile({doctor , onCancel , onUpdate}){
    const [form , setForm] =useState({...doctor});
    const [saving , setSaving] = useState(false);
      const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async () =>{
    try{
        setSaving(true);
        await api.put("/api/doctor/profile",form);
        alert("profile Updated Successfully");
        onUpdate();
    }catch(err){
        console.error(err);
    }finally{
        setSaving(false);
    }
  };
  return(
    <div className="doctor-profile">
        <h2>Update Profile</h2>

        <div className="profile-card">
        <div className="profile-form">
          <label>
            First Name
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
          </label>

          <label>
            Last Name
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
          </label>

          <label>
            Specialization
            <input
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
            />
          </label>

          <label>
            Experience (Years)
            <input
              type="number"
              name="experience"
              value={form.experience || ""}
              onChange={handleChange}
            />
          </label>

          <label>
            About
            <textarea
              name="about"
              value={form.about || ""}
              onChange={handleChange}
            />
          </label>

          <label>
            Phone
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </label>

          <div className="profile-actions">
            <button onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button className="cancel" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
export default UpdateDoctorProfile;