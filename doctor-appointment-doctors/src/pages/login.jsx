import { useState } from "react";
import api from "../utils/api";
import {useNavigate ,Link} from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../styles/signup.css";
import "../styles/login.css";

function Login(){
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const {login} = useAuth();
    const navigate = useNavigate();

    const handlelogin = async (e)=>{
        e.preventDefault();
        try{
            const res = await api.post("/api/auth/login",{
                email , password
            });
           if (res.data.user) {
            login(res.data.user);
            navigate("/dashboard");
            } else {
            alert(res.data.message || "Login failed");
            }
            // if(res.data.success){
                
            // }   
        }catch(err){
            console.error(err);
        }
    }
    return(
        <>
        <div className="login-container">
            <div className="login-card">
                <h1>Login</h1>
                <form onSubmit={handlelogin}>
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

                    <button type="submit">Login</button>
                     <p className="signup-text">
                    Don't have an account?
                    <Link to="/signup" className="signup-link"> Signup</Link>
                    </p>
                </form>
            </div>
        </div>
        </>
    )
}

export default Login;

// import { useAuth } from "../context/useAuth";

// export default function Login() {
//   const { login } = useAuth();

//   const handleClick = () => {
//     login({ firstName: "Test" });
//   };

//   return (
//     <>
//       <h1>Login Test</h1>
//       <button onClick={handleClick}>Login</button>
//     </>
//   );
// }
