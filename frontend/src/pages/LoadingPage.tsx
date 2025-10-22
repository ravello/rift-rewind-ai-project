import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LoadingPage() {
    const navigate = useNavigate();

    React.useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/agent");
        }, 3000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <>
            <Header />
            <div>Loading...</div>
            <Footer />
        </>
    );
}