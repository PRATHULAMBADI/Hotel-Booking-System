
function Home() {

    return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="text-center max-w-3xl bg-white p-10 rounded-2xl shadow-lg">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                Hotel Booking System
            </h1>
            <p className="text-lg text-gray-600 mb-8">
                Find and book your favourite hotels
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
                Explore Hotels
            </button>
        </div>
    </div>
    )
}

export default Home