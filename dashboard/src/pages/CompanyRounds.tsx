import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, XCircle, ExternalLink, Mic, Keyboard } from 'lucide-react';
import { toast } from 'sonner';

interface AptitudeQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

interface CodingQuestion {
  id: number;
  title: string;
  difficulty: string;
  link: string;
}

interface CompanyRoundsData {
  aptitude: AptitudeQuestion[];
  coding: CodingQuestion[];
  technical: string[];
  hr: string[];
}

interface Company {
  name: string;
  logo: string;
  rounds: CompanyRoundsData;
}

const companyData: Record<string, Company> = {
  google: {
    name: 'Google',
    logo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
    rounds: {
      aptitude: [
        {
          id: 1,
          question: 'If a car travels 60 km in 1 hour, how far will it travel in 2.5 hours at the same speed?',
          options: ['120 km', '150 km', '180 km', '200 km'],
          correct: 1,
        },
        {
          id: 2,
          question: 'What is 15% of 200?',
          options: ['25', '30', '35', '40'],
          correct: 1,
        },
      ],
      coding: [
        {
          id: 1,
          title: 'Two Sum',
          difficulty: 'Easy',
          link: 'https://leetcode.com/problems/two-sum/',
        },
        {
          id: 2,
          title: 'Longest Substring Without Repeating Characters',
          difficulty: 'Medium',
          link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        },
      ],
      technical: [
        'Explain the difference between HTTP and HTTPS',
        'What is the time complexity of binary search?',
        'Describe the concept of closures in JavaScript',
      ],
      hr: [
        'Tell me about yourself',
        'Why do you want to work at Google?',
        'Describe a challenging project you worked on',
      ],
    },
  },
  microsoft: {
    name: 'Microsoft',
    logo: '/images/photo1763221566.jpg',
    rounds: {
      aptitude: [
        {
          id: 1,
          question: 'A train travels at 80 km/h. How long will it take to cover 240 km?',
          options: ['2 hours', '3 hours', '4 hours', '5 hours'],
          correct: 1,
        },
      ],
      coding: [
        {
          id: 1,
          title: 'Reverse Linked List',
          difficulty: 'Easy',
          link: 'https://leetcode.com/problems/reverse-linked-list/',
        },
        {
          id: 2,
          title: 'Merge Intervals',
          difficulty: 'Medium',
          link: 'https://leetcode.com/problems/merge-intervals/',
        },
      ],
      technical: [
        'Explain the SOLID principles',
        'What is dependency injection?',
        'Describe the difference between SQL and NoSQL databases',
      ],
      hr: [
        'What are your strengths and weaknesses?',
        'Where do you see yourself in 5 years?',
        'How do you handle conflicts in a team?',
      ],
    },
  },
  // Add other companies similarly...
};

export default function CompanyRounds() {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const [selectedRound, setSelectedRound] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});
  const [textAnswers, setTextAnswers] = useState<Record<number, string>>({});
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingQuestionId, setRecordingQuestionId] = useState<number | null>(null);
  const [aiFeedback, setAiFeedback] = useState<Record<number, string>>({});
  const [aiEvaluating, setAiEvaluating] = useState<Record<number, boolean>>({});
  const [evaluationRequested, setEvaluationRequested] = useState<Record<number, boolean>>({});
  const [voiceStatus, setVoiceStatus] = useState<Record<number, string>>({});
  // If the user presses "Submit" from the voice UI while recording, we'll stop recognition
  // and let onend perform evaluation. If they're not recording, evaluate immediately.
  const [interimTranscripts, setInterimTranscripts] = useState<Record<number, string>>({});
  const recognitionRef = useRef<any | null>(null);

  const company = companyId ? companyData[companyId] : null;

  useEffect(() => {
    if (!company) navigate('/');
  }, [company, navigate]);

  // cleanup on unmount to stop speech recognition if running
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  if (!company) return null;

  const rounds = [
    { id: 'round1', name: 'Round 1: Aptitude', key: 'aptitude' },
    { id: 'round2', name: 'Round 2: Coding', key: 'coding' },
    { id: 'round3', name: 'Round 3: Technical', key: 'technical' },
    { id: 'round4', name: 'Round 4: HR', key: 'hr' },
  ];

  const handleAnswerSubmit = (questionId: number, selectedAnswer: number | undefined, correctAnswer: number) => {
    if (selectedAnswer === undefined) {
      toast.error('Please select an option before submitting.');
      return;
    }
    setShowResults({ ...showResults, [questionId]: true });
    if (selectedAnswer === correctAnswer) {
      toast.success('Correct answer!');
    } else {
      toast.error('Incorrect answer. Check the correct answer below.');
    }
  };

  const evaluateWithAI = async (questionText: string, userAnswer: string) => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) {
    throw new Error("Missing Gemini API Key in env");
  }
  if (!questionText || !userAnswer) {
    return "Please provide a valid question and answer.";
  }

  try {
    const prompt = `
You are an interview evaluator.

Question: ${questionText}
Candidate Answer: ${userAnswer}

Provide:
1. Score out of 10
2. Strengths
3. Improvements
4. Verdict (Good / Average / Weak)
5. provide sample answer for reference
remove stars before answering
`;

    const modelName = "gemini-2.5-flash";  // Use a valid Gemini model
    const baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;

    // Support either API key query param or Bearer token in Authorization header.
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    let fetchUrl = baseUrl;
    if (typeof key === 'string' && key.startsWith('AIza')) {
      fetchUrl = `${baseUrl}?key=${key}`;
    } else {
      headers['Authorization'] = `Bearer ${key}`;
    }

    const res = await fetch(fetchUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || `AI request failed with status ${res.status}`);
    }
    const data = await res.json();

    // Debug: log full response
    console.log("Gemini API response:", data);

    // Extract text
    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (aiText && aiText.trim() !== "") {
      return aiText;
    } else {
      // Retry once or return fallback
      return `AI responded but result was empty. Please try again.`;
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return `AI evaluation failed.`;
  }
};


  const getQuestionTextById = (round: string | null, questionId: number) => {
    if (!round) return '';
    if (round === 'technical') return company.rounds.technical[questionId] || '';
    if (round === 'hr') return company.rounds.hr[questionId - 100] || '';
    return '';
  };

  const handleVoiceInput = (questionId: number) => {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    toast.error('Speech Recognition not supported in this browser');
    return;
  }

  // Stop existing recognition if running
  if (recognitionRef.current) {
    // If existing recorder is for the same question, stop (toggle behavior)
    if (recordingQuestionId === questionId) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsRecording(false);
      setRecordingQuestionId(null);
      return;
    }
    // Otherwise, stop previous and proceed to start new
    recognitionRef.current.stop();
    recognitionRef.current = null;
    setIsRecording(false);
    setRecordingQuestionId(null);
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = true; // keep listening until user stops
  recognition.interimResults = true; // get partial results in real time

    recognition.onstart = () => {
    recognitionRef.current = recognition;
    setIsRecording(true);
    setRecordingQuestionId(questionId);
    setVoiceStatus(prev => ({ ...prev, [questionId]: 'recording' }));
    // clear interim and AI feedback for this question when starting
    setInterimTranscripts(prev => ({ ...prev, [questionId]: '' }));
    setAiFeedback(prev => ({ ...prev, [questionId]: '' }));
    toast.info('Recording started... Speak now!');
  };

    recognition.onresult = (event: any) => {
    let interim = '';
    let finalText = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const res = event.results[i][0];
      if (event.results[i].isFinal) {
        finalText += res.transcript;
      } else {
        interim += res.transcript;
      }
    }
    // set interim transcript for this question (real-time display)
    const newInterim = (finalText + interim).trim();
    setInterimTranscripts(prev => ({ ...prev, [questionId]: newInterim }));
    // Update the text answer to show in textarea as well
    // Append finalText only if it adds something new to avoid duplication
    setTextAnswers(prev => {
      const existing = prev[questionId] || '';
      const combined = (existing + finalText).trim();
      return { ...prev, [questionId]: combined };
    });
  };

    recognition.onerror = (err: any) => {
    console.error('Speech recognition error', err);
    setIsRecording(false);
    setRecordingQuestionId(null);
    recognitionRef.current = null;
    toast.error('Voice recognition failed');
  };

    recognition.onend = () => {
    setIsRecording(false);
    setRecordingQuestionId(null);
    recognitionRef.current = null;
    toast.success('Recording ended. Sending to AI for feedback...');
    setVoiceStatus(prev => ({ ...prev, [questionId]: 'stopped' }));

    // get question text by mapping the id correctly
    const questionText = getQuestionTextById(selectedRound, questionId);
    const userAnswer = (textAnswers[questionId] || interimTranscripts[questionId] || '').trim();

    if (userAnswer !== '') {
      const shouldEvaluate = evaluationRequested[questionId] || true; // by default evaluate on end
      // If evaluation wasn't requested and we don't want auto-eval, skip: here we auto-evaluate
      if (!shouldEvaluate) {
        setVoiceStatus(prev => ({ ...prev, [questionId]: 'idle' }));
        return;
      }
      setVoiceStatus(prev => ({ ...prev, [questionId]: 'evaluating' }));
      setAiEvaluating(prev => ({ ...prev, [questionId]: true }));
      console.debug('Evaluating AI for question', questionId, { questionText, userAnswer });
      toast.loading('AI is evaluating...');
      evaluateWithAI(questionText, userAnswer).then((feedback) => {
        setAiFeedback((prev) => ({ ...prev, [questionId]: feedback }));
        toast.dismiss();
        toast.success('AI evaluation complete');
      }).catch((err) => {
        console.error('AI evaluation error', err);
        toast.dismiss();
        // If this looks like a CORS or network error, add helpful message
        setAiFeedback((prev) => ({ ...prev, [questionId]: `AI evaluation failed: ${err?.message || String(err)}. If this is a browser CORS issue, try calling the API from a backend.` }));
        toast.error('AI evaluation failed');
      }).finally(() => {
        setAiEvaluating(prev => ({ ...prev, [questionId]: false }));
        setVoiceStatus(prev => ({ ...prev, [questionId]: 'done' }));
        setEvaluationRequested(prev => ({ ...prev, [questionId]: false }));
      });
    }
    // Clear interim transcript
    setInterimTranscripts(prev => ({ ...prev, [questionId]: '' }));
  };

    recognition.start();
};

  // Handles submit from voice UI; either stops recording to trigger onend evaluation
  // or directly evaluates the current spoken/typed text if not recording.
  const handleVoiceSubmit = async (questionId: number) => {
    const questionText = getQuestionTextById(selectedRound, questionId);
    const currentAnswer = (textAnswers[questionId] || interimTranscripts[questionId] || '').trim();
    if (!currentAnswer) {
      toast.error('No spoken answer to evaluate yet. Please record or type your answer first.');
      return;
    }

    // If currently recording for this question, stop recording and let onend evaluate
    if (recordingQuestionId === questionId && recognitionRef.current) {
      // request evaluation when recognition.onend is called after we stop
      setEvaluationRequested(prev => ({ ...prev, [questionId]: true }));
      setVoiceStatus(prev => ({ ...prev, [questionId]: 'pendingEvaluation' }));
      toast.loading('Stopping recording and evaluating...');
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Failed to stop recognition', err);
        toast.error('Failed to stop recording. Try again.');
      }
      return;
    }

    // Not recording: evaluate right now.
    setAiEvaluating(prev => ({ ...prev, [questionId]: true }));
    toast.loading('AI is evaluating...');
    try {
      const feedback = await evaluateWithAI(questionText, currentAnswer);
      setAiFeedback(prev => ({ ...prev, [questionId]: feedback }));
      toast.dismiss();
      toast.success('AI evaluation complete');
    } catch (err) {
      console.error('AI eval error (voice submit)', err);
      toast.dismiss();
      setAiFeedback(prev => ({ ...prev, [questionId]: `AI evaluation failed: ${err?.message || String(err)}` }));
      toast.error('AI evaluation failed');
    } finally {
      setAiEvaluating(prev => ({ ...prev, [questionId]: false }));
    }
  };

  // Handle textual submissions for AI review
  const handleTextAnswerSubmit = async (questionId: number, questionText: string) => {
    const answer = textAnswers[questionId];
    if (!answer || answer.trim().length < 5) {
      toast.error('Please provide a more detailed answer');
      return;
    }
    toast.loading('AI evaluating...');
    setAiEvaluating(prev => ({ ...prev, [questionId]: true }));
    try {
      const feedback = await evaluateWithAI(questionText, answer);
      setAiFeedback((prev) => ({ ...prev, [questionId]: feedback }));
      toast.dismiss();
      toast.success('Evaluation complete');
      setAiEvaluating(prev => ({ ...prev, [questionId]: false }));
    } catch (err) {
      console.error('AI evaluation error', err);
      toast.dismiss();
      toast.error('AI evaluation failed');
      setAiEvaluating(prev => ({ ...prev, [questionId]: false }));
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <img src={company.logo} alt={`${company.name} logo`} className="h-8 object-contain" />
              <span className="text-2xl font-bold">{company.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!selectedRound ? (
          <div>
            <h1 className="text-4xl font-bold mb-8 text-center">Select Interview Round</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rounds.map((round) => (
                <Card
                  key={round.id}
                  className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 border-2 hover:border-indigo-500"
                  onClick={() => setSelectedRound(round.key)}
                >
                  <CardHeader>
                    <CardTitle className="text-2xl">{round.name}</CardTitle>
                    <CardDescription>Click to start this round</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Start Round</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Interview Rounds</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {rounds.map((round) => (
                    <Button
                      key={round.id}
                      variant={selectedRound === round.key ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setSelectedRound(round.key)}
                    >
                      {round.name}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setSelectedRound(null)}
                  >
                    ← Back to Rounds
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* ---------- Aptitude Round ---------- */}
              {selectedRound === "aptitude" && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold">Aptitude Round</h2>
                  {company.rounds.aptitude.map((q: AptitudeQuestion) => (
                    <Card key={q.id}>
                      <CardHeader>
                        <CardTitle>Question {q.id}</CardTitle>
                        <CardDescription className="text-lg">{q.question}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup
                          value={answers[q.id] !== undefined ? String(answers[q.id]) : undefined}
                          onValueChange={(value) => setAnswers({ ...answers, [q.id]: parseInt(value) })}
                        >
                          {q.options.map((option: string, index: number) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                              <RadioGroupItem value={index.toString()} id={`q${q.id}-opt${index}`} />
                              <Label htmlFor={`q${q.id}-opt${index}`} className="text-base cursor-pointer">{option}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                        <Button
                          className="mt-4"
                          onClick={() => handleAnswerSubmit(q.id, answers[q.id], q.correct)}
                          disabled={answers[q.id] === undefined}
                        >
                          Submit Answer
                        </Button>
                        {showResults[q.id] && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              {answers[q.id] === q.correct ? (
                                <CheckCircle2 className="text-green-600" />
                              ) : (
                                <XCircle className="text-red-600" />
                              )}
                              <span className="font-semibold">
                                Correct Answer: {q.options[q.correct]}
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* ---------- Coding Round ---------- */}
              {selectedRound === "coding" && (
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold mb-6">Coding Round</h2>
                  {company.rounds.coding.map((q: CodingQuestion) => (
                    <Card key={q.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{q.title}</CardTitle>
                            <CardDescription className="mt-2">
                              <Badge variant={q.difficulty === "Easy" ? "default" : q.difficulty === "Medium" ? "secondary" : "destructive"}>
                                {q.difficulty}
                              </Badge>
                            </CardDescription>
                          </div>
                          <Button asChild>
                            <a href={q.link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Solve on LeetCode
                            </a>
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}

              {/* ---------- Technical Round ---------- */}
              {selectedRound === "technical" && (
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold mb-6">Technical Round</h2>
                  <div className="mb-4 flex gap-2">
                    <Button variant={inputMode === "text" ? "default" : "outline"} onClick={() => setInputMode("text")}>
                      <Keyboard className="mr-2 h-4 w-4" />
                      Type Answer
                    </Button>
                    <Button variant={inputMode === "voice" ? "default" : "outline"} onClick={() => setInputMode("voice")}>
                      <Mic className="mr-2 h-4 w-4" />
                      Voice Answer
                    </Button>
                  </div>
                  {company.rounds.technical.map((question: string, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                        <CardDescription className="text-base">{question}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {inputMode === "text" ? (
                          <>
                            <Textarea
                              placeholder="Type your answer here..."
                              value={textAnswers[index] || ''}
                              onChange={(e) => setTextAnswers({ ...textAnswers, [index]: e.target.value })}
                              className="min-h-[150px] mb-4"
                            />
                            <Button onClick={() => handleTextAnswerSubmit(index, question)}>Submit for AI Review</Button>
                            {aiFeedback[index] && (
                              <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded-md text-green-700 whitespace-pre-line">
                                🤖 AI Feedback: {aiFeedback[index]}
                              </div>
                            )}
                            {aiEvaluating[index] && (
                              <div className="mt-4 p-2 text-sm text-gray-600">Evaluating... Please wait.</div>
                            )}
                          </>
                        ) : (
                          <div className="space-y-4">
                            <div className="p-3 bg-gray-50 border rounded min-h-[100px] text-left whitespace-pre-line">
                              {interimTranscripts[index] || textAnswers[index] || 'Click to start and speak your answer...'}
                            </div>
                            <div className="text-sm text-gray-500">{voiceStatus[index] || 'Idle'}</div>
                            <div className="flex gap-2 justify-center">
                              <Button size="lg" onClick={() => handleVoiceInput(index)} className={recordingQuestionId === index ? "bg-red-500 hover:bg-red-600" : ""}>
                                <Mic className="mr-2 h-5 w-5" />
                                {recordingQuestionId === index ? "Recording..." : "Start Recording"}
                              </Button>
                              <Button size="lg" variant="outline" onClick={() => handleVoiceSubmit(index)} disabled={!!aiEvaluating[index]}>
                                {aiEvaluating[index] ? 'Evaluating...' : 'Submit for AI Review'}
                              </Button>
                            </div>
                            {aiFeedback[index] && (
                              <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded-md text-green-700 whitespace-pre-line">
                                🤖 AI Feedback: {aiFeedback[index]}
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* ---------- HR Round ---------- */}
              {selectedRound === "hr" && (
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold mb-6">HR Round</h2>
                  <div className="mb-4 flex gap-2">
                    <Button variant={inputMode === "text" ? "default" : "outline"} onClick={() => setInputMode("text")}>
                      <Keyboard className="mr-2 h-4 w-4" />
                      Type Answer
                    </Button>
                    <Button variant={inputMode === "voice" ? "default" : "outline"} onClick={() => setInputMode("voice")}>
                      <Mic className="mr-2 h-4 w-4" />
                      Voice Answer
                    </Button>
                  </div>
                  {company.rounds.hr.map((question: string, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                        <CardDescription className="text-base">{question}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {inputMode === "text" ? (
                          <>
                            <Textarea
                              placeholder="Type your answer here..."
                              value={textAnswers[index + 100] || ''}
                              onChange={(e) => setTextAnswers({ ...textAnswers, [index + 100]: e.target.value })}
                              className="min-h-[150px] mb-4"
                            />
                            <Button onClick={() => handleTextAnswerSubmit(index + 100, question)}>Submit for AI Review</Button>
                            {aiFeedback[index + 100] && (
                              <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded-md text-green-700 whitespace-pre-line">
                                🤖 AI Feedback: {aiFeedback[index + 100]}
                              </div>
                            )}
                            {aiEvaluating[index + 100] && (
                              <div className="mt-4 p-2 text-sm text-gray-600">Evaluating... Please wait.</div>
                            )}
                          </>
                        ) : (
                          <div className="space-y-4">
                            <div className="p-3 bg-gray-50 border rounded min-h-[100px] text-left whitespace-pre-line">
                              {interimTranscripts[index + 100] || textAnswers[index + 100] || 'Click to start and speak your answer...'}
                            </div>
                            <div className="text-sm text-gray-500">{voiceStatus[index + 100] || 'Idle'}</div>
                            <div className="flex gap-2 justify-center">
                              <Button size="lg" onClick={() => handleVoiceInput(index + 100)} className={recordingQuestionId === index + 100 ? "bg-red-500 hover:bg-red-600" : ""}>
                                <Mic className="mr-2 h-5 w-5" />
                                {recordingQuestionId === index + 100 ? "Recording..." : "Start Recording"}
                              </Button>
                              <Button size="lg" variant="outline" onClick={() => handleVoiceSubmit(index + 100)} disabled={!!aiEvaluating[index + 100]}>
                                {aiEvaluating[index + 100] ? 'Evaluating...' : 'Submit for AI Review'}
                              </Button>
                            </div>
                            {aiFeedback[index + 100] && (
                              <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded-md text-green-700 whitespace-pre-line">
                                🤖 AI Feedback: {aiFeedback[index + 100]}
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
