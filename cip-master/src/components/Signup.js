import React, { useState } from 'react';
import * as faceapi from 'face-api.js';

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
    
    async function signup(){
        console.log("Name: "+name);
        console.log("Email: "+email);
        let temp = localStorage.getItem("facedescriptor");
        let fidesc;
        if(temp !== null){
            fidesc = JSON.parse(temp);
            //do faceapi.LabeledFaceDescriptors.fromJSON(fidesc); in backend before comparision;
            console.log("Face descriptor: ");
            console.log(fidesc);
        }
        let data = {
            name: name,
            email: email,
            facedesc: fidesc,
            client: "Random string"
        }
        let response = await fetch("http://localhost:3081/signup",{
            method: "POST",
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        });
        let result = await response.json();
        console.log(result);
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