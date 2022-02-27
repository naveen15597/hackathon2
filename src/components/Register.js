import React, { useState } from 'react'
import env from 'react-dotenv';
import axios from 'axios';

function Register() {
    const [firstName,setFirstName] = useState("");
    const [lastName,setLastName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const handleSubmit =async()=>{
        let res = await axios.post(env.API_URL+"register/",{firstName,lastName,email,password});
        if(res.data.status!=200){
            alert(res.data.message);
        }
        
    }
  return (
    <div className='parent-div'>
        <div className='Login-div'>
            {/* <form> */}
            <h3>Sign Up</h3>
            <div className="form-group">
                <label>First name</label>
                <input type="text" className="form-control" placeholder="First name" onChange={e=>setFirstName(e.target.value)}/>
            </div>
            <div className="form-group">
                <label>Last name</label>
                <input type="text" className="form-control" placeholder="Last name" onChange={e=>setLastName(e.target.value)}/>
            </div>
            <div className="form-group">
                <label>Email address</label>
                <input type="email" className="form-control" placeholder="Enter email" onChange={e=>setEmail(e.target.value)}/>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" placeholder="Enter password" onChange={e=>setPassword(e.target.value)}/>
            </div>
            <button className="btn btn-primary btn-block" style={{"width":"20%"}} onClick={()=>handleSubmit()}>Sign Up</button>
            <p className="forgot-password text-right">
                Already registered <a href="/">sign in?</a>
            </p>
        {/* </form> */}
    </div>
</div>
  )
}

export default Register