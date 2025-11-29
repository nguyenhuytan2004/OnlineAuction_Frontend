import React from "react";

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex-shrink-0">
                            <h1 className="text-2xl font-bold text-purple-600">
                                OnlineAuction
                            </h1>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <a
                                    href="/"
                                    className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
                                >
                                    Home
                                </a>
                                <a
                                    href="/auctions"
                                    className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
                                >
                                    Auctions
                                </a>
                                <a
                                    href="/profile"
                                    className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
                                >
                                    Profile
                                </a>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <p className="text-center">
                        &copy; 2025 OnlineAuction. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
