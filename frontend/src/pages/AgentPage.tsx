import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ChatBox } from "../components/ChatBox";
import { ChatInput } from "../components/ChatInput";
import { Button, Card, CardHeader, CardBody, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { motion } from "framer-motion";

interface ModalInfo {
    title: string;
    subtitle: string;
    img: string;
    description: string;
}

// TODO backend connection INSIGHTS
const modalData: ModalInfo[] = [
    { title: "Insight 1", subtitle: "Details about insight", img: "/img1.png", description: "Longer description"},
    { title: "Insight 2", subtitle: "Details about insight", img: "/img2.png", description: "Longer description"},
    { title: "Insight 3", subtitle: "Details about insight", img: "/img3.png", description: "Longer description"},
    { title: "Insight 4", subtitle: "Details about insight", img: "/img4.png", description: "Longer description"},
    { title: "Insight 5", subtitle: "Details about insight", img: "/img5.png", description: "Longer description"}
];

interface AgentPageProps {
    playerData: any;
}

export default function AgentPage({ playerData }: AgentPageProps) {
    // for chat
    const [messages, setMessages] = useState([
        {id: 1, sender: "agent", text: "Teemo: Hello summoner, how can I assist you?"},
    ]);

    const handleSend = (text: string) => {
        setMessages((prev) => [
            ...prev,
            { id: prev.length + 1, sender: "user", text: `You: ${text}` },
        ]);

        // TODO backend connection RAG AI Chatbot
        // const response = await fetch(...);
        // const data = await response.json();
        // setMessages(...);
    }

    // setTimeout used for example backend response, remove for production
    // setTimeout(() => {
    //     setMessages((prev) => [
    //         ...prev,
    //         {
    //             id: prev.length + 2,
    //             sender: "agent",
    //             text: "I've analyzed your recent matches -- you excel in early-lane skirmishes.",
    //         },
    //     ]);
    // }, 1000000);

    // for modals
    const [openModal, setOpenModal] = useState<number | null>(null);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#163358] to-black text-white">
            <Header />

            <main className="flex-grow p-6 flex flex-col items-center justify-center gap-8 pt-8">
                <h1 className="text-6xl font-bold mb-6 text-[#C79B3B]">Your 2025 recall</h1>
                <div className="flex flex-row w-full min-h-0 max-w-6xl gap-6">
                    {/* Chat section */}
                    <section className="flex flex-col flex-1 min-h-0 border border-gray-800 bg-gray-800/50 rounded-xl p-4 justify-between shadow-inner">
                        <ChatBox messages={messages} />
                        <ChatInput onSend={handleSend} />
                    </section>

                    {/* Card section */}
                    <section className="flex flex-col flex-1 gap-4">
                        {modalData.map((data, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Card isPressable onClick={() => setOpenModal(i)} shadow="sm" className="cursor-pointer bg-gray-800/50 hover:bg-gray-700 transition w-full">
                                    <CardHeader className="flex justify-between items-center">
                                        <h3 className="font-semibold text-lg text-[#C79B3B]">{data.title}</h3>
                                        <img src={data.img} alt={data.title} className="w-10 h-10 rounded-lg object-cover text-white" />
                                    </CardHeader>
                                    <CardBody>
                                        <p className="text-sm text-slate-300">{data.subtitle}</p>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        ))}
                    </section>
                </div>

                {/* Modals */}
                {modalData.map((data, i) => (
                    <Modal key={i} isOpen={openModal === i} className="bg-gray-800/95 text-white h-120" onOpenChange={() => setOpenModal(null)}>
                        <ModalContent>
                            <ModalHeader className="text-[#C79B3B]">{data.title}</ModalHeader>
                            <ModalBody>
                                <img src={data.img} alt={data.title} className="rounded-lg mb-3" />
                                <p>{data.description}</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button onPress={() => setOpenModal(null)} color="danger" variant="solid">Close</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                ))}
            </main>

            <Footer />
        </div>
    );
}