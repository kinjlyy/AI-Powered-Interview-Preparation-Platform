import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, ExternalLink } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Skill {
  name: string;
  level: number;
}

interface Topic {
  category: string;
  items: string[];
}

interface Resource {
  name: string;
  url: string;
}

interface Company {
  id: string;
  name: string;
  logo: string;
}

interface Role {
  name: string;
  icon: string;
  description: string;
  skills: Skill[];
  topics: Topic[];
  resources: Resource[];
  hiringCompanies: Company[];
}

const roleData: Record<string, Role> = {
  frontend: {
    name: 'Frontend Developer',
    icon: '💻',
    description: 'Build beautiful and responsive user interfaces',
    skills: [
      { name: 'HTML/CSS', level: 90 },
      { name: 'JavaScript/TypeScript', level: 85 },
      { name: 'React/Vue/Angular', level: 80 },
      { name: 'Responsive Design', level: 85 },
      { name: 'Web Performance', level: 75 },
    ],
    topics: [
      {
        category: 'Core Technologies',
        items: [
          'HTML5 semantic elements',
          'CSS Grid and Flexbox',
          'JavaScript ES6+ features',
          'TypeScript fundamentals',
        ],
      },
      {
        category: 'Frameworks & Libraries',
        items: [
          'React hooks and state management',
          'Component lifecycle',
          'Redux/Context API',
          'Next.js/Gatsby',
        ],
      },
      {
        category: 'Tools & Best Practices',
        items: [
          'Git version control',
          'Webpack/Vite bundlers',
          'Testing (Jest, React Testing Library)',
          'Accessibility (WCAG)',
        ],
      },
    ],
    resources: [
      { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/' },
      { name: 'React Official Documentation', url: 'https://react.dev/' },
      { name: 'Frontend Masters', url: 'https://frontendmasters.com/' },
      { name: 'CSS-Tricks', url: 'https://css-tricks.com/' },
    ],
    hiringCompanies: [
      { id: 'google', name: 'Google', logo: '/images/Google.svg' },
      { id: 'meta', name: 'Meta', logo: '/images/Meta.jpg' },
      { id: 'netflix', name: 'Netflix', logo: '/images/Netflix.jpg' },
      { id: 'amazon', name: 'Amazon', logo: '/images/Amazon.jpg' },
    ],
  },
  backend: {
    name: 'Backend Developer',
    icon: '⚙️',
    description: 'Design and build scalable server-side applications',
    skills: [
      { name: 'Server-side Languages', level: 85 },
      { name: 'Database Management', level: 80 },
      { name: 'API Design', level: 85 },
      { name: 'System Architecture', level: 75 },
      { name: 'Security', level: 80 },
    ],
    topics: [
      {
        category: 'Programming Languages',
        items: ['Node.js/Express', 'Python/Django', 'Java/Spring Boot', 'Go'],
      },
      {
        category: 'Databases',
        items: ['SQL (PostgreSQL, MySQL)', 'NoSQL (MongoDB, Redis)', 'Database design', 'Query optimization'],
      },
      {
        category: 'API & Architecture',
        items: ['RESTful APIs', 'GraphQL', 'Microservices', 'Message queues'],
      },
    ],
    resources: [
      { name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
      { name: 'Database Internals', url: 'https://www.databass.dev/' },
      { name: 'Designing Data-Intensive Applications', url: 'https://dataintensive.net/' },
      { name: 'Node.js Documentation', url: 'https://nodejs.org/docs/' },
    ],
    hiringCompanies: [
      { id: 'amazon', name: 'Amazon', logo: '/images/Amazon.jpg' },
      { id: 'microsoft', name: 'Microsoft', logo: '/images/Microsoft.jpg' },
      { id: 'google', name: 'Google', logo: '/images/Google.svg' },
      { id: 'apple', name: 'Apple', logo: '/images/Apple.jpg' },
    ],
  },
  fullstack: {
    name: 'Full Stack Developer',
    icon: '🔧',
    description: 'Master both frontend and backend development',
    skills: [
      { name: 'Frontend Technologies', level: 80 },
      { name: 'Backend Technologies', level: 80 },
      { name: 'Database Management', level: 75 },
      { name: 'DevOps Basics', level: 70 },
      { name: 'System Design', level: 75 },
    ],
    topics: [
      {
        category: 'Frontend',
        items: ['React/Vue', 'State Management', 'Responsive Design', 'Web APIs'],
      },
      {
        category: 'Backend',
        items: ['Node.js/Python', 'RESTful APIs', 'Authentication', 'Database integration'],
      },
      {
        category: 'DevOps & Deployment',
        items: ['Docker basics', 'CI/CD pipelines', 'Cloud platforms (AWS/Azure)', 'Monitoring'],
      },
    ],
    resources: [
      { name: 'Full Stack Open', url: 'https://fullstackopen.com/' },
      { name: 'The Odin Project', url: 'https://www.theodinproject.com/' },
      { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/' },
      { name: 'Web.dev', url: 'https://web.dev/' },
    ],
    hiringCompanies: [
      { id: 'google', name: 'Google', logo: '/images/Google.svg' },
      { id: 'amazon', name: 'Amazon', logo: '/images/Amazon.jpg' },
      { id: 'microsoft', name: 'Microsoft', logo: '/images/Microsoft.jpg' },
      { id: 'meta', name: 'Meta', logo: '/images/Meta.jpg' },
    ],
  },
  devops: {
    name: 'DevOps Engineer',
    icon: '🚀',
    description: 'Automate and optimize software delivery',
    skills: [
      { name: 'CI/CD', level: 85 },
      { name: 'Cloud Platforms', level: 80 },
      { name: 'Containerization', level: 85 },
      { name: 'Infrastructure as Code', level: 80 },
      { name: 'Monitoring', level: 75 },
    ],
    topics: [
      {
        category: 'Core Concepts',
        items: ['Linux administration', 'Networking basics', 'Version control', 'Scripting (Bash, Python)'],
      },
      {
        category: 'Tools & Platforms',
        items: ['Docker & Kubernetes', 'Jenkins/GitLab CI', 'Terraform/Ansible', 'AWS/Azure/GCP'],
      },
      {
        category: 'Practices',
        items: ['Continuous Integration', 'Continuous Deployment', 'Infrastructure monitoring', 'Security best practices'],
      },
    ],
    resources: [
      { name: 'DevOps Roadmap', url: 'https://roadmap.sh/devops' },
      { name: 'Kubernetes Documentation', url: 'https://kubernetes.io/docs/' },
      { name: 'AWS Certified DevOps', url: 'https://aws.amazon.com/certification/certified-devops-engineer-professional/' },
      { name: 'Docker Documentation', url: 'https://docs.docker.com/' },
    ],
    hiringCompanies: [
      { id: 'amazon', name: 'Amazon', logo: '/images/Amazon.jpg' },
      { id: 'google', name: 'Google', logo: '/images/Google.svg' },
      { id: 'microsoft', name: 'Microsoft', logo: '/images/Microsoft.jpg' },
      { id: 'netflix', name: 'Netflix', logo: '/images/Netflix.jpg' },
    ],
  },
  'data-scientist': {
    name: 'Data Scientist',
    icon: '📊',
    description: 'Extract insights from data using analytics and ML',
    skills: [
      { name: 'Python/R', level: 85 },
      { name: 'Statistics', level: 80 },
      { name: 'Machine Learning', level: 85 },
      { name: 'Data Visualization', level: 75 },
      { name: 'SQL', level: 80 },
    ],
    topics: [
      {
        category: 'Programming & Tools',
        items: ['Python (NumPy, Pandas)', 'Jupyter Notebooks', 'SQL queries', 'Git'],
      },
      {
        category: 'Statistics & ML',
        items: ['Probability & Statistics', 'Supervised Learning', 'Unsupervised Learning', 'Deep Learning basics'],
      },
      {
        category: 'Data Engineering',
        items: ['Data cleaning', 'Feature engineering', 'ETL pipelines', 'Big Data tools (Spark)'],
      },
    ],
    resources: [
      { name: 'Kaggle', url: 'https://www.kaggle.com/' },
      { name: 'Coursera ML Specialization', url: 'https://www.coursera.org/specializations/machine-learning-introduction' },
      { name: 'Fast.ai', url: 'https://www.fast.ai/' },
      { name: 'Scikit-learn Documentation', url: 'https://scikit-learn.org/' },
    ],
    hiringCompanies: [
      { id: 'google', name: 'Google', logo: '/images/Google.svg' },
      { id: 'meta', name: 'Meta', logo: '/images/Meta.jpg' },
      { id: 'amazon', name: 'Amazon', logo: '/images/Amazon.jpg' },
      { id: 'microsoft', name: 'Microsoft', logo: '/images/Microsoft.jpg' },
    ],
  },
  'product-manager': {
    name: 'Product Manager',
    icon: '📋',
    description: 'Drive product strategy and execution',
    skills: [
      { name: 'Product Strategy', level: 85 },
      { name: 'User Research', level: 80 },
      { name: 'Data Analysis', level: 75 },
      { name: 'Communication', level: 90 },
      { name: 'Technical Knowledge', level: 70 },
    ],
    topics: [
      {
        category: 'Product Management',
        items: ['Product lifecycle', 'Roadmap planning', 'Prioritization frameworks', 'Stakeholder management'],
      },
      {
        category: 'User-Centric Design',
        items: ['User research methods', 'Persona development', 'User journey mapping', 'A/B testing'],
      },
      {
        category: 'Business & Analytics',
        items: ['Market analysis', 'Metrics & KPIs', 'Business models', 'Competitive analysis'],
      },
    ],
    resources: [
      { name: 'Cracking the PM Interview', url: 'https://www.crackingthepminterview.com/' },
      { name: 'Product School', url: 'https://productschool.com/' },
      { name: 'Mind the Product', url: 'https://www.mindtheproduct.com/' },
      { name: 'Product Coalition', url: 'https://productcoalition.com/' },
    ],
    hiringCompanies: [
      { id: 'google', name: 'Google', logo: '/images/Google.svg' },
      { id: 'meta', name: 'Meta', logo: '/images/Meta.jpg' },
      { id: 'amazon', name: 'Amazon', logo: '/images/Amazon.jpg' },
      { id: 'apple', name: 'Apple', logo: '/images/Apple.jpg' },
    ],
  },
};

export default function RolePreparation() {
  const { roleId } = useParams();
  const navigate = useNavigate();

  const role = roleId ? roleData[roleId] : null;

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Role not found</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <span className="text-3xl">{role.icon}</span>
              <span className="text-2xl font-bold">{role.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{role.name} Preparation</h1>
          <p className="text-xl text-gray-600">{role.description}</p>
        </div>

        {/* Required Skills */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Required Skills</CardTitle>
            <CardDescription>Master these skills to excel in this role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {role.skills.map((skill: Skill, index: number) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm text-gray-600">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Topics to Study */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {role.topics.map((topic: Topic, index: number) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{topic.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {topic.items.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Learning Resources */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Recommended Resources</CardTitle>
            <CardDescription>Top resources to accelerate your learning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {role.resources.map((resource: Resource, index: number) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 hover:border-indigo-500 transition-all"
                >
                  <span className="font-medium">{resource.name}</span>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Companies Hiring for This Role */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Companies Hiring for This Role</CardTitle>
            <CardDescription>Top companies actively recruiting {role.name}s</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {role.hiringCompanies.map((company: Company) => (
                <div
                  key={company.id}
                  className="flex flex-col items-center justify-center p-4 border rounded-lg hover:shadow-lg hover:border-indigo-500 transition-all cursor-pointer"
                  onClick={() => navigate(`/company/${company.id}`)}
                >
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-12 w-auto object-contain mb-2"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                  <span className="text-2xl font-bold text-indigo-600 hidden">
                    {company.name.charAt(0)}
                  </span>
                  <span className="text-sm font-medium text-center mt-2">{company.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}