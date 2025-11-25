import { useState, useEffect } from 'react';
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

interface CompanyRounds {
  aptitude: AptitudeQuestion[];
  coding: CodingQuestion[];
  technical: string[];
  hr: string[];
}

interface Company {
  name: string;
  logo: string;
  rounds: CompanyRounds;
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
  amazon: {
    name: 'Amazon',
    logo: '/images/photo1763221566.jpg',
    rounds: {
      aptitude: [
        {
          id: 1,
          question: 'If 5 workers can complete a task in 10 days, how many days will 10 workers take?',
          options: ['5 days', '7 days', '10 days', '15 days'],
          correct: 0,
        },
      ],
      coding: [
        {
          id: 1,
          title: 'Valid Parentheses',
          difficulty: 'Easy',
          link: 'https://leetcode.com/problems/valid-parentheses/',
        },
        {
          id: 2,
          title: 'LRU Cache',
          difficulty: 'Medium',
          link: 'https://leetcode.com/problems/lru-cache/',
        },
      ],
      technical: [
        'Explain Amazon\'s leadership principles',
        'How would you design a scalable system?',
        'What is the difference between microservices and monolithic architecture?',
      ],
      hr: [
        'Tell me about a time you failed',
        'Describe a situation where you had to work with a difficult team member',
        'Why Amazon?',
      ],
    },
  },
  meta: {
    name: 'Meta',
    logo: '/images/photo1763221566.jpg',
    rounds: {
      aptitude: [
        {
          id: 1,
          question: 'What is 25% of 80?',
          options: ['15', '20', '25', '30'],
          correct: 1,
        },
      ],
      coding: [
        {
          id: 1,
          title: 'Binary Tree Level Order Traversal',
          difficulty: 'Medium',
          link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
        },
      ],
      technical: [
        'Explain React hooks',
        'What is virtual DOM?',
        'Describe the event loop in JavaScript',
      ],
      hr: [
        'Why do you want to work at Meta?',
        'Tell me about your most impactful project',
      ],
    },
  },
  apple: {
    name: 'Apple',
    logo: '/images/photo1763221565.jpg',
    rounds: {
      aptitude: [
        {
          id: 1,
          question: 'If a product costs $120 after a 20% discount, what was the original price?',
          options: ['$140', '$150', '$160', '$180'],
          correct: 1,
        },
      ],
      coding: [
        {
          id: 1,
          title: 'Maximum Subarray',
          difficulty: 'Medium',
          link: 'https://leetcode.com/problems/maximum-subarray/',
        },
      ],
      technical: [
        'Explain memory management in iOS',
        'What is the difference between strong and weak references?',
      ],
      hr: [
        'What makes Apple different?',
        'Describe your design philosophy',
      ],
    },
  },
  netflix: {
    name: 'Netflix',
    logo: '/images/photo1763221566.jpg',
    rounds: {
      aptitude: [
        {
          id: 1,
          question: 'A streaming service has 100 million users. If 30% are active daily, how many active users are there?',
          options: ['20 million', '30 million', '40 million', '50 million'],
          correct: 1,
        },
      ],
      coding: [
        {
          id: 1,
          title: 'Design Video Streaming System',
          difficulty: 'Hard',
          link: 'https://leetcode.com/discuss/interview-question/system-design/',
        },
      ],
      technical: [
        'How would you optimize video streaming?',
        'Explain CDN architecture',
      ],
      hr: [
        'Tell me about a time you took a risk',
        'How do you stay updated with technology?',
      ],
    },
  },
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

  const company = companyId ? companyData[companyId] : null;

  useEffect(() => {
    if (!company) {
      navigate('/');
    }
  }, [company, navigate]);

  if (!company) return null;

  const handleAnswerSubmit = (questionId: number, selectedAnswer: number, correctAnswer: number) => {
    setShowResults({ ...showResults, [questionId]: true });
    if (selectedAnswer === correctAnswer) {
      toast.success('Correct answer!');
    } else {
      toast.error('Incorrect answer. Check the correct answer below.');
    }
  };

  const handleTextAnswerSubmit = (questionId: number) => {
    const answer = textAnswers[questionId];
    if (!answer || answer.trim().length < 10) {
      toast.error('Please provide a more detailed answer (at least 10 characters)');
      return;
    }
    
    // Simulate AI checking
    toast.success('Answer submitted! AI is analyzing your response...');
    setTimeout(() => {
      toast.info('AI Feedback: Good structure! Consider adding more specific examples.');
    }, 2000);
  };

  const handleVoiceInput = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast.info('Recording started... Speak your answer');
      // Simulate recording
      setTimeout(() => {
        setIsRecording(false);
        toast.success('Recording completed! Processing your answer...');
      }, 3000);
    }
  };

  const rounds = [
    { id: 'round1', name: 'Round 1: Aptitude', key: 'aptitude' },
    { id: 'round2', name: 'Round 2: Coding', key: 'coding' },
    { id: 'round3', name: 'Round 3: Technical', key: 'technical' },
    { id: 'round4', name: 'Round 4: HR', key: 'hr' },
  ];

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
              <img 
                src={company.logo} 
                alt={`${company.name} logo`}
                className="h-8 object-contain"
              />
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
            {/* Left Sidebar - Rounds */}
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

            {/* Main Content Area */}
            <div className="flex-1">
              {selectedRound === 'aptitude' && (
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
                          value={answers[q.id]?.toString()}
                          onValueChange={(value) => setAnswers({ ...answers, [q.id]: parseInt(value) })}
                        >
                          {q.options.map((option: string, index: number) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                              <RadioGroupItem value={index.toString()} id={`q${q.id}-opt${index}`} />
                              <Label htmlFor={`q${q.id}-opt${index}`} className="text-base cursor-pointer">
                                {option}
                              </Label>
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

              {selectedRound === 'coding' && (
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold mb-6">Coding Round</h2>
                  {company.rounds.coding.map((q: CodingQuestion) => (
                    <Card key={q.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{q.title}</CardTitle>
                            <CardDescription className="mt-2">
                              <Badge
                                variant={
                                  q.difficulty === 'Easy'
                                    ? 'default'
                                    : q.difficulty === 'Medium'
                                    ? 'secondary'
                                    : 'destructive'
                                }
                              >
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

              {selectedRound === 'technical' && (
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold mb-6">Technical Round</h2>
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
                        {inputMode === 'text' ? (
                          <>
                            <Textarea
                              placeholder="Type your answer here..."
                              value={textAnswers[index] || ''}
                              onChange={(e) => setTextAnswers({ ...textAnswers, [index]: e.target.value })}
                              className="min-h-[150px] mb-4"
                            />
                            <Button onClick={() => handleTextAnswerSubmit(index)}>
                              Submit for AI Review
                            </Button>
                          </>
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
                              Click to record your answer
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {selectedRound === 'hr' && (
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold mb-6">HR Round</h2>
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
                        {inputMode === 'text' ? (
                          <>
                            <Textarea
                              placeholder="Type your answer here..."
                              value={textAnswers[index + 100] || ''}
                              onChange={(e) => setTextAnswers({ ...textAnswers, [index + 100]: e.target.value })}
                              className="min-h-[150px] mb-4"
                            />
                            <Button onClick={() => handleTextAnswerSubmit(index + 100)}>
                              Submit for AI Review
                            </Button>
                          </>
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
                              Click to record your answer
                            </p>
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