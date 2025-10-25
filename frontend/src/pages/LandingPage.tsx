import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Form, Input, Button } from "@heroui/react";

interface LandingPageProps {
    setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
}

const LandingPage: React.FC<LandingPageProps> = ({ setIsAuthorized }) => {
    const navigate = useNavigate();

    async function handleSearch() {
        // TODO backend connection
        // FIND AND VALIDATE ACCOUNT RIOT API
        // SET STATE(S) from App.tsx
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#163358] to-black text-white">
            <Header />

            <main className="flex flex-col items-center justify-center flex-grow px-4">
                <h1 className="text-[#C79B3B] text-9xl font-bold mb-6">Recall</h1>
                <Form className="w-full max-w-md space-y-4" action="" method="post">
                    <Input label="Game name" fullWidth isRequired />
                    <Input label="Tagline (e.g., #NA1, #ABC1)" fullWidth isRequired />
                    <Button onPress={handleSearch} className="w-full mt-4 bg-[#C79B3B] text-black hover:cursor-pointer hover:bg-cyan-200">Search</Button>
                </Form>
            </main>

            <Footer />
        </div>
    );
}

export default LandingPage;