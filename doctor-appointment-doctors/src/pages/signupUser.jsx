import { useState } from "react";
import api from "../utils/api";
import {useNavigate ,Link} from "react-router-dom"
import "../styles/signup.css"; 

function SignupUser(){
    const [firstName , setFirstName] = useState("");
    const [lastName , setLastName] = useState("");
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const navigate = useNavigate();
    const signup = async (e)=>{
        e.preventDefault();
        try{
            console.log("trying to signup user");
            const res =await api.post("/api/users/signup",{
                firstName , lastName ,email , password
            });
            if(res.data.success){
                navigate("/login");
            }else{
                alert("Signup Failed");
            }
        } catch(err){
            alert("Signup Failed");
            console.error(err);
        }
    }

    return (
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

                    {/* <input 
                    placeholder="Enter Your age" 
                    value ={age}
                    onChange={(e)=>setAge(e.target.value)}
                    type="number"
                    required={true}/> */}
                    
                    <button type="submit">Signup</button>
                    <p className="login-text">
                    Already have an account?
                    <Link to="/login" className="login-link"> Login</Link>
                    </p>
                    <p className="signup-text">Signup as a Doctor
                        <Link to="/signup" className="signup-link">SignUp </Link>
                    </p>
                </form>
            </div>
            </div>
        </>
    )
}
export default SignupUser;