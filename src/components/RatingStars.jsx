import React from "react";
import { Star } from "lucide-react";

/**
 * Component hiển thị rating dạng stars
 */
const RatingStars = ({ rating, size = "default", showNumber = true }) => {
    const sizeClasses = {
        small: "w-3 h-3",
        default: "w-4 h-4",
        large: "w-5 h-5",
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    className={`${sizeClasses[size]} ${
                        i <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-300 text-slate-300"
                    }`}
                />,
            );
        }
        return stars;
    };

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">{renderStars()}</div>
            {showNumber && (
                <span className="text-sm text-slate-600 ml-1">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default RatingStars;
