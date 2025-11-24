import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Skill {
  name: string;
  level: number;
}

interface Topic {
  category: string;
  items: string[];
}

interface Role {
  name: string;
  icon: string;
  description: string;
  skills: Skill[];
  topics: Topic[];
  resources: string[];
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
      'MDN Web Docs',
      'React Official Documentation',
      'Frontend Masters',
      'CSS-Tricks',
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
      'System Design Primer',
      'Database Internals',
      'Designing Data-Intensive Applications',
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
      'Full Stack Open',
      'The Odin Project',
      'freeCodeCamp',
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
      'DevOps Roadmap',
      'Kubernetes Documentation',
      'AWS Certified DevOps',
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
      'Kaggle',
      'Coursera ML Specialization',
      'Fast.ai',
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
      'Cracking the PM Interview',
      'Product School',
      'Mind the Product',
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
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Recommended Resources</CardTitle>
            <CardDescription>Top resources to accelerate your learning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {role.resources.map((resource: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-base px-4 py-2">
                  {resource}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}