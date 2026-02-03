import {useState} from "react";
import "../styles/editprofile.css";

function EditProfile({user,onSubmit,onCancel }){
    const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    description: user?.description || "",
    });

    const handleChange = (e)=>{
        const {name,value} = e.target;
        setForm((prev)=>({...prev,[name]:value}))
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        onSubmit(form); // parent handler
    }

     return (
    <form className="edit-profile" onSubmit={handleSubmit}>
      <input
        name="firstName"
        placeholder="First Name"
        value={form.firstName}
        onChange={handleChange}
      />

      <input
        name="lastName"
        placeholder="Last Name"
        value={form.lastName}
        onChange={handleChange}
      />

      <button type="submit" className="btn btn-save">Save</button>
      <button type="button" className="btn btn-normal" onClick={onCancel}>
          Cancel
        </button>
    </form>
  );
}

export default EditProfile;