import {useState,useEffect , useCallback} from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import AppointmentDetailSkeleton  from "../components/AppointmentDetailSkeleton";
import api from "../utils/api";
import Loader from "../components/Loader";
import { to12Hour } from "../utils/time";
import "../styles/appointmentdetailbase.css";

function AppointmentDetailBase({role , actions}) {
  const [appointment , setAppointment] = useState(null);
  const {id} = useParams();
  const [chatStatus , setChatStatus] = useState(null);
  const [expired , setChatExpired] = useState(true);
  const [loading , setLoading] = useState(true);
  const history = appointment?.statusHistory ?? [];
  const navigate = useNavigate();

  // let shouldShowChatButton = false;
  const [shouldShowChatButton,setShouldShowChatButton] = useState(false);
  // appointment?.status === "accepted" &&
  // // chatStatus !== "expired" &&
  // !expired &&
  // chatStatus !== "hidden";
  // // const isChatDisabled = chatStatus !== "expired";

  // const lastIndex = history.length - 1;
  const statusIcon = {
  pending: "⏳",
  accepted: "✅",
  rejected: "❌",
  cancelled: "❌"
};


   const getData = useCallback(async ()=>{
      try{
        const res = await api.get(`/api/appointment/${id}`);
        setAppointment(res.data);
      }catch(err){
        console.error(err);
      }finally{
        setLoading(false);
      }
    }
   ,[id])
  useEffect(()=>{
    getData();
  },[getData])

  // to get chat enabled status
  const getChatStatus = useCallback(async () => {
  if (!appointment?._id) return;   

  try {
    const res = await api.get(`/api/chat/access/${appointment._id}`);
    setChatStatus(res.data.enabledStatus);
    setChatExpired(res.data.expiredStatus)
    if( (res.data.enabledStatus==="enabled" ||(res.data.enabledStatus ==="disabled" && !res.data.expiredStatus)) && appointment.status=="accepted"){
      setShouldShowChatButton(true);
    }
  } catch (err) {
    console.error(err);
  }
}, [appointment?._id,appointment?.status]);
  useEffect(()=>{
    if (appointment?._id) {
    getChatStatus();
  }
  },[appointment?._id,getChatStatus])

  const onUpdate=()=>{
    getData();
  }
  if(loading) {
    return <AppointmentDetailSkeleton  />
  }
  if(!appointment) return <p>No appointments found</p>

  return (
  <div className="appointment-detail-card">
    <h2>Appointment Details</h2>

    <div className="detail-row">
      <span>Status:</span>
      <strong className={`status ${appointment.status}`}>
        {appointment.status}
      </strong>
    </div>

    <div className="detail-row">
      <span>Date:</span>
      <strong>
        {new Date(appointment.date).toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric"
        })}
      </strong>
    </div>

    <div className="detail-row">
      <span>Time:</span>
      <strong>
        {to12Hour(appointment.start)} - {to12Hour(appointment.end)}
      </strong>
    </div>

    {/* USER VIEW */}
    {role === "user" && appointment.doctor && (
      <>
        <hr />
        <h4>Doctor</h4>
        <p>
          Dr. {appointment.doctor.firstName}{" "}
          {appointment.doctor.lastName}
        </p>
        {appointment.doctor.phone && (
          <p>📞 {appointment.doctor.phone}</p>
        )}
      </>
    )}

    {/* DOCTOR VIEW */}
    {role === "doctor" && appointment.user && (
      <>
        <hr />
        <h4>Patient</h4>
        <p>
          {appointment.user.firstName}{" "}
          {appointment.user.lastName}
        </p>
      </>
    )}

    {/* ACTIONS */}
    <div className="actions-area">
      {actions && actions(appointment,onUpdate)}
    </div>

<div className="timeline">
  {history.map((s, i) => (
    <div
      key={s._id}
      className={`timeline-item ${i === history.length - 1 ? "active" : ""}`}
    >
      <span className="dot" />
      <div className="content">
        <div className="title">
          {statusIcon[s.status]} {s.status}
        </div>
        <small>
          {new Date(s.at).toLocaleString("en-IN")}
        </small>
      </div>
    </div>
  ))}
</div>
  {shouldShowChatButton && (
      <div className="chat-action">
        <button
          className={`chat-btn ${expired ? "disabled" : "enabled"}`}
          disabled={expired}
          onClick={()=>navigate(`/chat/${id}`)}
        >
          {chatStatus === "enabled"
            ? "Join Chat"
            : "Chat Available Soon"}
        </button>
      </div>
    )}

    
  </div>
);

}

export default AppointmentDetailBase;