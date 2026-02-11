import BookAppointment from "./BookAppointment";
import "../../styles/doctordetail.css";

const normalize = (d)=>{
    const x = new Date(d);
    x.setHours(0,0,0,0);
    return x.getTime();
}

// hide slots that are completely in the past for the selected date
const isSlotInFutureOrNow = (selectedDate, slot) => {
  const today = new Date();

  const date = new Date(selectedDate);
  date.setHours(0, 0, 0, 0);

  // if selected date is before today, no slots should be shown
  if (date.getTime() < normalize(today)) return false;

  // if selected date is after today, all slots are okay
  if (date.getTime() > normalize(today)) return true;

  // same day: compare end time with "now"
  const [endH, endM] = String(slot.end).split(":").map(Number);
  const slotEnd = new Date(selectedDate);
  slotEnd.setHours(endH || 0, endM || 0, 0, 0);

  return slotEnd.getTime() >= today.getTime();
};

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
            .filter(slot => slot.isAvailable && isSlotInFutureOrNow(selectedDate, slot))
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