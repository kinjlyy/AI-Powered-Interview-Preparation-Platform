import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Briefcase, Code, Mic, Video, User, Search } from 'lucide-react';

const companies = [
  { id: 'google', name: 'Google', logo: '/images/Google.svg' },
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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMockInterview = (companyId: string) => {
    navigate(`/mock-interview?company=${companyId}`);
  };

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
              <Button variant="ghost" onClick={() => navigate('/questions')}>
                <Code className="mr-2 h-4 w-4" />
                Questions
              </Button>
              {/* Practice link removed as requested */}
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
            <div className="mb-6 max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCompanies.map((company) => (
                <Card
                  key={company.id}
                  className="hover:shadow-lg transition-all border-2 hover:border-indigo-500"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                        <img 
                          src={company.logo} 
                          alt={`${company.name} logo`}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                        />
                        <span className="text-3xl font-bold text-indigo-600 hidden">
                          {company.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-semibold mb-1">{company.name}</h3>
                        <p className="text-sm text-gray-500">Prepare for your interview</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1" 
                        variant="outline"
                        onClick={() => navigate(`/company/${company.id}`)}
                      >
                        Start Practicing
                      </Button>
                      <Button 
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700" 
                        onClick={() => handleMockInterview(company.id)}
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Mock Interview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCompanies.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No companies found matching "{searchQuery}"</p>
              </div>
            )}
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