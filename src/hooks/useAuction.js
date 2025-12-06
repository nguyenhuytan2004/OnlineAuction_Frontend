import { useEffect } from "react";
import websocketService from "../services/websocketService";

export const useAuction = (
    productId,
    handleAuctionUpdate,
    handleAuctionExtended,
    handleAuctionEnd,
) => {
    useEffect(() => {
        if (!productId) {
            return;
        }

        try {
            // Subscribe to bid updates
            websocketService.subscribeToBids(productId, (data) => {
                handleAuctionUpdate?.(data);
            });

            // Subscribe to auction extensions
            websocketService.subscribeToAuctionExtension(productId, (data) => {
                handleAuctionExtended?.(data);
            });

            // Subscribe to auction end
            websocketService.subscribeToAuctionEnd(productId, (data) => {
                handleAuctionEnd?.(data);
            });
        } catch (error) {
            console.error("Error subscribing to auction events:", error);
        }

        // Cleanup
        return () => {
            websocketService.unsubscribeFromProduct(productId);
        };
    }, [
        productId,
        handleAuctionUpdate,
        handleAuctionExtended,
        handleAuctionEnd,
    ]);
};
