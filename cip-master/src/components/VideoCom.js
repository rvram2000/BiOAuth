import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import {Link} from 'react-router-dom';

import './VideoCom.css';

function VideoCom() {
  
  const vid = useRef(null);
  const vidElem = useRef(null);
  const [loadinfo, setloadinfo] = useState("Loading model");
  const [intervalid, setintervalid] = useState(0);
  //const [captured, setcaptured] = useState(false);
  
  useEffect(()=>{
    loadModels();
  },[]);
  
  function loadModels(){
    Promise.all([
        //faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        //faceapi.nets.faceLandmark68Net.loadFromUri('/models')
        //faceapi.loadTinyFaceDetectorModel('/models'),
        //faceapi.loadFaceLandmarkModel('/models')
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
    ]).then(startVideo);
  }
  
  function startVideo(){
    console.log("starting")
    setloadinfo("Loaded");
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(
      stream => {
          vid.current.srcObject = stream;
          startDetection();
        }
    );  
  }
  
  function startDetection(){
    vid.current.addEventListener('play', () => {
      let canvas = faceapi.createCanvasFromMedia(vid.current);
      vidElem.current.append(canvas);
      const displaySize = { width: vid.current.width, height: vid.current.height }
      faceapi.matchDimensions(canvas, displaySize);
      console.log("Video")
      let imageInterval = setInterval(async () => {
        console.log("Running "+imageInterval);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        const detections = await faceapi.detectSingleFace(vid.current, new faceapi.TinyFaceDetectorOptions({scoreThreshold:0.5})).withFaceLandmarks().withFaceDescriptor();
        if(detections){
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
          if(detections && detections.detection._score > 0.85){
              let labeldesc = new faceapi.LabeledFaceDescriptors("Person", [detections.descriptor]);
              //console.log(labeldesc);
              localStorage.setItem("facedescriptor",JSON.stringify(labeldesc));
          }
        }
      }, 200);
      setintervalid(imageInterval);
      /*setInterval(()=>{
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      },2000);*/
      
      /*Promise.resolve(faceapi.detectSingleFace(vid.current, new faceapi.TinyFaceDetectorOptions({scoreThreshold:0.75})).withFaceLandmarks().withFaceDescriptor())
      .then(detections=>{
        if(detections){
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        }
      });
      }, 100)*/
    })
  }
  
  /*async function match(){
    const img = await faceapi.fetchImage("http://localhost:3080/me.jpg");
    const detect = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    let faceid = localStorage.getItem("facedescriptor");
    let fid = JSON.parse(faceid);
    console.log(fid);
    console.log(detect);
    let fids = faceapi.LabeledFaceDescriptors.fromJSON(fid);
    const faceMatcher = new faceapi.FaceMatcher(fids);
    const bestMatch = faceMatcher.findBestMatch(detect.descriptor);
    //const bestMatch = faceapi.euclideanDistance(fid.descriptor,detect.descriptor);
    console.log(bestMatch);
  }*/
  
  function capture(){
    console.log("Hksdkksd");
    localStorage.removeItem("facedescriptor");
    var selectInter = setInterval(()=>{
      let faceid = localStorage.getItem("facedescriptor");
      if(faceid !== null){
        const fid = JSON.parse(faceid);
        clearInterval(selectInter);
        clearInterval(intervalid);
        console.log(fid);
        //setcaptured(true);
      }
    },200);
  }
  
  async function login(){
    let fidesc;
    let faceid = localStorage.getItem("facedescriptor");
    if(faceid !== null){
      fidesc = JSON.parse(faceid);
      //do faceapi.LabeledFaceDescriptors.fromJSON(fidesc); in backend before comparision;
      console.log(fidesc);
    }
    let data = {
      facedesc: fidesc,
      client: "Random string"
    }
    vid.current.srcObject.getTracks()[0].stop();
    let response = await fetch("http://localhost:3081/login",{
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    });
    let result = await response.json();
    console.log(result);
  }
  
  function signup(){
    vid.current.srcObject.getTracks()[0].stop();
  }
  
  return (
    <div>
      <div>{loadinfo}. Capture face before login or signup</div>
      <div ref={vidElem} className="VidElem">
        <video ref={vid} width="720" height="560" autoPlay muted></video>
      </div>
      <div className="butts">
        <div className="login butt" onClick={capture}>Capture</div>
        <div className="login butt" onClick={login}>Login</div>
        <Link to="/signup" className="signup butt" onClick={signup}>Signup</Link>
      </div>
    </div>
  );
}

export default VideoCom;