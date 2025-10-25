import { useState } from 'react';
import { HeroUIProvider } from '@heroui/react';
import { BrowserRouter as BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import LoadingPage from "./pages/LoadingPage";
import AgentPage from "./pages/AgentPage";

function App() {
  const [isAuthorized, setIsAuthorized] = useState(true);  // placeholder, set to false when in production

  return (
    <HeroUIProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage setIsAuthorized={setIsAuthorized} />} />
          <Route path="/loading" element={isAuthorized ? <LoadingPage /> : <Navigate to="/" replace />} />
          <Route path="/agent" element={isAuthorized ? <AgentPage /> : <Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HeroUIProvider>
  );
}

export default App
