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
            <div className="doctor-header">
              <div className="avatar"  onClick={() => navigate(`/doctor/${doc._id}`)}>
                {doc.profilePhoto ? (
                  <img src={doc.profilePhoto} alt="doctor" />
                ) : (
                  <span>👨‍⚕️</span>
                )}
              </div>

              <div>
                <h3>
                  Dr. {doc.firstName} {doc.lastName}
                </h3>
                <p className="spec">{doc.specialization}</p>
              </div>
            </div>

            <div className="doctor-info">
              <p>Age: {doc.age}</p>
              <p>Email: {doc.email}</p>
              <p>Phone: {doc.phone}</p>
            </div>

            <div className="doctor-footer">
              {doc.approved ? (
                <span className="approved">✔ Approved</span>
              ) : (
                <span className="pending">⏳ Pending Approval</span>
              )}

              <button
                disabled={!doc.approved}
                className="book-btn"
                 onClick={() => navigate(`/doctor/${doc._id}`)}
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))}
        </div>

    </div>
 )
}
export default DoctorSearch;