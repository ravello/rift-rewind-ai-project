import { useState, useEffect } from "react";
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

// We pass playerData from the LandingPage to the AgentPage via state.
// What data is returned depends on the backend.
// Edit this type if need be.
interface AgentPageProps {
  playerData: any;
}

let modalData: ModalInfo[] = [];

function calculateInsights(matchList: any[]) {
  const champTime: { [key: string]: number } = {};
  const champKDAs: { [key: string]: number[] } = {}; // (kills + assists) / deaths
  const matchKDAs: { [key: string]: number } = {};

  for (const match of matchList) {
    const champ = match.champion;
    const time = match.gameDuration || 0;
    champTime[champ] = (champTime[champ] || 0) + time;
    const kda = match.kda || "0/0/0";
    const [killsStr, deathsStr, assistsStr] = kda.split("/");
    const kills = parseInt(killsStr) || 0;
    const deaths = parseInt(deathsStr) || 1; // avoid division by zero
    const assists = parseInt(assistsStr) || 0;
    if (!champKDAs[champ]) {
      champKDAs[champ] = [];
    }
    champKDAs[champ].push((kills + assists) / deaths);
    matchKDAs[match.matchId] = (kills + assists) / deaths;
  }

  let mainChamp = "";
  let maxTime = 0;
  for (const champ in champTime) {
    if (champTime[champ] > maxTime) {
      maxTime = champTime[champ];
      mainChamp = champ;
    }
  }

  let bestChamp = "";
  let bestKDA = 0;
  let weakestChamp = "";
  let weakestKDA = Infinity;
  for (const champ in champKDAs) {
    const kdaList = champKDAs[champ];
    const avgKDA = kdaList.reduce((sum, val) => sum + val, 0) / kdaList.length;
    if (avgKDA > bestKDA) {
      bestKDA = avgKDA;
      bestChamp = champ;
    }
    if (avgKDA < weakestKDA) {
      weakestKDA = avgKDA;
      weakestChamp = champ;
    }
  }

  // find best match KDA
  let bestMatchKDA = 0;
  let bestMatchID = "";
  for (const matchId in matchKDAs) {
    if (matchKDAs[matchId] > bestMatchKDA) {
      bestMatchKDA = matchKDAs[matchId];
      bestMatchID = matchId;
    }
  }

  return {
    mainChamp,
    maxTime,
    bestChamp,
    bestKDA,
    weakestChamp,
    weakestKDA,
    bestMatchID,
  };
}

// Function to handle calculating insights
async function generateInsights(playerData: any) {
  if (!playerData) {
    modalData = [
      {
        title: "No Data Available",
        subtitle:
          "Player data is missing or incomplete. Please return Home and re-enter your details.",
        thumbnail_art: "/img1.jpg",
        splash_art: "/img1.png",
        description:
          "Use the Home button at the top right of the page to go back.",
      },
    ];
    return;
  }

  let mainChampion = "";
  let mainTimePlayed = 0;
  let bestChampion = "";
  let bestChampKDA = 0;
  let weakestChampion = "";
  let weakestChampKDA = Infinity;
  let bestMatchID = "";

  const matchList = playerData.matches || [];
  const insights = calculateInsights(matchList);
  mainChampion = insights.mainChamp;
  mainTimePlayed = insights.maxTime;
  bestChampion = insights.bestChamp;
  bestChampKDA = insights.bestKDA;
  weakestChampion = insights.weakestChamp;
  weakestChampKDA = insights.weakestKDA;
  bestMatchID = insights.bestMatchID;

  // Insight for main
  const response = await fetch(
    "https://kq0dg72561.execute-api.us-east-2.amazonaws.com/dev/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `Provide insights about the matches where I played as my main League of Legends champion: ${mainChampion}. Consider which position I usually played and my performance on metrics like KDA and win rate.`,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch insights for main champion.");
  }
  const data = await response.json();
  const mainInsight = data.body || "Generating main champion insights...";

  // Insight for best Champion
  const responseBest = await fetch(
    "https://kq0dg72561.execute-api.us-east-2.amazonaws.com/dev/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `Provide insights about the matches where I performed best as my best League of Legends champion: ${bestChampion}. Consider which position I usually played and my performance on metrics like KDA and win rate.`,
      }),
    }
  );
  const dataBest = await responseBest.json();
  const bestInsight =
    dataBest.body || "Generating insights about your best champion...";

  // Insight for weakest Champion
  const responseWeakest = await fetch(
    "https://kq0dg72561.execute-api.us-east-2.amazonaws.com/dev/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `Provide insights about the matches where I struggled the most as my weakest League of Legends champion: ${weakestChampion}. Consider which position I usually played and my performance on metrics like KDA and win rate.`,
      }),
    }
  );
  const dataWeakest = await responseWeakest.json();
  const weakestInsight =
    dataWeakest.body || "Generating insights about your weakest champion...";

  // Insight for best match
  const responseBestMatch = await fetch(
    "https://kq0dg72561.execute-api.us-east-2.amazonaws.com/dev/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `Provide insights about my best match with match ID: ${bestMatchID}. Consider metrics like KDA, vision score, and other statistics.`,
      }),
    }
  );
  const dataBestMatch = await responseBestMatch.json();
  const bestMatchInsight =
    dataBestMatch.body || "Generating insights about your best match...";

  // Insight for recommended build
  const responseBuild = await fetch(
    "https://kq0dg72561.execute-api.us-east-2.amazonaws.com/dev/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `Based on my overall performance in League of Legends, recommend an optimal item build and runes setup to enhance my gameplay. Consider my strengths and weaknesses across different champions and roles.`,
      }),
    }
  );
  const dataBuild = await responseBuild.json();
  const buildInsight = dataBuild.body || "Generating recommended build...";

  // set modal data
  modalData = [
    {
      title: "Your Main: " + mainChampion,
      subtitle:
        "You played as " +
        mainChampion +
        " for " +
        Math.floor(mainTimePlayed / 3600) +
        " hrs " +
        Math.floor((mainTimePlayed % 3600) / 60) +
        " mins this year. Click to see more details",
      thumbnail_art: "/img1.jpg",
      splash_art: "/img1.png",
      description: mainInsight,
    },
    {
      title: "Your best Champion: " + bestChampion,
      subtitle:
        "You performed best when playing as " +
        bestChampion +
        ", with an average KDA of " +
        bestChampKDA.toFixed(2) +
        ". Click to see more details",
      thumbnail_art: "/img2.jpg",
      splash_art: "/img2.png",
      description: bestInsight,
    },
    {
      title: "Your weakest Champion: " + weakestChampion,
      subtitle:
        "You struggled the most when playing as " +
        weakestChampion +
        ", with an average KDA of " +
        weakestChampKDA.toFixed(2) +
        ". Click to see more details",
      thumbnail_art: "/img3.jpg",
      splash_art: "/img3.png",
      description: weakestInsight,
    },
    {
      title: "Your best match: " + bestMatchID,
      subtitle:
        "This was your best match of the year! Click to see more details",
      thumbnail_art: "/img4.jpg",
      splash_art: "/img4.png",
      description: bestMatchInsight,
    },
    {
      title: "Recommended Build",
      subtitle:
        "Optimize your gameplay with this recommended build. Click to see more details",
      thumbnail_art: "/img5.jpg",
      splash_art: "/img5.png",
      description: buildInsight,
    },
  ];
  return modalData;
}

export default function AgentPage({ playerData }: AgentPageProps) {
  const [sessionId, setSessionId] = useState<string>("");
  //const [loading, setLoading] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ModalInfo[]>([
    {
      title: "Loading...",
      subtitle:
        "Generating your personalized match history insights. Please wait a moment...",
      thumbnail_art: "/img1.jpg",
      splash_art: "/img1.png",
      description: "Please wait while we analyze your data.",
    },
  ]);

  // generate insights based on playerData
  // useEffect(() => {
  //   generateInsights(playerData).then((data) => {
  //     if (data) {
  //       setModalContent(data);
  //     }
  //   });
  // }, [playerData]);

  // for chat
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "agent",
      text: "Teemo: Hey Summoner! Ready to level up your League of Legends skills? I’ve got tips, insights, and analysis to help you climb the ranks. Let's get started!",
    },
  ]);

  useEffect(() => {
    const createSession = async (playerData: any) => {
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
              inputText: `Perform an analysis on my insights: ${JSON.stringify(
                playerData
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
            text: `Teemo: All done, Summoner! Your League of Legends analysis is ready—time to dominate the Rift!`,
          },
          {
            id: prev.length + 2,
            sender: "agent",
            text: `Teemo: ${initialAnalysisData.response}`,
          },
        ]);
        setSessionId(sessionData.sessionId);
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    generateInsights(playerData).then((data) => {
      if (data) {
        setModalContent(data);
        createSession(data[0].title + " " + data[0].subtitle + " " + data[1].title + " " + data[1].subtitle + " " + data[2].title + " " + data[2].subtitle);
      }
    });
    
  }, [playerData]);

  const handleSend = async (text: string) => {
    try {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, sender: "user", text: `You: ${text}` },
      ]);
      //setLoading(true);
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
        {
          id: prev.length + 1,
          sender: "agent",
          text: `Teemo: ${data.response}`,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "agent",
          text: `Sorry, your request couldn't be completed. Please try reloadig the page.`,
        },
      ]);
    } finally {
      //setLoading(false);
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
            {modalContent.map((data, i) => (
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
                <ShareButtons
                  pageUrl={pageUrl}
                  shareText="This is my League of Legends Summoner Insight for 2025!"
                />
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
