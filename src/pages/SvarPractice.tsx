import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mic, Volume2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const svarQuestions = [
  {
    id: 1,
    question: 'Describe a situation where you had to work under pressure',
    category: 'Behavioral',
    tips: [
      'Speak clearly and maintain steady pace',
      'Use proper pronunciation for technical terms',
      'Avoid filler words like "um", "uh", "like"',
      'Practice proper breathing between sentences',
    ],
  },
  {
    id: 2,
    question: 'Tell me about a time when you solved a complex problem',
    category: 'Problem Solving',
    tips: [
      'Articulate technical concepts clearly',
      'Maintain consistent volume throughout',
      'Use pauses effectively for emphasis',
      'Pronounce acronyms correctly',
    ],
  },
  {
    id: 3,
    question: 'Describe a situation where you demonstrated leadership',
    category: 'Leadership',
    tips: [
      'Project confidence through voice tone',
      'Vary your pitch to maintain engagement',
      'Enunciate words clearly',
      'Control speaking speed - not too fast or slow',
    ],
  },
  {
    id: 4,
    question: 'Share an experience where you had to adapt to change',
    category: 'Adaptability',
    tips: [
      'Maintain natural speech rhythm',
      'Avoid monotone delivery',
      'Practice proper word stress',
      'Use appropriate intonation for questions and statements',
    ],
  },
  {
    id: 5,
    question: 'Tell me about a time you worked in a team',
    category: 'Teamwork',
    tips: [
      'Speak with enthusiasm and energy',
      'Pronounce names and titles correctly',
      'Use clear diction',
      'Maintain professional tone throughout',
    ],
  },
];

export default function SvarPractice() {
  const navigate = useNavigate();
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);
  const [clarityScore, setClarityScore] = useState<number | null>(null);
  const [paceScore, setPaceScore] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState('');

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    toast.success('Recording started! Speak your answer clearly.');
    
    // Simulate recording timer
    const interval = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= 120) {
          clearInterval(interval);
          handleStopRecording();
          return 120;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setHasRecorded(true);
    toast.info('Recording stopped. Analyzing your pronunciation...');
    
    // Simulate AI analysis
    setTimeout(() => {
      const pronunciation = Math.floor(Math.random() * 20) + 75; // 75-95
      const clarity = Math.floor(Math.random() * 20) + 70; // 70-90
      const pace = Math.floor(Math.random() * 25) + 70; // 70-95
      
      setPronunciationScore(pronunciation);
      setClarityScore(clarity);
      setPaceScore(pace);
      
      toast.success('Analysis complete! Check your scores below.');
    }, 2000);
  };

  const handlePlayback = () => {
    toast.info('Playing back your recording...');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreFeedback = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    return 'Needs Improvement';
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
            <div className="flex items-center space-x-2">
              <Mic className="h-6 w-6 text-indigo-600" />
              <span className="text-2xl font-bold">SVAR Round - Pronunciation Analysis</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">SVAR (Situation, Voice, Articulation, Response) Practice</h1>
          <p className="text-lg text-gray-600">
            Practice your pronunciation and speaking skills. AI will analyze your voice clarity, pace, and pronunciation.
          </p>
        </div>

        {selectedQuestion === null ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {svarQuestions.map((q) => (
              <Card
                key={q.id}
                className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 border-2 hover:border-indigo-500"
                onClick={() => setSelectedQuestion(q.id)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">Question {q.id}</CardTitle>
                    <Badge variant="secondary">{q.category}</Badge>
                  </div>
                  <CardDescription className="text-base">{q.question}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Start Practice</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar - Question List */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {svarQuestions.map((q) => (
                    <Button
                      key={q.id}
                      variant={selectedQuestion === q.id ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => {
                        setSelectedQuestion(q.id);
                        setHasRecorded(false);
                        setPronunciationScore(null);
                        setClarityScore(null);
                        setPaceScore(null);
                        setTextAnswer('');
                      }}
                    >
                      Question {q.id}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setSelectedQuestion(null)}
                  >
                    ← Back to All Questions
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {svarQuestions
                .filter((q) => q.id === selectedQuestion)
                .map((question) => (
                  <div key={question.id}>
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-2xl mb-2">Question {question.id}</CardTitle>
                            <Badge variant="secondary" className="mb-4">
                              {question.category}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription className="text-lg">{question.question}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-6">
                          <h3 className="font-semibold mb-3 flex items-center">
                            <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
                            Pronunciation Tips:
                          </h3>
                          <ul className="space-y-2">
                            {question.tips.map((tip, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-indigo-600 mr-2">•</span>
                                <span className="text-gray-700">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Recording Controls */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                          <div className="text-center">
                            {!isRecording && !hasRecorded && (
                              <Button
                                size="lg"
                                onClick={handleStartRecording}
                                className="bg-indigo-600 hover:bg-indigo-700"
                              >
                                <Mic className="mr-2 h-5 w-5" />
                                Start Recording
                              </Button>
                            )}

                            {isRecording && (
                              <div className="space-y-4">
                                <div className="flex items-center justify-center space-x-3">
                                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                                  <span className="text-2xl font-mono font-bold">
                                    {formatTime(recordingTime)}
                                  </span>
                                </div>
                                <Button
                                  size="lg"
                                  onClick={handleStopRecording}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Stop Recording
                                </Button>
                              </div>
                            )}

                            {hasRecorded && (
                              <div className="space-y-4">
                                <div className="flex justify-center space-x-4">
                                  <Button variant="outline" onClick={handlePlayback}>
                                    <Volume2 className="mr-2 h-4 w-4" />
                                    Play Recording
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setHasRecorded(false);
                                      setPronunciationScore(null);
                                      setClarityScore(null);
                                      setPaceScore(null);
                                    }}
                                  >
                                    <Mic className="mr-2 h-4 w-4" />
                                    Record Again
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Alternative: Text Input */}
                        <div className="mb-6">
                          <h3 className="font-semibold mb-3">Or type your answer:</h3>
                          <Textarea
                            placeholder="Type your answer here if you prefer not to record..."
                            value={textAnswer}
                            onChange={(e) => setTextAnswer(e.target.value)}
                            className="min-h-[150px]"
                          />
                          <Button
                            className="mt-3"
                            onClick={() => {
                              if (textAnswer.trim().length < 20) {
                                toast.error('Please provide a more detailed answer');
                                return;
                              }
                              toast.success('Answer submitted for review!');
                            }}
                          >
                            Submit Text Answer
                          </Button>
                        </div>

                        {/* AI Analysis Results */}
                        {pronunciationScore !== null && (
                          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50">
                            <CardHeader>
                              <CardTitle>AI Pronunciation Analysis</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <div className="flex justify-between mb-2">
                                  <span className="font-semibold">Pronunciation Accuracy</span>
                                  <span className={`font-bold ${getScoreColor(pronunciationScore)}`}>
                                    {pronunciationScore}% - {getScoreFeedback(pronunciationScore)}
                                  </span>
                                </div>
                                <Progress value={pronunciationScore} className="h-3" />
                              </div>

                              <div>
                                <div className="flex justify-between mb-2">
                                  <span className="font-semibold">Voice Clarity</span>
                                  <span className={`font-bold ${getScoreColor(clarityScore!)}`}>
                                    {clarityScore}% - {getScoreFeedback(clarityScore!)}
                                  </span>
                                </div>
                                <Progress value={clarityScore!} className="h-3" />
                              </div>

                              <div>
                                <div className="flex justify-between mb-2">
                                  <span className="font-semibold">Speaking Pace</span>
                                  <span className={`font-bold ${getScoreColor(paceScore!)}`}>
                                    {paceScore}% - {getScoreFeedback(paceScore!)}
                                  </span>
                                </div>
                                <Progress value={paceScore!} className="h-3" />
                              </div>

                              <div className="mt-4 p-4 bg-white rounded-lg">
                                <h4 className="font-semibold mb-2">AI Feedback:</h4>
                                <ul className="space-y-2 text-sm">
                                  <li className="flex items-start">
                                    <span className="text-green-600 mr-2">✓</span>
                                    <span>Good articulation of technical terms</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="text-yellow-600 mr-2">!</span>
                                    <span>Try to reduce filler words for smoother delivery</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="text-green-600 mr-2">✓</span>
                                    <span>Consistent volume and clear enunciation</span>
                                  </li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}