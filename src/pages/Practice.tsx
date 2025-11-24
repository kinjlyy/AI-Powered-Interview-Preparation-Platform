import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ExternalLink, Search } from 'lucide-react';

const practiceQuestions = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/two-sum/',
    companies: ['🔍', '📦', '🍎', '🪟'],
    tags: ['Array', 'Hash Table'],
  },
  {
    id: 2,
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/reverse-linked-list/',
    companies: ['🪟', '📦', '👥'],
    tags: ['Linked List', 'Recursion'],
  },
  {
    id: 3,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/valid-parentheses/',
    companies: ['📦', '🔍', '👥'],
    tags: ['Stack', 'String'],
  },
  {
    id: 4,
    title: 'Merge Intervals',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/merge-intervals/',
    companies: ['🔍', '👥', '🪟'],
    tags: ['Array', 'Sorting'],
  },
  {
    id: 5,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    companies: ['🔍', '📦', '👥'],
    tags: ['String', 'Sliding Window'],
  },
  {
    id: 6,
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    companies: ['👥', '🔍', '🪟'],
    tags: ['Tree', 'BFS'],
  },
  {
    id: 7,
    title: 'LRU Cache',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/lru-cache/',
    companies: ['📦', '🔍', '👥'],
    tags: ['Design', 'Hash Table', 'Linked List'],
  },
  {
    id: 8,
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/maximum-subarray/',
    companies: ['🍎', '🔍', '📦'],
    tags: ['Array', 'Dynamic Programming'],
  },
  {
    id: 9,
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/trapping-rain-water/',
    companies: ['🔍', '📦', '👥'],
    tags: ['Array', 'Two Pointers', 'Stack'],
  },
  {
    id: 10,
    title: 'Serialize and Deserialize Binary Tree',
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
    companies: ['🔍', '👥', '📦'],
    tags: ['Tree', 'Design', 'DFS'],
  },
];

export default function Practice() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);

  const filteredQuestions = practiceQuestions.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = !difficultyFilter || q.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <span className="text-2xl font-bold">Coding Practice</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-center">Practice Coding Questions</h1>
          <p className="text-xl text-gray-600 text-center mb-8">
            Curated questions asked by top tech companies
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by question name or tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={difficultyFilter === null ? 'default' : 'outline'}
                onClick={() => setDifficultyFilter(null)}
              >
                All
              </Button>
              <Button
                variant={difficultyFilter === 'Easy' ? 'default' : 'outline'}
                onClick={() => setDifficultyFilter('Easy')}
              >
                Easy
              </Button>
              <Button
                variant={difficultyFilter === 'Medium' ? 'default' : 'outline'}
                onClick={() => setDifficultyFilter('Medium')}
              >
                Medium
              </Button>
              <Button
                variant={difficultyFilter === 'Hard' ? 'default' : 'outline'}
                onClick={() => setDifficultyFilter('Hard')}
              >
                Hard
              </Button>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <Card key={question.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{question.title}</CardTitle>
                    <CardDescription className="flex flex-wrap gap-2 items-center">
                      <Badge
                        variant={
                          question.difficulty === 'Easy'
                            ? 'default'
                            : question.difficulty === 'Medium'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {question.difficulty}
                      </Badge>
                      {question.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </CardDescription>
                  </div>
                  <Button asChild>
                    <a href={question.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Solve
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Asked by:</span>
                  <div className="flex space-x-1">
                    {question.companies.map((company, idx) => (
                      <span key={idx} className="text-2xl" title="Company">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No questions found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}