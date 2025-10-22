import Header from "../components/Header";
import Footer from "../components/Footer";
import { Form, Input, Button } from "@heroui/react";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-950 to-black text-white">
            <Header />

            <main className="flex flex-col items-center justify-center flex-grow px-4">
                <h1 className="text-cyan-400 text-9xl font-bold mb-6">Recall</h1>
                <Form className="w-full max-w-md space-y-4" action="" method="post">
                    <Input label="Game name" fullWidth isRequired />
                    <Input label="Tagline (e.g., #NA1)" fullWidth isRequired />
                    <Button className="w-full mt-4 bg-cyan-400 text-black hover:cursor-pointer hover:bg-cyan-200">Search</Button>
                </Form>
            </main>

            <Footer />
        </div>
    );
}