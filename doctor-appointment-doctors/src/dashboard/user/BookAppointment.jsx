import { useState } from "react";
import api from "../../utils/api";
import { to12Hour } from "../../utils/time";
import "../../styles/doctordetail.css";

function BookAppointment({doctorId , date, slot}){
    const [loading , setLoading] = useState(false)
    const handleBook = async ()=>{
        if(loading) return 
        setLoading(true);
        try{
            await api.post("/api/appointment",{
                doctorId,
                date,
                slotId:slot._id,
            });
            alert("Appointment Requested")
        }catch(err){
            console.error(err); 
            alert("Slot Already Booked")
        }finally{
            setLoading(false);
        }
    }
    return(
        <buttton className="slot-btn"
            // disabled={loading}
            disabled = {slot.isAvailable || loading}
            onClick={handleBook}>
            {to12Hour(slot.start)}-{to12Hour(slot.end)}
        </buttton>
    )
}

export default BookAppointment;