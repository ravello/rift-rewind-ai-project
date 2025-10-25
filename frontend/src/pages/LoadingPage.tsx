import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Spinner } from "@heroui/react";

export default function LoadingPage() {
    const navigate = useNavigate();

    React.useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/agent");
        }, 3000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#163358] to-black text-white">
            <Header />

            <main className="flex flex-col items-center justify-center flex-grow px-4">
                <Spinner size="lg" />
                <p>Loading...</p>
            </main>

            <Footer />
        </div>
    );
}