import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";

import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";

import ClientDashboard from "./pages/client/ClientDashboard.tsx";
import ClientProjects from "./pages/client/ClientProjects.tsx";
import AIRecommend from "./pages/client/AIRecommend.tsx";
import ClientProgress from "./pages/client/ClientProgress.tsx";
import ChatPage from "./pages/ChatPage.tsx";

import ContractorDashboard from "./pages/contractor/ContractorDashboard.tsx";
import ContractorProjects from "./pages/contractor/ContractorProjects.tsx";
import ContractorUpload from "./pages/contractor/ContractorUpload.tsx";

import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import AdminProjects from "./pages/admin/AdminProjects.tsx";
import AdminMaterials from "./pages/admin/AdminMaterials.tsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" theme="dark" />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Client */}
            <Route element={<ProtectedRoute roles={["client"]} />}>
              <Route element={<AppLayout />}>
                <Route path="/client" element={<ClientDashboard />} />
                <Route path="/client/projects" element={<ClientProjects />} />
                <Route path="/client/recommend" element={<AIRecommend />} />
                <Route path="/client/progress" element={<ClientProgress />} />
                <Route path="/client/chat" element={<ChatPage role="client" />} />
              </Route>
            </Route>

            {/* Contractor */}
            <Route element={<ProtectedRoute roles={["contractor"]} />}>
              <Route element={<AppLayout />}>
                <Route path="/contractor" element={<ContractorDashboard />} />
                <Route path="/contractor/projects" element={<ContractorProjects />} />
                <Route path="/contractor/upload" element={<ContractorUpload />} />
                <Route path="/contractor/chat" element={<ChatPage role="contractor" />} />
              </Route>
            </Route>

            {/* Admin */}
            <Route element={<ProtectedRoute roles={["admin"]} />}>
              <Route element={<AppLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/projects" element={<AdminProjects />} />
                <Route path="/admin/materials" element={<AdminMaterials />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
