import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Spinner, Input, Button } from "@heroui/react";

interface LandingPageProps {
  onSuccess: (data: any) => void;
}

function LandingPage({ onSuccess }: LandingPageProps) {
  const [gameName, setGameName] = useState("");
  const [tagline, setTagline] = useState("#");
  const [region, setRegion] = useState("americas");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSearch() {
    if (!gameName || !tagline) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // POST request to API Gateway Lambda function
      const response = await fetch(
        `https://n78kw0j1a4.execute-api.us-east-2.amazonaws.com/dev/lambda-endpoint`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            riotId: `${gameName}${tagline}`,
            region: `${region}`,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Account not found.");
      }

      // USED FOR TESTING, REMOVE FOR PRODUCTION
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      // const fakeData = {
      //     name: "hideonbush",
      //     tagline,
      //     level: 45,
      //     rank: "Gold 2",
      // };

      const data = await response.json();

      if (data.statusCode && data.statusCode !== 200) {
        throw new Error(data.message || "Account not found.");
      }

      onSuccess(data); // update parent state, this sets isAuthorized (App.tsx) to true

      navigate("/agent"); // go to agent page
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex flex-col min-h-screen w-full bg-cover bg-center bg-gradient-to-br from-[#163358] to-black text-white"
      style={{
        backgroundImage: "url('/riot-bg.jpg')",
      }}
    >
      <Header />

      <main className="flex flex-col items-center justify-center flex-grow px-4">
        <h1 className="text-[#C79B3B] text-9xl font-bold mb-6">Recall</h1>
        <div className="max-w-md w-full mb-4 inline-flex">
          <Input
            className="max-w-2/3 mr-2"
            label="Game name"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            disabled={loading}
            fullWidth
            isRequired
          />
          <Input
            className="max-w-1/3"
            label="Tagline (e.g., #NA1)"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            disabled={loading}
            fullWidth
            isRequired
          />
        </div>
        <div className="max-w-2xs w-full mb-6">
          <label className="block mb-1">Region</label>
          <select
            className="w-full p-2 rounded bg-gray-800 text-white"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            disabled={loading}
          >
            <option value="americas">Americas</option>
            <option value="asia">Korea & Japan</option>
            <option value="europe">Europe & Middle East</option>
            <option value="sea">Rest of Asia & Oceania</option>
          </select>
        </div>
        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}
        <Button
          className="max-w-md w-full bg-[#C79B3B] text-black hover:cursor-pointer hover:bg-cyan-200"
          onPress={handleSearch}
        >
          {loading ? <Spinner color="primary" size="md" /> : "Search"}
        </Button>
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;
