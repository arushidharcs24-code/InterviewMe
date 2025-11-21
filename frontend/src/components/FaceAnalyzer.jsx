import React, { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

export default function FaceAnalyzer() {
  const canvasRef = useRef(null);
const mediaRecorderRef = useRef(null);
const [recording, setRecording] = useState(false);
const [recordedChunks, setRecordedChunks] = useState([]);
  const videoRef = useRef(null);
  const [eyeContact, setEyeContact] = useState(0);
  const [expression, setExpression] = useState("Neutral");
  const [posture, setPosture] = useState("Centered");

const startRecording = () => {
  if (!canvasRef.current) return;

  const stream = canvasRef.current.captureStream(30); // 30 FPS
  const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      setRecordedChunks((prev) => [...prev, e.data]);
    }
  };
   recorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);

    // Download automatically
    const a = document.createElement("a");
    a.href = url;
    a.download = "recording.webm";
    a.click();
  };

   mediaRecorderRef.current = recorder;
  recorder.start();
  setRecording(true);
  setRecordedChunks([]); 
};

const stopRecording = () => {
  if (mediaRecorderRef.current) {
    mediaRecorderRef.current.stop();
    setRecording(false);
  }
};

  const getDistance = (p1, p2) =>
    Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

  const calculateEyeOpenness = (landmarks) => {
    if (!landmarks[159] || !landmarks[145] || !landmarks[386] || !landmarks[374])
      return 0;

    const leftHeight = getDistance(landmarks[159], landmarks[145]);
    const rightHeight = getDistance(landmarks[386], landmarks[374]);
    return ((leftHeight + rightHeight) / 2).toFixed(3);
  };

  const calculateMouthCurve = (landmarks) => {
    const width = getDistance(landmarks[61], landmarks[291]);
    const height = getDistance(landmarks[13], landmarks[14]);
    const ratio = height / width;

    if (ratio > 0.08) return "Smiling";
    if (ratio < 0.04) return "Uncertain";
    return "Neutral";
  };

  const calculateHeadTilt = (landmarks) => {
    return Math.abs(landmarks[33].y - landmarks[263].y) > 0.02
      ? "Tilted"
      : "Centered";
  };


  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    faceMesh.onResults((results) => {
      const landmarks = results.multiFaceLandmarks?.[0];
      if (!landmarks) return;

      // Eye confidence estimation
      const openness = calculateEyeOpenness(landmarks);
      const eyePercentage = Math.min(100, openness * 1000).toFixed(0);
      setEyeContact(eyePercentage);

     
      setExpression(calculateMouthCurve(landmarks));


      setPosture(calculateHeadTilt(landmarks));
    });

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);


  return (
    <div className="w-full max-w-3xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Facial Analysis</h2>

      <div className="flex justify-center">
        <video
          ref={videoRef}
          autoPlay
          className="rounded-lg border shadow-md w-[400px] "
        />
          <canvas
    ref={canvasRef}
    width={400}
    height={480}
    className="rounded-lg border shadow-md"
  />
      </div>

<div className="flex justify-center gap-4 mt-4">
  {!recording ? (
    <button
      onClick={startRecording}
      className="px-4 py-2 bg-green-600 text-white rounded-lg"
    >
      Start Recording
    </button>
  ) : (
    <button
      onClick={stopRecording}
      className="px-4 py-2 bg-red-600 text-white rounded-lg"
    >
      Stop Recording
    </button>
  )}
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-center">
  <div className="p-4 bg-blue-100 rounded-lg">
    <h3 className="font-semibold">Eye Contact</h3>
    <p className="text-xl font-bold">{eyeContact}%</p>
  </div>

  <div className="p-4 bg-green-100 rounded-lg">
    <h3 className="font-semibold">Expression</h3>
    <p className="text-xl font-bold">{expression}</p>
  </div>

  <div className="p-4 bg-yellow-100 rounded-lg">
    <h3 className="font-semibold">Posture</h3>
    <p className="text-xl font-bold">{posture}</p>
  </div>
</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-center">
        <div className="p-4 bg-blue-100 rounded-lg">
          <h3 className="font-semibold">Eye Contact</h3>
          <p className="text-xl font-bold">{eyeContact}%</p>
        </div>

        <div className="p-4 bg-green-100 rounded-lg">
          <h3 className="font-semibold">Expression</h3>
          <p className="text-xl font-bold">{expression}</p>
        </div>

        <div className="p-4 bg-yellow-100 rounded-lg">
          <h3 className="font-semibold">Posture</h3>
          <p className="text-xl font-bold">{posture}</p>
        </div>
      </div>
    </div>
  );
}
