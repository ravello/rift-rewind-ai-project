import { Link } from "react-router-dom";

export default function Header() {
    return(
        <header className="w-full bg-gray-900 text-[#C79B3B] py-4 px-6 flex justify-between items-center shadow-lg">
            <h1 className="text-2xl font-bold">Summoner Insights</h1>
            <nav>
                <Link to="/" className="hover:text-[#E0D3B8] hover:underline">Home</Link>
            </nav>
        </header>
    );
}