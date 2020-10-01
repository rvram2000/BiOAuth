import React, { useState } from 'react';

import './Signup.css';

function Signup(){
    
    //localStorage.getItem("facedescriptor");
    
    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    
    function handleChange(event){
        if(event.target.id === "name"){
            setname(event.target.value);
        }
        if(event.target.id === "email"){
            setemail(event.target.value);
        }
    }
    
    function signup(){
        console.log("Name: "+name);
        console.log("Email: "+email);
        let temp = localStorage.getItem("facedescriptor");
        if(temp !== null){
            console.log("Face descriptor: ");
            console.log(JSON.parse(temp));
        }
    }
    
    return(
        <div className="form">
            <div>Name: <input id="name" value={name} onChange={handleChange} type="text"/></div>
            <div>Email: <input id="email" value={email} onChange={handleChange} type="text"/></div>
            <div className="signup butt" onClick={signup}>Signup</div>
        </div>
    );
}

export default Signup;