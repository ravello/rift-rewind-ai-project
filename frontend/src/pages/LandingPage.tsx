import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Spinner, Input, Button } from "@heroui/react";

interface LandingPageProps {
    onSuccess: (data: any) => void;
}

function LandingPage ({ onSuccess }: LandingPageProps) {
    const [gameName, setGameName] = useState("");
    const [tagline, setTagline] = useState("");
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
            // TODO: Call AWS Lambda endpoint via API Gateway to get Riot account
            // Replace this URL with something that works
            const response = await fetch(`https://your-api-gateway-id.execute-api.us-east-1.amazonaws.com/api/do_something`);  

            if (!response.ok) {
                throw new Error("Account not found.");
            }
        
            // TODO: FOR TESTING, REMOVE FOR PRODUCTION
            // await new Promise((resolve) => setTimeout(resolve, 5000));

            const data = await response.json();

            onSuccess(data);  // update parent state, this sets authorized to true

            navigate("/agent");  // go to agent page
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Error.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col min-h-screen w-full bg-cover bg-center bg-gradient-to-br from-[#163358] to-black text-white"
        style={{
            backgroundImage: "url('/riot-bg.jpg')",
        }}
        >
            <Header />

            <main className="flex flex-col items-center justify-center flex-grow px-4">
                <h1 className="text-[#C79B3B] text-9xl font-bold mb-6">Recall</h1>
                <Input 
                    className="max-w-md mb-4" 
                    label="Game name" 
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    disabled={loading}
                    fullWidth 
                    isRequired 
                />
                <Input 
                    className="max-w-md mb-4" 
                    label="Tagline (e.g., #NA1, #ABC1)"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    disabled={loading} 
                    fullWidth 
                    isRequired 
                />
                {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
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