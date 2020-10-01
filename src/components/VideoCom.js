import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import {Link} from 'react-router-dom';

import './VideoCom.css';

function VideoCom() {
  
  const vid = useRef(null);
  const vidElem = useRef(null);
  const [loadinfo, setloadinfo] = useState("Loading model");
  let finaldetec = null;
  let detections = null;
  
  useEffect(()=>{
    loadModels();
  });
  
  function loadModels(){
    Promise.all([
        //faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        //faceapi.nets.faceLandmark68Net.loadFromUri('/models')
        //faceapi.loadTinyFaceDetectorModel('/models'),
        //faceapi.loadFaceLandmarkModel('/models')
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.loadSsdMobilenetv1Model('/models')
    ]).then(startVideo);
  }
  
  function startVideo(){
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
      setInterval(async () => {
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        detections = await faceapi.detectSingleFace(vid.current, new faceapi.TinyFaceDetectorOptions({scoreThreshold:0.75})).withFaceLandmarks().withFaceDescriptor();
        if(detections){
          
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          //console.log(resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        }
      }, 500);
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
  
  
  function login(){
    finaldetec = null;
    var loginselect = setInterval(()=>{
      if(detections && detections.detection._score > 0.85){
        finaldetec = detections;
        clearInterval(loginselect);
        console.log(finaldetec);
      }
    },100);
  }
  
  /*async function match(){
    const img = await faceapi.fetchImage("http://localhost:3080/me.jpg");
    const detect = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    const faceMatcher = new faceapi.FaceMatcher(finaldetec, 0.6);
    const bestMatch = faceMatcher.findBestMatch(detect.descriptor);
    console.log(bestMatch);
  }*/
  
  function signup(){
    finaldetec = null;
    var loginselect = setInterval(()=>{
      if(detections && detections.detection._score > 0.85){
        finaldetec = detections;
        clearInterval(loginselect);
        console.log(finaldetec);
        localStorage.setItem("facedescriptor",finaldetec.descriptor);
      }
    },100);
  }
  
  return (
    <div>
      <div>{loadinfo}</div>
      <div ref={vidElem} className="VidElem">
        <video ref={vid} width="720" height="560" autoPlay muted></video>
      </div>
      <div className="butts">
        <div className="login butt" onClick={login}>Login</div>
        <Link to="/signup" className="signup butt" onClick={signup}>Signup</Link>
      </div>
    </div>
  );
}

export default VideoCom;