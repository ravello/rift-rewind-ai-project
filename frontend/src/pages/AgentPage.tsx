import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Textarea, Input, Button, Card, CardHeader, CardBody, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { motion } from "framer-motion";

interface ModalInfo {
    title: string;
    text: string;
    img: string;
}

const modalData: ModalInfo[] = [
    { title: "Insight 1", text: "Details about insight", img: "/img1.png"},
    { title: "Insight 2", text: "Details about insight", img: "/img2.png"},
    { title: "Insight 3", text: "Details about insight", img: "/img3.png"},
    { title: "Insight 4", text: "Details about insight", img: "/img4.png"},
    { title: "Insight 5", text: "Details about insight", img: "/img5.png"}
];

export default function AgentPage() {
    const [openModal, setOpenModal] = useState<number | null>(null);
    const [userInput, setUserInput] = useState("");
    const [messages, setMessages] = useState<string[]>(["Teemo: Wow! What a year. Ask me anything."]);

    const handleSend = () => {
        if (!userInput.trim()) return;
        setMessages((prev) => [...prev, `You: ${userInput}`, `Agent: Thinking about "${userInput}"...`]);
        setUserInput("");
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 to-black text-white">
            <Header />

            <main className="flex-grow p-6 flex flex-col items-center gap-8 pt-8">
                <h1 className="text-6xl font-bold mb-6">Your 2025 recall</h1>
                <div className="flex flex-row w-full max-w-6xl gap-6">
                    {/* Chat section */}
                    <section className="flex flex-col flex-1 bg-slate-800/50 rounded-2xl p-4 justify-between">
                        <Textarea
                            value={messages.join("\n")}
                            readOnly
                            className="h-125 text-sm mb-4 resize-none bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white"
                        />
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Ask Teemo something..."
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                className="flex-1" 
                            />
                            <Button onPress={handleSend} color="primary">Send</Button>
                        </div>
                    </section>

                    {/* Card section */}
                    <section className="flex flex-col flex-1 gap-4">
                        {modalData.map((data, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Card isPressable onClick={() => setOpenModal(i)} shadow="sm" className="cursor-pointer bg-slate-800 hover:bg-slate-700 transition w-full">
                                    <CardHeader className="flex justify-between items-center">
                                        <h3 className="font-semibold text-lg">{data.title}</h3>
                                        <img src={data.img} alt={data.title} className="w-10 h-10 rounded-lg object-cover" />
                                    </CardHeader>
                                    <CardBody>
                                        <p className="text-sm text-slate-300">{data.text}</p>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        ))}
                    </section>
                </div>

                {/* Modals */}
                {modalData.map((data, i) => (
                    <Modal key={i} isOpen={openModal === i} onOpenChange={() => setOpenModal(null)}>
                        <ModalContent>
                            <ModalHeader>{data.title}</ModalHeader>
                            <ModalBody>
                                <img src={data.img} alt={data.title} className="rounded-lg mb-3" />
                                <p>{data.text}</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button onPress={() => setOpenModal(null)} color="danger" variant="light">Close</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                ))}
            </main>

            <Footer />
        </div>
    );
}