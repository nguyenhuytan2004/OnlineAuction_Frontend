import { useCallback } from "react";
import websocketService from "../services/websocketService";
import authService from "../services/authService";

export const useBid = (productId) => {
    const placeBid = useCallback(
        (maxAutoPrice) => {
            console.log("Placing bid:", { productId, maxAutoPrice });

            const bidderId = authService.getCurrentUser().userId;
            websocketService.placeBid(productId, {
                productId,
                bidderId,
                maxAutoPrice,
            });
        },
        [productId],
    );

    return { placeBid };
};
