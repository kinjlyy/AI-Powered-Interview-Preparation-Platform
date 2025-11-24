import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Briefcase, Code, Mic, Video, User } from 'lucide-react';

const companies = [
  { id: 'google', name: 'Google', logo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png' },
  { id: 'microsoft', name: 'Microsoft', logo: '/images/Microsoft.jpg' },
  { id: 'amazon', name: 'Amazon', logo: '/images/Amazon.jpg' },
  { id: 'meta', name: 'Meta', logo: '/images/Meta.jpg' },
  { id: 'apple', name: 'Apple', logo: '/images/Apple.jpg' },
  { id: 'netflix', name: 'Netflix', logo: '/images/Netflix.jpg' },
];

const roles = [
  { id: 'frontend', name: 'Frontend Developer', icon: '💻' },
  { id: 'backend', name: 'Backend Developer', icon: '⚙️' },
  { id: 'fullstack', name: 'Full Stack Developer', icon: '🔧' },
  { id: 'devops', name: 'DevOps Engineer', icon: '🚀' },
  { id: 'data-scientist', name: 'Data Scientist', icon: '📊' },
  { id: 'product-manager', name: 'Product Manager', icon: '📋' },
];

export default function Index() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('companies');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                InterviewPrep Pro
              </span>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" onClick={() => navigate('/practice')}>
                <Code className="mr-2 h-4 w-4" />
                Practice
              </Button>
              <Button variant="ghost" onClick={() => navigate('/svar-practice')}>
                <Mic className="mr-2 h-4 w-4" />
                SVAR Round
              </Button>
              <Button variant="ghost" onClick={() => navigate('/mock-interview')}>
                <Video className="mr-2 h-4 w-4" />
                Mock Interview
              </Button>
              <Button variant="ghost" onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Master Your Interview Preparation
          </h1>
          <p className="text-xl text-gray-600">
            Practice company-specific questions or prepare by role
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="companies" className="text-lg">
              <Building2 className="mr-2 h-5 w-5" />
              Companies
            </TabsTrigger>
            <TabsTrigger value="roles" className="text-lg">
              <Briefcase className="mr-2 h-5 w-5" />
              Roles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="companies">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <Card
                  key={company.id}
                  className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 border-2 hover:border-indigo-500"
                  onClick={() => navigate(`/company/${company.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-center mb-4">
                      <img 
                        src={company.logo} 
                        alt={`${company.name} logo`}
                        className="h-16 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <span className="text-4xl hidden">
                        {company.name.charAt(0)}
                      </span>
                    </div>
                    <CardTitle className="text-2xl text-center">{company.name}</CardTitle>
                    <CardDescription className="text-center">Click to view interview rounds</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Start Preparation
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="roles">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role) => (
                <Card
                  key={role.id}
                  className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 border-2 hover:border-purple-500"
                  onClick={() => navigate(`/role/${role.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <span className="text-4xl">{role.icon}</span>
                      <div>
                        <CardTitle className="text-xl">{role.name}</CardTitle>
                        <CardDescription>View preparation roadmap</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Explore Role
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}