import { useState } from 'react';
import { HeroUIProvider } from '@heroui/react';
import { BrowserRouter as BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import AgentPage from "./pages/AgentPage";

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  return (
    <HeroUIProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage onSuccess={(data) => {
              setPlayerData(data);
              setIsAuthorized(true);
            }} />} 
          />
          <Route path="/agent" element={isAuthorized ? <AgentPage playerData={playerData} /> : <Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </HeroUIProvider>
  );
}

export default App
