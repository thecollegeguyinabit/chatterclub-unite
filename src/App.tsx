
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClubifyProvider } from "@/context/ClubifyContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import CreateClub from "./pages/CreateClub";
import MyClubs from "./pages/MyClubs";
import ClubDetail from "./pages/ClubDetail";
import ClubChat from "./pages/ClubChat";
import ChatDirectory from "./pages/ChatDirectory";
import DirectChat from "./pages/DirectChat";
import NotFound from "./pages/NotFound";
import ClubSettings from "./pages/ClubSettings";
import ClubMembers from "./pages/ClubMembers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <ClubifyProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/explore" element={<Explore />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/create-club" element={<CreateClub />} />
                <Route path="/my-clubs" element={<MyClubs />} />
                <Route path="/club/:clubId" element={<ClubDetail />} />
                <Route path="/club/:clubId/chat" element={<ClubChat />} />
                <Route path="/club/:clubId/chat/:channelId" element={<ClubChat />} />
                <Route path="/club/:clubId/settings" element={<ClubSettings />} />
                <Route path="/club/:clubId/members" element={<ClubMembers />} />
                <Route path="/chat" element={<ChatDirectory />} />
                <Route path="/chat/:userId" element={<DirectChat />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ClubifyProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
