import { useState } from "react";
import api from "../utils/api";
import {useNavigate ,Link} from "react-router-dom"
import "../styles/signup.css";

function Signup(){
    const [firstName , setFirstName] = useState("");
    const [lastName , setLastName] = useState("");
    const [age , setAge ]  = useState("");
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [phone , setPhone] = useState("");
    const [specialization, setSpecialization] = useState("");
    const navigate = useNavigate();

     const specializations = [
    "Cardiologist",
    "Dermatologist",
    "Dentist",
    "Neurologist",
    "Orthopedic",
    "Gynecologist",
    "Psychiatrist",
    "ENT Specialist",
    "General Physician",
    "Pediatrician",
  ];

    const signup = async (e)=>{
        e.preventDefault();
        try{
            const res = api.post("/api/doctor/signup",{
                firstName , lastName , age , email ,password, phone , specialization
            });
            if((await res).data.success){
                navigate("/login");
            }else{
            alert("Signup failed");
            }
        }catch(err){
            console.error(err);
            alert("Signup failed");
        }
    }
    return(
        <>
            <div className="signup-container">
                <div className="signup-card ">
                <h1>Signup</h1>
                <form onSubmit={signup}>
                    <input 
                    placeholder="Enter First Name" 
                    value ={firstName}
                    type="text"
                    onChange={(e)=>setFirstName(e.target.value)}
                    required={true}/>

                    <input 
                    placeholder="Enter Last Name" 
                    value ={lastName}
                    type="text"
                    onChange={(e)=>setLastName(e.target.value)}
                    required={true}/>

                    <input 
                    placeholder="Enter Your Email" 
                    value ={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    required={true}/>

                    <input 
                    placeholder="Enter Your Password" 
                    value ={password}
                    type="password"
                    onChange={(e)=>setPassword(e.target.value)}
                    required={true}/>

                    <input 
                    placeholder="Enter Your age" 
                    value ={age}
                    onChange={(e)=>setAge(e.target.value)}
                    type="number"
                    required={true}/>

                    <input 
                    placeholder="Enter Your Mobile No." 
                    value ={phone}
                    onChange={(e)=>setPhone(e.target.value)}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required={true}/>

                     {/* SPECIALIZATION SCROLL */}
                    <select
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    required
                    >
                    <option value="">Select Specialization</option>
                    {specializations.map((spec) => (
                        <option key={spec} value={spec}>
                        {spec}
                        </option>
                    ))}
                    </select>
                    
                    <button type="submit">Signup</button>
                    <p className="login-text">
                    Already have an account?
                    <Link to="/login" className="login-link"> Login</Link>
                    </p>
                     <p className="signup-text">Signup as a Patient
                        <Link to="/signupuser" className="signup-link">SignUp </Link>
                    </p>
                </form>
            </div>
            </div>
        </>
    )
}
export default Signup;