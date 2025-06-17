import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";

// Components
import WelcomeScreen from "@/components/WelcomeScreen";
import TopBar from "@/components/TopBar";
import BottomNavigation from "@/components/BottomNavigation";

// Pages
import Dashboard from "@/pages/Dashboard";
import Wallet from "@/pages/Wallet";
import Winners from "@/pages/Winners";
import Earn from "@/pages/Earn";
import Profile from "@/pages/Profile";
import Tournaments from "@/pages/Tournaments";
import Auth from "@/pages/Auth";
import Help from "@/pages/Help";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";
import PaymentSuccess from "@/pages/PaymentSuccess";
import About from "@/pages/About";
import Terms from "@/pages/Terms";
import RefundPolicy from "@/pages/RefundPolicy";

function AppContent() {
  const { isLoggedIn, isLoading } = useAuth();
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedGameId, setSelectedGameId] = useState<number | undefined>();

  // Check if user has seen welcome screen before
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('kirda_seen_welcome');
    if (hasSeenWelcome) {
      setShowWelcome(false);
    }
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    localStorage.setItem('kirda_seen_welcome', 'true');
  };

  const handleNavigate = (page: string, gameId?: number) => {
    setCurrentPage(page);
    if (gameId) {
      setSelectedGameId(gameId);
    }
  };

  const handleBack = () => {
    setCurrentPage('home');
    setSelectedGameId(undefined);
  };

  // Show welcome screen first
  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!isLoggedIn) {
    return <Auth />;
  }

  // Main app interface
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <TopBar 
        onWalletClick={() => handleNavigate('wallet')} 
        onNotificationClick={() => {}} 
      />

      <main className="p-4">
        {currentPage === 'home' && (
          <Dashboard 
            onNavigate={handleNavigate}
            onDeposit={() => {}} 
            onWithdraw={() => {}} 
          />
        )}
        {currentPage === 'wallet' && <Wallet />}
        {currentPage === 'winners' && <Winners />}
        {currentPage === 'earn' && <Earn />}
        {currentPage === 'profile' && <Profile onNavigate={handleNavigate} />}
        {currentPage === 'tournaments' && (
          <Tournaments gameId={selectedGameId} onBack={handleBack} />
        )}
        {currentPage === 'help' && <Help onBack={handleBack} />}
        {currentPage === 'admin' && <Admin />}
      </main>

      <BottomNavigation 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
      />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin" component={() => <Admin />} />
      <Route path="/payment-success" component={() => <PaymentSuccess />} />
      <Route path="/about" component={() => <About />} />
      <Route path="/terms" component={() => <Terms />} />
      <Route path="/refund-policy" component={() => <RefundPolicy />} />
      <Route component={AppContent} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;