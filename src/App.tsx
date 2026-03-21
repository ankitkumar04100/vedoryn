import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import DashboardLayout from "./components/dashboard/DashboardLayout.tsx";
import DashboardOverview from "./pages/dashboard/DashboardOverview.tsx";
import CareerScorePage from "./pages/dashboard/CareerScorePage.tsx";
import RoadmapPage from "./pages/dashboard/RoadmapPage.tsx";
import InterviewsPage from "./pages/dashboard/InterviewsPage.tsx";
import JobsPage from "./pages/dashboard/JobsPage.tsx";
import StudyPlannerPage from "./pages/dashboard/StudyPlannerPage.tsx";
import ScholarshipsPage from "./pages/dashboard/ScholarshipsPage.tsx";
import MentorsPage from "./pages/dashboard/MentorsPage.tsx";
import ProofLayerPage from "./pages/dashboard/ProofLayerPage.tsx";
import WellnessPage from "./pages/dashboard/WellnessPage.tsx";
import GamificationPage from "./pages/dashboard/GamificationPage.tsx";
import RecruiterPage from "./pages/dashboard/RecruiterPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="career-score" element={<CareerScorePage />} />
            <Route path="roadmap" element={<RoadmapPage />} />
            <Route path="interviews" element={<InterviewsPage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="study" element={<StudyPlannerPage />} />
            <Route path="scholarships" element={<ScholarshipsPage />} />
            <Route path="mentors" element={<MentorsPage />} />
            <Route path="proof" element={<ProofLayerPage />} />
            <Route path="wellness" element={<WellnessPage />} />
            <Route path="gamification" element={<GamificationPage />} />
            <Route path="recruiter" element={<RecruiterPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
