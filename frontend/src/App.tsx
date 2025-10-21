import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import LoadingPage from "./pages/LoadingPage";
import AgentPage from "./pages/AgentPage";
import { HeroUIProvider } from '@heroui/react';
import './App.css';

function App() {
  return (
    <HeroUIProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/agent" element={<AgentPage />} />
        </Routes>
      </Router>
    </HeroUIProvider>
  )
}

export default App
