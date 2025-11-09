import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ChatBox } from "../components/ChatBox";
import { ChatInput } from "../components/ChatInput";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { motion } from "framer-motion";
import { ShareButtons } from "../components/ShareButtons";

interface ModalInfo {
  title: string;
  subtitle: string;
  thumbnail_art: string;
  splash_art: string;
  description: string;
}

// This is fake data that I pass for the modals
// The API must return an Array of 5 objects so that modalData.map() is called correctly
// Configure the LandingPage.tsx to call the correct API Gateway endpoint
// BACKEND TODO: Delete this fake data once we have a working API endpoint
const modalData: ModalInfo[] = [
  {
    title: "Insight 1",
    subtitle: "Details about insight",
    thumbnail_art: "/img1.png",
    splash_art: "/img1.jpg",
    description: "Longer description",
  },
  {
    title: "Insight 2",
    subtitle: "Details about insight",
    thumbnail_art: "/img2.png",
    splash_art: "/img2.jpg",
    description: "Longer description",
  },
  {
    title: "Insight 3",
    subtitle: "Details about insight",
    thumbnail_art: "/img3.png",
    splash_art: "/img3.jpg",
    description: "Longer description",
  },
  {
    title: "Insight 4",
    subtitle: "Details about insight",
    thumbnail_art: "/img4.png",
    splash_art: "/img4.jpg",
    description: "Longer description",
  },
  {
    title: "Insight 5",
    subtitle: "Details about insight",
    thumbnail_art: "/img5.png",
    splash_art: "/img5.jpg",
    description: "Longer description",
  },
];

// We pass playerData from the LandingPage to the AgentPage via state.
// What data is returned depends on the backend.
// Edit this type if need be.
interface AgentPageProps {
  playerData: any;
}

export default function AgentPage({ playerData }: AgentPageProps) {
  const [sessionId, setSessionId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  console.log("Player data received in AgentPage:", playerData);

  // for chat
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "agent",
      text: "Teemo: Hello summoner, how can I assist you?",
    },
  ]);

  useEffect(() => {
    const createSession = async () => {
      try {
        const sessionResponse: Response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}`,
          {
            method: "POST",
          }
        );
        const sessionData: { sessionId: string } = await sessionResponse.json();

        const initialAnalysisResponse: Response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/${sessionData.sessionId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputText: `Provide an analysis on these League of Legends player insights: ${JSON.stringify(
                "KDA: 0.7" // SAMPLE DATA, ROBERT: PASS YOUR INSIGHTS DATA HERE
              )}`,
            }),
          }
        );
        const initialAnalysisData: { response: string } =
          await initialAnalysisResponse.json();
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: "agent",
            text: `${initialAnalysisData.response}`,
          },
        ]);
        setSessionId(sessionData.sessionId);
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    createSession();
  }, []);


  const handleSend = async (text: string) => {
    try {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, sender: "user", text: `You: ${text}` },
      ]);
      setLoading(true);
      const response: Response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/${sessionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputText: text }),
        }
      );
      const data: { response: string } = await response.json();
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, sender: "agent", text: `${data.response}` },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, sender: "agent", text: `Sorry, your request couldn't be completed. Please try reloadig the page.` },
      ]);
    } finally {
      setLoading(false);
    }
  };


  // FOR TESTING, REMOVE FOR PRODUCTION EVENTUALLY
  // setTimeout used for example backend response
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

  // for share buttons
  const pageUrl = window.location.href;

  return (
    <div
      className="flex flex-col min-h-screen w-full bg-cover bg-center bg-gradient-to-br from-[#163358] to-black text-white"
      style={{
        backgroundImage: "url('/riot-bg.jpg')",
      }}
    >
      <Header />

      <main className="flex-grow p-6 flex flex-col items-center justify-center gap-8 pt-8">
        <h1 className="text-6xl font-bold mb-6 text-[#C79B3B]">
          Your 2025 recall
        </h1>
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
                <Card
                  isPressable
                  onClick={() => setOpenModal(i)}
                  shadow="sm"
                  className="cursor-pointer bg-gray-800/50 hover:bg-gray-700 transition w-full"
                >
                  <CardHeader className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-[#C79B3B]">
                      {data.title}
                    </h3>
                    <img
                      src={data.thumbnail_art}
                      alt={data.title}
                      className="w-10 h-10 rounded-lg object-cover text-white"
                    />
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
          <Modal
            key={i}
            isOpen={openModal === i}
            className="bg-gray-800 text-white h-120"
            onOpenChange={() => setOpenModal(null)}
          >
            <ModalContent>
              <ModalHeader className="text-[#C79B3B]">{data.title}</ModalHeader>
              <ModalBody>
                <img
                  src={data.splash_art}
                  alt={data.title}
                  className="rounded-lg mb-3"
                />
                <p>{data.description}</p>
              </ModalBody>
              <ModalFooter>
                <ShareButtons pageUrl={pageUrl} shareText="This is my League of Legends Summoner Insight for 2025!" />
                <Button
                  onPress={() => setOpenModal(null)}
                  color="danger"
                  variant="shadow"
                >
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        ))}
      </main>

      <Footer />
    </div>
  );
}
