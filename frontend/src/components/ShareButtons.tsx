import { generateShareLinks } from "../lib/shareLinks";
import { FaTwitter, FaDiscord, FaFacebook } from "react-icons/fa";
import { Button } from "@heroui/react";

interface Props {
  shareText: string;
  pageUrl: string;
}

export function ShareButtons({ shareText, pageUrl }: Props) {
  const links = generateShareLinks(pageUrl, shareText);

  const handleShareTwitter = () => {
    window.open(links.twitter, "_blank");
  };

  const handleShareFacebook = () => {
    window.open(links.facebook, "_blank");
  };

  const handleShareDiscord = async () => {
    await navigator.clipboard.writeText(links.discord.message);
    window.open(links.discord.url, "_blank");
  };

  return (
    <div className="flex gap-2">
        <Button
            variant="shadow"
            onPress={handleShareTwitter}
        >
            <FaTwitter className="text-blue-400" />
        </Button>
        <Button 
            variant="shadow"
            onPress={handleShareDiscord}
        >
            <FaDiscord className="text-indigo-400" />
        </Button>
        <Button 
            variant="shadow"
            onPress={handleShareFacebook}
        >
            <FaFacebook className="text-blue-500" />
        </Button>
    </div>
  );
}