import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    User,
    Heart,
    Settings,
    Lock,
    LogOut,
    ChevronDown,
    Star,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import helpers from "../utils/helpers";

/**
 * Component Avatar Dropdown Menu
 * Hiển thị avatar user và dropdown menu với các tùy chọn
 */
const AvatarDropdown = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsOpen(false);
        logout();
    };

    const colorClasses = {
        amber: {
            bg: "bg-amber-500/10",
            bgHover: "group-hover:bg-amber-500/20",
            text: "text-amber-400",
        },
        red: {
            bg: "bg-red-500/10",
            bgHover: "group-hover:bg-red-500/20",
            text: "text-red-400",
        },
        green: {
            bg: "bg-green-500/10",
            bgHover: "group-hover:bg-green-500/20",
            text: "text-green-400",
        },
        blue: {
            bg: "bg-blue-500/10",
            bgHover: "group-hover:bg-blue-500/20",
            text: "text-blue-400",
        },
        purple: {
            bg: "bg-purple-500/10",
            bgHover: "group-hover:bg-purple-500/20",
            text: "text-purple-400",
        },
    };

    const menuItems = [
        {
            to: "/profile/info",
            icon: User,
            label: "Quản lý sản phẩm",
            description: "Đang tham gia, Đã thắng",
            color: "amber",
        },
        {
            to: "/profile/favorites",
            icon: Heart,
            label: "Yêu thích",
            description: "Sản phẩm yêu thích",
            color: "red",
        },
        {
            to: "/profile/ratings",
            icon: Star,
            label: "Đánh giá",
            description: "Đánh giá nhận được",
            color: "green",
        },
        {
            to: "/profile/account",
            icon: Settings,
            label: "Tài khoản",
            description: "Cập nhật thông tin",
            color: "blue",
        },
        {
            to: "/profile/password",
            icon: Lock,
            label: "Đổi mật khẩu",
            description: "Bảo mật tài khoản",
            color: "purple",
        },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-slate-800/50 transition-all duration-300 group"
            >
                {/* Avatar Circle */}
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {helpers.getAvatarInitials(user?.fullName)}
                    </div>
                    {/* Online indicator */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                </div>

                {/* User name */}
                <div className="hidden md:block text-left">
                    <p className="text-sm font-bold text-slate-300 group-hover:text-amber-600 transition-colors">
                        {user?.fullName}
                    </p>
                </div>

                {/* Dropdown indicator */}
                <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info Header */}
                    <div className="bg-gradient-to-r from-amber-600 to-orange-500 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-amber-600 font-black text-lg shadow-lg">
                                {helpers.getAvatarInitials(user?.fullName)}
                            </div>
                            <div className="flex-1">
                                <p className="font-black text-white text-lg">
                                    {user?.fullName}
                                </p>
                                <p className="text-sm text-amber-50">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const colors = colorClasses[item.color];
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all duration-200 group"
                                >
                                    <div
                                        className={`w-10 h-10 rounded-lg ${colors.bg} ${colors.bgHover} flex items-center justify-center transition-colors`}
                                    >
                                        <Icon
                                            className={`w-5 h-5 ${colors.text}`}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-200 group-hover:text-white transition-colors">
                                            {item.label}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {item.description}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}

                        {/* Divider */}
                        <div className="h-px bg-slate-700 my-2"></div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-500/10 transition-all duration-200 group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center group-hover:bg-gray-500/20 transition-colors">
                                <LogOut className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-bold text-gray-400 group-hover:text-gray-300 transition-colors">
                                    Đăng xuất
                                </p>
                                <p className="text-xs text-slate-500">
                                    Thoát khỏi tài khoản
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AvatarDropdown;
