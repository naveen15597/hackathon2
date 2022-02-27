import axios from 'axios';
import React, { useState } from 'react'
import env from 'react-dotenv';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate =useNavigate();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const handleSubmit =async()=>{
        let res = await axios.post(env.API_URL+"login/",{email,password});
        if(res.data.status!=200){
            alert(res.data.message);
        }
        else{
            localStorage.setItem('userId',res.data.userId);
            navigate('/dashboard');
        }
    }
    return (
        <div className='parent-div'>
        <div className='Login-div'>
            {/* <form> */}
                <h3>Sign In</h3>
                <div className="form-group" style={{"width":"80%"}}>
                    <label>Email address</label>
                    <input type="email" className="form-control" placeholder="Enter email" onChange={e=>setEmail(e.target.value)}/>
                </div>
                <div className="form-group" style={{"width":"80%"}}>
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" onChange={e=>setPassword(e.target.value)}/>
                </div>
                {/* <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                </div> */}
                <button className="btn btn-primary btn-block" style={{"width":"20%"}} onClick={()=>handleSubmit()}>Login</button> 
                <button className="btn btn-primary btn-block" style={{"width":"20%"}} onClick={()=>navigate('/SignUp')}>SignUp</button>
                {/* <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p> */}
            {/* </form> */}
        </div>
        </div>
    );
}

export default Login