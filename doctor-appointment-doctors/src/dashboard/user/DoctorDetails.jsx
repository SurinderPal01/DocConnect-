import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import api from "../../utils/api";
import DoctorSlots from "./DoctorSlots";
import "../../styles/doctordetail.css";

function DoctorDetails() {
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const { doctorId } = useParams();

  useEffect(() => {
    api.get(`/api/doctor/${doctorId}`).then(res => {
      console.log("data",res.data.availability);
      setDoctor(res.data);
    });
  }, [doctorId]);

  if (!doctor) return <Loader />;

  // available dates from doctor availability
  const availableDates = doctor.availability.map(a =>
    new Date(a.date).toISOString().split("T")[0]
  );
  if(!availableDates) return <p>No slots available for this date</p>

  return (
    <div className="doctor-detail-page">
      <div className="doctor-info">
        <h2>Dr. {doctor.firstName} {doctor.lastName}</h2>
        <p>{doctor.specialization}</p>
      </div>

      {/* CALENDAR */}
      <div className="date-selector">
        <label>Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          // min={availableDates[0]}
          // max={availableDates[availableDates.length - 1]}
        />
      </div>

      {selectedDate && (
        <DoctorSlots
          doctor={doctor}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
}

export default DoctorDetails;
