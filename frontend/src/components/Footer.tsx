export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-400 text-center py-4 mt-12 text-sm">
      &copy; {new Date().getFullYear()} Summoner Insights. All rights reserved.
    </footer>
  );
}