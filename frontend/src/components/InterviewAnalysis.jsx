import React, { useState, useRef, useEffect } from 'react';
import './InterviewAnalysis.css';

// ---------------------- SPEECH TO TEXT LOGIC (MERGED) ----------------------
const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'sort of', 'basically', 'literally', 'actually', 'i mean', 'right'];

const calculateJaccardSimilarity = (str1, str2) => {
  const set1 = new Set(str1.toLowerCase().split(/\s+/));
  const set2 = new Set(str2.toLowerCase().split(/\s+/));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return union.size === 0 ? 0 : (intersection.size / union.size) * 100;
};

const analyzeTranscriptBetter = (transcript, idealAnswer) => {
  const cleanTranscript = transcript.toLowerCase().replace(/[^\w\s]/g, ' ');
  const words = cleanTranscript.split(/\s+/).filter(w => w.length > 0);

  const wordCount = words.length;
  const fillerCounts = {};
  let totalFillers = 0;

  words.forEach(word => {
    if (FILLER_WORDS.includes(word)) {
      fillerCounts[word] = (fillerCounts[word] || 0) + 1;
      totalFillers++;
    }
  });

  const fillerScore = Math.max(0, 100 - (totalFillers * 5));
  const relevanceScore = calculateJaccardSimilarity(cleanTranscript, idealAnswer.toLowerCase());

  const uniqueWords = new Set(words).size;
  const vocabularyVariety = wordCount > 0 ? uniqueWords / wordCount : 0;
  const clarityScore = Math.min(100, (vocabularyVariety * 50) + (fillerScore * 0.5));

  const suggestions = [];

  if (totalFillers > 2) {
    const mostUsedFiller = Object.entries(fillerCounts).sort((a, b) => b[1] - a[1])[0];
    suggestions.push(
      `Try to reduce filler words — you used "${mostUsedFiller[0]}" ${mostUsedFiller[1]} times.`
    );
  } else {
    suggestions.push("Good control on filler words.");
  }

  if (clarityScore < 60) suggestions.push("Try to expand vocabulary or slow down to articulate better.");
  if (relevanceScore < 40) suggestions.push("Your answer lacks relevance — stay closer to the main point.");

  return {
    fillerCount: totalFillers,
    fillerPercentage: ((totalFillers / wordCount) * 100).toFixed(1),
    answerLength: wordCount,
    clarityScore: clarityScore.toFixed(0),
    relevanceScore: relevanceScore.toFixed(0),
    confidenceScore: Math.max(50, clarityScore - totalFillers * 2).toFixed(0),
    suggestions
  };
};

// ---------------------------------------------------------------------------


const InterviewAnalysis = () => {
  // Speech State
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechAnalysis, setSpeechAnalysis] = useState(null);

  let recognitionRef = useRef(null);

  // Facial State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facialMetrics, setFacialMetrics] = useState({
    eyeContact: 0,
    expression: 'Neutral',
    posture: 'Centered'
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceMeshRef = useRef(null);
  const streamRef = useRef(null);

  // Load mediapipe scripts
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js';
    script.async = true;

    script.onload = () => {
      const cameraScript = document.createElement('script');
      cameraScript.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
      cameraScript.async = true;
      document.body.appendChild(cameraScript);
    };

    document.body.appendChild(script);

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // ---------------------- REAL SPEECH TO TEXT MERGE ----------------------
  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      setTranscript(finalTranscript + " " + interim);
    };

    recognition.onerror = e => console.error("Speech error:", e);

    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);

    // Perform analysis
    const idealAnswer = "I am a dedicated professional with experience in teamwork, leadership and problem solving.";
    const analysis = analyzeTranscriptBetter(transcript, idealAnswer);
    setSpeechAnalysis(analysis);
  };

  // ---------------------- CAMERA + FACEMESH LOGIC (UNCHANGED) ----------------------

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setIsCameraActive(true);

      videoRef.current.onloadedmetadata = () => initializeFaceMesh();

    } catch (error) {
      alert("Unable to access camera. Check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current)
      streamRef.current.getTracks().forEach(t => t.stop());

    videoRef.current.srcObject = null;
    setIsCameraActive(false);
  };

  const initializeFaceMesh = () => {
    if (!window.FaceMesh) {
      setTimeout(initializeFaceMesh, 400);
      return;
    }

    const faceMesh = new window.FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    faceMesh.onResults(onFaceMeshResults);
    faceMeshRef.current = faceMesh;

    if (window.Camera) {
      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoRef.current });
        }
      });
      camera.start();
    }
  };

  const onFaceMeshResults = (results) => {
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0)
      return;

    const landmarks = results.multiFaceLandmarks[0];

    // Eye Contact
    const left = Math.abs(landmarks[159].y - landmarks[145].y);
    const right = Math.abs(landmarks[386].y - landmarks[374].y);
    const eye = ((left + right) / 2) * 2000;

    // Expression
    const mouthH = Math.abs(landmarks[14].y - landmarks[13].y);
    const mouthW = Math.abs(landmarks[291].x - landmarks[61].x);
    const mouthRatio = mouthH / mouthW;

    let expression = "Neutral";
    if (mouthRatio > 0.4) expression = "Surprised";
    else if (mouthW > 0.15) expression = "Smiling";
    else if (eye < 0.01) expression = "Nervous";

    // Posture
    const x = landmarks[1].x;
    let posture = "Centered";
    if (x < 0.4) posture = "Tilt Right";
    else if (x > 0.6) posture = "Tilt Left";

    setFacialMetrics({
      eyeContact: Math.min(100, Math.max(0, eye)).toFixed(0),
      expression,
      posture
    });

    // Draw
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00FF00";
    landmarks.forEach(l => {
      ctx.beginPath();
      ctx.arc(l.x * canvas.width, l.y * canvas.height, 1.5, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  // ---------------------- UI RENDER (UNCHANGED) ----------------------
  return (
    <div className="interview-page">
      <h1 className="page-title">AI Interview Analyzer</h1>

      {/* ------------------------ SPEECH SECTION ------------------------ */}
      <div className="section">
        <h2>Speech-to-Text</h2>

        <div className="controls">
          {!isRecording ? (
            <button className="start-btn" onClick={startRecording}>
              🎤 Start Recording
            </button>
          ) : (
            <button className="stop-btn" onClick={stopRecording}>
              ⏹ Stop Recording
            </button>
          )}
        </div>

        <textarea
          className="transcript-box"
          value={transcript}
          readOnly
          placeholder="Your spoken answer will appear here..."
        />

        {speechAnalysis && (
          <div className="results-card">
            <h3>Speech Analysis</h3>

            <p><strong>Answer Length:</strong> {speechAnalysis.answerLength} words</p>
            <p><strong>Filler Words:</strong> {speechAnalysis.fillerCount} ({speechAnalysis.fillerPercentage}%)</p>
            <p><strong>Clarity Score:</strong> {speechAnalysis.clarityScore}/100</p>
            <p><strong>Relevance Score:</strong> {speechAnalysis.relevanceScore}/100</p>
            <p><strong>Confidence Score:</strong> {speechAnalysis.confidenceScore}/100</p>

            <h4>Suggestions</h4>
            <ul>
              {speechAnalysis.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ------------------------ FACIAL ANALYSIS ------------------------ */}
      <div className="section">
        <h2>Facial Analysis</h2>

        <div className="controls">
          {!isCameraActive ? (
            <button className="start-btn" onClick={startCamera}>
              📷 Start Camera
            </button>
          ) : (
            <button className="stop-btn" onClick={stopCamera}>
              ⏹ Stop Camera
            </button>
          )}
        </div>

        <div className="camera-container">
          <video ref={videoRef} autoPlay muted className="camera-feed" />
          <canvas ref={canvasRef} className="overlay-canvas"></canvas>
        </div>

        <div className="results-card">
          <h3>Facial Metrics</h3>
          <p><strong>Eye Contact:</strong> {facialMetrics.eyeContact}%</p>
          <p><strong>Expression:</strong> {facialMetrics.expression}</p>
          <p><strong>Posture:</strong> {facialMetrics.posture}</p>
        </div>
      </div>
    </div>
  );
};

export default InterviewAnalysis;
