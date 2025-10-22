export default function Header() {
    return(
        <header className="w-full bg-gray-900 text-white py-4 px-6 flex justify-between items-center shadow-lg">
            <h1 className="text-2xl font-bold">Summoner Insights</h1>
            <nav>
                <a href="#" className="hover:text-cyan-400">Home</a>
            </nav>
        </header>
    );
}