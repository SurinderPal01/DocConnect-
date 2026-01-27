import BookAppointment from "./BookAppointment";
import "../../styles/doctordetail.css";

const normalize = (d)=>{
    const x = new Date(d);
    x.setHours(0,0,0,0);
    return x.getTime();
}

function DoctorSlots({doctor , selectedDate}){
    const dateAvailability = doctor.availability.find(
        a=>normalize(a.date) === normalize(selectedDate))

    if(!dateAvailability || dateAvailability.slots.length===0){
        return <p>No Slots available</p>
    }
    return(
     <div className="availability-section">
        <h4>
            Slots For{" "}
            {new Date(selectedDate).toLocaleDateString("en-US",{
                weekday:"long",
                day:"2-digit",
                month:"short"
            })}
        </h4>

        <div className="slots-grid">
            {dateAvailability.slots
            .filter(slot => slot.isAvailable)
            .map(slot => (
                <BookAppointment
                key={slot._id}
                doctorId={doctor._id}
                date={selectedDate}
                slot={slot}
                />
            ))}
        </div>
        </div>

    )
}
export default DoctorSlots;