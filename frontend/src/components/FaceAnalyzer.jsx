import React, { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

export default function FaceAnalyzer() {
  const videoRef = useRef(null);
  const [eyeContact, setEyeContact] = useState(0);
  const [expression, setExpression] = useState("Neutral");
  const [posture, setPosture] = useState("Centered");

  // ---------- Helper Functions ----------
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

  // ---------- MediaPipe FaceMesh Setup ----------
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

      // Mouth expression
      setExpression(calculateMouthCurve(landmarks));

      // Head posture
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

  // ---------- UI ----------
  return (
    <div className="w-full max-w-3xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Facial Analysis</h2>

      <div className="flex justify-center">
        <video
          ref={videoRef}
          autoPlay
          className="rounded-lg border shadow-md w-[400px]"
        />
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
