import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Target, Clock, TrendingUp } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    questionsAttempted: 0,
    questionsCompleted: 0,
    starAnswersSaved: 0,
    mockInterviewsCompleted: 0,
    totalTimeSpent: 0,
    streak: 0,
  });

  useEffect(() => {
    // Load stats from localStorage
    const savedAnswers = JSON.parse(localStorage.getItem('starAnswers') || '{}');
    setStats({
      questionsAttempted: 25,
      questionsCompleted: 18,
      starAnswersSaved: Object.keys(savedAnswers).length,
      mockInterviewsCompleted: 3,
      totalTimeSpent: 1250,
      streak: 5,
    });
  }, []);

  const completionRate = stats.questionsAttempted > 0 
    ? Math.round((stats.questionsCompleted / stats.questionsAttempted) * 100)
    : 0;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const achievements = [
    { name: 'First Steps', description: 'Completed your first question', unlocked: true },
    { name: 'Quick Learner', description: 'Solved 10 problems', unlocked: true },
    { name: 'STAR Student', description: 'Saved 5 STAR answers', unlocked: stats.starAnswersSaved >= 5 },
    { name: 'Interview Ready', description: 'Completed 3 mock interviews', unlocked: stats.mockInterviewsCompleted >= 3 },
    { name: 'Consistency King', description: '7-day streak', unlocked: stats.streak >= 7 },
    { name: 'Problem Solver', description: 'Solved 50 problems', unlocked: false },
  ];

  const recentActivity = [
    { date: '2025-11-15', activity: 'Completed Google Aptitude Round', type: 'practice' },
    { date: '2025-11-14', activity: 'Saved STAR answer for leadership question', type: 'star' },
    { date: '2025-11-13', activity: 'Completed Mock Interview', type: 'interview' },
    { date: '2025-11-12', activity: 'Solved Two Sum on LeetCode', type: 'coding' },
    { date: '2025-11-11', activity: 'Explored Frontend Developer role', type: 'learning' },
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
            <span className="text-2xl font-bold">My Profile</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Questions Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.questionsCompleted}</div>
              <Progress value={completionRate} className="mt-2" />
              <p className="text-xs text-gray-600 mt-1">{completionRate}% completion rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-500 mr-2" />
                <div className="text-3xl font-bold">{stats.streak} days</div>
              </div>
              <p className="text-xs text-gray-600 mt-2">Keep it up!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Time Invested</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-500 mr-2" />
                <div className="text-3xl font-bold">{formatTime(stats.totalTimeSpent)}</div>
              </div>
              <p className="text-xs text-gray-600 mt-2">Total practice time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Mock Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Target className="h-8 w-8 text-green-500 mr-2" />
                <div className="text-3xl font-bold">{stats.mockInterviewsCompleted}</div>
              </div>
              <p className="text-xs text-gray-600 mt-2">Completed sessions</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                Achievements
              </CardTitle>
              <CardDescription>Your milestones and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-3 p-3 rounded-lg ${
                      achievement.unlocked ? 'bg-green-50' : 'bg-gray-50 opacity-60'
                    }`}
                  >
                    <Trophy
                      className={`h-6 w-6 mt-0.5 ${
                        achievement.unlocked ? 'text-yellow-500' : 'text-gray-400'
                      }`}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{achievement.name}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                    {achievement.unlocked && (
                      <Badge variant="default">Unlocked</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest practice sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">{item.activity}</p>
                      <p className="text-sm text-gray-600">{item.date}</p>
                    </div>
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills Progress */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Skills Progress</CardTitle>
            <CardDescription>Track your improvement across different areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { skill: 'Data Structures & Algorithms', progress: 65 },
                { skill: 'System Design', progress: 45 },
                { skill: 'Behavioral Questions', progress: 80 },
                { skill: 'Coding Speed', progress: 55 },
                { skill: 'Problem Solving', progress: 70 },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{item.skill}</span>
                    <span className="text-sm text-gray-600">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}