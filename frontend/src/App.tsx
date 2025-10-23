import { HeroUIProvider } from '@heroui/react';
import { BrowserRouter as BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import LoadingPage from "./pages/LoadingPage";
import AgentPage from "./pages/AgentPage";

function App() {
  const isAuthorized = true;

  return (
    <HeroUIProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/loading" element={isAuthorized ? <LoadingPage /> : <Navigate to="/" />} />
          <Route path="/agent" element={isAuthorized ? <AgentPage /> : <Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </HeroUIProvider>
  );
}

export default App
