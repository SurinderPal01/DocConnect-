
import AppointmentDetailBase from "../../components/AppointmentDetailBase";
import DoctorActions from "../../components/DoctorActions";

function DoctorAppointmentDetail(){
    return(
        <AppointmentDetailBase role="doctor"
         actions={(appt,onUpdate) => <DoctorActions appointment={appt} onUpdate={onUpdate} /> }/>
    )
}   
export default DoctorAppointmentDetail;