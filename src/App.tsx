import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import CompanyRounds from './pages/CompanyRounds';
import RolePreparation from './pages/RolePreparation';
import Practice from './pages/Practice';
import SvarPractice from './pages/SvarPractice';
import MockInterview from './pages/MockInterview';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { Footer } from '@/components/Footer';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/company/:companyId" element={<CompanyRounds />} />
              <Route path="/role/:roleId" element={<RolePreparation />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/svar-practice" element={<SvarPractice />} />
              <Route path="/mock-interview" element={<MockInterview />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;