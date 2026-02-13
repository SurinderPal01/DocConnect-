import {useState} from "react";
import "../styles/editprofile.css";

function EditProfile({user,onSubmit,onCancel }){
    const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    age: user?.age || "",
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
    <form className="edit-profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
            <label>First Name</label>
            <input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
            />
        </div>

        <div className="form-group">
             <label>Last Name</label>
            <input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
            />
        </div>

         <div className="form-group">
             <label>Age</label>
            <input
                name="age"
                type="number"
                placeholder="Age"
                value={form.age}
                onChange={handleChange}
            />
        </div>

         <div className="form-group">
             <label>Phone</label>
            <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
            />
        </div>
      
      <div className="form-actions">
           <button type="submit" className="btn btn-save">Save Changes</button>
            <button type="button" className="btn btn-cancel" onClick={onCancel}>
                Cancel
            </button>
      </div>
     
    </form>
  );
}

export default EditProfile;