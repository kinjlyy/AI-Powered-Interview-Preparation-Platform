import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Play, Pause, SkipForward, Mic, Keyboard, Building2, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

const companies = [
  { id: 'google', name: 'Google' },
  { id: 'microsoft', name: 'Microsoft' },
  { id: 'amazon', name: 'Amazon' },
  { id: 'meta', name: 'Meta' },
  { id: 'apple', name: 'Apple' },
  { id: 'netflix', name: 'Netflix' },
];

const roles = [
  { id: 'frontend', name: 'Frontend Developer' },
  { id: 'backend', name: 'Backend Developer' },
  { id: 'fullstack', name: 'Full Stack Developer' },
  { id: 'devops', name: 'DevOps Engineer' },
  { id: 'data-scientist', name: 'Data Scientist' },
  { id: 'product-manager', name: 'Product Manager' },
];

const generalQuestions = {
  technical: [
    'Explain the difference between REST and GraphQL',
    'What is the CAP theorem in distributed systems?',
    'Describe how you would optimize database queries',
  ],
  coding: [
    'Implement a function to reverse a linked list',
    'Design a URL shortener service',
    'Find the longest palindromic substring',
  ],
  behavioral: [
    'Tell me about yourself',
    'Describe a challenging project you worked on',
    'How do you handle disagreements with team members?',
  ],
};

export default function MockInterview() {
  const navigate = useNavigate();
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [selectionMode, setSelectionMode] = useState<'company' | 'role' | 'general' | null>(null);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [currentRound, setCurrentRound] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isPaused, setIsPaused] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [isRecording, setIsRecording] = useState(false);
  const [answer, setAnswer] = useState('');

  const rounds = [
    { name: 'Technical Round', questions: generalQuestions.technical },
    { name: 'Coding Round', questions: generalQuestions.coding },
    { name: 'Behavioral Round', questions: generalQuestions.behavioral },
  ];

  const handleStartInterview = () => {
    if (selectionMode === 'company' && !selectedCompany) {
      toast.error('Please select a company');
      return;
    }
    if (selectionMode === 'role' && !selectedRole) {
      toast.error('Please select a role');
      return;
    }
    setInterviewStarted(true);
    startTimer();
    toast.success('Mock interview started! Good luck!');
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            toast.info('Time is up for this question!');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < rounds[currentRound].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(300);
      setAnswer('');
      setIsRecording(false);
      toast.info('Moving to next question');
    } else if (currentRound < rounds.length - 1) {
      setCurrentRound(currentRound + 1);
      setCurrentQuestion(0);
      setTimeLeft(300);
      setAnswer('');
      setIsRecording(false);
      toast.success(`${rounds[currentRound].name} completed! Moving to ${rounds[currentRound + 1].name}`);
    } else {
      toast.success('Mock interview completed! Great job!');
      setInterviewStarted(false);
      setCurrentRound(0);
      setCurrentQuestion(0);
    }
  };

  const handleSkipQuestion = () => {
    toast.info('Skipping to next question');
    handleNextQuestion();
  };

  const handleVoiceInput = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast.info('Recording started... Speak your answer');
      setTimeout(() => {
        setIsRecording(false);
        toast.success('Recording completed! AI is analyzing your response...');
        setTimeout(() => {
          toast.info('AI Feedback: Good explanation! Consider adding more examples.');
        }, 1500);
      }, 3000);
    }
  };

  const handleSubmitAnswer = () => {
    if (inputMode === 'text' && answer.trim().length < 10) {
      toast.error('Please provide a more detailed answer');
      return;
    }
    toast.success('Answer submitted! AI is evaluating...');
    setTimeout(() => {
      toast.info('AI Feedback: Well-structured answer with good technical depth.');
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft > 180) return 'text-green-600';
    if (timeLeft > 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <span className="text-2xl font-bold">Mock Interview Setup</span>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Mock Interview Simulator</h1>
            <p className="text-lg text-gray-600">
              Choose your interview type and prepare for success
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Interview Type</CardTitle>
              <CardDescription>Choose how you want to practice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant={selectionMode === 'company' ? 'default' : 'outline'}
                  className="h-24 flex flex-col items-center justify-center"
                  onClick={() => setSelectionMode('company')}
                >
                  <Building2 className="h-8 w-8 mb-2" />
                  <span>Company-Specific</span>
                </Button>
                <Button
                  variant={selectionMode === 'role' ? 'default' : 'outline'}
                  className="h-24 flex flex-col items-center justify-center"
                  onClick={() => setSelectionMode('role')}
                >
                  <Briefcase className="h-8 w-8 mb-2" />
                  <span>Role-Specific</span>
                </Button>
                <Button
                  variant={selectionMode === 'general' ? 'default' : 'outline'}
                  className="h-24 flex flex-col items-center justify-center"
                  onClick={() => setSelectionMode('general')}
                >
                  <Play className="h-8 w-8 mb-2" />
                  <span>General Interview</span>
                </Button>
              </div>

              {selectionMode === 'company' && (
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">Select Company</label>
                  <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectionMode === 'role' && (
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">Select Role</label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectionMode && (
                <Button className="w-full mt-6" size="lg" onClick={handleStartInterview}>
                  Start Mock Interview
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interview Format</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>3 rounds: Technical, Coding, and Behavioral</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>5 minutes per question</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Option to type or speak your answers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>AI-powered feedback on your responses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Skip questions if needed</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Button
              variant="ghost"
              onClick={() => {
                if (confirm('Are you sure you want to exit the interview?')) {
                  setInterviewStarted(false);
                  setCurrentRound(0);
                  setCurrentQuestion(0);
                }
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Exit Interview
            </Button>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">{rounds[currentRound].name}</Badge>
              <span className={`text-2xl font-mono font-bold ${getTimeColor()}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {rounds[currentRound].questions.length}
            </span>
          </div>
          <Progress
            value={((currentQuestion + 1) / rounds[currentRound].questions.length) * 100}
            className="h-2"
          />
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">
                  Question {currentQuestion + 1}
                </CardTitle>
                <Badge>{rounds[currentRound].name}</Badge>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPaused(!isPaused)}
                >
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={handleSkipQuestion}>
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-6">{rounds[currentRound].questions[currentQuestion]}</p>

            <div className="mb-4 flex gap-2">
              <Button
                variant={inputMode === 'text' ? 'default' : 'outline'}
                onClick={() => setInputMode('text')}
              >
                <Keyboard className="mr-2 h-4 w-4" />
                Type Answer
              </Button>
              <Button
                variant={inputMode === 'voice' ? 'default' : 'outline'}
                onClick={() => setInputMode('voice')}
              >
                <Mic className="mr-2 h-4 w-4" />
                Speak Answer
              </Button>
            </div>

            {inputMode === 'text' ? (
              <div>
                <Textarea
                  placeholder="Type your answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="min-h-[200px] mb-4"
                />
                <div className="flex space-x-2">
                  <Button onClick={handleSubmitAnswer}>Submit Answer</Button>
                  <Button variant="outline" onClick={handleNextQuestion}>
                    Next Question
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Button
                  size="lg"
                  onClick={handleVoiceInput}
                  className={isRecording ? 'bg-red-500 hover:bg-red-600' : ''}
                >
                  <Mic className="mr-2 h-5 w-5" />
                  {isRecording ? 'Recording...' : 'Start Recording'}
                </Button>
                <p className="text-sm text-gray-600 mt-4">
                  Click to record your answer (AI will analyze your response)
                </p>
                {!isRecording && (
                  <Button variant="outline" className="mt-4" onClick={handleNextQuestion}>
                    Next Question
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interview Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Take your time to think before answering</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Structure your answers clearly</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Use specific examples from your experience</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Ask clarifying questions if needed</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}