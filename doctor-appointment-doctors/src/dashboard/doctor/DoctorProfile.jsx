import { useEffect,useState } from "react";
import api from "../../utils/api";
import Loader from "../../components/Loader";
import DoctorProfileSkeleton from "../../components/DoctorProfileSkeleton";
import UpdateDoctorProfile from "../../components/UpdateDoctorProfile";
import "../../styles/doctorprofile.css";
function DoctorProfile(){
    const [doctor , setDoctor] = useState();
    const [loading , setLoading] = useState(true);
    const [edit , setEdit] = useState(false);


    useEffect(()=>{
        fetchProfile();
    },[]);
     const fetchProfile = async ()=>{
            try{
                const res = await api.get("/api/doctor/profile");
                setDoctor(res.data);
            }catch(err){
                console.error(err)
            }finally{
                setLoading(false);
            }
        }

   
    if(loading) return <DoctorProfileSkeleton />
    if(!doctor) return <p>No Profile Data</p>

  //   if (edit) {
  //   return (
  //     <UpdateDoctorProfile
  //       doctor={doctor}
  //       onCancel={() => setEdit(false)}
  //       onUpdate={() => {
  //         setEdit(false);
  //         fetchProfile();
  //       }}
  //     />
  //   );
  // }

   return (
  <div className="doctor-profile">
    <div className="profile-header">
      <h1>Doctor Profile</h1>
     
    </div>

    <div className="profile-card">
      <div className="profile-left">
        <div className="profile-photo">
          {doctor.profilePhoto ? (
            <img src={doctor.profilePhoto} alt="doctor" />
          ) : (
            <div className="avatar">👨‍⚕️</div>
          )}
        </div>

        <h2>Dr. {doctor.firstName} {doctor.lastName}</h2>
        <span className="doctor-badge">{doctor.specialization}</span>

          {!edit && (
  <button className="edit-btn" onClick={() => setEdit(true)}>
        ✏️ Edit Profile
      </button>
          )}
       

      {edit && (
        <UpdateDoctorProfile
        doctor={doctor}
        onCancel={() => setEdit(false)}
        onUpdate={() => {
          setEdit(false);
          fetchProfile();
        }}
      />
      )}
      </div>

      <div className="profile-right">
        <div className="info-row">
          <label>Experience</label>
          <p>{doctor.experience || 0} years</p>
        </div>

        <div className="info-row">
          <label>Email</label>
          <p>{doctor.email}</p>
        </div>

        <div className="info-row">
          <label>Phone</label>
          <p>{doctor.phone}</p>
        </div>

        {doctor.consultationFee!==0 && (
    <div className="info-row">
      <label>Consultation Fee</label>
      <p>₹ {doctor.consultationFee}</p>
    </div>
  )}
      </div>
    </div>
  </div>
);

}

export default DoctorProfile;