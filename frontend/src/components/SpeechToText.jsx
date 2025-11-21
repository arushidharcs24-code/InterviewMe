import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Square,
  RefreshCw,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Settings,
  Volume2,
  Activity,
  FileText,
  Zap,
} from 'lucide-react';

// --- Analysis Logic Helper Functions ---

const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'sort of', 'basically', 'literally', 'actually', 'i mean', 'right'];

const calculateJaccardSimilarity = (str1, str2) => {
  const set1 = new Set(str1.toLowerCase().split(/\s+/));
  const set2 = new Set(str2.toLowerCase().split(/\s+/));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return union.size === 0 ? 0 : (intersection.size / union.size) * 100;
};

const analyzeText = (transcript, idealAnswer) => {
  const cleanTranscript = transcript.toLowerCase().replace(/[^\w\s]/g, ' ');
  const words = cleanTranscript.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // 1. Filler Word Analysis
  const fillerCounts = {};
  let totalFillers = 0;

  words.forEach(word => {
    if (FILLER_WORDS.includes(word)) {
      fillerCounts[word] = (fillerCounts[word] || 0) + 1;
      totalFillers++;
    }
  });

  const fillerScore = Math.max(0, 100 - totalFillers * 5);

  // 2. Content Relevance
  const relevanceScore = calculateJaccardSimilarity(cleanTranscript, idealAnswer.toLowerCase());

  // 3. Clarity & Confidence
  const uniqueWords = new Set(words).size;
  const vocabularyVariety = wordCount > 0 ? uniqueWords / wordCount : 0;
  const clarityScore = Math.min(100, vocabularyVariety * 50 + fillerScore * 0.5);

  // 4. Suggestions Generation
  const suggestions = [];
  if (totalFillers > 2) {
    const mostUsedFiller = Object.entries(fillerCounts).sort((a, b) => b[1] - a[1])[0];
    suggestions.push(`Try to reduce filler words. You used "${mostUsedFiller[0]}" ${mostUsedFiller[1]} times.`);
  }
  if (wordCount < 20) suggestions.push("Your answer is quite short. Try expanding on your key points.");
  if (relevanceScore < 30) suggestions.push("Your answer seems to drift from the core topic. Try using more keywords from the ideal answer.");
  if (clarityScore > 80) suggestions.push("Great vocabulary variety and clarity!");
  else if (clarityScore < 50) suggestions.push("Try to use more varied vocabulary to improve clarity.");

  return {
    wordCount,
    fillerCount: totalFillers,
    fillerDetails: fillerCounts,
    scores: {
      clarity: Math.round(clarityScore),
      relevance: Math.round(relevanceScore),
      filler: Math.round(fillerScore),
    },
    suggestions,
  };
};

// --- ScoreCard Component ---
const ScoreCard = ({ title, score, icon: Icon, colorClass }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-bold ${colorClass}`}>{score}%</span>
      </div>
    </div>
    <div className={`p-3 rounded-full opacity-10 ${colorClass.replace('text', 'bg')}`}>
      <Icon className={`w-6 h-6 ${colorClass}`} />
    </div>
  </div>
);

// --- Main App Component ---
export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [idealAnswer, setIdealAnswer] = useState("React is a JavaScript library for building user interfaces. It uses a component-based architecture and a virtual DOM to efficiently update and render data. Key concepts include JSX, props, state, and hooks.");
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed') setError("Microphone access denied. Please enable permissions.");
        else setError("Error accessing speech recognition. Try Chrome or Edge.");
        setIsRecording(false);
      };
    } else {
      setError("Your browser does not support the Web Speech API. Please use Chrome, Edge, or Safari.");
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      handleAnalyze();
    } else {
      setTranscript("");
      setAnalysis(null);
      setError(null);
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleAnalyze = () => {
    if (!transcript.trim()) return;
    const results = analyzeText(transcript, idealAnswer);
    setAnalysis(results);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-600">
            <Volume2 className="w-6 h-6" />
            <h1 className="text-xl font-bold text-slate-900">VocalCoach AI</h1>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-8">

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-8 bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-in fade-in slide-in-from-top-4">
            <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              Target Context (Ideal Answer)
            </h2>
            <p className="text-sm text-slate-500 mb-3">
              Paste an "ideal" answer or description here. The AI uses this to calculate relevance and coverage.
            </p>
            <textarea
              className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-32 font-mono bg-slate-50"
              value={idealAnswer}
              onChange={(e) => setIdealAnswer(e.target.value)}
              placeholder="Enter the ideal answer text here..."
            />
          </div>
        )}

        {/* Main Recording & Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            <div className={`relative rounded-2xl p-8 text-center transition-all duration-300 ${isRecording ? 'bg-indigo-50 border-2 border-indigo-500 shadow-lg' : 'bg-white border border-slate-200 shadow-sm'}`}>

              {/* Status Indicator */}
              <div className="absolute top-4 right-4">
                {isRecording && (
                  <span className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold animate-pulse">
                    <span className="w-2 h-2 bg-red-600 rounded-full" />
                    LIVE
                  </span>
                )}
              </div>

              <div className="mb-6 relative h-24 flex items-center justify-center">
                {isRecording ? (
                  <div className="flex items-center gap-1 h-12">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 bg-indigo-500 rounded-full animate-[bounce_1s_infinite]"
                        style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-300">
                    <Activity className="w-16 h-16 mx-auto" />
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-semibold mb-2">
                {isRecording ? "Listening..." : "Ready to Record"}
              </h2>
              <p className="text-slate-500 mb-8">
                {isRecording ? "Speak clearly into your microphone." : "Press the button below to start analyzing your speech."}
              </p>

              <button
                onClick={toggleRecording}
                disabled={!!error}
                className={`relative group overflow-hidden px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 mx-auto shadow-xl
                ${isRecording ? 'bg-white text-red-500 border-2 border-red-500 hover:bg-red-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'}
                ${error ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5" />}
                {isRecording ? "Stop Analysis" : "Start Recording"}
              </button>

              {error && (
                <div className="mt-4 text-red-500 text-sm flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>

            {/* Live Transcript */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm min-h-[200px]">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Live Transcript
              </h3>
              {transcript ? (
                <p className="text-lg leading-relaxed text-slate-700">{transcript}</p>
              ) : (
                <p className="text-slate-400 italic">Your words will appear here as you speak...</p>
              )}
            </div>
          </div>

          {/* Right Column: Analysis */}
          <div className="lg:col-span-1 space-y-6">
            {analysis ? (
              <div className="animate-in fade-in slide-in-from-bottom-8 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-800 text-lg">Analysis Results</h3>
                  <button
                    onClick={handleAnalyze}
                    className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Refresh
                  </button>
                </div>

                <ScoreCard title="Clarity Score" score={analysis.scores.clarity} icon={Zap} colorClass="text-amber-500" />
                <ScoreCard title="Relevance Score" score={analysis.scores.relevance} icon={CheckCircle2} colorClass="text-emerald-500" />
                <ScoreCard title="Filler Word Score" score={analysis.scores.filler} icon={BarChart3} colorClass="text-blue-500" />

                {/* Detailed Stats */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="font-semibold text-slate-800 mb-4">Word Statistics</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-500">Word Count</span>
                        <span className="font-medium">{analysis.wordCount}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-500">Filler Words</span>
                        <span className="font-medium text-red-500">{analysis.fillerCount}</span>
                      </div>
                      {analysis.fillerCount > 0 && (
                        <div className="flex gap-2 flex-wrap mt-2">
                          {Object.entries(analysis.fillerDetails).map(([word, count]) => (
                            <span key={word} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-md border border-red-100">
                              {word}: {count}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-xl shadow-lg text-white">
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 fill-current" />
                    AI Suggestions
                  </h4>
                  {analysis.suggestions.length > 0 ? (
                    <ul className="space-y-2 text-sm opacity-90">
                      {analysis.suggestions.map((suggestion, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 bg-white rounded-full flex-shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm opacity-90">Perfect delivery! No specific improvements needed.</p>
                  )}
                </div>

              </div>
            ) : (
              <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl h-full flex flex-col items-center justify-center p-8 text-slate-400 text-center min-h-[400px]">
                <BarChart3 className="w-12 h-12 mb-3 opacity-50" />
                <p className="font-medium">Analysis will appear here</p>
                <p className="text-sm">Record your answer to generate insights</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
