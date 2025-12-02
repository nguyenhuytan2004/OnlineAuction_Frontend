import React from "react";

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 flex items-center justify-center">
            {children}
        </div>
    );
};

export default AuthLayout;
