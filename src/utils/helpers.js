const helpers = {
    // Build category tree from flat list
    buildCategoryTree: (flatCategories) => {
        const map = {};
        const roots = [];

        // Create map
        flatCategories.forEach((cat) => {
            map[cat.categoryId] = { ...cat, children: [] };
        });

        // Build tree
        flatCategories.forEach((cat) => {
            if (cat.parent) {
                if (map[cat.parent.categoryId]) {
                    map[cat.parent.categoryId].children.push(
                        map[cat.categoryId],
                    );
                }
            } else {
                roots.push(map[cat.categoryId]);
            }
        });

        return roots;
    },

    // Get color for time left
    getTimeColorClass: (endTime) => {
        const now = new Date();
        const end = new Date(endTime);
        const diff = end - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (diff < 0) return "text-gray-400";
        if (days < 1) return "text-red-500 font-semibold"; // < 1 ngày: đỏ
        if (days <= 3) return "text-orange-300 font-semibold"; // <= 3 ngày: cam
        return "text-white"; // > 3 ngày: trắng
    },

    // Get rating stars
    getRatingStars: (ratingScore, ratingCount) => {
        if (ratingCount === 0) return 0;
        return Math.round((ratingScore * 5) / ratingCount);
    },
};

export default helpers;
