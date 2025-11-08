export function generateShareLinks(pageUrl: string, shareText: string) {
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedText = encodeURIComponent(shareText);

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    discord: {
      url: "https://discord.com/channels/@me",
      message: `${shareText} ${pageUrl}`,
    },
  };
}