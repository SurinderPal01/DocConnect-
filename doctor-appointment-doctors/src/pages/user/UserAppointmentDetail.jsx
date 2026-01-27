import React from 'react'
import AppointmentDetailBase from '../../components/AppointmentDetailBase'
import UserActions from '../../components/UserActions'

function UserAppointmentDetail() {
  return (
        <AppointmentDetailBase role="user" actions={(appt,onUpdate) => <UserActions appointment={appt}  onUpdate={onUpdate}/>} />

  )
}

export default UserAppointmentDetail