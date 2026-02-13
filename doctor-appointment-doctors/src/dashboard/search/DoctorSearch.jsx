import { useEffect, useState } from "react";
import { useSearchParams , useNavigate } from "react-router-dom";

import "../../styles/doctorsearch.css"
import api from "../../utils/api";
import Loader from "../../components/Loader";
function DoctorSearch(){
const [searchParams] =useSearchParams();
const category = searchParams.get("category");
const [doctors,setDoctors] = useState([]);
const [loading , setLoading] = useState(true);
const navigate = useNavigate();

useEffect(()=>{
    const fetchDoctors = async ()=>{
        try{
        const res = await api.get(`/api/doctor?category=${category}`);
        console.log("doc data",res.data)
        setDoctors(res.data);
        }catch(err){
            console.error(err);
        }finally {
        setLoading(false);
      }
    };

    if(category)fetchDoctors();
},[category]);
if(loading) return <Loader />
 return(
    <div className="doctor-search">
        <h2>Doctors - {category}</h2>
        {doctors.length === 0 && (<p className="no-data">No Doctors Found</p>)}

        <div className="doctor-list">
        {doctors.map((doc) => (
          <div className="doctor-card" key={doc._id}>
            <div className="doctor-card-image">
               <div className="avatar" onClick={() => navigate(`/doctor/${doc._id}`)}>
                <img 
                  src={doc.profilePhoto || "/assets/doctor.png"} 
                  alt={`Dr. ${doc.firstName}`} 
                  onError={(e) => {e.target.onerror = null; e.target.src = "/assets/doctor.png"}}
                />
              </div>
              <span className="view-profile-link" onClick={() => navigate(`/doctor/${doc._id}`)}>View Profile</span>
            </div>

            <div className="doctor-card-details">
                <div className="doc-header">
                    <h3>Dr. {doc.firstName} {doc.lastName}</h3>
                    <p className="doc-spec">{doc.specialization}</p>
                </div>
                
                <div className="doc-meta">
                    <div className="meta-row">
                        <span className="meta-label">Experience:</span>
                        <span className="meta-value">12+ Years</span> {/* Dummy data for now as per plan */}
                    </div>
                    <div className="meta-row">
                         <span className="meta-label">Languages:</span>
                         <span className="meta-value">English, Hindi</span>
                    </div>
                     <div className="meta-row">
                        <span className="meta-label">Gender:</span>
                        <span className="meta-value">Male</span> {/* Placeholder, or derive if available */}
                    </div>
                </div>
            </div>

            <div className="doctor-card-actions">
               {doc.approved ? (
                <span className="status-badge approved">Available Today</span>
              ) : (
                <span className="status-badge pending">Approval Pending</span>
              )}
              
              <button
                disabled={!doc.approved}
                className="book-btn-large"
                 onClick={() => navigate(`/doctor/${doc._id}`)}
              >
                Book an Appointment
              </button>
              
               <div className="contact-info-small">
                  <small>📞 {doc.phone}</small>
               </div>
            </div>
          </div>
        ))}
        </div>

    </div>
 )
}
export default DoctorSearch;