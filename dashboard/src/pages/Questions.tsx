import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Search, ExternalLink, Code, TrendingUp, Zap } from 'lucide-react';

interface Question {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  leetcodeLink: string;
  companies: Array<{
    id: string;
    name: string;
    logo: string;
  }>;
  topics: string[];
}

const questions: Question[] = [
  {
    id: '1',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Array',
    leetcodeLink: 'https://leetcode.com/problems/two-sum/',
    companies: [
      { id: 'google', name: 'Google', logo: '/images/Google.svg' },
      { id: 'amazon', name: 'Amazon', logo: '/images/Amazon.jpg' },
      { id: 'microsoft', name: 'Microsoft', logo: '/images/Microsoft.jpg' },
    ],
    topics: ['Array', 'Hash Table'],
  },
  {
    id: '2',
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    category: 'Linked List',
    leetcodeLink: 'https://leetcode.com/problems/add-two-numbers/',
    companies: [
      { id: 'microsoft', name: 'Microsoft', logo: '/images/Microsoft.jpg' },
      { id: 'amazon', name: 'Amazon', logo: '/images/Amazon.jpg' },
    ],
    topics: ['Linked List', 'Math'],
  },
  {
    id: '3',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'String',
    leetcodeLink: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    companies: [
      { id: 'amazon', name: 'Amazon', logo: '/images/Amazon.jpg' },
      { id: 'google', name: 'Google', logo: '/images/Google.svg' },
      { id: 'meta', name: 'Meta', logo: '/images/Meta.jpg' },
    ],
    topics: ['String', 'Sliding Window'],
  },
  {
    id: '4',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    category: 'Array',
    leetcodeLink: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
    companies: [
      { id: 'google', name: 'Google', logo: '/images/Google.svg' },
      { id: 'microsoft', name: 'Microsoft', logo: '/images/Microsoft.jpg' },
    ],
    topics: ['Array', 'Binary Search'],
  },
  {
    id: '5',
    title: 'Reverse Integer',
    difficulty: 'Medium',
    category: 'Math',
    leetcodeLink: 'https://leetcode.com/problems/reverse-integer/',
    companies: [
      { id: 'apple', name: 'Apple', logo: '/images/Apple.jpg' },
      { id: 'amazon', name: 'Amazon', logo: '/images/Amazon.jpg' },
    ],
    topics: ['Math'],
  },
  {
    id: '6',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    category: 'Linked List',
    leetcodeLink: 'https://leetcode.com/problems/merge-two-sorted-lists/',
    companies: [
      { id: 'microsoft', name: 'Microsoft', logo: '/images/Microsoft.jpg' },
      { id: 'amazon', name: 'Amazon', logo: '/images/Amazon.jpg' },
      { id: 'apple', name: 'Apple', logo: '/images/Apple.jpg' },
    ],
    topics: ['Linked List', 'Recursion'],
  },
  {
    id: '7',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    leetcodeLink: 'https://leetcode.com/problems/valid-parentheses/',
    companies: [
      { id: 'google', name: 'Google', logo: '/images/Google.svg' },
      { id: 'meta', name: 'Meta', logo: '/images/Meta.jpg' },
      { id: 'amazon', name: 'Amazon', logo: '/images/Amazon.jpg' },
    ],
    topics: ['Stack', 'String'],
  },
  {
    id: '8',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    category: 'Tree',
    leetcodeLink: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    companies: [
      { id: 'microsoft', name: 'Microsoft', logo: '/images/Microsoft.jpg' },
      { id: 'amazon', name: 'Amazon', logo: '/images/Amazon.jpg' },
      { id: 'meta', name: 'Meta', logo: '/images/Meta.jpg' },
    ],
    topics: ['Tree', 'BFS'],
  },
];

export default function Questions() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Hard':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <Building2 className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                InterviewPrep Pro
              </span>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" onClick={() => navigate('/questions')}>
                <Code className="mr-2 h-4 w-4" />
                Questions
              </Button>
              <Button variant="ghost" onClick={() => navigate('/practice')}>
                <Zap className="mr-2 h-4 w-4" />
                Practice
              </Button>
              <Button variant="ghost" onClick={() => navigate('/svar-practice')}>
                <TrendingUp className="mr-2 h-4 w-4" />
                SVAR Round
              </Button>
              <Button variant="ghost" onClick={() => navigate('/mock-interview')}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Mock Interview
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Coding Questions Library
          </h1>
          <p className="text-xl text-gray-600">
            Practice questions asked by top tech companies
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search questions or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          </div>

          <Tabs value={selectedDifficulty} onValueChange={setSelectedDifficulty} className="w-full max-w-md mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="Easy">Easy</TabsTrigger>
              <TabsTrigger value="Medium">Medium</TabsTrigger>
              <TabsTrigger value="Hard">Hard</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <Card key={question.id} className="hover:shadow-lg transition-all border-2 hover:border-indigo-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{question.title}</CardTitle>
                      <Badge className={`${getDifficultyColor(question.difficulty)} border`}>
                        {question.difficulty}
                      </Badge>
                    </div>
                    <CardDescription className="flex flex-wrap gap-2 mb-3">
                      {question.topics.map((topic) => (
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => window.open(question.leetcodeLink, '_blank')}
                    className="ml-4"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    LeetCode
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">Asked by:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {question.companies.map((company) => (
                      <div
                        key={company.id}
                        className="flex items-center gap-1 bg-white border rounded-full px-2 py-1 hover:shadow-md transition-all cursor-pointer"
                        title={company.name}
                      >
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="h-5 w-5 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                        />
                        <span className="text-xs font-medium text-gray-700 hidden">
                          {company.name.charAt(0)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No questions found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}