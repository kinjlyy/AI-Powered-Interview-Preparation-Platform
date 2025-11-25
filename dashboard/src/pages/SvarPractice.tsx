// SvarPractice.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Mic, Volume2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

/**
 * Full-featured Pronunciation Practice component
 * - Word and Paragraph practice
 * - SpeechRecognition + WebAudio analysis
 * - Attractive UI and animations
 * - Removes playback button per request
 *
 * Install notes (if missing): lucide-react, framer-motion, sonner
 */

const WORDS = [
  { word: "Algorithm", phonetic: "/ˈælɡəˌrɪðəm/", difficulty: "Medium" },
  { word: "Authentication", phonetic: "/ɔːˌθentɪˈkeɪʃən/", difficulty: "Hard" },
  { word: "Cache", phonetic: "/kæʃ/", difficulty: "Easy" },
  { word: "Deprecated", phonetic: "/ˈdeprɪkeɪtɪd/", difficulty: "Medium" },
  { word: "Encapsulation", phonetic: "/ɪnˌkæpsjʊˈleɪʃən/", difficulty: "Hard" },
  { word: "Framework", phonetic: "/ˈfreɪmwɜːrk/", difficulty: "Easy" },
  { word: "Hierarchy", phonetic: "/ˈhaɪərɑːrki/", difficulty: "Medium" },
  { word: "Implementation", phonetic: "/ˌɪmplɪmenˈteɪʃən/", difficulty: "Medium" },
  { word: "JSON", phonetic: "/ˈdʒeɪsən/", difficulty: "Easy" },
  { word: "Kubernetes", phonetic: "/ˌkuːbərˈnetɪs/", difficulty: "Hard" },
  { word: "Microservices", phonetic: "/ˌmaɪkroʊˈsɜːrvɪsɪz/", difficulty: "Hard" },
  { word: "Observability", phonetic: "/əbˌzɜːrvəˈbɪlɪti/", difficulty: "Hard" },
  { word: "Polymorphism", phonetic: "/ˌpɒlɪˈmɔːrfɪzəm/", difficulty: "Medium" },
  { word: "Query Optimization", phonetic: "/ˈkwɪəri ˌɒptɪmaɪˈzeɪʃən/", difficulty: "Hard" },
  { word: "Refactoring", phonetic: "/riːˈfæktərɪŋ/", difficulty: "Medium" },
  { word: "Scalability", phonetic: "/ˌskeɪləˈbɪlɪti/", difficulty: "Medium" },
  { word: "Throughput", phonetic: "/ˈθruːpʊt/", difficulty: "Medium" },
  { word: "Usability", phonetic: "/juːzəˈbɪlɪti/", difficulty: "Easy" },
  { word: "Virtualization", phonetic: "/ˌvɜːrtʃuəlɪˈzeɪʃən/", difficulty: "Hard" },
  { word: "WebAssembly", phonetic: "/ˌweb əˈsɛmbli/", difficulty: "Hard" },
];

const PARAGRAPHS = [
  {
    id: 1,
    title: "System Architecture",
    text:
      "Our microservices architecture uses Docker containers orchestrated by Kubernetes. The API gateway enforces authentication and route rules. Caching is provided by Redis to reduce database load and improve latency.",
    difficulty: "Hard",
  },
  {
    id: 2,
    title: "Frontend Development",
    text:
      "React components are modular and reuse hooks for state management. We use TypeScript for type safety, lazy loading for initial performance, and CSS-in-JS for component-scoped styles.",
    difficulty: "Medium",
  },
  {
    id: 3,
    title: "DevOps Pipeline",
    text:
      "Continuous integration runs tests and security scans on each commit. We deploy with blue-green strategies to minimize downtime and use Infrastructure as Code with Terraform for reproducibility.",
    difficulty: "Hard",
  },
];

type Mode = "word" | "paragraph";

/* Helpers: scoring, similarity, syllable estimation, RMS */
function tokenize(text = "") {
  return text
    .toLowerCase()
    .replace(/[^\w\s']/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/** Quick token overlap / fuzzy score between expected and spoken */
function textSimilarity(expected: string, spoken: string) {
  if (!expected) return 0;
  const E = tokenize(expected);
  const S = tokenize(spoken);
  if (E.length === 0) return 0;

  // exact word matches in order and presence
  let matched = 0;
  // check in-order matches with tolerance
  let si = 0;
  for (let ei = 0; ei < E.length && si < S.length; ei++) {
    if (E[ei] === S[si]) {
      matched++;
      si++;
    } else {
      // allow sliding window: look next few words
      const window = S.slice(si, si + 3);
      const idx = window.indexOf(E[ei]);
      if (idx >= 0) {
        matched++;
        si += idx + 1;
      } else {
        // skip spoken word
        si++;
      }
    }
  }

  // also reward partial string similarity (prefix matches)
  const partialBonus =
    E.reduce((acc, w, i) => {
      const spokenWord = S[i] || "";
      if (!spokenWord) return acc;
      if (spokenWord.startsWith(w.slice(0, Math.max(1, Math.floor(w.length / 2))))) return acc + 0.25;
      return acc;
    }, 0) / Math.max(1, E.length);

  const raw = matched / E.length;
  const score = Math.min(1, raw + partialBonus * 0.5);
  return score;
}

/** Estimate syllable count (rough heuristic) */
function countSyllables(word: string) {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  const vowels = word.match(/[aeiouy]{1,2}/g);
  return Math.max(1, vowels ? vowels.length : 1);
}

/** Approx WPM from transcript length and recordingTime */
function computeWPM(transcript = "", seconds = 1) {
  const words = tokenize(transcript).length;
  const minutes = seconds / 60;
  if (minutes <= 0) return 0;
  return Math.round(words / minutes);
}

/** RMS from time-domain audio samples Float32Array */
function computeRMS(samples: Float32Array) {
  if (!samples || samples.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    sum += samples[i] * samples[i];
  }
  const rms = Math.sqrt(sum / samples.length);
  // normalized 0..1
  return Math.min(1, rms * 5); // scale small values
}

/* UI helpers */
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-800 border-green-300";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "Hard":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const getScoreColor = (score: number) => {
  if (score >= 85) return "text-green-600";
  if (score >= 70) return "text-yellow-600";
  return "text-red-600";
};

export default function SvarPractice() {
  const navigate = useNavigate();
  const [practiceMode, setPracticeMode] = useState<Mode>("word");

  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [selectedParagraph, setSelectedParagraph] = useState<number | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<number | null>(null);

  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Float32Array | null>(null);

  const [hasRecorded, setHasRecorded] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);
  const [clarityScore, setClarityScore] = useState<number | null>(null);
  const [fluencyScore, setFluencyScore] = useState<number | null>(null);
  const [speedScore, setSpeedScore] = useState<number | null>(null);

  const [rmsLevel, setRmsLevel] = useState(0);

  useEffect(() => {
    return () => {
      stopInternalRecording();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetAnalysis() {
    setHasRecorded(false);
    setTranscript("");
    setPronunciationScore(null);
    setClarityScore(null);
    setFluencyScore(null);
    setSpeedScore(null);
    setRmsLevel(0);
    setRecordingTime(0);
  }

  function startTimer() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setRecordingTime((r) => r + 1);
    }, 1000);
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  async function setupAudioMonitoring(stream: MediaStream) {
    try {
      const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextCtor();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.fftSize;
      const dataArray = new Float32Array(bufferLength);
      dataArrayRef.current = dataArray;

      // sample loop
      const sampleLoop = () => {
        if (!analyserRef.current || !dataArrayRef.current) return;
        analyserRef.current.getFloatTimeDomainData(dataArrayRef.current);
        const rms = computeRMS(dataArrayRef.current);
        setRmsLevel((prev) => {
          // smooth
          return prev * 0.85 + rms * 0.15;
        });
        if (isRecording) requestAnimationFrame(sampleLoop);
      };
      requestAnimationFrame(sampleLoop);
    } catch (err) {
      console.warn("Audio monitoring failed", err);
    }
  }

  async function startRecording() {
    resetAnalysis();
    // Request mic
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      await setupAudioMonitoring(stream);
    } catch (err) {
      toast.error("Microphone permission required.");
      return;
    }

    // Use SpeechRecognition (webkit prefix fallback)
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech Recognition API not supported in this browser. Use Chrome/Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    // continuous true for paragraphs, false for words
    recognition.continuous = practiceMode === "paragraph";

    recognition.onstart = () => {
      setIsRecording(true);
      setHasRecorded(false);
      startTimer();
      toast.success("Recording started. Speak clearly.");
    };

    recognition.onresult = (event: any) => {
      // Aggregate results if continuous
      let transcriptText = "";
      for (let i = 0; i < event.results.length; i++) {
        transcriptText += event.results[i][0].transcript + (i < event.results.length - 1 ? " " : "");
      }
      setTranscript((prev) => (practiceMode === "paragraph" ? prev + " " + transcriptText : transcriptText));
    };

    recognition.onerror = (ev: any) => {
      console.error("Recognition error", ev);
      toast.error("Speech recognition error.");
    };

    recognition.onend = async () => {
      // onend fires after user stops; do final analysis
      stopTimer();
      setIsRecording(false);

      // stop audio stream tracks
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }

      // compute final analysis
      await runAnalysis();
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (err) {
      console.warn("recognition start err", err);
    }
  }

  function stopInternalRecording() {
    // stop recognition & audio
    try {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    } catch (e) {
      /* ignore */
    }
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
    } catch (e) {
      /* ignore */
    }
    try {
      audioContextRef.current?.close();
      audioContextRef.current = null;
    } catch (e) {
      /* ignore */
    }
    stopTimer();
    setIsRecording(false);
  }

  async function stopRecording() {
    // user-initiated stop
    stopInternalRecording();
    // when recognition ends, onend will call analysis; but ensure runAnalysis here too
    await runAnalysis();
  }

  async function runAnalysis() {
    // guard
    const expectedText =
      practiceMode === "word"
        ? selectedWord !== null
          ? WORDS[selectedWord].word
          : ""
        : selectedParagraph !== null
        ? PARAGRAPHS.find((p) => p.id === selectedParagraph)?.text || ""
        : "";

    // if recognition didn't populate transcript, still try to read lastAudio samples? (out of scope)
    const finalTranscript = transcript.trim();

    if (!finalTranscript) {
      toast.error("No speech captured. Try again and speak clearly.");
      return;
    }

    // Pronunciation: similarity
    const sim = textSimilarity(expectedText, finalTranscript);
    const pronScore = Math.round(sim * 100);

    // Clarity: use RMS level and some heuristics
    // rmsLevel is 0..1 roughly; map to 0..100
    const rms = rmsLevel; // 0..1
    let clarity = Math.round(Math.min(100, Math.max(20, rms * 120))); // give baseline
    // If transcript had many missing words reduce clarity slightly
    if (pronScore < 50) clarity = Math.max(10, clarity - 10);

    // Fluency: estimate from WPM and pause count; simple heuristics:
    const wpm = computeWPM(finalTranscript, recordingTime || 1);
    // ideal speaking range 100-180 WPM depending; for reading paragraphs 110-160, for words it's irrelevant
    const targetWPM = practiceMode === "word" ? 80 : 140;
    // speedScore: how close to target
    const speedDiff = Math.abs(wpm - targetWPM);
    const speedScoreVal = Math.max(0, Math.round(100 - (speedDiff / targetWPM) * 100));

    // Fluency: based on continuous match and WPM
    let fluency = Math.round((pronScore * 0.6 + speedScoreVal * 0.4) * 1.0);
    // penalize if transcript shorter than expected by a lot (skipped words)
    const expectedTokens = tokenize(expectedText).length;
    const spokenTokens = tokenize(finalTranscript).length;
    if (spokenTokens < expectedTokens * 0.6) {
      fluency = Math.max(20, fluency - 20);
    }

    // Combine to final display numbers
    setPronunciationScore(pronScore);
    setClarityScore(clarity);
    setFluencyScore(Math.max(0, Math.min(100, fluency)));
    setSpeedScore(speedScoreVal);

    setHasRecorded(true);
    toast.success("AI Analysis complete.");
  }

  // UI helpers for feedback text
  function getFeedbackText(score: number | null) {
    if (score === null) return "";
    if (score >= 85) return "Excellent — keep that up!";
    if (score >= 70) return "Good — a few small improvements will make it great.";
    if (score >= 50) return "Fair — focus on clarity & pacing.";
    return "Needs practice — try speaking slower & clearer.";
  }

  // navigation back reset helpers
  function backToWordList() {
    setSelectedWord(null);
    resetAnalysis();
  }

  function backToParagraphList() {
    setSelectedParagraph(null);
    resetAnalysis();
  }

  /* --------------------
   Render UI
     -------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-indigo-700">SVAR — Pronunciation Practice</span>
              <span className="text-sm text-gray-500">AI-powered feedback · Word & Paragraph modes</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm text-gray-600 gap-2">
              <Mic className="h-5 w-5 text-indigo-600" />
              <span>Live Analysis</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Instructions + Mode */}
          <aside className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow"
            >
              <h2 className="text-lg font-semibold text-indigo-700">How to use</h2>
              <p className="text-sm text-gray-600 mt-2">
                Choose a word or a paragraph. Click <span className="font-semibold">Start Recording</span>, speak naturally,
                and click <span className="font-semibold">Stop</span>. The AI will analyze pronunciation, clarity and fluency.
              </p>

              <div className="mt-4">
                <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">Real-time Web API</Badge>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2">
                <Button
                  onClick={() => {
                    setPracticeMode("word");
                    setSelectedParagraph(null);
                    resetAnalysis();
                  }}
                  variant={practiceMode === "word" ? "default" : "outline"}
                >
                  Word Practice
                </Button>
                <Button
                  onClick={() => {
                    setPracticeMode("paragraph");
                    setSelectedWord(null);
                    resetAnalysis();
                  }}
                  variant={practiceMode === "paragraph" ? "default" : "outline"}
                >
                  Paragraph Practice
                </Button>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700">Microphone Level</h3>
                <div className="mt-2 w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full transition-all"
                    style={{
                      width: `${Math.round((rmsLevel || 0) * 100)}%`,
                      background: `linear-gradient(90deg,#7c3aed,#06b6d4)`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Speak louder for clearer analysis. Avoid noisy backgrounds.</p>
              </div>
            </motion.div>
          </aside>

          {/* Center Column: Main content */}
          <section className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
              <Tabs value={practiceMode} onValueChange={(v) => { setPracticeMode(v as Mode); resetAnalysis(); }}>
                <TabsList className="grid grid-cols-2 gap-2 bg-white p-2 rounded-2xl shadow">
                  <TabsTrigger value="word">Word Practice</TabsTrigger>
                  <TabsTrigger value="paragraph">Paragraph Practice</TabsTrigger>
                </TabsList>

                {/* WORD TAB */}
                <TabsContent value="word" className="mt-6">
                  {selectedWord === null ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {WORDS.map((w, idx) => (
                        <motion.div
                          key={w.word + idx}
                          whileHover={{ scale: 1.03 }}
                          className="cursor-pointer"
                        >
                          <Card
                            onClick={() => {
                              setSelectedWord(idx);
                              resetAnalysis();
                            }}
                            className="border-2 hover:border-indigo-400 transition"
                          >
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-xl">{w.word}</CardTitle>
                                <Badge className={`${getDifficultyColor(w.difficulty)} border`}>{w.difficulty}</Badge>
                              </div>
                              <CardDescription className="mt-2 text-sm text-gray-600">{w.phonetic}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="text-sm text-gray-700">Practice pronunciation and get AI feedback.</div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <Card className="rounded-2xl shadow-lg">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-4xl">{WORDS[selectedWord].word}</CardTitle>
                              <CardDescription className="text-lg mt-1">{WORDS[selectedWord].phonetic}</CardDescription>
                            </div>
                            <Badge className={`${getDifficultyColor(WORDS[selectedWord].difficulty)} border text-base px-3 py-1`}>
                              {WORDS[selectedWord].difficulty}
                            </Badge>
                          </div>
                          <div className="mt-4">
                            <Button variant="outline" onClick={backToWordList}>
                              ← Back to Word List
                            </Button>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                          {/* Recording Controls */}
                          <div className="bg-gray-50 rounded-lg p-6 text-center">
                            {!isRecording && !hasRecorded && (
                              <div className="space-y-3">
                                <div className="text-sm text-gray-600">Ready to record</div>
                                <Button
                                  size="lg"
                                  onClick={startRecording}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl"
                                >
                                  <Mic className="mr-2" />
                                  Start Recording
                                </Button>
                              </div>
                            )}

                            {isRecording && (
                              <div className="space-y-3">
                                <div className="flex items-center justify-center gap-3">
                                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                  <div className="text-2xl font-mono">{Math.floor(recordingTime / 60)}:{String(recordingTime % 60).padStart(2, "0")}</div>
                                </div>
                                <Button onClick={stopRecording} className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl">
                                  Stop
                                </Button>
                              </div>
                            )}

                            {hasRecorded && (
                              <div className="space-y-3">
                                <div className="text-sm text-gray-600">Recording complete. View analysis below.</div>
                                <Button onClick={() => { resetAnalysis(); }} className="px-6 py-3 rounded-xl">
                                  Record Again
                                </Button>
                              </div>
                            )}
                          </div>

                          {/* Analysis */}
                          {pronunciationScore !== null && (
                            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                              <CardHeader>
                                <CardTitle>AI Pronunciation Analysis</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div>
                                  <div className="flex justify-between mb-2">
                                    <span className="font-semibold">Pronunciation</span>
                                    <span className={`font-bold ${getScoreColor(pronunciationScore)}`}>
                                      {pronunciationScore}% — {getFeedbackText(pronunciationScore)}
                                    </span>
                                  </div>
                                  <Progress value={pronunciationScore} className="h-3" />
                                </div>

                                <div>
                                  <div className="flex justify-between mb-2">
                                    <span className="font-semibold">Clarity</span>
                                    <span className={`font-bold ${getScoreColor(clarityScore ?? 0)}`}>
                                      {clarityScore}% — {getFeedbackText(clarityScore)}
                                    </span>
                                  </div>
                                  <Progress value={clarityScore ?? 0} className="h-3" />
                                </div>

                                <div>
                                  <div className="flex justify-between mb-2">
                                    <span className="font-semibold">Fluency</span>
                                    <span className={`font-bold ${getScoreColor(fluencyScore ?? 0)}`}>
                                      {fluencyScore}% — {getFeedbackText(fluencyScore)}
                                    </span>
                                  </div>
                                  <Progress value={fluencyScore ?? 0} className="h-3" />
                                </div>

                                <div>
                                  <div className="flex justify-between mb-2">
                                    <span className="font-semibold">Speed (WPM)</span>
                                    <span className="font-bold">{computeWPM(transcript, recordingTime)} WPM</span>
                                  </div>
                                  <Progress value={speedScore ?? 0} className="h-3" />
                                </div>

                                <div className="mt-3 p-4 bg-white rounded-lg">
                                  <h4 className="font-semibold mb-2">AI Feedback</h4>
                                  <ul className="space-y-2 text-sm">
                                    <li className="flex items-start">
                                      <span className="text-green-600 mr-2">✓</span>
                                      <span>Pronunciation match: {Math.round((pronunciationScore ?? 0))}%</span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-indigo-600 mr-2">•</span>
                                      <span>Clarity measured from mic level: {(rmsLevel * 100).toFixed(0)}%</span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-yellow-600 mr-2">!</span>
                                      <span>{getFeedbackText(fluencyScore)}</span>
                                    </li>
                                  </ul>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                {/* PARAGRAPH TAB */}
                <TabsContent value="paragraph" className="mt-6">
                  {selectedParagraph === null ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {PARAGRAPHS.map((p) => (
                        <Card
                          key={p.id}
                          className="cursor-pointer hover:shadow-lg transition"
                          onClick={() => {
                            setSelectedParagraph(p.id);
                            resetAnalysis();
                          }}
                        >
                          <CardHeader>
                            <div className="flex justify-between">
                              <CardTitle>{p.title}</CardTitle>
                              <Badge className={`${getDifficultyColor(p.difficulty)} border`}>{p.difficulty}</Badge>
                            </div>
                            <CardDescription className="mt-2 line-clamp-3">{p.text}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm text-gray-700">Practice reading this paragraph aloud to get a fluency score.</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <Card className="rounded-2xl shadow-lg">
                        <CardHeader>
                          <div className="flex justify-between">
                            <div>
                              <CardTitle className="text-2xl">
                                {PARAGRAPHS.find((p) => p.id === selectedParagraph)?.title}
                              </CardTitle>
                              <CardDescription className="mt-2 text-sm">
                                {PARAGRAPHS.find((p) => p.id === selectedParagraph)?.text}
                              </CardDescription>
                            </div>
                            <Badge
                              className={`${getDifficultyColor(
                                PARAGRAPHS.find((p) => p.id === selectedParagraph)?.difficulty || "Medium"
                              )} border`}
                            >
                              {PARAGRAPHS.find((p) => p.id === selectedParagraph)?.difficulty}
                            </Badge>
                          </div>

                          <div className="mt-4">
                            <Button variant="outline" onClick={backToParagraphList}>
                              ← Back to Paragraph List
                            </Button>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                          {/* Recording Controls (Paragraph) */}
                          <div className="bg-gray-50 rounded-lg p-6 text-center">
                            {!isRecording && !hasRecorded && (
                              <div className="space-y-3">
                                <div className="text-sm text-gray-600">Ready to record the paragraph.</div>
                                <Button
                                  size="lg"
                                  onClick={startRecording}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl"
                                >
                                  <Mic className="mr-2" />
                                  Start Recording
                                </Button>
                              </div>
                            )}

                            {isRecording && (
                              <div className="space-y-3">
                                <div className="flex items-center justify-center gap-3">
                                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                  <div className="text-2xl font-mono">{Math.floor(recordingTime / 60)}:{String(recordingTime % 60).padStart(2, "0")}</div>
                                </div>
                                <Button onClick={stopRecording} className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl">
                                  Stop
                                </Button>
                              </div>
                            )}

                            {hasRecorded && (
                              <div className="space-y-3">
                                <div className="text-sm text-gray-600">Recording complete. See analysis below.</div>
                                <Button onClick={() => resetAnalysis()} className="px-6 py-3 rounded-xl">
                                  Record Again
                                </Button>
                              </div>
                            )}
                          </div>

                          {/* Analysis (Paragraph) */}
                          {pronunciationScore !== null && (
                            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                              <CardHeader>
                                <CardTitle>AI Pronunciation Analysis</CardTitle>
                              </CardHeader>

                              <CardContent className="space-y-4">
                                <div>
                                  <div className="flex justify-between mb-2">
                                    <span className="font-semibold">Pronunciation</span>
                                    <span className={`font-bold ${getScoreColor(pronunciationScore)}`}>
                                      {pronunciationScore}% — {getFeedbackText(pronunciationScore)}
                                    </span>
                                  </div>
                                  <Progress value={pronunciationScore} className="h-3" />
                                </div>

                                <div>
                                  <div className="flex justify-between mb-2">
                                    <span className="font-semibold">Clarity</span>
                                    <span className={`font-bold ${getScoreColor(clarityScore ?? 0)}`}>
                                      {clarityScore}% — {getFeedbackText(clarityScore)}
                                    </span>
                                  </div>
                                  <Progress value={clarityScore ?? 0} className="h-3" />
                                </div>

                                <div>
                                  <div className="flex justify-between mb-2">
                                    <span className="font-semibold">Fluency</span>
                                    <span className={`font-bold ${getScoreColor(fluencyScore ?? 0)}`}>
                                      {fluencyScore}% — {getFeedbackText(fluencyScore)}
                                    </span>
                                  </div>
                                  <Progress value={fluencyScore ?? 0} className="h-3" />
                                </div>

                                <div>
                                  <div className="flex justify-between mb-2">
                                    <span className="font-semibold">Speed (WPM)</span>
                                    <span className="font-bold">{computeWPM(transcript, recordingTime)} WPM</span>
                                  </div>
                                  <Progress value={speedScore ?? 0} className="h-3" />
                                </div>

                                <div className="mt-3 p-4 bg-white rounded-lg">
                                  <h4 className="font-semibold mb-2">AI Feedback</h4>
                                  <ul className="space-y-2 text-sm">
                                    <li className="flex items-start">
                                      <span className="text-green-600 mr-2">✓</span>
                                      <span>Pronunciation match: {Math.round((pronunciationScore ?? 0))}%</span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-indigo-600 mr-2">•</span>
                                      <span>Clarity measured from mic level: {(rmsLevel * 100).toFixed(0)}%</span>
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-yellow-600 mr-2">!</span>
                                      <span>{getFeedbackText(fluencyScore)}</span>
                                    </li>
                                  </ul>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </section>
        </div>
      </main>
    </div>
  );
}
