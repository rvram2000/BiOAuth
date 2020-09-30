import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

import './VideoCom.css';

function VideoCom() {
  
  const vid = useRef(null);
  const vidElem = useRef(null);
  const [loadinfo, setloadinfo] = useState("Loading model");
  
  
  function loadModels(){
    Promise.all([
        //faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        //faceapi.nets.faceLandmark68Net.loadFromUri('/models')
        //faceapi.loadTinyFaceDetectorModel('/models'),
        //faceapi.loadFaceLandmarkModel('/models')
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models')
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
      const canvas = faceapi.createCanvasFromMedia(vid.current);
      vidElem.current.append(canvas);
      const displaySize = { width: vid.current.width, height: vid.current.height }
      faceapi.matchDimensions(canvas, displaySize);
      setInterval(async () => {
        const detections = await faceapi.detectSingleFace(vid.current, new faceapi.TinyFaceDetectorOptions({scoreThreshold:0.75})).withFaceLandmarks().withFaceDescriptor();
        if(detections){
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        }
      }, 100);
      /*setInterval(()=>{
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      },500);*/
      
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
  
  useEffect(()=>{
    loadModels();
  });
  
  return (
    <div ref={vidElem} className="VidElem">
      <video ref={vid} width="720" height="560" autoPlay muted></video>
      <div>{loadinfo}</div>
    </div>
  );
}

export default VideoCom;